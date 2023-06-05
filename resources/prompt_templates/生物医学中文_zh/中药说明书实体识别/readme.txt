根据entity type拆解，有13种entity types
['药品', '药物成分', '药物剂型', '药物性味', '中药功效', '症状', '人群', '食物分组', '食物', '疾病', '证候', '疾病分组', '药品分组']
每一种就对应一种label；相当于句子的一个标签变成了13个标签

label2type={'药品':"I-drug",
        '药物成分':"I-component",
        '药物剂型':"I-form",
        '药物性味':"I-flavor",
        '中药功效':"I-efficacy",
        '症状':"I-sym",
        '人群':"I-people",
        '食物分组':"I-foodgroup",
        '食物':"I-food",
        '疾病':"I-dis",
        '证候':"I-syndrome",
        '疾病分组':"I-disgroup",
        '药品分组':"I-druggroup"}
