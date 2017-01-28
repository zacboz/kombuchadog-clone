angular.module('kombuchadog')
.controller('profileCtrl', function($scope, mainSrvc, $stateParams){


  mainSrvc.getDogProfile($stateParams.name).then((response) => {
    $scope.profile = response.data;
    // console.log($scope.profile);
    $scope.adopted = $scope.profile[0].adopted;
      // if ($scope.test === true) {
      //   $scope.adopted = 'ADOPTED!';
      // } else {
      //   $scope.adopted = 'UP FOR ADOPTION'
      // }
  });


});
