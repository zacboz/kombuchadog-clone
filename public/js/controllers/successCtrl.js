angular.module('kombuchadog').controller('successCtrl', function($scope, mainSrvc, $stateParams) {

  mainSrvc.getAdopted().then((response) => {
    $scope.adopted = response.data;
    console.log($scope.adopted);
  });

});
