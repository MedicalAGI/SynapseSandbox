import glob
import yaml
from promptsource.templates import DatasetTemplates

yaml_files = glob.glob('./生物医学英文20220612/**/*.yaml', recursive=True)
print("number of dataset : {}".format(len(yaml_files)))

num_prompts = 0
for yaml_file in yaml_files:
      yaml_dict = yaml.load(open(yaml_file,"r"), Loader=yaml.FullLoader)
      templates = yaml_dict["templates"]
      num_prompts+=len(templates)
      break

print("number of templates : {}".format(num_prompts))

for tn in yaml_dict['templates']:
    rst = yaml_dict['templates'][tn].apply({'word': "xinglinjie", 'normalized': "??????"})
    print('=====' * 20)
    print(rst)
    print(yaml_dict['templates'][tn].jinja)
    print(yaml_dict.keys())

