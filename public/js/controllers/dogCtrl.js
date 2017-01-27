angular.module('kombuchadog').controller('dogCtrl', function($scope, mainSrvc, $stateParams) {

  mainSrvc.getUpForAdoption().then((response) => {
    $scope.dogs = response.data;
    console.log($scope.dogs);
  });

});
