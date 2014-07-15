$(window.Keypad).on('init', function(event, stream) {
  stream.addEventListener('garage_door', function(e) {
    var state = e.data;
    var icon  = $("#garage-door-state img");

    icon.attr("src", "/images/garage_door_" + state + ".png")
      .removeClass('loading');
  });

  $('#garage-door-state img').click(function(){
    $.post(window.location.href + '/toggle');

    this.classList.remove("opening");
    this.offsetWidth = this.offsetWidth;
    this.classList.add("opening");
  });
});
