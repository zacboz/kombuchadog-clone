'use strict';

angular.module('kombuchadog', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html',
        controller: 'homeCtrl'
    }).state('about', {
        url: '/about',
        templateUrl: './views/about.html'
    }).state('our-kombucha', {
        url: '/our-kombucha',
        templateUrl: './views/our-kombucha.html'
    }).state('our-dogs', {
        url: '/our-dogs',
        templateUrl: './views/our-dogs.html',
        controller: 'dogCtrl'
    }).state('dog-profile', {
        url: '/dog-profile/:name',
        templateUrl: './views/profile.html',
        controller: 'profileCtrl'
    }).state('success-stories', {
        url: '/success-stories',
        templateUrl: './views/success-stories.html',
        controller: 'successCtrl'
    }).state('find-kombucha', {
        url: '/find-kombucha',
        templateUrl: './views/find-kombucha.html',
        controller: 'findCtrl'
    }).state('merchandise', {
        url: '/merchandise',
        templateUrl: './views/merchandise.html',
        controller: 'merchandiseCtrl'
    }).state('merchandise-details', {
        url: '/merchandise-details/:id',
        templateUrl: './views/merchandise-details.html',
        controller: 'detailsCtrl'
    }).state('cart', {
        url: '/cart',
        templateUrl: './views/cart.html',
        controller: 'cartCtrl'
    }).state('checkout', {
        url: '/checkout',
        templateUrl: './views/checkout.html',
        controller: 'checkoutCtrl'
    });

    $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('kombuchadog').service('mainSrvc', function ($http) {

  this.getUpForAdoption = function () {
    return $http({
      method: 'GET',
      url: '/our-dogs-index'
    }).then(function (response) {
      return response;
    });
  };

  this.getAdopted = function () {
    return $http({
      method: 'GET',
      url: '/success-stories-index'
    }).then(function (response) {
      return response;
    });
  };

  this.getDogProfile = function (name) {
    return $http({
      method: 'GET',
      url: '/our-dogs/' + name
    }).then(function (response) {
      return response;
      // console.log('SERVICE', response);
    });
  };

  this.getMerchandise = function () {
    return $http({
      method: 'GET',
      url: '/merchandise-index'
    }).then(function (response) {
      return response;
      // console.log(response);
    });
  };

  this.getMerchandiseDetails = function (id) {
    return $http({
      method: 'GET',
      url: '/merchandise/' + id
    }).then(function (response) {
      return response;
      // console.log(response);
    });
  };

  this.addToCart = function (productTitle, productImage, productSize, productQuantity, productPrice, productId) {
    var item = {
      productTitle: productTitle,
      productImage: productImage,
      productSize: productSize,
      productQuantity: productQuantity,
      productPrice: productPrice,
      productId: productId
    };
    return $http({
      method: 'POST',
      url: '/cart',
      data: item
    }).success(function () {
      // console.log('SRVC item added')
    });
  };

  this.getCart = function () {
    return $http({
      method: 'GET',
      url: '/cart'
    }).then(function (response) {
      // console.log('SRVC CART', response)
      return response;
    });
  };

  this.removeFromCart = function (item) {
    var id = item.productId;
    return $http({
      method: 'DELETE',
      url: '/cart/' + id
    }).then(function (response) {
      console.log('SRVE REMOVE FROM CART', response);
      return response;
    });
  };

  this.updateQuantity = function (productId, productQuantity) {
    var product = {
      productId: productId,
      productQuantity: productQuantity
    };
    console.log('SRVC product', product);
    return $http({
      method: 'PUT',
      url: '/cart/' + productId,
      data: product
    }).success(function (response) {
      console.log('SRVC UPDATING', response);
    });
  };

  this.postOrder = function (token, total, cart) {
    console.log('SRVC TOKEN', token);
    return $http({
      method: 'POST',
      url: '/order',
      data: { token: token, total: total, cart: cart }
    }).success(function (response) {
      console.log('SRVC token', response);
      return response;
    });
  };
});
// $(window).scroll(function() {
//   // if ($(window).width() >= 1026) {
//     // find the scroll and use this variable to move elements
//     var winScroll = $(this).scrollTop();
//     // console.log(winScroll);
//     // center moves down on the y-axis on scroll
//
//     $('#dog-banner').css({
//       'transform': 'translate(0px, -'+ winScroll /50 +'%)'
//     });
//   // }
// });
"use strict";
'use strict';

