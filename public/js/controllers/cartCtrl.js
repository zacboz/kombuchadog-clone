angular.module('kombuchadog')
.controller('cartCtrl', function($scope, mainSrvc, $stateParams){

  $scope.subtotal = 0;
  $scope.cart;

  let cartTotal = () => {
    // console.log('running cartTotal', $scope.cart);
    if (!$scope.cart || $scope.cart.length === 0) {
      $scope.cart = [];
      $scope.subtotal = 0;
    } else {
      $scope.cart.forEach((element, index) => {
        // console.log(element);
        $scope.subtotal += parseInt(element.productPrice) * parseInt(element.productQuantity);
      });
    };
  };

  mainSrvc.getCart().then((response) => {
    $scope.cart = response.data;
    console.log('Cart in controller', $scope.cart);
    cartTotal();
  }).catch((err) => {
    console.log(err);
  });

$scope.removeFromCart = (item) => {
  console.log('remove CTRL', item)
  mainSrvc.removeFromCart(item).then(() => {
    mainSrvc.getCart().then((response) => {
      $scope.cart = response.data;
      $scope.subtotal = 0;
      cartTotal();
    }).catch((err) => {
      console.log(err);
    });
  });
};

$scope.updateQuantity = (item) => {
  console.log(item)
  // console.log($scope.cart);
  // console.log($scope.cart[0].productId);
  // const productId = $scope.cart.productId;
  mainSrvc.updateQuantity(item.productId, item.productQuantity);
    mainSrvc.getCart().then((response) => {
      $scope.cart = response.data;
      $scope.subtotal = 0;
      cartTotal();
    }).catch((err) => {
      console.log(err);
    });
};





});//closing
