"use strict";

const MainChannels = (function() {
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
  let $toggleElementsLink;

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

  function init(){
    addToggleLink();
    setInitialLinkState();
  }

  return {
    init: init
  };
})();

MainChannels.init();
