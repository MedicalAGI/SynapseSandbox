import re
import itertools
from hashlib import md5
import time

from .registry import Registry
from .config import CFG
from .utils import parse_variable_from_prompt_template
from .utils import call_tfserving

NODES = Registry(name='nodes')


@NODES.register_node(type='process')
class DefaultProcessNode:

    def __init__(self, node):
        pass

    def __call__(self, node, input):
        if node.prompt is None:
            raise Exception(
                'prompt template is required for default process node')
        else:
            prompt_template_keys = parse_variable_from_prompt_template(
                node.prompt.jinja)
            prompt_input = dict()
            prompt_input[prompt_template_keys[0]] = input
            prompt_input = node.prompt.apply(prompt_input)[0]
            rsp = call_tfserving([{"instances": [prompt_input]}], node.llm)[0]
            return {'output': rsp.json()['predictions'][0]['outputs']}


@NODES.register_node(type='policy')
class DefaultPolicyNode:

    def __init__(self, node):
        pass

    def __call__(self, node, input):
        output = input
        if node.prompt is not None:
            prompt_template_keys = parse_variable_from_prompt_template(
                node.prompt.jinja)
            prompt_input = dict()
            prompt_input[prompt_template_keys[0]] = input
            prompt_input = node.prompt.apply(prompt_input)[0]
            rsp = call_tfserving([{"instances": [prompt_input]}], node.llm)[0]
            output = rsp.json()['predictions'][0]['outputs']
        if node.valid_range is not None and node.valid_value is None:
            if re.fullmatch(r'^[+-]?\d+\.?\d*$', output) is not None:
                output = float(output)
                valid = node.valid_range[0] <= output <= node.valid_range[1]
            else:
                valid = False
        elif node.valid_range is None and node.valid_value is not None:
            valid = output in node.valid_value
        else:
            raise Exception(
                'must specify only one of valid_range and valid_value')
        return {'output': output, 'stop': not valid}


@NODES.register_node(type='search')
class DefaultSearchNode:

    def __init__(self, node):
        if node.prompt is None:
            raise Exception('prompt template is required for search node')
        else:
            self._prompt = node.prompt
            self._prompt_template_keys = parse_variable_from_prompt_template(
                node.prompt.jinja)

        self._digit_pat = re.compile('[0-9]+\.?[0-9]*')
        if node.threshold is None:
            raise Exception('threshold must be specified for search')
        else:
            self.thres = node.threshold

        self._llm = node.llm if node.llm else 'default'

    def __get_input(self, input):
        prompt_input = dict()
        prompt_input[self._prompt_template_keys[0]] = input[0]
        prompt_input[self._prompt_template_keys[1]] = input[1]
        prompt_input = self._prompt.apply(prompt_input)[0]
        return prompt_input

    def __real_calculate_similarity(self, input, database):
        num_worker = len(CFG.TFSERVER_URLs)
        all_rsps = list()
        for idx in range(0, len(database),
                         CFG.TFSERVER_BATCH_SIZE * num_worker):
            batched_qa = database[idx:idx +
                                  CFG.TFSERVER_BATCH_SIZE * num_worker]
            batched_prompt_inputs = [
                self.__get_input([input, qa['问题']]) for qa in batched_qa
            ]
            reqs = [{
                "instances":
                batched_prompt_inputs[_:_ + CFG.TFSERVER_BATCH_SIZE]
            } for _ in range(0, len(batched_prompt_inputs),
                             CFG.TFSERVER_BATCH_SIZE)]

            rsps = call_tfserving(reqs, self._llm, sync=False)
            all_rsps.extend(rsps)
        preds = list(
            itertools.chain(
                *[_.result().json()['predictions'] for _ in all_rsps]))
        match_result = [
            {
                'score': float(preds[jdx]['outputs']),
                'question': database[jdx]['问题'],
                'answer': database[jdx]['答案']
            } for jdx in range(len(preds))
            if self._digit_pat.fullmatch(preds[jdx]['outputs']) is not None
        ]
        return match_result

    def __calculate_similarity(self, input, dbname):
        database = CFG.QA_DATABASES[dbname]
        _sk = md5('{}:{}'.format(input, dbname).encode('utf-8')).hexdigest()
        if _sk not in CFG.QA_SEARCH_CACHE:
            CFG.QA_SEARCH_CACHE[_sk] = None
            match_result = self.__real_calculate_similarity(input, database)
            CFG.QA_SEARCH_CACHE[_sk] = match_result
        elif CFG.QA_SEARCH_CACHE[_sk] is None:
            _idx = 0
            match_result = None
            while _idx < 10 and match_result is None:
                time.sleep(30)
                match_result = CFG.QA_SEARCH_CACHE[_sk]
            if match_result is None:
                match_result = self.__real_calculate_similarity(
                    input, database)
        else:
            match_result = CFG.QA_SEARCH_CACHE[_sk]

        match_result = [
            item for item in match_result if item['score'] >= self.thres
        ]
        match_result_sorted = sorted(match_result,
                                     key=lambda d: d['score'],
                                     reverse=True)
        return match_result_sorted

    def __call__(self, node, input):
        output = None
        extra_output = None

        if node.database1 is None:
            raise Exception('database is required for search node')
        if node.database1 not in CFG.QA_DATABASES:
            raise Exception(
                'can not find database {}, valid database: {}'.format(
                    node.database1, CFG.QA_DATABASES.keys()))
        if node.database2 is not None and node.database2 not in CFG.QA_DATABASES:
            raise Exception(
                'can not find database {}, valid database: {}'.format(
                    node.database2, CFG.QA_DATABASES.keys()))

        # step1: search local database
        sorted_match_result = self.__calculate_similarity(
            input, node.database1)
        if len(sorted_match_result) > 0:
            output = sorted_match_result[0]['answer']
            extra_output = sorted_match_result[0]['question']
            return {'output': output, 'extra_output': extra_output}
        elif node.database2 is None:
            return {'stop': True}
        else:
            sorted_match_result = self.__calculate_similarity(
                input, node.database2)
            if len(sorted_match_result) > 0:
                output = sorted_match_result[0]['answer']
                extra_output = sorted_match_result[0]['question']
                return {'output': output, 'extra_output': extra_output}
            else:
                return {'stop': True}


if __name__ == '__main__':
    print(NODES._registry)