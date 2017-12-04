$(document).ready(function() {
  $('#sentence-form').keypress(function(e) {
    if(e.which == 13) {
      var text = e.target.value;
      if(text !== undefined && text.length > 0) {
        $(e.target).parent().addClass('is-loading');
        $(e.target).prop("disabled", true);

        $.ajax({
          method: "POST",
          url: "/predict",
          contentType: "applicaiton/json",
          dataType: "json",
          data: JSON.stringify({ q: text })
        })
        .done(function(data) {
          console.log('result:', data.sentiment, text);
          prepend(text, data.sentiment)
          $('time.timeago').timeago();
        })
        .fail(function(err) {
          alert(err);
        })
        .always(function(res) {
          $(e.target).parent().removeClass('is-loading');
          $(e.target).prop("disabled", false);
          $(e.target).val('');
        })
      }
    }
  });
  $('time.timeago').timeago();
});

function prepend(text, sentiment) {
  var content = $('<div></div>');

  var img = $('<img />');
  if(sentiment == "happy") {
    img.attr('src', '/static/img/happy.png');
  }
  else {
    img.attr('src', '/static/img/unhappy.png');
  }

  var now = new Date();
  var h3 = $('<h3></h3>').text(text);
  var time = $('<time></time>').addClass('timeago').attr('datetime', now.toISOString());

  content.append(img);
  content.append(h3);
  content.append(time);
  content.append($('<hr />'));

  $('.history').prepend(content);
}
