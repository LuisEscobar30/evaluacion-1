document.addEventListener('DOMContentLoaded', function() {

  var elems = document.querySelectorAll('.carousel.carousel-slider');
  

  elems.forEach(function(el) {
    M.Carousel.init(el, {
      fullWidth: true,
      indicators: true
    });
  });
});