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


// Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-69936574-1', 'auto');
ga('send', 'pageview');
