angular.module('kombuchadog')
.controller('homeCtrl', function($scope, mainSrvc, $stateParams){

  var velocity = 0.4;

  function update(){
  var pos = $(window).scrollTop();
  $('.home-header-image').each(function() {
     var $element = $(this);
     // subtract some from the height b/c of the padding
     var height = $element.height()-1730;
     $(this).css('backgroundPosition', '50% ' + Math.round((height - pos) * velocity) +  'px');
    });
    };

  $(window).bind('scroll', update);

});
