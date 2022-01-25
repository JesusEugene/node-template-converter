/* eslint-disable no-param-reassign */

/**
 * @fileoverview Реализуется функционал отвечающий за работу с шаблонизацией
 * и конвертацией файла
 * @namespace pdfConvert
 */

const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const cov = require('convert-multiple-files');

/**
 * Класс имеет функционал заполнения шаблонов
 * @class
 * @summary класс имеет функционал по работе с шаблонизацией и конвертацией файла
 */
class Templater {
  /**
   * @constructor
   * @param {string} templatePath Путь к пустому docx шаблону
   * @param {string} outPath Путь куда сохранить заполненный docx шаблон
   */
  constructor(templatePath, outPath) {
    this.setOutDocxFilePath(outPath);
    this.setTemplateDocxFilePath(templatePath);
  }

  /**
   * Установить путь куда сохранить заполненный docx шаблон
   * @param {string} outPath путь для сохранения заполненного docx шаблона
   * @returns {Object} Возвращает объект класса
   */
  setOutDocxFilePath(outPath) {
    if (typeof outPath !== 'string') {
      throw new Error('Path outPath must be a string');
    }
    this.outPath = outPath;
    return this;
  }

  /**
   * Установить путь для шаблона файла
   * @param {string} templatePath путь к шаблону
   * @returns {Object} Возвращает объект класса
   */
  setTemplateDocxFilePath(templatePath) {
    if (typeof templatePath !== 'string') {
      throw new Error('Path templatePath must be a string');
    }
    this.templatePath = templatePath;
    return this;
  }

  /**
   * Объект ошибки содержит дополнительную информацию при регистрации с помощью JSON.stringify
   * (он содержит объект свойств, содержащий все подопытные ошибки).
   * @private
   * @param {string} key ключ
   * @param {string} value значение
   * @returns {Object}
   */
  static replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce((error, key) => {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  /**
   * Используется для более удобного вывода ошибок
   * @private
   * @param {*} error Ошибка из catch
   */
  static errorHandler(error) {
    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors
        .map((error) => error.properties.explanation)
        .join('\n');
      console.log('errorMessages', errorMessages);
    }
    throw error;
  }

  /**
   * Заполняет шаблон значениями из полей
   * @param {*} fields Словарь ключ-значение для  подстановки в шаблон
   * @returns {Object} Возвращает объект класса
   */
  fill(fields) {
    const content = fs.readFileSync(this.templatePath, 'binary');
    const zip = new PizZip(content);
    let doc;

    try {
      doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    } catch (error) {
      // ошибки комплияции или неуместные теги
      this.errorHandler(error);
    }

    // Заполнение шаблона данными и fields
    doc.setData(fields);

    try {
      // Рендер документа замена всех {значение} на исходные
      doc.render();
    } catch (error) {
      // Ловля ошибок связанных с рендером
      this.errorHandler(error);
    }

    // Создание буфера для docx файла
    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    // Запись буфера в файл
    fs.writeFileSync(this.outPath, buf);

    return this;
  }

  /**
   * Конвертация файла в pdf
   * @param {string} pdfFolder Путь к папке с pdf
   * @returns {Object} Возвращает объект класса
   */
  convert(pdfFolder) {
    if (typeof pdfFolder !== 'string') {
      throw new Error('Path pdfFolder must be a string');
    }

    this.promise = cov.convertWordFiles(this.outPath, 'pdf', pdfFolder);

    return this;
  }

  /**
   * Конвертация файла в pdf возвращает promise
   * @param {string} pdfFolder Путь к папке с pdf
   * @returns {Promise<string>} Возвращает промис
   */
  convertWithPromise(pdfFolder) {
    if (typeof pdfFolder !== 'string') {
      throw new Error('Path pdfFolder must be a string');
    }

    return cov.convertWordFiles(this.outPath, 'pdf', pdfFolder);
  }
}

module.exports = Templater;
