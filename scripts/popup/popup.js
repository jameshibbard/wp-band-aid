var $fetchPostsButton = $('#fetchPosts');

function processJSON(json){
  var cutoff = moment().subtract(14, 'days');
  var htmlString = ""

  json.forEach(function(item){
    var date = moment(item.date);

    if (date.isBefore(cutoff)){
     // The article we're dealing with is older than two weeks
     // Do nothing
     return;
    }

    var chunk = (`<p>
      <a href="${item.link}">${item.title}</a><br />
      ${item.description}
    </p>
    `).replace(/^    /gm, '');

    htmlString += chunk
  });

  return htmlString;
}

$fetchPostsButton.on("click", function() {
  $(this).prop("disabled", true)
  $.getJSON("https://www.sitepoint.com/wp-admin/admin-ajax.php?action=sp_api_posts&offset=0&per_page=24&category=javascript", function(json){
    var text = processJSON(json);
    copyTextToClipboard(text);
    $fetchPostsButton.prop("disabled", false)
  })
});
