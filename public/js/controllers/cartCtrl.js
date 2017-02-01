angular.module('kombuchadog')
.controller('cartCtrl', function($scope, mainSrvc, $stateParams){

  $scope.test = 'hello';

  mainSrvc.getCart().then((response) => {
    $scope.cart = response.data;
    console.log('Cart in controller', $scope.cart);
  });

});
