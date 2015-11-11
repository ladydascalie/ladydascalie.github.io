var host = "ladydascalie.github.io";
if ((host === window.location.host) && (window.location.protocol !== "https:")) {
  window.location.protocol = "https";
}

// Smooth scrolling
$("a[href^='#']").on('click', function (e) {
  "use strict";
  // prevent default anchor click behavior
  e.preventDefault();
  // store hash
  var hash = this.hash;
  // animate
  $('html, body').animate({
    scrollTop: $(hash).offset().top - 70
  });
});

// ToggleDropdown
function toggleDropdown() { // jshint ignore: line
  "use strict";
  $('button.navbar-toggle').click();
}

// Header styles
$(window).on('load', function() {
  "use strict";
  var header = $(".navbar");
  var scroll = $(window).scrollTop();
  if (scroll >= 300) {
    header.removeClass('transparent-header').addClass("full-header");
  } else {
    header.removeClass("full-header").addClass('transparent-header');
  }
});

$(function() {
  "use strict";

  //caches a jQuery object containing the header element
  var header = $(".navbar");
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 300) {
      header.removeClass('transparent-header').addClass("full-header");
    } else {
      header.removeClass("full-header").addClass('transparent-header');
    }
  });
});

// Form submission "thank you" note
if (window.location.hash === "#thanks") {
  $('#thanks').removeClass("hidden-all");
  $('#thanks').addClass("block");
} else {
  $('#thanks').removeClass("block");
  $('#thanks').addClass("hidden-all");
}
