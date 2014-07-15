window.Keypad.alarm = function(event, stream) {
  var $console = $('#status h1');

  $('#keypad').hide();
  $('#command-row').removeClass('hidden');

  stream.addEventListener('status', function(e) {
    var status = JSON.parse(e.data);
    Keypad.clearState($console)

    zone = "Zone " + status.zone_number
    if(status.zone_name) zone = status.zone_name

    if(status.alarm_sounding){
      $console.text("ALARM: " + zone).addClass("alarm-sounding")
    } else if(status.fire){
      $console.text("FIRE").addClass("alarm-sounding")
    } else if(status.armed_home || status.armed_away) {
      type = status.armed_home ? "stay" : "away"
      $console.text("Armed " + type).addClass("armed")
    } else if(status.ready) {
      $console.text("Ready").addClass("ready")
    } else {
      $console.text(zone)
    }
  });

  $('#command-row a').click(function(e){
    var click = $('#click')[0];

    click.load();
    click.play();

    var $button = $(this);
    var val = $button.text();
    switch(val){
      case "Off":
        val = 1;
        break;
      case "Away":
        val = 2;
        break;
      case "Stay":
        val = 3;
        break;
    }
    $.post(window.location.href + '/write', {key: window.Keypad.passcode + val})
  });

  Keypad.clearState($console);
}

$(window.Keypad).on('init', function(event, stream) {
  $('#keypad a').click(function(e){
    var click = $('#click')[0];

    click.load();
    click.play();

    var $button = $(this);
    var val = $button.text();

    window.Keypad.passcode += val;
    var display = "";
    for(i = 0; i < window.Keypad.passcode.length; i++) {
      display += "&nbsp;&bull;&nbsp;"
    }
    $('#status h1').html(display);

    if(window.Keypad.passcode.length == 4){
      window.Keypad.alarm(event, stream);
    }
  });
});