angular.module('kombuchadog').controller('cartCtrl', function ($scope, mainSrvc, $stateParams, $rootScope) {

  $scope.subtotal = 0;
  $scope.cart;

  // if($scope.cart == 0 ) {
  //   document.getElementById('cart-page').style.display = "none";
  //   document.getElementById('empty-cart').style.display = "block";
  // }

  var cartTotal = function cartTotal() {
    // console.log('running cartTotal', $scope.cart);
    if (!$scope.cart || $scope.cart.length === 0) {
      document.getElementById('cart-page').style.display = "none";
      document.getElementById('empty-cart').style.display = "block";
      $scope.cart = [];
      $scope.subtotal = 0;
    } else {
      $scope.cart.forEach(function (element, index) {
        // console.log(element);
        $scope.subtotal += parseInt(element.productPrice) * parseInt(element.productQuantity);
      });
    };
  };

  var findTotalItems = function findTotalItems() {
    $scope.totalItems = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      $scope.totalItems += Number($scope.cart[i].productQuantity);
    }
    console.log($scope.totalItems);
    return $scope.totalItems;
  };

  mainSrvc.getCart().then(function (response) {
    $scope.cart = response.data;
    console.log('Cart in controller', $scope.cart);
    cartTotal();
  }).catch(function (err) {
    console.log(err);
  });

  $scope.removeFromCart = function (item) {
    $rootScope.cartTotal = findTotalItems();
    console.log('remove CTRL', item);
    mainSrvc.removeFromCart(item).then(function () {
      mainSrvc.getCart().then(function (response) {
        $scope.cart = response.data;
        $scope.subtotal = 0;
        cartTotal();
        $rootScope.cartTotal = findTotalItems();
      }).catch(function (err) {
        console.log(err);
      });
    });
  };

  $scope.updateQuantity = function (item) {
    $rootScope.cartTotal = findTotalItems();
    console.log(item);
    mainSrvc.updateQuantity(item.productId, item.productQuantity);
    mainSrvc.getCart().then(function (response) {
      $scope.cart = response.data;
      $scope.subtotal = 0;
      cartTotal();
    }).catch(function (err) {
      console.log(err);
    });
  };

  var handler = StripeCheckout.configure({
    key: 'pk_test_6065FRM1a4tbwIiofznTSYu4',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function token(_token) {
      console.log(_token);
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      mainSrvc.postOrder(_token, $scope.subtotal * 100, $scope.cart);
    }
  });

  document.getElementById('custombutton').addEventListener('click', function (e) {
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
  window.addEventListener('popstate', function () {
    handler.close();
  });
}); //closing
'use strict';

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams, $location, $rootScope) {

  mainSrvc.getMerchandiseDetails($stateParams.id).then(function (response) {
    $scope.details = response.data[0];
    console.log('detailsCtrl', $scope.details.id);
    if ($scope.details.id < 2) {
      $scope.previous = null;
      $scope.next = true;
      $scope.slash = null;
    } else if ($scope.details.id > 3) {
      $scope.next = null;
      $scope.previous = true;
      $scope.slash = null;
    } else {
      $scope.previous = true;
      $scope.next = true;
      $scope.slash = true;
    }
  });

  $scope.productQuantity = 1;
  $scope.addToCart = function (productSize, productQuantity) {
    $rootScope.cartTotal += Number(productQuantity);
    var productTitle = $scope.details.title;
    var productPrice = $scope.details.price;
    var productImage = $scope.details.image;
    var productId = $scope.details.id;
    mainSrvc.addToCart(productTitle, productImage, productSize, productQuantity, productPrice, productId);
  };

  $scope.changeProduct = function (direction) {
    var index = $scope.details.id + Number(direction);
    if (index < 1) {
      $location.path('/merchandise-details/1');
    } else if (index > 4) {
      $location.path('/merchandise-details/4');
    } else {
      $location.path('/merchandise-details/' + index);
    }
  };
});
'use strict';

angular.module('kombuchadog').controller('dogCtrl', function ($scope, mainSrvc, $stateParams, $document) {

  mainSrvc.getUpForAdoption().then(function (response) {
    $scope.dogs = response.data;
    console.log($scope.dogs);
  });

  var velocity = 0.2;

  function update() {
    var pos = $(window).scrollTop();
    $('.our-dogs-banner').each(function () {
      var $element = $(this);
      // subtract some from the height b/c of the padding
      var height = $element.height() - 1580;
      $(this).css('backgroundPosition', '36.5% ' + Math.round((height - pos) * velocity) + 'px');
    });
  };

  $(window).bind('scroll', update);
});
'use strict';

