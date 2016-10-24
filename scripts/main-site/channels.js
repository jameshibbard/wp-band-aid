"use strict";

const Channel = (function() {
  const elems = {
    "$msAdvertising": $("adblock-msg").parent(),
    "$featuredArea": $("main div").first(),
    "$emailSubscribeBanner1": $("category-subscribe").parent(),
    "$emailSubscribeBanner2": $("banner-subscribe").parent(),
    "$premiumCourses": $("a[href='/premium/courses/']").parent().parent(),
    "$premiumBooks": $("a[href='/premium/books/']").parent().parent(),
    "$latestHeading": $("h1:contains('Latest')").parent(),
    "$woorankBanner": $("#woorank-demand-gen"),
    "$randomAd": $(".maestro-content-type-ad").parent()
  };

  const $articlesContainer = $(".sp🚧 .l-pv4");
  const $channelBanner = $(".ChannelBanner");
  const $channelBannerInner = $(".ChannelBanner div div").first();
  const $infiniteScrollTrigger = $("#Latest_infiniteScrollTrigger").prev();
  let $articlePannels = $(".HomePanel_content");

  let API_KEY, SECRET_TOKEN;
  chrome.storage.sync.get(['parselyAPIKey','parselySecret'], function(items){
    API_KEY = items.parselyAPIKey;
    SECRET_TOKEN = items.parselySecret;
  });

  let $toggleElementsLink, linksTemplate;

  function toggleElements(){
    $.each(elems, function(key, $elem) {
      $elem.toggle();
    });
  }

  function applyElemsShowingCSS(){
    $articlesContainer.css("padding", "32px 0");
    $channelBanner.css("margin-bottom", "0");
  }

  function applyElemsHiddenCSS(){
    $articlesContainer.css("padding", "0");
    $channelBanner.css("margin-bottom", "32px");
  }

  function elemsHidden(){
    return localStorage.getItem("elemsHidden");
  }

  function setLinkText(action){
    $toggleElementsLink.text(`${action} Superfluous Elements`);
  }

  function setInitialLinkState(){
    if (elemsHidden()){
      setLinkText("Show");
      applyElemsHiddenCSS();
      toggleElements();
    }
  }

  function handleToggleLinkClick(){
    if (elemsHidden()){
      setLinkText("Hide");
      localStorage.removeItem("elemsHidden");
      applyElemsShowingCSS();
    } else {
      setLinkText("Show");
      localStorage.setItem("elemsHidden", "true");
      applyElemsHiddenCSS();
    }

    toggleElements();
  }

  function addToggleLink(){
    $toggleElementsLink = $("<a />", {
      href: "#",
      style: "color: white; position: relative; top: 25px;",
      text: "Hide Superfluous Elements",
      id: "bandaid-toggle-link",
      title: "Remove all the superfluous stuff",
      click: function(e){
        e.preventDefault();
        handleToggleLinkClick();
      }
    });

    $channelBannerInner.append($toggleElementsLink);
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

      const postUrl = $(this).closest(".HomePanel").attr("href");
      $(this).text("fetching ...").fadeIn(1000);
      displayTotalHits(postUrl, $(this));
    });
  }

  function mutationObserverCallback(mutations) {
    var mutationRecord = mutations[0];
    if (mutationRecord.addedNodes[0] !== undefined){
      // New posts were loaded
      $articlePannels = $(".HomePanel_content");
      attachLinkTemplate();
    }
  }

  function addInfiniteScrollObserver(){
    // Ensures that "Open in Parsely" links get added
    // to dynamically loaded posts
    //
    const observer = new MutationObserver(function(mutations) {
      mutationObserverCallback(mutations);
    });

    observer.observe(
      $infiniteScrollTrigger[0],
      { childList: true }
    );
  }

  function attachLinkTemplate(){
    $articlePannels.each(function(){
      var hasParselyLinks = $(this).find("div.parsely-link-block").length;

      if(!hasParselyLinks){
        const postUrl = $(this).closest(".HomePanel").attr("href");
        const parselyUrl = 'https://dash.parsely.com/sitepoint.com/find?url=' +
                            encodeURIComponent(postUrl);

        $(".parsely-link-block").addClass("channel");
        $(this).append(linksTemplate);
        $(this).find("a.open-parsely").attr("href", parselyUrl);
      }
    });
  }

  function init(){
    getTemplate("parsely-links.html")
    .then(function(html){
      linksTemplate = html;
      attachLinkTemplate();
      addToggleLink();
      setInitialLinkState();
      addInfiniteScrollObserver();
      attachEventHandlers();
    });
  }

  return {
    init: init
  };
})();
