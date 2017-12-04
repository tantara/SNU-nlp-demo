$(document).ready(function() {
  var surl = "http://" + document.domain + ":" + location.port + "/channel";
  console.log("socket url:", surl);
  socket = io.connect(surl);

  socket.on('connect', function(msg) {
    console.log('[socket] connected')
  });

  socket.on('disconnect', function(msg) {
    console.log('[socket] disconnected')
  });

  socket.on('response', function(msg) {
    console.log('[socket] prepend:', msg.sentiment, msg.text);
    prepend(msg.text, msg.sentiment);
  });

  $("form#broadcast").submit(function(event){
    if($("#input-data").val() == "")
    {
      return false;
    }
    socket.emit("request", {data: $("#input-data").val()});
    $("#input-data").val("");
    return false;
  });

  $('#sentence-form').keypress(function(e) {
    if(e.which == 13) {
      var text = e.target.value;
      if(text !== undefined && text.length > 0) {
        $(e.target).parent().addClass('is-loading');
        $(e.target).prop("disabled", true);

        predict(text, function() {
          $(e.target).parent().removeClass('is-loading');
          $(e.target).prop("disabled", false);
          $(e.target).val('');
        })
      }
    }
  });

  var samples = [
    "I am happy.",
    "The room was kind of clean but had a VERY strong smell of dogs.",
    "All in all, poor service, minimal amenities, small rooms, small bathrooms, no view, but great location.",
    "It is clean and the staff is very accomodating."
  ]
  for(var i = 0; i < samples.length; i++) {
    predict(samples[i]);
  }
});

function predict(text, callback) {
  $.ajax({
    method: "POST",
    url: "/predict",
    contentType: "applicaiton/json",
    dataType: "json",
    data: JSON.stringify({ q: text })
  })
  .done(function(data) {
    console.log('result:', data.sentiment, text);
    console.log('socket status:', socket.connected);
    if(!socket.connected) {
      console.log('[ajax] prepend:', data.sentiment, text);
      prepend(text, data.sentiment)
    }
    $('time.timeago').timeago();
  })
  .fail(function(err) {
    alert(err);
  })
  .always(function(res) {
    if(callback) callback();
  })
}

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
  $('time.timeago').timeago();
}