angular.module('kombuchadog').controller('findCtrl', function ($scope, mainSrvc, $stateParams) {});
'use strict';

angular.module('kombuchadog').controller('homeCtrl', function ($scope, mainSrvc, $stateParams, $rootScope) {

  var velocity = 0.4;

  function update() {
    var pos = $(window).scrollTop();
    $('.home-header-image').each(function () {
      var $element = $(this);
      // subtract some from the height b/c of the padding
      var height = $element.height() - 1730;
      $(this).css('backgroundPosition', '50% ' + Math.round((height - pos) * velocity) + 'px');
    });
  };

  $(window).bind('scroll', update);

  var i = 0;
  setInterval(changeImage, 2000);

  function changeImage() {
    //array of backgrounds
    var bottles = ["ginger.jpg", "hint-of-mint.jpg", "just-kombucha.jpg", "raspberry.jpg", "wild-blue-ginger.jpg", "wild-blueberry.jpg"];
    $('.right-column-image').css('background-image', 'url("images/kombuchaflavors/' + bottles[i] + '")');

    if (i == bottles.length - 1) {
      i = 0;
    } else {
      i++;
    }
  }
});
'use strict';

angular.module('kombuchadog').controller('indexCtrl', function ($scope, $rootScope, $state) {

  $rootScope.cartTotal = 0;
  // $rootScope.$watch('cartTotal', function(){
  //   console.log('it changed');
  //   console.log($rootScope.cartTotal);
  //
  // })
});
'use strict';

angular.module('kombuchadog').controller('merchandiseCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getMerchandise().then(function (response) {
    $scope.merchandise = response.data;
    console.log($scope.merchandise);
  });
});
'use strict';

angular.module('kombuchadog').controller('profileCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getDogProfile($stateParams.name).then(function (response) {
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
'use strict';

angular.module('kombuchadog').controller('successCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getAdopted().then(function (response) {
    $scope.adopted = response.data;
    console.log($scope.adopted);
  });

  var velocity = 0.2;

  function update() {
    var pos = $(window).scrollTop();
    $('.success-banner').each(function () {
      var $element = $(this);
      // subtract some from the height b/c of the padding
      var height = $element.height() - 1920;
      $(this).css('backgroundPosition', '65.5% ' + Math.round((height - pos) * velocity) + 'px');
    });
  };

  $(window).bind('scroll', update);
});
'use strict';

angular.module('kombuchadog').directive('cartnav', function () {
  return {
    restrict: 'AE',
    template: "({{totalItems}})",
    scope: {},
    controller: function controller($scope, mainSrvc, $rootScope, $state) {

      $rootScope.$watch('cartTotal', function () {
        console.log('it changed');
        console.log($rootScope.cartTotal);
        $scope.totalItems = $rootScope.cartTotal;
      });
    }

  };
});
'use strict';

angular.module('kombuchadog').directive('checkout', function (mainSrvc) {
  return {
    restrict: 'AE',
    templateUrl: './views/checkoutbtn.html',
    scope: {
      amount: '='
    },
    link: function link(scope, element, attrs) {
      var handler = StripeCheckout.configure({
        key: 'pk_test_6065FRM1a4tbwIiofznTSYu4',
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function token(_token) {
          console.log(_token);
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          mainSrvc.postOrder(_token);
        }
      });

      document.getElementById('custombutton').addEventListener('click', function (e) {
        // Open Checkout with further options:
        handler.open({
          name: 'KOMBUCHADOG',
          description: 'Adopt Happiness',
          shippingAddress: true,
          billingAddress: true,
          zipCode: true,
          amount: scope.amount
        });
        e.preventDefault();
      });

      // Close Checkout on page navigation:
      window.addEventListener('popstate', function () {
        handler.close();
      });
    }
  };
});
'use strict';

