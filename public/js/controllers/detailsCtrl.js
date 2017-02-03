angular.module('kombuchadog')
.controller('detailsCtrl', function($scope, mainSrvc, $stateParams, $location){

  mainSrvc.getMerchandiseDetails($stateParams.id).then((response) => {
    $scope.details = response.data[0];
    console.log('detailsCtrl', $scope.details.id);
    if ($scope.details.id < 2) {
      $scope.previous = null;
      $scope.next = true;
    } else if ($scope.details.id > 3) {
      $scope.next = null;
      $scope.previous = true;
    } else {
      $scope.previous = true;
      $scope.next = true;
    }
  });

  $scope.productQuantity = 1;
  $scope.addToCart = (productSize, productQuantity) => {
    const productTitle = $scope.details.title;
    const productPrice = $scope.details.price;
    const productImage = $scope.details.image;
    const productId = $scope.details.id;

    mainSrvc.addToCart(productTitle, productImage, productSize, productQuantity, productPrice, productId);
      alert('product added to cart');
  };

  $scope.changeProduct = (direction) => {
    let index = $scope.details.id + Number(direction);
    if (index < 1) {
      $location.path('/merchandise-details/1');
    }
    else if (index > 4){
      $location.path('/merchandise-details/4');
    }
    else {
      $location.path(`/merchandise-details/${index}`);
    }
  };

});
