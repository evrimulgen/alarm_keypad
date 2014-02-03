$(function() {
  FastClick.attach(document.body);
  var stream = new EventSource('/stream');
  var clearState = function($console){
    $console.removeClass("alarm-sounding armed ready").text()
  };
  stream.onerror = function(e) {
    $console = $('#status h1');
    clearState($console)
    $console.text("Comm Error").addClass("alarm-sounding");
  }
  stream.onmessage = function(e) {
    var status = JSON.parse(e.data);
    $console = $('#status h1')
    clearState($console)
    if(status["ALARM SOUNDING"]){
      $console.text("ALARM").addClass("alarm-sounding")
    } else if(status["ARMED HOME"] || status["ARMED AWAY"]) {
      type = status["ARMED HOME"] ? "stay" : "away"
      $console.text("Armed " + type).addClass("armed")
    } else if(status["READY"]) {
      $console.text("Ready").addClass("ready")
    }
  }
});

$(document).on('click', 'a', function(e){
  var click = $('#click')[0];

  click.load();
  click.play();

  var $button = $(this);
  var val = $button.text();
  switch(val){
    case "OFF":
      val = 1;
      break;
    case "AWAY":
      val = 2;
      break;
    case "STAY":
      val = 3;
      break;
  }
  $.post('/write', {key: val})
});
