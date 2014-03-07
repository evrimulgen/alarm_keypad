$(window.Keypad).on('init', function(event, stream) {
  stream.addEventListener('garage_door', function(e) {
    var state = e.data;
    var icon  = $("#garage-door-state img");

    if(!icon.hasClass("loading") || icon.hasClass('init'))
      icon.attr("src", "/images/garage_door_" + state + ".png")
        .removeClass('init loading');
  });

  $('#garage-door-state img').click(function(){
    var icon = $(this);
    $.post(window.location.href + '/toggle');

    if(!icon.hasClass("loading")){
      icon.addClass("loading");
      // It takes about 13 seconds for my garage door to open. YYMV
      setTimeout(function() { icon.removeClass("loading"); }, 13000);
    }
  });
});
