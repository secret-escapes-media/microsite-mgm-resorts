(function ($, root, undefined) {$(function () {'use strict'; // on ready start
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
//        general
///////////////////////////////////////

  // css tricks snippet - http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  // inserts current year
  $('.js-year').html(new Date().getFullYear());

  // detects touch device
  if ("ontouchstart" in document.documentElement){
    $('html').addClass('touch');
  }

  // fit text for the main title
  $('.js-fit-text').fitText(0.75);


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage = $('body').data('current-page');
  $('.' + currentPage + ' .site-nav__item--' + currentPage).addClass('site-nav__item--current');


///////////////////////////////////////
//    Sticky header
///////////////////////////////////////

$(window).scroll(function(){
  var st = $(document).scrollTop();
  var bannerH = $('.banner').outerHeight();
  var navH = $('.banner__nav').outerHeight();
  var offset = bannerH - navH;
  if (st > offset){
    $('.banner__nav').addClass('is-stuck');
  } else {
    $('.banner__nav').removeClass('is-stuck');
  }
});


///////////////////////////////////////
//      SVG image swap
///////////////////////////////////////

  // finds image with class and swaps .png with .svg in img source string
  if (Modernizr.svgasimg) {
    var svgSwap = $('img.js-svg-swap');
    svgSwap.each( function() {
      var currentSrc = $(this).attr('src'),
          newSrc = currentSrc.replace('.png', '.svg');
      $(this).attr('src', newSrc);
    });
  }


// ///////////////////////////////////////
// //      Parallax
// //      [ example: <div class="parallax" data-parallax-speed="0.2"> ]
// ///////////////////////////////////////
//
//   $(document).scroll(function(){
//     var scrolled = $(document).scrollTop();
//     $('.parallax').each(function(){
//       var speed = $(this).attr('data-parallax-speed');
//       var offset = $(this).offset();
//       var parallax = -(scrolled - offset.top) * speed ;
//       $(this).css('background-position', 'center ' + parallax + 'px');
//     });
//   });


///////////////////////////////////////
//    POIs modal
///////////////////////////////////////

  var modal          = $('.js-modal'),
      modalLaunchBtn = $('.js-open-modal'),
      modalCloseBtn  = $('.js-close-modal');

    // opens modal with specific content
    function modalOpen(event){
      event.preventDefault();
      // hides all modal content
      $('.modal__content').hide();
      // show specific modal content from element data attribute
      var modalContent   = $(event.currentTarget).data('modal-id'),
          modalContentId = '.modal__content--' + modalContent;
      $(modalContentId).show().addClass('is-open');
      // disable scrolling on background content (doesn't work iOS)
      $('body').addClass('disable-scroll');
      // open modal
      modal.fadeIn('250', function(){
        $(this).removeClass('is-closed').addClass('is-open');
      });
    }

    // closes modal and hides all content
    function modalClose(event){
      event.preventDefault();
      // enable scrolling
      $('body').removeClass('disable-scroll');
      // reset scroll position
      // This is a bit hacky, but visually hides the scroll position resetting
      setTimeout(function() {
        $('.modal__content-wrap').scrollTop(0);
      }, 280);
      // close modal with fade
      modal.fadeOut('250', function(){
        $(this).removeClass('is-open').addClass('is-closed');
        // Remove status class from modal content
        $('.modal__content.is-open').removeClass('is-open');
      });
    }

    // launches modal when offer is clicked
    modalLaunchBtn.on('click', function(event) {
      modalOpen(event);
    });

    // closes modal on close icon click
    modalCloseBtn.on('click', function(event) {
      modalClose(event);
    });

    // closes modal on background click
    modal.on('click', function(event) {
      if (event.target !== this){
        return;
      }
      modalClose(event);
    });

    // closes modal on escape key press
    $(document).keyup(function(event) {
       if (event.keyCode == 27) {
         modalClose(event);
        }
    });


  ///////////////////////////////////////
  //    Modal Nav - next & previous
  ///////////////////////////////////////

    $('.js-modal-nav').on('click', function(event) {
      event.preventDefault();

      var navDirection          = $(this).data('nav-direction'),
          currentModal          = $('.modal__content.is-open'),
          currentModalCategory  = currentModal.data('content-category'),
          nextModal             = currentModal.next('.modal__content'),
          nextModalCategory     = nextModal.data('content-category'),
          previousModal         = currentModal.prev('.modal__content'),
          previousModalCategory = previousModal.data('content-category'),
          firstModal            = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:first'),
          lastModal             = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:last');


      function launchNextModal(){
        // hides the current modal
        currentModal.hide().removeClass('is-open');
        // reset scroll position
        $('.modal__content-wrap').scrollTop(0);
        if (nextModal && currentModalCategory === nextModalCategory ) {
          // shows next in category
          nextModal.show().addClass('is-open');
        } else {
          // isn't another modal in category so goes back to beginning
          firstModal.show().addClass('is-open');
        }
      }

      function launchPreviousModal(){
        // hides the current modal
        currentModal.hide().removeClass('is-open');
        // reset scroll position
        $('.modal__content-wrap').scrollTop(0);
        if (previousModal && currentModalCategory === previousModalCategory ) {
          // shows next in category
          previousModal.show().addClass('is-open');
        } else {
          // isn't another modal in category so goes back to beginning
          lastModal.show().addClass('is-open');
        }
      }

      // checks which button has been clicked and runs function
      switch (navDirection) {
        case 'next':
          launchNextModal();
          break;
        case 'previous':
          launchPreviousModal();
          break;
      }

    });


///////////////////////////////////////
//    Mobile CTA - waypoints
///////////////////////////////////////

// not sure of a cleaner way to write this and I dont want to trawl through the
// terrible docs to find out

  // shows mobile cta when past the start of food section
  var waypoint = new Waypoint({
    element: document.getElementById('food'),
    handler: function() {
      $('.mobile-cta').toggleClass('is-active');
    },
    offset: 10
  });

  // hides mobile cta when in the flights section it links to
  var fucky = new Waypoint({
    element: document.getElementById('flights'),
    handler: function() {
      $('.mobile-cta').toggleClass('is-active');
    },
    offset: 10
  });


///////////////////////////////////////
//    Expand image credit
///////////////////////////////////////

$('.js-image-credit').each(function() {
  // grab the credit text
  var imageCredit = $(this).html();
  // remove credit text and use a smaller label
  $(this).html('Image Source').css('cursor', 'pointer');
  // on click replace the label with the original credit text
  $(this).on('click', function() {
    $(this).html(imageCredit).css('cursor', 'auto');
  });
});




///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end