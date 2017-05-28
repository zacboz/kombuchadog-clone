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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwiJHJvb3RTY29wZSIsInN1YnRvdGFsIiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJzZUludCIsImZpbmRUb3RhbEl0ZW1zIiwidG90YWxJdGVtcyIsImkiLCJOdW1iZXIiLCJjYXRjaCIsImVyciIsImhhbmRsZXIiLCJTdHJpcGVDaGVja291dCIsImNvbmZpZ3VyZSIsImtleSIsImltYWdlIiwibG9jYWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJhbW91bnQiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsIiRzdGF0ZSIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInRlbXBsYXRlIiwic2NvcGUiLCIkd2F0Y2giLCJsaW5rIiwiYXR0cnMiLCJvbiIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENB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LENBQW1CLGVBQW5CO0FBQ0F4QixrQkFBRSxNQUFGLEVBQVV3QixRQUFWLENBQW1CLGFBQW5CO0FBQ0gsYUFMRDs7QUFPQXhCLGNBQUUsUUFBRixFQUFZdUIsRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBVztBQUMvQnZCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsY0FBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsWUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXlCLFdBQVYsQ0FBc0IsYUFBdEI7QUFDQXpCLGtCQUFFLE1BQUYsRUFBVXdCLFFBQVYsQ0FBbUIsWUFBbkI7QUFDSCxhQVBEO0FBU0Q7QUFwQ0ksS0FBUDtBQXNDRCxDQXZDRDs7O0FDQUF2SCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QjhHLFNBQTlCLENBQXdDLGNBQXhDLEVBQXdELFlBQU07QUFDNUQsU0FBTztBQUNMeEcsaUJBQWE7QUFEUixHQUFQO0FBR0QsQ0FKRDs7O0FDQUFQLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCOEcsU0FBOUIsQ0FBd0MsVUFBeEMsRUFBb0QsWUFBTTtBQUN4RCxTQUFPO0FBQ0xDLGNBQVUsSUFETDtBQUVMRSxXQUFPO0FBQ0w3RSxlQUFTO0FBREosS0FGRjtBQUtMOUIsaUJBQWE7QUFMUixHQUFQO0FBT0QsQ0FSRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICAgbGV0IGlkID0gaXRlbS5wcm9kdWN0SWRcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jYXJ0LycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkUgUkVNT1ZFIEZST00gQ0FSVCcsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgbGV0IHByb2R1Y3QgPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTUlZDIHByb2R1Y3QnLCBwcm9kdWN0KTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyB0b2tlbicsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICBcblxuXG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICBsZXQgY2FydFRvdGFsID0gKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5uaW5nIGNhcnRUb3RhbCcsICRzY29wZS5jYXJ0KTtcbiAgICBpZiAoISRzY29wZS5jYXJ0IHx8ICRzY29wZS5jYXJ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcnQtcGFnZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXB0eS1jYXJ0Jykuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgJHNjb3BlLnN1YnRvdGFsICs9IHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFByaWNlKSAqIHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFF1YW50aXR5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IGZpbmRUb3RhbEl0ZW1zID0gKCkgPT4ge1xuICAgICRzY29wZS50b3RhbEl0ZW1zID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRzY29wZS5jYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAkc2NvcGUudG90YWxJdGVtcyArPSBOdW1iZXIoJHNjb3BlLmNhcnRbaV0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnRvdGFsSXRlbXMpO1xuICAgIHJldHVybiAkc2NvcGUudG90YWxJdGVtcztcbiAgfVxuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICAgIGNhcnRUb3RhbCgpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cbiRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgY29uc29sZS5sb2coJ3JlbW92ZSBDVFJMJywgaXRlbSlcbiAgbWFpblNydmMucmVtb3ZlRnJvbUNhcnQoaXRlbSkudGhlbigoKSA9PiB7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4kc2NvcGUudXBkYXRlUXVhbnRpdHkgPSAoaXRlbSkgPT4ge1xuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gIGNvbnNvbGUubG9nKGl0ZW0pXG4gIG1haW5TcnZjLnVwZGF0ZVF1YW50aXR5KGl0ZW0ucHJvZHVjdElkLCBpdGVtLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn07XG5cbnZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICBsb2NhbGU6ICdhdXRvJyxcbiAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbiwgJHNjb3BlLnN1YnRvdGFsKjEwMCwgJHNjb3BlLmNhcnQpO1xuICB9XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICBoYW5kbGVyLm9wZW4oe1xuICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICB6aXBDb2RlOiB0cnVlLFxuICAgIGFtb3VudDogJHNjb3BlLnN1YnRvdGFsICogMTAwXG4gIH0pO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gIGhhbmRsZXIuY2xvc2UoKTtcbn0pO1xuXG5cblxuXG5cbn0pOy8vY2xvc2luZ1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKXtcblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZURldGFpbHMoJHN0YXRlUGFyYW1zLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscy5pZCk7XG4gICAgaWYgKCRzY29wZS5kZXRhaWxzLmlkIDwgMikge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgkc2NvcGUuZGV0YWlscy5pZCA+IDMpIHtcbiAgICAgICRzY29wZS5uZXh0ID0gbnVsbDtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS5wcm9kdWN0UXVhbnRpdHkgPSAxO1xuICAkc2NvcGUuYWRkVG9DYXJ0ID0gKHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCArPSBOdW1iZXIocHJvZHVjdFF1YW50aXR5KTtcbiAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSAkc2NvcGUuZGV0YWlscy50aXRsZTtcbiAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSAkc2NvcGUuZGV0YWlscy5wcmljZTtcbiAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSAkc2NvcGUuZGV0YWlscy5pbWFnZTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuZGV0YWlscy5pZDtcbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgfTtcblxuICAkc2NvcGUuY2hhbmdlUHJvZHVjdCA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBsZXQgaW5kZXggPSAkc2NvcGUuZGV0YWlscy5pZCArIE51bWJlcihkaXJlY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy8xJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4ID4gNCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvNCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKGAvbWVyY2hhbmRpc2UtZGV0YWlscy8ke2luZGV4fWApO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5ob21lLWhlYWRlci1pbWFnZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTczMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc1MCUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuICB2YXIgaSA9IDA7XG4gIHNldEludGVydmFsKGNoYW5nZUltYWdlLCAyMDAwKTtcblxuICBmdW5jdGlvbiBjaGFuZ2VJbWFnZSgpe1xuICAgIC8vYXJyYXkgb2YgYmFja2dyb3VuZHNcbiAgICB2YXIgYm90dGxlcyA9IFtcImdpbmdlci5qcGdcIiwgXCJoaW50LW9mLW1pbnQuanBnXCIsIFwianVzdC1rb21idWNoYS5qcGdcIiwgXCJyYXNwYmVycnkuanBnXCIsIFwid2lsZC1ibHVlLWdpbmdlci5qcGdcIiwgXCJ3aWxkLWJsdWViZXJyeS5qcGdcIl07XG4gICAgJCgnLnJpZ2h0LWNvbHVtbi1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCJpbWFnZXMva29tYnVjaGFmbGF2b3JzLycrYm90dGxlc1tpXSsnXCIpJyk7XG5cbiAgICBpZihpID09IGJvdHRsZXMubGVuZ3RoIC0xKXtcbiAgICAgICAgaSA9IDA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGkrKztcbiAgICB9XG4gIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpe1xuXG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gMDtcbiAgLy8gJHJvb3RTY29wZS4kd2F0Y2goJ2NhcnRUb3RhbCcsIGZ1bmN0aW9uKCl7XG4gIC8vICAgY29uc29sZS5sb2coJ2l0IGNoYW5nZWQnKTtcbiAgLy8gICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmNhcnRUb3RhbCk7XG4gIC8vXG4gIC8vIH0pXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ21lcmNoYW5kaXNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5tZXJjaGFuZGlzZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLm1lcmNoYW5kaXNlKTtcbiAgfSlcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ3Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldERvZ1Byb2ZpbGUoJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLnByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wcm9maWxlKTtcbiAgICAkc2NvcGUuYWRvcHRlZCA9ICRzY29wZS5wcm9maWxlWzBdLmFkb3B0ZWQ7XG4gICAgICAvLyBpZiAoJHNjb3BlLnRlc3QgPT09IHRydWUpIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnQURPUFRFRCEnO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnVVAgRk9SIEFET1BUSU9OJ1xuICAgICAgLy8gfVxuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5hZG9wdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuc3VjY2Vzcy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE5MjA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNjUuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2FydG5hdicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZTogXCIoe3t0b3RhbEl0ZW1zfX0pXCIsXG4gICAgc2NvcGU6IHt9LFxuICAgIGNvbnRyb2xsZXI6ICgkc2NvcGUsIG1haW5TcnZjLCAkcm9vdFNjb3BlLCAkc3RhdGUpID0+IHtcblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2NhcnRUb3RhbCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY2FydFRvdGFsKTtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAkcm9vdFNjb3BlLmNhcnRUb3RhbFxuXG4gICAgICB9KVxuXG5cbiAgICB9XG5cbn1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjaGVja291dCcsIChtYWluU3J2YykgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dGJ0bi5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgYW1vdW50OiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgdmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICAgICAgICBrZXk6ICdwa190ZXN0XzYwNjVGUk0xYTR0YndJaW9mem5UU1l1NCcsXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gICAgICAgIGxvY2FsZTogJ2F1dG8nLFxuICAgICAgICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbilcbiAgICAgICAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgICAgICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgICAgICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgICAgICAgaGFuZGxlci5vcGVuKHtcbiAgICAgICAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgemlwQ29kZTogdHJ1ZSxcbiAgICAgICAgICBhbW91bnQ6IHNjb3BlLmFtb3VudFxuICAgICAgICB9KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBoYW5kbGVyLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnbmF2YmFyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9uYXZiYXIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHN0YXRlLCAkcm9vdFNjb3BlKXtcblxuICAgICAgJCgnLmFjdGl2YXRlLW1vYmlsZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBcdFx0JCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5zb2NpYWwtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuYmFjaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdoaWRkZW4tbmF2Jyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiJdfQ==
