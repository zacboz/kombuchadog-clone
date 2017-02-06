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
  var myVar = setInterval(changeImage, 2000);

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

  // window.setInterval("changeImage()", 5000);
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

            var isActive = false;

            $('.activate-mobile-menu').on('click', function () {
                if (isActive) {
                    $('body').removeClass('mobile-open');
                    $('body').removeClass('routes-open');
                    $('body').removeClass('social-open');
                    $('body').removeClass('hidden-nav');
                    $('body').removeClass('social-right');
                    // $('body').addClass('menu-close');
                    $('body').addClass('hidden-social');
                } else {
                    $('body').addClass('mobile-open');
                    $('body').addClass('routes-open');
                    $('body').addClass('social-right');
                    $('body').addClass('hidden-nav');
                    $('body').addClass('hidden-social');
                    $('body').removeClass('menu-close');
                }
                isActive = !isActive;
            });

            $('.social-menu').on('click', function () {
                if (isActive) {
                    $('body').addClass('mobile-open');
                    $('body').addClass('routes-open');
                    $('body').addClass('hidden-nav');
                    $('body').removeClass('hidden-social');
                } else {
                    // $('body').removeClass('hidden-social');
                    $('body').removeClass('social-right');
                    $('body').addClass('social-open');
                    $('body').removeClass('routes-open');
                }
                isActive = !isActive;
            });

            $('.back').on('click', function () {
                if (isActive) {
                    $('body').addClass('mobile-open');
                    $('body').addClass('social-open');
                    $('body').removeClass('hidden-social');
                    $('body').addClass('hidden-nav');
                    $('body').removeClass('routes-open');
                } else {
                    $('body').addClass('social-right');
                    $('body').addClass('routes-open');
                }
                isActive = !isActive;
            });

            $('.close').on('click', function () {
                if (isActive) {
                    $('body').addClass('routes-open');
                    $('body').addClass('social-open');
                    $('body').addClass('mobile-open');
                    // $('body').removeClass('menu-close');
                    $('body').addClass('hidden-nav');
                } else {
                    $('body').addClass('hidden-social');
                    $('body').removeClass('routes-open');
                    $('body').removeClass('social-open');
                    $('body').removeClass('social-right');
                    $('body').removeClass('hidden-nav');
                    $('body').removeClass('mobile-open');
                    // $('body').addClass('menu-close');
                }
                isActive = !isActive;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwiJHJvb3RTY29wZSIsInN1YnRvdGFsIiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJpbmRleCIsInBhcnNlSW50IiwiZmluZFRvdGFsSXRlbXMiLCJ0b3RhbEl0ZW1zIiwiaSIsIk51bWJlciIsImNhdGNoIiwiZXJyIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwiaW1hZ2UiLCJsb2NhbGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJhbW91bnQiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJteVZhciIsInNldEludGVydmFsIiwiY2hhbmdlSW1hZ2UiLCJib3R0bGVzIiwiJHN0YXRlIiwibWVyY2hhbmRpc2UiLCJwcm9maWxlIiwiYWRvcHRlZCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwidGVtcGxhdGUiLCJzY29wZSIsIiR3YXRjaCIsImxpbmsiLCJhdHRycyIsImlzQWN0aXZlIiwib24iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixD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MkIsUUFBVixDQUFtQixhQUFuQjtBQUNBO0FBQ0EzQixzQkFBRSxNQUFGLEVBQVUyQixRQUFWLENBQW1CLFlBQW5CO0FBQ0YsaUJBTkQsTUFNTztBQUNKM0Isc0JBQUUsTUFBRixFQUFVMkIsUUFBVixDQUFtQixlQUFuQjtBQUNBM0Isc0JBQUUsTUFBRixFQUFVMEIsV0FBVixDQUFzQixhQUF0QjtBQUNBMUIsc0JBQUUsTUFBRixFQUFVMEIsV0FBVixDQUFzQixhQUF0QjtBQUNBMUIsc0JBQUUsTUFBRixFQUFVMEIsV0FBVixDQUFzQixjQUF0QjtBQUNBMUIsc0JBQUUsTUFBRixFQUFVMEIsV0FBVixDQUFzQixZQUF0QjtBQUNBMUIsc0JBQUUsTUFBRixFQUFVMEIsV0FBVixDQUFzQixhQUF0QjtBQUNBO0FBQ0Y7QUFDREYsMkJBQVcsQ0FBQ0EsUUFBWjtBQUNBLGFBakJEO0FBb0JEO0FBNUVJLEtBQVA7QUE4RUQsQ0EvRUQ7OztBQ0FBckgsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEI2RyxTQUE5QixDQUF3QyxjQUF4QyxFQUF3RCxZQUFNO0FBQzVELFNBQU87QUFDTHZHLGlCQUFhO0FBRFIsR0FBUDtBQUdELENBSkQ7OztBQ0FBUCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QjZHLFNBQTlCLENBQXdDLFVBQXhDLEVBQW9ELFlBQU07QUFDeEQsU0FBTztBQUNMQyxjQUFVLElBREw7QUFFTEUsV0FBTztBQUNMNUUsZUFBUztBQURKLEtBRkY7QUFLTDlCLGlCQUFhO0FBTFIsR0FBUDtBQU9ELENBUkQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjaGVja291dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NoZWNrb3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5zZXJ2aWNlKCdtYWluU3J2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgdGhpcy5nZXRVcEZvckFkb3B0aW9uID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRBZG9wdGVkID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1Y2Nlc3Mtc3Rvcmllcy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0RG9nUHJvZmlsZSA9IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MvJytuYW1lXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgcmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGxldCBpdGVtID0ge1xuICAgICAgcHJvZHVjdFRpdGxlOiBwcm9kdWN0VGl0bGUsXG4gICAgICBwcm9kdWN0SW1hZ2U6IHByb2R1Y3RJbWFnZSxcbiAgICAgIHByb2R1Y3RTaXplOiBwcm9kdWN0U2l6ZSxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5LFxuICAgICAgcHJvZHVjdFByaWNlOiBwcm9kdWN0UHJpY2UsXG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZFxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvY2FydCcsXG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBpdGVtIGFkZGVkJylcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldENhcnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvY2FydCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NSVkMgQ0FSVCcsIHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICAgIGxldCBpZCA9IGl0ZW0ucHJvZHVjdElkXG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvY2FydC8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZFIFJFTU9WRSBGUk9NIENBUlQnLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGxldCBwcm9kdWN0ID0ge1xuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWQsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnU1JWQyBwcm9kdWN0JywgcHJvZHVjdCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6ICcvY2FydC8nK3Byb2R1Y3RJZCxcbiAgICAgIGRhdGE6IHByb2R1Y3RcbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgVVBEQVRJTkcnLCByZXNwb25zZSk7XG4gICAgfSlcbiAgfTtcblxuICB0aGlzLnBvc3RPcmRlciA9ICh0b2tlbiwgdG90YWwsIGNhcnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnU1JWQyBUT0tFTicsIHRva2VuKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvb3JkZXInLFxuICAgICAgZGF0YToge3Rva2VuLCB0b3RhbCwgY2FydH1cbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgdG9rZW4nLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgXG5cblxuXG59KTtcbiIsIi8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4vLyAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI2KSB7XG4vLyAgICAgLy8gZmluZCB0aGUgc2Nyb2xsIGFuZCB1c2UgdGhpcyB2YXJpYWJsZSB0byBtb3ZlIGVsZW1lbnRzXG4vLyAgICAgdmFyIHdpblNjcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG4vLyAgICAgLy8gY29uc29sZS5sb2cod2luU2Nyb2xsKTtcbi8vICAgICAvLyBjZW50ZXIgbW92ZXMgZG93biBvbiB0aGUgeS1heGlzIG9uIHNjcm9sbFxuLy9cbi8vICAgICAkKCcjZG9nLWJhbm5lcicpLmNzcyh7XG4vLyAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwcHgsIC0nKyB3aW5TY3JvbGwgLzUwICsnJSknXG4vLyAgICAgfSk7XG4vLyAgIC8vIH1cbi8vIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdjYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgJHNjb3BlLmNhcnQ7XG5cbiAgbGV0IGNhcnRUb3RhbCA9ICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncnVubmluZyBjYXJ0VG90YWwnLCAkc2NvcGUuY2FydCk7XG4gICAgaWYgKCEkc2NvcGUuY2FydCB8fCAkc2NvcGUuY2FydC5sZW5ndGggPT09IDApIHtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgJHNjb3BlLnN1YnRvdGFsICs9IHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFByaWNlKSAqIHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFF1YW50aXR5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IGZpbmRUb3RhbEl0ZW1zID0gKCkgPT4ge1xuICAgICRzY29wZS50b3RhbEl0ZW1zID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRzY29wZS5jYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAkc2NvcGUudG90YWxJdGVtcyArPSBOdW1iZXIoJHNjb3BlLmNhcnRbaV0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnRvdGFsSXRlbXMpO1xuICAgIHJldHVybiAkc2NvcGUudG90YWxJdGVtcztcbiAgfVxuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICAgIGNhcnRUb3RhbCgpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cbiRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgY29uc29sZS5sb2coJ3JlbW92ZSBDVFJMJywgaXRlbSlcbiAgbWFpblNydmMucmVtb3ZlRnJvbUNhcnQoaXRlbSkudGhlbigoKSA9PiB7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4kc2NvcGUudXBkYXRlUXVhbnRpdHkgPSAoaXRlbSkgPT4ge1xuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gIGNvbnNvbGUubG9nKGl0ZW0pXG4gIG1haW5TcnZjLnVwZGF0ZVF1YW50aXR5KGl0ZW0ucHJvZHVjdElkLCBpdGVtLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn07XG5cbnZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICBsb2NhbGU6ICdhdXRvJyxcbiAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbiwgJHNjb3BlLnN1YnRvdGFsKjEwMCwgJHNjb3BlLmNhcnQpO1xuICB9XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICBoYW5kbGVyLm9wZW4oe1xuICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICB6aXBDb2RlOiB0cnVlLFxuICAgIGFtb3VudDogJHNjb3BlLnN1YnRvdGFsICogMTAwXG4gIH0pO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gIGhhbmRsZXIuY2xvc2UoKTtcbn0pO1xuXG5cblxuXG5cbn0pOy8vY2xvc2luZ1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKXtcblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZURldGFpbHMoJHN0YXRlUGFyYW1zLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscy5pZCk7XG4gICAgaWYgKCRzY29wZS5kZXRhaWxzLmlkIDwgMikge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgkc2NvcGUuZGV0YWlscy5pZCA+IDMpIHtcbiAgICAgICRzY29wZS5uZXh0ID0gbnVsbDtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS5wcm9kdWN0UXVhbnRpdHkgPSAxO1xuICAkc2NvcGUuYWRkVG9DYXJ0ID0gKHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCArPSBOdW1iZXIocHJvZHVjdFF1YW50aXR5KTtcbiAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSAkc2NvcGUuZGV0YWlscy50aXRsZTtcbiAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSAkc2NvcGUuZGV0YWlscy5wcmljZTtcbiAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSAkc2NvcGUuZGV0YWlscy5pbWFnZTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuZGV0YWlscy5pZDtcbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgfTtcblxuICAkc2NvcGUuY2hhbmdlUHJvZHVjdCA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBsZXQgaW5kZXggPSAkc2NvcGUuZGV0YWlscy5pZCArIE51bWJlcihkaXJlY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy8xJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4ID4gNCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvNCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKGAvbWVyY2hhbmRpc2UtZGV0YWlscy8ke2luZGV4fWApO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuXG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICB2YXIgbXlWYXIgPSBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAvLyB3aW5kb3cuc2V0SW50ZXJ2YWwoXCJjaGFuZ2VJbWFnZSgpXCIsIDUwMDApO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IDA7XG4gIC8vICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAvLyAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gIC8vICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAvL1xuICAvLyB9KVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5tZXJjaGFuZGlzZSk7XG4gIH0pXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXREb2dQcm9maWxlKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUucHJvZmlsZSk7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICAgICAgLy8gaWYgKCRzY29wZS50ZXN0ID09PSB0cnVlKSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ0FET1BURUQhJztcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ1VQIEZPUiBBRE9QVElPTidcbiAgICAgIC8vIH1cbiAgfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdzdWNjZXNzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcykge1xuXG4gIG1haW5TcnZjLmdldEFkb3B0ZWQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5hZG9wdGVkID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuYWRvcHRlZCk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLnN1Y2Nlc3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xOTIwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzY1LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NhcnRuYXYnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGU6IFwiKHt7dG90YWxJdGVtc319KVwiLFxuICAgIHNjb3BlOiB7fSxcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCBtYWluU3J2YywgJHJvb3RTY29wZSwgJHN0YXRlKSA9PiB7XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnaXQgY2hhbmdlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmNhcnRUb3RhbCk7XG4gICAgICAgICRzY29wZS50b3RhbEl0ZW1zID0gJHJvb3RTY29wZS5jYXJ0VG90YWxcblxuICAgICAgfSlcblxuXG4gICAgfVxuXG59XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2hlY2tvdXQnLCAobWFpblNydmMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXRidG4uaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFtb3VudDogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAgICAgICAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICAgICAgICBsb2NhbGU6ICdhdXRvJyxcbiAgICAgICAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgICAgICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gICAgICAgIGhhbmRsZXIub3Blbih7XG4gICAgICAgICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIHppcENvZGU6IHRydWUsXG4gICAgICAgICAgYW1vdW50OiBzY29wZS5hbW91bnRcbiAgICAgICAgfSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFuZGxlci5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSl7XG5cblxuICAgICAgdmFyIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICQoJy5hY3RpdmF0ZS1tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgXHRpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5hZGRDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgXHR9IGVsc2Uge1xuICAgICAgXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21lbnUtY2xvc2UnKTtcbiAgICAgIFx0fVxuICAgICAgXHRpc0FjdGl2ZSA9ICFpc0FjdGl2ZTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuc29jaWFsLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0aWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAvLyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmJhY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0aWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH0gZWxzZSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBcdGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgXHR9IGVsc2Uge1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuXG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgndGVlU2hpcnQnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2R1Y3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RlZS1zaGlydC5odG1sJ1xuICB9O1xufSk7XG4iXX0=
