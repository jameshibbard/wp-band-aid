"use strict";

var EditorToolbar = (function() {
  function getShowdownConverter(){
    var converter = new showdown.Converter();

    // Don't convert underscores in URLs
    // https://github.com/showdownjs/showdown/issues/96
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('tables', true);
    return converter;
  }

  function convertToHTML(converter, md){
    var html = converter.makeHtml(md);

    html = html.replace(/<code class="js language-js">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="coffee language-coffee">/g, '<code class="coffeecript language-coffeescript">');
    html = html.replace(/<code class="json language-json">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="html language-html">/g, '<code class="markup language-markup">');
    html = html.replace(/<code class="sh language-sh">/g, '<code class="bash language-bash">');

    return html;
  }

  function addMDButton(){
    var $editorToolbar = $("#ed_toolbar");
    var converter = getShowdownConverter();
    var $mainTextArea = $("#content");
    var $convertButton = $("<input />", {
      type: "button",
      value: "MD",
      class: "ed_button button button-small",
      id: "bandaid-md",
      title: "Convert MD to HTML",
      click: function(){
        var md = $mainTextArea.val();
        var html = convertToHTML(converter, md);
        $mainTextArea.val(html);
      }
    });
    $editorToolbar.append($convertButton);
  }

  function init(){
    addMDButton();
  }

  return {
    init: init
  };
})();
