$(function() {
  $('.first-screen').css("height", $(window).height());
  
  $('.owl-carousel').owlCarousel({
    loop:true,
    autoplay:true,
    margin:10,
    responsiveClass:true,
    dots:true,
    items: 1
  });

  let stackPhotos = [
    'portfolio-5.jpg',
    'portfolio-6.jpg',
    'portfolio-7.jpg',
    'portfolio-8.jpg',
    'portfolio-9.jpg',
    'portfolio-10.jpg',
    'portfolio-11.jpg',
    'portfolio-12.jpg',
    'portfolio-13.jpg',
    'portfolio-14.jpg'
  ];

  $('#more-works').click(function(e){
    e.preventDefault();
    const maxLength = (stackPhotos.length < 4 ? stackPhotos.length : 4);
    for (let i = 0; i < maxLength; i++) {
      $('.works-block').append('<img src="images/portfolio/' + stackPhotos[0] + '">');
      stackPhotos.shift();
    }
    if (maxLength < 4 || stackPhotos.length === 0) { $(this).css("display", "none"); } 
  });

  // $('video').removeAttr('controls');
  $('video').click(function(){
    this.paused ? this.play() : this.pause();
    // this.setAttribute('controls', 'controls');
  });

});