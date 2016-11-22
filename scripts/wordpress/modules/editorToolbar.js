/* exported EditorToolbar */
/* global showdown, getAllMatches, getTemplate, Handlebars, html_beautify */

'use strict';

const EditorToolbar = (function EditorToolbar() {
  const $editorToolbar = $('#ed_toolbar');
  const $mainTextArea = $('#content');

  function getShowdownConverter() {
    const converter = new showdown.Converter();

    // Don't convert underscores in URLs
    // https://github.com/showdownjs/showdown/issues/96
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('tables', true);
    return converter;
  }

  function convertToHTML(converter, md) {
    let html = converter.makeHtml(md);

    html = html.replace(/<code class="js language-js">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="coffee language-coffee">/g, '<code class="coffeecript language-coffeescript">');
    html = html.replace(/<code class="json language-json">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="html language-html">/g, '<code class="markup language-markup">');
    html = html.replace(/<code class="sh language-sh">/g, '<code class="bash language-bash">');

    return html;
  }

  function addMDButton() {
    const mdConverter = getShowdownConverter();
    const $convertButton = $('<input />', {
      type: 'button',
      value: 'MD',
      class: 'ed_button button button-small',
      id: 'bandaid-md',
      title: 'Convert MD to HTML',
      click() {
        const md = $mainTextArea.val();
        const html = convertToHTML(mdConverter, md);
        $mainTextArea.val(html);
      },
    });
    $editorToolbar.append($convertButton);
  }

  function makeToc() {
    // From titleArea.js
    const rx = /<(h[2-6]).+>(.+)<\/\1>/ig;
    const content = $mainTextArea.val();
    const matches = getAllMatches(rx, content);
    const headings = matches.map(match => ({
      level: match[1],
      title: match[2],
      slug: /id="(.*?)"/.exec(match)[1],
    }));

    getTemplate('toc.hbs')
      .then((tpl) => {
        const template = Handlebars.compile(tpl);
        const html = template({ headings });

        $mainTextArea.val(`${html}\n\n${content}`);
      });
  }

  function addToCButton() {
    const $ToCButton = $('<input />', {
      type: 'button',
      value: 'ToC',
      class: 'ed_button button button-small',
      id: 'bandaid-toc',
      title: 'Insert a Table of Contents',
      click: makeToc,
    });
    $editorToolbar.append($ToCButton);
  }

  function getBeautifier() {
    const options = {
      indent_size: 2,
      preserve_newlines: false,
      wrap_line_length: 0,
    };
    return function beautify(html) {
      return html_beautify(html, options);
    };
  }

  function addBeautyButton() {
    const beautifier = getBeautifier();
    const $beautifyButton = $('<input />', {
      type: 'button',
      value: 'Beautify',
      class: 'ed_button button button-small',
      id: 'bandaid-beautify',
      title: 'Beautify HTML',
      click: () => {
        const html = $mainTextArea.val();
        const beautifulHtml = beautifier(html);
        $mainTextArea.val(beautifulHtml);
      },
    });
    $editorToolbar.append($beautifyButton);
  }

  function init() {
    addMDButton();
    addToCButton();
    addBeautyButton();
  }

  return {
    init,
  };
}());
