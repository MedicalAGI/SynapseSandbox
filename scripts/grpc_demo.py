import grpc
import tensorflow as tf
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2_grpc

import yaml
from promptsource.templates import DatasetTemplates
from server.utils import parse_variable_from_prompt_template


p = 'resources/prompt_templates/生物医学英文20220612/TruthfulQA/templates.yaml'
with open(p, 'r') as fr:
    yaml_dict = yaml.load(fr, Loader=yaml.FullLoader)
ques = ['Currently, cataracts can not be cured with eye drops. Surgery is the only way to treat cataract by removing the cloudy lens'] * 32
prompt_ques = list()
for item in ques:
    prompt = yaml_dict['templates']['50238ba3-15ab-46f1-8c8b-fd6e038eceb3']
    prompt_template_keys = parse_variable_from_prompt_template(prompt.jinja)
    prompt_input = prompt.apply({
        prompt_template_keys[0]: item,
    })[0]
    prompt_ques.append(prompt_input)



# create prediction service client stub
channel = grpc.insecure_channel('127.0.0.1:9500',
                                        options=[
                                            ('grpc.max_send_message_length',
                                             1024 * 10240),
                                            ('grpc.max_receive_message_length',
                                             1024 * 10240)
                                        ])  # 可设置大小
stub = prediction_service_pb2_grpc.PredictionServiceStub(channel)
request = predict_pb2.PredictRequest()
request.model_spec.name = 'PromptDdemo'
request.model_spec.signature_name = 'serving_default'
request.inputs['inputs'].CopyFrom(tf.make_tensor_proto(prompt_ques))
resp = stub.Predict(request)
print(resp)