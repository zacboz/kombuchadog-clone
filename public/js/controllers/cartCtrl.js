angular.module('kombuchadog')
.controller('cartCtrl', function($scope, mainSrvc, $stateParams, $rootScope){

  $scope.subtotal = 0;
  $scope.cart;

  let cartTotal = () => {
    // console.log('running cartTotal', $scope.cart);
    if (!$scope.cart || $scope.cart.length === 0) {
      document.getElementById('cart-page').style.display = "none";
      document.getElementById('empty-cart').style.display = "block";
      $scope.cart = [];
      $scope.subtotal = 0;
    } else {
      $scope.cart.forEach((element, index) => {
        $scope.subtotal += parseInt(element.productPrice) * parseInt(element.productQuantity);
      });
    };
  };

  let findTotalItems = () => {
    $scope.totalItems = 0;
    for (let i = 0; i < $scope.cart.length; i++) {
      $scope.totalItems += Number($scope.cart[i].productQuantity);
    }
    return $scope.totalItems;
  }

  mainSrvc.getCart().then((response) => {
    $scope.cart = response.data;
    cartTotal();
  }).catch((err) => {
    console.log(err);
  });

$scope.removeFromCart = (item) => {
  $rootScope.cartTotal = findTotalItems();
  mainSrvc.removeFromCart(item).then(() => {
    mainSrvc.getCart().then((response) => {
      $scope.cart = response.data;
      $scope.subtotal = 0;
      cartTotal();
      $rootScope.cartTotal = findTotalItems();
    }).catch((err) => {
      console.log(err);
    });
  });
};

$scope.updateQuantity = (item) => {
  $rootScope.cartTotal = findTotalItems();
  mainSrvc.updateQuantity(item.productId, item.productQuantity);
    mainSrvc.getCart().then((response) => {
      $scope.cart = response.data;
      $scope.subtotal = 0;
      cartTotal();
    }).catch((err) => {
      console.log(err);
    });
};

var handler = StripeCheckout.configure({
  key: 'pk_test_6065FRM1a4tbwIiofznTSYu4',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
    mainSrvc.postOrder(token, $scope.subtotal*100, $scope.cart);
  }
});

document.getElementById('custombutton').addEventListener('click', function(e) {
  // Open Checkout with further options:
  handler.open({
    name: 'KOMBUCHADOG',
    description: 'Adopt Happiness',
    shippingAddress: true,
    billingAddress: true,
    zipCode: true,
    amount: $scope.subtotal * 100
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});





});//closing
