let apiKey, secretToken;

function fetchParselyCreds(){
  chrome.storage.sync.get(['parselyAPIKey', 'parselySecret'], function(items) {
    $("#api-key-status").text(items.parselyAPIKey);
    $("#secret-token-status").text(items.parselySecret);
  });
}

$("button").on("click", function(){
  const elem = $(this).prev().get(0);
  const key = elem.id;
  const val = elem.value;

  chrome.storage.sync.set({ [key] : val }, function(items) {
    console.log("Settings saved");
  });

  fetchParselyCreds();
});

fetchParselyCreds();
