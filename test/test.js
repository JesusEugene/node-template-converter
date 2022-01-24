const assert = require('assert');
const path = require('path');
const cov = require('convert-multiple-files');
const Templater = require('../lib/templater');

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
