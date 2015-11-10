var host = "ladydascalie.github.io";
if ((host == window.location.host) && (window.location.protocol != "https:")) {
    window.location.protocol = "https";
}

// Smooth scrolling
$("a[href^='#']").on('click', function(e) {

  // prevent default anchor click behavior
  e.preventDefault();

  // store hash
  var hash = this.hash;

  // animate
  $('html, body').animate({
    scrollTop: $(hash).offset().top
  }, 300, function(){
    // when done, add hash to url
    // (default click behaviour)
    window.location.hash = hash;
  });
});


// Thanks
if(window.location.hash === "#thanks") {
  $('#thanks').removeClass("hidden-all");
  $('#thanks').addClass("block");
} else {
  $('#thanks').removeClass("block");
  $('#thanks').addClass("hidden-all");
}
