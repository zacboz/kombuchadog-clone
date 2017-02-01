angular.module('kombuchadog')
.controller('detailsCtrl', function($scope, mainSrvc, $stateParams){

  mainSrvc.getMerchandiseDetails($stateParams.id).then((response) => {
    $scope.details = response.data[0];
    // console.log('detailsCtrl', $scope.details);
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

});
