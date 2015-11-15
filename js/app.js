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

/**
 * [toggleDropdown toggles the menu once a click on a menu element is registered]
 */
function toggleDropdown() { // jshint ignore: line
  "use strict";
  $('button.navbar-toggle').click();
}

/**
 * [IEF, toggles the classes on the header on load]
 */
$(window).on('load', function() {
  "use strict";
  var header = $(".navbar");
  var nav = $("nav.navbar");
  var scroll = $(window).scrollTop();
  if (scroll >= 300) {
    header.removeClass('transparent-header').addClass("full-header");
    nav.removeClass('navbar-fixed-top');
  } else {
    header.removeClass("full-header").addClass('transparent-header');
    nav.addClass('navbar-fixed-top');
  }
});

/**
 * [IEF, toggles the classes on the header on scroll]
 */
$(function() {
  "use strict";

  var header = $(".navbar");
  var nav = $("nav.navbar");
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 300) {
      header.removeClass('transparent-header').addClass("full-header");
      nav.addClass('navbar-fixed-top');

    } else {
      header.removeClass("full-header").addClass('transparent-header');
      nav.removeClass('navbar-fixed-top');
    }
  });
});

/**
 * [Conditional IEF, toggles the classes on the thank you note footer]
 */
if (window.location.hash === "#thanks") {
  $('#thanks').removeClass("hidden-all");
  $('#thanks').addClass("block");
} else {
  $('#thanks').removeClass("block");
  $('#thanks').addClass("hidden-all");
}
