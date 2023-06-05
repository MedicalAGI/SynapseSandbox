根据entity type拆解，
有DNA', 'protein', 'cell_type', 'cell_line', 'RNA',那么一个句子就变成5个来出来，每一种就对应一种label；相当于句子的一个标签变成了5个标签

label2type={'DNA': 'I-DNA', 'protein': 'I-protein', 'cell_type': 'I-cell_type', 'cell_line': 'I-cell_line', 'RNA': 'I-RNA'}