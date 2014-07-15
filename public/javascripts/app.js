var Keypad = {passcode: ''};

$(function() {
  FastClick.attach(document.body);
  var stream = new EventSource(window.location.href + '/stream');

  stream.onerror = function(e) {
    $console = $('#status h1');
    $console.text("Comm Error").addClass("alarm-sounding");
  }

  stream.addEventListener('keepalive', function(e) {
    console.debug("Keep Alive");
  });

  $(window.Keypad).trigger('init', [stream]);
});
