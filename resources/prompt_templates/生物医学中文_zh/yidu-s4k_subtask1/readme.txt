根据label type拆解，比如有6种entity types“'疾病和诊断', '解剖部位', '药物', '影像检查', '手术', '实验室检验'”,那么一个句子就变成6个来出来，每一种就对应一种label；相当于句子的一个标签变成了6个标签

label2type = {'疾病和诊断':"I-dis",'解剖部位':"I-anatomy",'药物':"I-drug",'影像检查':"I-Imgexam","手术":"I-operation","实验室检验":"I-Labtest"}