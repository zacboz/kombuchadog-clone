angular.module('kombuchadog').controller('dogCtrl', function($scope, mainSrvc, $stateParams) {

  mainSrvc.getUpForAdoption().then((response) => {
    $scope.dogs = response.data;
    console.log($scope.dogs);
  });

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
