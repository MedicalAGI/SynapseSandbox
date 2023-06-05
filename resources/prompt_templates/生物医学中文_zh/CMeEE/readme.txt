根据label type拆解，
"dis","sym","pro","equ","dru","ite","bod","dep","mic" 9种类型实体
那么一个句子就变成6个出来，每一种就对应一种label；相当于句子的一个标签变成了6个标签

label2type = {'dis': 'I-dis', 'sym': 'I-sym', 'pro': 'I-pro', 'equ': 'I-equ', 'dru': 'I-dru', 'ite': 'I-ite', 'bod': 'I-bod', 'dep': 'I-dep', 'mic': 'I-mic'}