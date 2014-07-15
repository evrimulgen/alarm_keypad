<<<<<<< Updated upstream
window.Keypad.alarm = function(event, stream) {
  var $console = $('#status h1');

  var clearState = function($console){
    $console.removeClass("alarm-sounding armed ready").text('Connecting')
  };

  stream.addEventListener('status', function(e) {
    var status = JSON.parse(e.data);
    clearState($console)
=======
$(window.Keypad).on('init', function(event, stream) {
  stream.addEventListener('status', function(e) {
    var status = JSON.parse(e.data);
    $console = $('#status h1')
    Keypad.clearState($console)
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  $('#command-row a').click(function(e){
    var click = $('#click')[0];

    click.load();
    click.play();

=======
  $('a').click(function(e){
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    $.post(window.location.href + '/write', {key: window.Keypad.passcode + val})
  });

  clearState($console);
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
      $('#keypad').hide();
      $('#command-row').removeClass('hidden');
      window.Keypad.alarm(event, stream);
    }
=======

    $.post(window.location.href + '/write', {key: val})

    this.classList.remove("clicked");
    this.offsetWidth = this.offsetWidth;
    this.classList.add("clicked");
>>>>>>> Stashed changes
  });
});
