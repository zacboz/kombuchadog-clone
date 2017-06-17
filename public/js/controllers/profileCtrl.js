angular.module('kombuchadog')
.controller('profileCtrl', function($scope, mainSrvc, $stateParams){


  mainSrvc.getDogProfile($stateParams.name).then((response) => {
    $scope.profile = response.data;
    $scope.adopted = $scope.profile[0].adopted;
  });


});
