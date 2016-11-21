"use strict";

const EditorToolbar = (function() {
  const $editorToolbar = $("#ed_toolbar");
  const $mainTextArea = $("#content");
  const converter = getShowdownConverter();

  let $convertButton, $ToCButton;

  function getShowdownConverter(){
    const converter = new showdown.Converter();

    // Don't convert underscores in URLs
    // https://github.com/showdownjs/showdown/issues/96
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('tables', true);
    return converter;
  }

  function convertToHTML(converter, md){
    let html = converter.makeHtml(md);

    html = html.replace(/<code class="js language-js">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="coffee language-coffee">/g, '<code class="coffeecript language-coffeescript">');
    html = html.replace(/<code class="json language-json">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="html language-html">/g, '<code class="markup language-markup">');
    html = html.replace(/<code class="sh language-sh">/g, '<code class="bash language-bash">');

    return html;
  }

  function addMDButton(){
    $convertButton = $("<input />", {
      type: "button",
      value: "MD",
      class: "ed_button button button-small",
      id: "bandaid-md",
      title: "Convert MD to HTML",
      click: function(){
        const md = $mainTextArea.val();
        const html = convertToHTML(converter, md);
        $mainTextArea.val(html);
      }
    });
    $editorToolbar.append($convertButton);
  }

  function makeToc(){
    // From titleArea.js
    const rx       = /<(h[2-6]).+>(.+)<\/\1>/ig;
    const content  = $mainTextArea.val();
    const matches  = getAllMatches(rx, content);
    const headings = matches.map(match => {
      return {
        level: match[1],
        title: match[2],
        slug: /id="(.*?)"/.exec(match)[1]
      };
    });

    getTemplate("toc.hbs")
      .then(tpl => {
        const template = Handlebars.compile(tpl);
        const html = template({ headings });

        $mainTextArea.val(html + "\n\n" + content);
      });
  }

  function addToCButton(){
    $ToCButton = $("<input />", {
      type: "button",
      value: "ToC",
      class: "ed_button button button-small",
      id: "bandaid-toc",
      title: "Insert a Table of Contents",
      click: makeToc
    });
    $editorToolbar.append($ToCButton);
  }

  function getBeautifier(){
    const options = {
      "preserve_newlines": false,
      "wrap_line_length": 0
    };
    return function beautify(html) {
      return html_beautify(html, options);
    }
  }

  function addBeautyButton($editorToolbar, $mainTextArea) {
    const beautifier = getBeautifier();
    const $beautifyButton = $("<input />", {
      type: "button",
      value: "Beautify",
      class: "ed_button button button-small",
      id: "bandaid-beautify",
      title: "Beautify HTML",
      click: () => {
        var html = $mainTextArea.val();
        var beautifulHtml = beautifier(html);
        $mainTextArea.val(beautifulHtml);
      }
    });
    $editorToolbar.append($beautifyButton);
  }


  function init(){
    addMDButton();
    addToCButton();
    addBeautyButton($editorToolbar, $mainTextArea)
  }

  return {
    init: init
  };
})();
