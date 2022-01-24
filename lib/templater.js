/* eslint-disable no-param-reassign */

/**
 * @fileoverview Реализуется функционал отвечающий за заполнение шаблона файла
 * @namespace pdfConvert
 */

const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const cov = require('convert-multiple-files');

/**
 * Класс имеет функционал заполнения шаблонов
 * @class
 * @summary Класс имеет функционал заполнения шаблонов
 */
class Templater {
  /**
   * @constructor
   * @param {string} templatePath Путь к пустому docx шаблону
   * @param {string} outPath Путь куда сохранить заполненный docx шаблон
   */
  constructor(templatePath, outPath) {
    if (!templatePath || !outPath) {
      throw new Error('Неверный тип аргумента');
    }

    this.templatePath = templatePath;
    this.outPath = outPath;
  }

  /**
   * Установить путь куда сохранить заполненный docx шаблон
   * @param {string} outPath путь для сохранения заполненного docx шаблона
   * @returns {Object} Возвращает объект класса
   */
  setOutDocxFilePath(outPath) {
    if (!outPath) {
      throw new Error('Неверный тип аргумента');
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
    if (!templatePath) {
      throw new Error('Неверный тип аргумента');
    }
    this.templatePath = templatePath;
    return this;
  }

  /**
   * Объект ошибки содержит дополнительную информацию при регистрации с помощью JSON.stringify
   * (он содержит объект свойств, содержащий все подопытные ошибки).
   * @private
   * @param {*} key ключ
   * @param {*} value значение
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

    // Запись буфера в объект
    fs.writeFileSync(this.outPath, buf);

    return this;
  }

  /**
   * Конвертация файла в pdf
   * @param {string} pdfFolder Путь к папке с pdf
   * @returns {Object} Возвращает объект класса
   */
  convert(pdfFolder) {
    cov.convertWordFiles(this.outPath, 'pdf', pdfFolder);
    return this;
  }
}

module.exports = Templater;
