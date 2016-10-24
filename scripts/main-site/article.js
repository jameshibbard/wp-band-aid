"use strict";

const Article = (function() {
  const elems = {
    "$msAdvertising": $("adblock-msg").parent().parent(),
    "$latestCoursesandBooks": $(".ArticleContent_endcap").next().next().next(),
    "$emailSubscribe": $(".CategorySubscribeForm"),
    "$premiumAds": $(".u-premium-preview"),
    "$socialButtons": $(".Sharer"),
    "$sponsors-title": $("h1:contains('Sponsors')"),
    "$sponsors-box": $("h1:contains('Sponsors')").next()
  };
  const $mainHeading = $("h1:first");
  const $linkContainer = $("<div id='link-container'></div>");
  const parselyUrl = 'https://dash.parsely.com/sitepoint.com/find?url=' + encodeURIComponent(document.URL);

  let API_KEY, SECRET_TOKEN;
  chrome.storage.sync.get(['parselyAPIKey','parselySecret'], function(items){
    API_KEY = items.parselyAPIKey;
    SECRET_TOKEN = items.parselySecret;
  });

  let $toggleElementsLink, $linksTemplate;

  function toggleElements(){
    $.each(elems, function(key, $elem) {
      $elem.toggle();
    });
  }

  function elemsHidden(){
    return localStorage.getItem("elemsHidden");
  }

  function setLinkText(action){
    $toggleElementsLink.text(`${action} Superfluous Elements`);
  }

  function setInitialLinkState(){
    let i = setInterval(function(){
      if($(".ArticleAside_row").length){
        if (elemsHidden()){
          setLinkText("Show");
          toggleElements();
        }

        clearInterval(i);
      }
    }, 500);
  }

  function handleToggleLinkClick(){
    if (elemsHidden()){
      setLinkText("Hide");
      localStorage.removeItem("elemsHidden");
    } else {
      setLinkText("Show");
      localStorage.setItem("elemsHidden", "true");
    }

    toggleElements();
  }

  function addToggleLink(){
    $toggleElementsLink = $("<a />", {
      href: "#",
      text: "Hide Superfluous Elements",
      id: "bandaid-toggle-link",
      title: "Remove all the superfluous stuff",
      click: function(e){
        e.preventDefault();
        handleToggleLinkClick();
      }
    });

    $linkContainer.append($toggleElementsLink);
  }

  function buildApiUrl(postUrl, days){
    const apiUrl = "https://api.parsely.com/v2/analytics/post/detail?url=" +
                   encodeURIComponent(postUrl) +
                   "&apikey=" + API_KEY +
                   "&secret=" + SECRET_TOKEN +
                   "&days=" + days;
    return apiUrl;
  }

  function displayTotalHits(postUrl, $link){
    $.get(postUrl, function(data){
      const publishedOn = $(data).filter("meta[property='article:published_time']").attr('content');
      const days = moment().diff(moment(publishedOn), "days") + 1;

      $.getJSON(buildApiUrl(postUrl, days), function(json){
        const hits = json.data[0]._hits;
        $link.replaceWith(`${hits} views in ${days} days`);
      });
    });
  }

  function attachEventHandlers(){
    $(document).on("click", ".get-total-views", function(e){
      e.preventDefault();

      $(this).text("fetching ...").fadeIn(1000);
      displayTotalHits(document.URL, $(this));
    });
  }

  function init(){
    $linkContainer.insertAfter( $mainHeading.next() );

    getTemplate("parsely-links.html")
    .then(function(html){
      $linksTemplate = html;
      addToggleLink();
      setInitialLinkState();

      $linkContainer
        .append("&nbsp;&nbsp;|&nbsp;&nbsp;")
        .append($linksTemplate);

      $(".open-parsely").attr("href", parselyUrl);
      attachEventHandlers();
    });
  }

  return {
    init: init
  };
})();
