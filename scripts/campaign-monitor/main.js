"use strict";

var EditorToolbar = (function() {

})();

function getShowdownConverter(){
  var converter = new showdown.Converter();

  // Don't convert underscores in URLs
  // https://github.com/showdownjs/showdown/issues/96
  converter.setOption('literalMidWordUnderscores', true);
  converter.setOption('tables', true);
  return converter;
}

function convertToHTML(md){
  var html = converter.makeHtml(md);

  // Custom shit
  html = html.replace(/<blockquote>\s+?<p>/gm, '<p style="border-left: 10px solid rgba(128,128,128,0.075); background-color: rgba(128,128,128,0.05); padding: 15px 20px;">');
  html = html.replace(/<\/blockquote>/gm, '');

  return html;
}

// Create the button and append to editor toolbar
//
var $convertButton = $("<button />", {
  text: "MD > HTML",
  type: "button",
  id: "md-to-html",
  style: "float: left; margin-left: 10px; display: none;",
  click: function(){
    var md = $("textarea.cke_source").val();
    var html = convertToHTML(md);
    $("textarea.cke_source").val(html);
  }
});
$("#editorPane .overview .buttons").append($convertButton);

$("#editorPane").on("click", "a[title='Source']", function(){
  $("#md-to-html").toggle();
});

// Whole page is a mass of iframes
// Mutation observer to watch for changes to editor pane
// As pressing (e.g.) "Edit" in the preview pane
// Will swap out the ck instance, but leave the MD > HTML button visible
//
var target = $("#editorPane")[0];
var observer = new MutationObserver(function(mutations) {
  if($(".cke_button_source").hasClass("cke_off")){
    $("#md-to-html").hide();
  }
});
var config = { attributes: true };
observer.observe(target, config);

var converter = getShowdownConverter();
