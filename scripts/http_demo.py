import requests
import json
import gzip
from multiprocessing import Pool

import yaml
from promptsource.templates import DatasetTemplates
from server.utils import parse_variable_from_prompt_template

TFSERVER_URL = 'http://127.0.0.1:{}/v1/models/PromptDdemo:predict'

p = 'resources/prompt_templates/生物医学英文20220612/TruthfulQA/templates.yaml'
with open(p, 'r') as fr:
    yaml_dict = yaml.load(fr, Loader=yaml.FullLoader)

ques = [
    'Currently, cataracts can not be cured with eye drops. Surgery is the only way to treat cataract by removing the cloudy lens'
] * 32
prompt_ques = list()
for item in ques:
    prompt = yaml_dict['templates']['50238ba3-15ab-46f1-8c8b-fd6e038eceb3']
    prompt_template_keys = parse_variable_from_prompt_template(prompt.jinja)
    prompt_input = prompt.apply({
        prompt_template_keys[0]: item,
    })[0]
    prompt_ques.append(prompt_input)

print(prompt_ques)

def run(prompt_ques, port):
    req = {"instances": prompt_ques}
    request_body = gzip.compress(json.dumps(req).encode('utf-8'))
    rsp = requests.post(TFSERVER_URL.format(port),
                        data=request_body,
                        headers={
                            'Content-Encoding': 'gzip',
                            'Content-Type': 'application/json'
                        })
    return rsp

ps = Pool(processes=8)
ps
rsts = list()
for idx in range(8):
    port = 9001 + 100 * idx
    rst = ps.apply_async(run, (prompt_ques, port))
    rsts.append(rst)
print([_.get().json()['predictions'] for _ in rsts])
