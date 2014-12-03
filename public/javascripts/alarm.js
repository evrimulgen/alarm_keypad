window.Keypad.toggleKeypad = function(){
  $keypad = $('#keypad')

  if($keypad.is(':visible')){
    $('#keypad').hide();
    $('#command-row, #panic').removeClass('hidden');
  } else {
    $('#keypad').show();
    $('#command-row, #panic').addClass('hidden');
  }
}

window.Keypad.alarm = function(event, stream) {
  var $console = $('#status h1');

  window.Keypad.toggleKeypad();

  Keypad.statusListener = stream.addEventListener('status', function(e) {
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

  $('#command-row .controls a').click(function(e){
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

    this.classList.remove("clicked");
    this.offsetWidth = this.offsetWidth;
    this.classList.add("clicked");
  });

  $('a#reset-passcode').click(function(){
    window.Keypad.passcode = '';
    window.Keypad.toggleKeypad();
  });

  $('#panic a').click(function(e){
    e.preventDefault();

    if(confirm("Are you sure?")){
      $.post(window.location.href + '/panic')
    }
  });

  Keypad.clearState($console);
}

$(window.Keypad).on('init', function(event, stream) {
  $('#reset a').click(function(e){
    localStorage.removeItem('passcode');
  });

  if(window.Keypad.passcode.length == 4){
    window.Keypad.alarm(event, stream);
  }
  else {
    $('#keypad a').click(function(e){
      var $button = $(this);
      var val = $button.text();

      window.Keypad.passcode += val;
      var display = "";
      for(i = 0; i < window.Keypad.passcode.length; i++) {
        display += "&nbsp;&bull;&nbsp;"
      }
      $('#status h1').html(display);

      this.classList.remove("clicked");
      this.offsetWidth = this.offsetWidth;
      this.classList.add("clicked");

      if(window.Keypad.passcode.length == 4){
        localStorage.setItem("passcode", window.Keypad.passcode);
        window.Keypad.alarm(event, stream);
      }
    });
  }
});
