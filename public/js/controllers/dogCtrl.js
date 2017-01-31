angular.module('kombuchadog').controller('dogCtrl', function($scope, mainSrvc, $stateParams, $document) {

  mainSrvc.getUpForAdoption().then((response) => {
    $scope.dogs = response.data;
    console.log($scope.dogs);
  });

  var velocity = 0.2;

  function update(){
  var pos = $(window).scrollTop();
  $('.our-dogs-banner').each(function() {
     var $element = $(this);
     // subtract some from the height b/c of the padding
     var height = $element.height()-1580;
     $(this).css('backgroundPosition', '36.5% ' + Math.round((height - pos) * velocity) +  'px');
    });
    };

  $(window).bind('scroll', update);


  // $('.parallax-window').parallax({imageSrc: '/images/dog-banners-v2.jpg'});


  // ADDITIONAL CODE TO MAKE THE PARALLAX FOR THIS CONTAINER STOP ONCE IT LEAVES THE VIEW.
    // $(window).scroll(function() {
    //   var bannerContainerHeight = $('.banner-container').height();
    //   var winScroll = $(this).scrollTop();
    //   if (winScroll >= $('.banner-container').offset().top - $(window).height() && winScroll <= $('.banner-container').offset().top + bannerContainerHeight) {
    //     var offset = winScroll - $('.banner-container').offset().top + $(window).height() - 0;
    //     // center moves down on the y-axis on scroll
    //     $('#dog-banner').css({
    //       'transform': 'translate(0px, -'+ offset /50 +'%)'
    //     });
    //   }
    // });


});
