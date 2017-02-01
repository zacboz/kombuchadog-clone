angular.module('kombuchadog').controller('successCtrl', function($scope, mainSrvc, $stateParams) {

  mainSrvc.getAdopted().then((response) => {
    $scope.adopted = response.data;
    console.log($scope.adopted);
  });

  var velocity = 0.2;

  function update(){
  var pos = $(window).scrollTop();
  $('.success-banner').each(function() {
     var $element = $(this);
     // subtract some from the height b/c of the padding
     var height = $element.height()-1920;
     $(this).css('backgroundPosition', '65.5% ' + Math.round((height - pos) * velocity) +  'px');
    });
    };

  $(window).bind('scroll', update);


});