angular.module('kombuchadog').directive('navbar', function () {
    return {
        templateUrl: './views/navbar.html',
        controller: function controller($state, $rootScope) {

            $('.activate-mobile-menu').on('click', function () {
                $('body').addClass('mobile-open');
                $('body').addClass('routes-open');
                $('body').addClass('hidden-social');
                $('body').addClass('social-right');
                $('body').addClass('hidden-nav');
                // $('body').removeClass('menu-close');
            });

            $('.social-menu').on('click', function () {
                $('body').removeClass('routes-open');
                $('body').removeClass('hidden-social');
                $('body').removeClass('social-right');
                $('body').addClass('social-open');
            });

            $('.back').on('click', function () {
                $('body').removeClass('social-open');
                $('body').addClass('social-right');
                $('body').addClass('hidden-social');
                $('body').addClass('routes-open');
            });

            $('.close').on('click', function () {
                $('body').removeClass('routes-open');
                $('body').removeClass('social-open');
                $('body').removeClass('social-right');
                $('body').removeClass('hidden-nav');
                $('body').removeClass('mobile-open');
                $('body').addClass('menu-close');
            });
        }
    };
});
'use strict';

angular.module('kombuchadog').directive('socialFooter', function () {
  return {
    templateUrl: './views/footer.html'
  };
});
'use strict';

