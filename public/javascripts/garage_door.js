$(window.Keypad).on('init', function(event, stream) {
  stream.addEventListener('garage_door', function(e) {
    var state = e.data;
    var icon  = $("#garage-door-state img");

    if(!icon.hasClass("loading") || icon.hasClass('init'))
      icon.attr("src", "/images/garage_door_" + state + ".png")
        .removeClass('init loading');
  });

  $('#garage-door-state img').click(function(){
    var icon = $(this)
    if(!icon.hasClass("loading")){
      icon.addClass("loading");

      $.post(window.location.href + '/toggle')

      setTimeout(function() { icon.removeClass("loading"); }, 5000);
    }
  });
});
