import sys
import requests
import uuid

import yaml
from promptsource.templates import DatasetTemplates

BASE_URL = 'http://127.0.0.1:9502'
FLOW_ID = uuid.uuid1().hex if len(sys.argv) == 1 else sys.argv[1]


def get_templates():
    rsp = requests.get('{}/api/get_templates'.format(BASE_URL))
    return rsp.json()


def run_flow(templates):
    print('flow_id: {}'.format(FLOW_ID))

    rsp = requests.post(
        '{}/api/run_flow'.format(BASE_URL),
        json={
            'flow_id':
            FLOW_ID,
            'nodes': [
                {
                    'name':
                    'node1',
                    'type':
                    'process',
                    'template':
                    templates['生物医学英文20220612/MedQSum/DOC_write_summary_of_above'],
                    'input':
                    'I have been diagnosed with cataract for 10 years. Can I use eyedrops to treat it?'
                },
                {
                    'name': 'node2',
                    'type': 'search',
                    'template': templates['生物医学英文20220612/MedSTS/sentence_similarity'],
                    'threshold': 0.8,
                    'database1': 'general_qa'
                },
                {
                    'name': 'node3',
                    'type': 'policy',
                    'template': templates['生物医学英文20220612/TruthfulQA/whether_truthful'],
                    'valid_value': ['No', 'None']
                },
            ]
        })
    if rsp.ok:
        print(rsp.json())


if __name__ == '__main__':
    templates = get_templates()
    run_flow(templates["template"])