angular.module('kombuchadog').directive('teeShirt', function () {
  return {
    restrict: 'AE',
    scope: {
      product: '='
    },
    templateUrl: './views/tee-shirt.html'
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwiJHJvb3RTY29wZSIsInN1YnRvdGFsIiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJzZUludCIsImZpbmRUb3RhbEl0ZW1zIiwidG90YWxJdGVtcyIsImkiLCJOdW1iZXIiLCJjYXRjaCIsImVyciIsImhhbmRsZXIiLCJTdHJpcGVDaGVja291dCIsImNvbmZpZ3VyZSIsImtleSIsImltYWdlIiwibG9jYWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJhbW91bnQiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsIiRzdGF0ZSIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInRlbXBsYXRlIiwic2NvcGUiLCIkd2F0Y2giLCJsaW5rIiwiYXR0cnMiLCJvbiIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENB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QkFBRSxNQUFGLEVBQVV3QixRQUFWLENBQW1CLGVBQW5CO0FBQ0F4QixrQkFBRSxNQUFGLEVBQVV3QixRQUFWLENBQW1CLGFBQW5CO0FBQ0gsYUFMRDs7QUFPQXhCLGNBQUUsUUFBRixFQUFZdUIsRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBVztBQUMvQnZCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsY0FBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsWUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXdCLFFBQVYsQ0FBbUIsWUFBbkI7QUFDSCxhQVBEO0FBU0Q7QUFwQ0ksS0FBUDtBQXNDRCxDQXZDRDs7O0FDQUF2SCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QjhHLFNBQTlCLENBQXdDLGNBQXhDLEVBQXdELFlBQU07QUFDNUQsU0FBTztBQUNMeEcsaUJBQWE7QUFEUixHQUFQO0FBR0QsQ0FKRDs7O0FDQUFQLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCOEcsU0FBOUIsQ0FBd0MsVUFBeEMsRUFBb0QsWUFBTTtBQUN4RCxTQUFPO0FBQ0xDLGNBQVUsSUFETDtBQUVMRSxXQUFPO0FBQ0w3RSxlQUFTO0FBREosS0FGRjtBQUtMOUIsaUJBQWE7QUFMUixHQUFQO0FBT0QsQ0FSRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICAgbGV0IGlkID0gaXRlbS5wcm9kdWN0SWRcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jYXJ0LycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkUgUkVNT1ZFIEZST00gQ0FSVCcsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgbGV0IHByb2R1Y3QgPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTUlZDIHByb2R1Y3QnLCBwcm9kdWN0KTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyB0b2tlbicsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICBcblxuXG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICAvLyBpZigkc2NvcGUuY2FydCA9PSAwICkge1xuICAvLyAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJ0LXBhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIC8vICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtcHR5LWNhcnQnKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAvLyB9XG5cbiAgbGV0IGNhcnRUb3RhbCA9ICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncnVubmluZyBjYXJ0VG90YWwnLCAkc2NvcGUuY2FydCk7XG4gICAgaWYgKCEkc2NvcGUuY2FydCB8fCAkc2NvcGUuY2FydC5sZW5ndGggPT09IDApIHtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJ0LXBhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1wdHktY2FydCcpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAkc2NvcGUuY2FydCA9IFtdO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLmNhcnQuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICRzY29wZS5zdWJ0b3RhbCArPSBwYXJzZUludChlbGVtZW50LnByb2R1Y3RQcmljZSkgKiBwYXJzZUludChlbGVtZW50LnByb2R1Y3RRdWFudGl0eSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIGxldCBmaW5kVG90YWxJdGVtcyA9ICgpID0+IHtcbiAgICAkc2NvcGUudG90YWxJdGVtcyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkc2NvcGUuY2FydC5sZW5ndGg7IGkrKykge1xuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgKz0gTnVtYmVyKCRzY29wZS5jYXJ0W2ldLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCRzY29wZS50b3RhbEl0ZW1zKTtcbiAgICByZXR1cm4gJHNjb3BlLnRvdGFsSXRlbXM7XG4gIH1cblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJ0NhcnQgaW4gY29udHJvbGxlcicsICRzY29wZS5jYXJ0KTtcbiAgICBjYXJ0VG90YWwoKTtcbiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xuXG4kc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gIGNvbnNvbGUubG9nKCdyZW1vdmUgQ1RSTCcsIGl0ZW0pXG4gIG1haW5TcnZjLnJlbW92ZUZyb21DYXJ0KGl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuJHNjb3BlLnVwZGF0ZVF1YW50aXR5ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICBjb25zb2xlLmxvZyhpdGVtKVxuICBtYWluU3J2Yy51cGRhdGVRdWFudGl0eShpdGVtLnByb2R1Y3RJZCwgaXRlbS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59O1xuXG52YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgbG9jYWxlOiAnYXV0bycsXG4gIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4sICRzY29wZS5zdWJ0b3RhbCoxMDAsICRzY29wZS5jYXJ0KTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgaGFuZGxlci5vcGVuKHtcbiAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgemlwQ29kZTogdHJ1ZSxcbiAgICBhbW91bnQ6ICRzY29wZS5zdWJ0b3RhbCAqIDEwMFxuICB9KTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICBoYW5kbGVyLmNsb3NlKCk7XG59KTtcblxuXG5cblxuXG59KTsvL2Nsb3NpbmdcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbiwgJHJvb3RTY29wZSl7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMuaWQpO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgKz0gTnVtYmVyKHByb2R1Y3RRdWFudGl0eSk7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5kb2dzKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcub3VyLWRvZ3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNTgwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzM2LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxuICBcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IDA7XG4gIC8vICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAvLyAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gIC8vICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAvL1xuICAvLyB9KVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5tZXJjaGFuZGlzZSk7XG4gIH0pXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXREb2dQcm9maWxlKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUucHJvZmlsZSk7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICAgICAgLy8gaWYgKCRzY29wZS50ZXN0ID09PSB0cnVlKSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ0FET1BURUQhJztcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ1VQIEZPUiBBRE9QVElPTidcbiAgICAgIC8vIH1cbiAgfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdzdWNjZXNzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcykge1xuXG4gIG1haW5TcnZjLmdldEFkb3B0ZWQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5hZG9wdGVkID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuYWRvcHRlZCk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLnN1Y2Nlc3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xOTIwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzY1LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NhcnRuYXYnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGU6IFwiKHt7dG90YWxJdGVtc319KVwiLFxuICAgIHNjb3BlOiB7fSxcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCBtYWluU3J2YywgJHJvb3RTY29wZSwgJHN0YXRlKSA9PiB7XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnaXQgY2hhbmdlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmNhcnRUb3RhbCk7XG4gICAgICAgICRzY29wZS50b3RhbEl0ZW1zID0gJHJvb3RTY29wZS5jYXJ0VG90YWxcblxuICAgICAgfSlcblxuXG4gICAgfVxuXG59XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2hlY2tvdXQnLCAobWFpblNydmMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXRidG4uaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFtb3VudDogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAgICAgICAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICAgICAgICBsb2NhbGU6ICdhdXRvJyxcbiAgICAgICAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgICAgICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gICAgICAgIGhhbmRsZXIub3Blbih7XG4gICAgICAgICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIHppcENvZGU6IHRydWUsXG4gICAgICAgICAgYW1vdW50OiBzY29wZS5hbW91bnRcbiAgICAgICAgfSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFuZGxlci5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSl7XG5cbiAgICAgICQoJy5hY3RpdmF0ZS1tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAvLyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21lbnUtY2xvc2UnKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuc29jaWFsLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmJhY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21lbnUtY2xvc2UnKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgndGVlU2hpcnQnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2R1Y3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RlZS1zaGlydC5odG1sJ1xuICB9O1xufSk7XG4iXX0=
