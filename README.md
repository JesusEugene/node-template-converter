# node-template-converter

![GitHub repo size](https://img.shields.io/github/repo-size/gnomgad/node-template-converter)
[![install size](https://packagephobia.com/badge?p=node-template-converter)](https://packagephobia.com/result?p=node-template-converter)
![npm](https://img.shields.io/npm/v/node-template-converter)


## Основные требования

Проект должен уметь заполнять данными шаблоны в формате docx, и конвертировать эти шаблоны в pdf формат.


## Установка
```
npm i node-template-converter
```
or
```
yarn add node-template-converter
```

## Использование

```js

const {Templater} = require('node-template-converter');

// Create object
const t = new Templater('./f.docx','./d.docx');

// Create dictionart key:value
const fields = {
'w':'weak',
'n':'namesssss'
}

// fill in the template ./f.docx and save the file ./d.docx
t.fill(fields)
// convert ./d.docx in .pdf and save in folder./pdf
t.convert('./pdf');


const b = {
  'w':'ewq',
  'n':'qwe'
}
// set output path for docx file and create new pdf file
t.setOutDocxFilePath('./B.docx').fill(b).convert('./pdf');
```

### Как пользоваться шаблонизатором можно посомтреть на сайте docxtemplater
https://www.npmjs.com/package/docxtemplater

