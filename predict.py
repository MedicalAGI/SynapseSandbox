from typing import Optional
import numpy as np
import json
import requests


import promptsource
import yaml
import json
import os
from promptsource.templates import DatasetTemplates



class SelfEncoder(json.JSONEncoder):  
    def default(self, obj):  
        if isinstance(obj, np.ndarray):  
            return obj.tolist()  
        elif isinstance(obj, np.floating):  
            return float(obj)  
        elif isinstance(obj, bytes):  
            return str(obj, encoding='utf-8');  
        return json.JSONEncoder.default(self, obj)
def predict(input_sentence, model_name="large_mt5"):
    input = np.array([input_sentence])
    input_data = {  
    "signature_name": "",  
    "instances":input}
    data = json.dumps(input_data, cls=SelfEncoder, indent=2)
    root_url = "http://127.0.0.1:8501"
    url = f"{root_url}/v1/models/{model_name}:predict"
    result = requests.post(url, data=data)
    tmp = eval(result.content)
    return tmp



###################  20220718
yaml_file = "templates2.yaml"
yaml_dict = yaml.load(open(yaml_file,"r"), Loader=yaml.FullLoader)
templates = yaml_dict["templates"]

data=json.load(open("tmp.json"))
for d in data:
    for name,temp in templates.items():
        input_ = temp.apply(d)[0]
        result = predict(input_, model_name="3b_xl_medical")
        pred = result["predictions"][0]["outputs"]
        print("Input sentence : {}".format(input_))
        print("--------")
        print("Prediction : {}".format(pred))
        print("--------")

