angular.module('kombuchadog')
.controller('detailsCtrl', function($scope, mainSrvc, $stateParams){

  mainSrvc.getMerchandiseDetails($stateParams.id).then((response) => {
    // console.log($stateParams.id);
    $scope.details = response.data;
    console.log('detailsCtrl', $scope.details);
  });

});
