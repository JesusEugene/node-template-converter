const assert = require('assert');
const path = require('path');
const Templater = require('../lib/templater');

// eslint-disable-next-line no-undef
it('Полный тест на юзабилити', () => {
  assert.doesNotThrow(() => {
    const inPath = path.join(__dirname, 'f.docx');
    const outPath = path.join(__dirname, 's.docx');
    const outPath2 = path.join(__dirname, 's2.docx');
    const pdfPath = path.join(__dirname, 'pdf');
    const fields = {
      n: 'Evg...',
      w: 'World',
    };
    const fields2 = {
      n: 'nig...',
      w: 'www',
    };
    const t = new Templater(inPath, outPath).fill(fields).convert(pdfPath);
    t.setOutDocxFilePath(outPath2).fill(fields2).convert(pdfPath);
  }, Error);
});


it('Краш ошибки на название', () => {
  assert.throws(() => {
    const t = new Templater(null, null).fill(fields).convert(pdfPath);
  }, Error);
});

it('Промис', () => {
  assert.doesNotThrow(() => {
    const inPath = path.join(__dirname, 'f.docx');
    const outPath = path.join(__dirname, 'sq.docx');
    const pdfPath = path.join(__dirname, 'pdf');
    const fields = {
      n: 'Evg...',
      w: 'World',
    };
    const t = new Templater(inPath, outPath).fill(fields).convert('C//:c');
    t.promise.then(()=>{
      console.log('hello')
    }).catch(err => {console.log(err)});
  }, Error);
});