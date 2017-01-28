angular.module('kombuchadog').controller('merchandiseCtrl', function($scope, mainSrvc, $stateParams){


  mainSrvc.getMerchandise().then(function(response){
    $scope.merchandise = response.data;
    console.log($scope.merchandise);
  })

});
