// Responds to context menu options
//
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text) {
    switch (msg.text) {
      case "getTitle":
        sendResponse($('title').text());
        break;
      case "getDesc":
        sendResponse($('meta[name="description"]').attr("content"));
        break;
      case "getNewsletterLink":
        alert("ziggy");
        sendResponse("titty");
        break;
      default:
        sendResponse("");
    }
  }
});
