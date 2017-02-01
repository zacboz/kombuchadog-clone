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


  


});
