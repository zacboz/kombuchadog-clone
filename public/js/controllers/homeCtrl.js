angular.module('kombuchadog')
.controller('homeCtrl', function($scope, mainSrvc, $stateParams, $rootScope){



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

  var i = 0;
  var myVar = setInterval(changeImage, 2000);

  function changeImage(){
    //array of backgrounds
    var bottles = ["ginger.jpg", "hint-of-mint.jpg", "just-kombucha.jpg", "raspberry.jpg", "wild-blue-ginger.jpg", "wild-blueberry.jpg"];
    $('.right-column-image').css('background-image', 'url("images/kombuchaflavors/'+bottles[i]+'")');

    if(i == bottles.length -1){
        i = 0;
    }
    else{
        i++;
    }
  }

 // window.setInterval("changeImage()", 5000);

});
