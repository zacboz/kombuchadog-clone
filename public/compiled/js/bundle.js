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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL2NhcnRuYXYuanMiLCJkaXJlY3RpdmVzL2NoZWNrb3V0LmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwidGVtcGxhdGUiLCJzY29wZSIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHJvb3RTY29wZSIsIiRzdGF0ZSIsIiR3YXRjaCIsImNhcnRUb3RhbCIsInRvdGFsSXRlbXMiLCJhbW91bnQiLCJsaW5rIiwiZWxlbWVudCIsImF0dHJzIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwiaW1hZ2UiLCJsb2NhbGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiaXNBY3RpdmUiLCIkIiwib24iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiJHN0YXRlUGFyYW1zIiwic3VidG90YWwiLCJsZW5ndGgiLCJmb3JFYWNoIiwiaW5kZXgiLCJwYXJzZUludCIsImZpbmRUb3RhbEl0ZW1zIiwiaSIsIk51bWJlciIsImNhdGNoIiwiZXJyIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwic2Nyb2xsVG9wIiwiZWFjaCIsIiRlbGVtZW50IiwiaGVpZ2h0IiwiY3NzIiwiTWF0aCIsInJvdW5kIiwiYmluZCIsIm15VmFyIiwic2V0SW50ZXJ2YWwiLCJjaGFuZ2VJbWFnZSIsImJvdHRsZXMiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixD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SCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4Qk8sVUFBOUIsQ0FBeUMsYUFBekMsRUFBd0QsVUFBU3NDLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCaUMsWUFBM0IsRUFBeUM7O0FBRS9GakMsV0FBUy9CLFVBQVQsR0FBc0JGLElBQXRCLENBQTJCLFVBQUNDLFFBQUQsRUFBYztBQUN2QytCLFdBQU8wRSxPQUFQLEdBQWlCekcsU0FBU2UsSUFBMUI7QUFDQUksWUFBUUMsR0FBUixDQUFZVyxPQUFPMEUsT0FBbkI7QUFDRCxHQUhEOztBQUtBLE1BQUlqQixXQUFXLEdBQWY7O0FBRUEsV0FBU0MsTUFBVCxHQUFpQjtBQUNqQixRQUFJQyxNQUFNN0IsRUFBRUgsTUFBRixFQUFVaUMsU0FBVixFQUFWO0FBQ0E5QixNQUFFLGlCQUFGLEVBQXFCK0IsSUFBckIsQ0FBMEIsWUFBVztBQUNsQyxVQUFJQyxXQUFXaEMsRUFBRSxJQUFGLENBQWY7QUFDQTtBQUNBLFVBQUlpQyxTQUFTRCxTQUFTQyxNQUFULEtBQWtCLElBQS9CO0FBQ0FqQyxRQUFFLElBQUYsRUFBUWtDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFXQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ0gsU0FBU0osR0FBVixJQUFpQkYsUUFBNUIsQ0FBWCxHQUFvRCxJQUF0RjtBQUNBLEtBTEg7QUFNRzs7QUFFSDNCLElBQUVILE1BQUYsRUFBVXdDLElBQVYsQ0FBZSxRQUFmLEVBQXlCVCxNQUF6QjtBQUdELENBdEJEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycsIFsndWkucm91dGVyJ10pXG4gIC5jb25maWcoKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpID0+IHtcbiAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLHtcbiAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Fib3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvYWJvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9hYm91dC5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWtvbWJ1Y2hhLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXItZG9ncycse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1kb2dzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWRvZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RvZ0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdkb2ctcHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL2RvZy1wcm9maWxlLzpuYW1lJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvcHJvZmlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncHJvZmlsZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdzdWNjZXNzLXN0b3JpZXMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9zdWNjZXNzLXN0b3JpZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9zdWNjZXNzLXN0b3JpZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3N1Y2Nlc3NDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZmluZC1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL2ZpbmQta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9maW5kLWtvbWJ1Y2hhLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdmaW5kQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbWVyY2hhbmRpc2VDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UtZGV0YWlscycse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlLWRldGFpbHMvOmlkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UtZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZGV0YWlsc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjYXJ0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2FydCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NhcnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NhcnRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2hlY2tvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jaGVja291dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjaGVja291dEN0cmwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWRvcHRlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdWNjZXNzLXN0b3JpZXMtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldERvZ1Byb2ZpbGUgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLycrbmFtZVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU0VSVklDRScsIHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZURldGFpbHMgPSAoaWQpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmFkZFRvQ2FydCA9IChwcm9kdWN0VGl0bGUsIHByb2R1Y3RJbWFnZSwgcHJvZHVjdFNpemUsIHByb2R1Y3RRdWFudGl0eSwgcHJvZHVjdFByaWNlLCBwcm9kdWN0SWQpID0+IHtcbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgIHByb2R1Y3RUaXRsZTogcHJvZHVjdFRpdGxlLFxuICAgICAgcHJvZHVjdEltYWdlOiBwcm9kdWN0SW1hZ2UsXG4gICAgICBwcm9kdWN0U2l6ZTogcHJvZHVjdFNpemUsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eSxcbiAgICAgIHByb2R1Y3RQcmljZTogcHJvZHVjdFByaWNlLFxuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWRcbiAgICB9XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NhcnQnLFxuICAgICAgZGF0YTogaXRlbVxuICAgIH0pLnN1Y2Nlc3MoKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NSVkMgaXRlbSBhZGRlZCcpXG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIENBUlQnLCByZXNwb25zZSlcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgICBsZXQgaWQgPSBpdGVtLnByb2R1Y3RJZFxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiAnL2NhcnQvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWRSBSRU1PVkUgRlJPTSBDQVJUJywgcmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMudXBkYXRlUXVhbnRpdHkgPSAocHJvZHVjdElkLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICBsZXQgcHJvZHVjdCA9IHtcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHlcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1NSVkMgcHJvZHVjdCcsIHByb2R1Y3QpO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgdXJsOiAnL2NhcnQvJytwcm9kdWN0SWQsXG4gICAgICBkYXRhOiBwcm9kdWN0XG4gICAgfSkuc3VjY2VzcygocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDIFVQREFUSU5HJywgcmVzcG9uc2UpO1xuICAgIH0pXG4gIH07XG5cbiAgdGhpcy5wb3N0T3JkZXIgPSAodG9rZW4sIHRvdGFsLCBjYXJ0KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1NSVkMgVE9LRU4nLCB0b2tlbik7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL29yZGVyJyxcbiAgICAgIGRhdGE6IHt0b2tlbiwgdG90YWwsIGNhcnR9XG4gICAgfSkuc3VjY2VzcygocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDIHRva2VuJywgcmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIFxuXG5cblxufSk7XG4iLCIvLyAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuLy8gICAvLyBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gMTAyNikge1xuLy8gICAgIC8vIGZpbmQgdGhlIHNjcm9sbCBhbmQgdXNlIHRoaXMgdmFyaWFibGUgdG8gbW92ZSBlbGVtZW50c1xuLy8gICAgIHZhciB3aW5TY3JvbGwgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKHdpblNjcm9sbCk7XG4vLyAgICAgLy8gY2VudGVyIG1vdmVzIGRvd24gb24gdGhlIHktYXhpcyBvbiBzY3JvbGxcbi8vXG4vLyAgICAgJCgnI2RvZy1iYW5uZXInKS5jc3Moe1xuLy8gICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoMHB4LCAtJysgd2luU2Nyb2xsIC81MCArJyUpJ1xuLy8gICAgIH0pO1xuLy8gICAvLyB9XG4vLyB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2FydG5hdicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZTogXCIoe3t0b3RhbEl0ZW1zfX0pXCIsXG4gICAgc2NvcGU6IHt9LFxuICAgIGNvbnRyb2xsZXI6ICgkc2NvcGUsIG1haW5TcnZjLCAkcm9vdFNjb3BlLCAkc3RhdGUpID0+IHtcblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2NhcnRUb3RhbCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY2FydFRvdGFsKTtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAkcm9vdFNjb3BlLmNhcnRUb3RhbFxuXG4gICAgICB9KVxuXG5cbiAgICB9XG5cbn1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjaGVja291dCcsIChtYWluU3J2YykgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dGJ0bi5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgYW1vdW50OiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgdmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICAgICAgICBrZXk6ICdwa190ZXN0XzYwNjVGUk0xYTR0YndJaW9mem5UU1l1NCcsXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gICAgICAgIGxvY2FsZTogJ2F1dG8nLFxuICAgICAgICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbilcbiAgICAgICAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgICAgICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgICAgICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgICAgICAgaGFuZGxlci5vcGVuKHtcbiAgICAgICAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgemlwQ29kZTogdHJ1ZSxcbiAgICAgICAgICBhbW91bnQ6IHNjb3BlLmFtb3VudFxuICAgICAgICB9KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBoYW5kbGVyLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnbmF2YmFyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9uYXZiYXIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHN0YXRlLCAkcm9vdFNjb3BlKXtcblxuXG4gICAgICB2YXIgaXNBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgJCgnLmFjdGl2YXRlLW1vYmlsZS1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBcdGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICBcdH0gZWxzZSB7XG4gICAgICBcdFx0JCgnYm9keScpLmFkZENsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgXHR9XG4gICAgICBcdGlzQWN0aXZlID0gIWlzQWN0aXZlO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5zb2NpYWwtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgXHRpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgXHR9IGVsc2Uge1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgIFx0fVxuICAgICAgXHRpc0FjdGl2ZSA9ICFpc0FjdGl2ZTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuYmFjaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgXHRpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgIFx0fVxuICAgICAgXHRpc0FjdGl2ZSA9ICFpc0FjdGl2ZTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0aWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tbmF2Jyk7XG4gICAgICBcdH0gZWxzZSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAvLyAkKCdib2R5JykuYWRkQ2xhc3MoJ21lbnUtY2xvc2UnKTtcbiAgICAgIFx0fVxuICAgICAgXHRpc0FjdGl2ZSA9ICFpc0FjdGl2ZTtcbiAgICAgIH0pO1xuXG5cbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignY2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpe1xuXG4gICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICRzY29wZS5jYXJ0O1xuXG4gIGxldCBjYXJ0VG90YWwgPSAoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ3J1bm5pbmcgY2FydFRvdGFsJywgJHNjb3BlLmNhcnQpO1xuICAgIGlmICghJHNjb3BlLmNhcnQgfHwgJHNjb3BlLmNhcnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAkc2NvcGUuY2FydCA9IFtdO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLmNhcnQuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICRzY29wZS5zdWJ0b3RhbCArPSBwYXJzZUludChlbGVtZW50LnByb2R1Y3RQcmljZSkgKiBwYXJzZUludChlbGVtZW50LnByb2R1Y3RRdWFudGl0eSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIGxldCBmaW5kVG90YWxJdGVtcyA9ICgpID0+IHtcbiAgICAkc2NvcGUudG90YWxJdGVtcyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkc2NvcGUuY2FydC5sZW5ndGg7IGkrKykge1xuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgKz0gTnVtYmVyKCRzY29wZS5jYXJ0W2ldLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCRzY29wZS50b3RhbEl0ZW1zKTtcbiAgICByZXR1cm4gJHNjb3BlLnRvdGFsSXRlbXM7XG4gIH1cblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJ0NhcnQgaW4gY29udHJvbGxlcicsICRzY29wZS5jYXJ0KTtcbiAgICBjYXJ0VG90YWwoKTtcbiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xuXG4kc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gIGNvbnNvbGUubG9nKCdyZW1vdmUgQ1RSTCcsIGl0ZW0pXG4gIG1haW5TcnZjLnJlbW92ZUZyb21DYXJ0KGl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuJHNjb3BlLnVwZGF0ZVF1YW50aXR5ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICBjb25zb2xlLmxvZyhpdGVtKVxuICBtYWluU3J2Yy51cGRhdGVRdWFudGl0eShpdGVtLnByb2R1Y3RJZCwgaXRlbS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59O1xuXG52YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgbG9jYWxlOiAnYXV0bycsXG4gIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4sICRzY29wZS5zdWJ0b3RhbCoxMDAsICRzY29wZS5jYXJ0KTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgaGFuZGxlci5vcGVuKHtcbiAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgemlwQ29kZTogdHJ1ZSxcbiAgICBhbW91bnQ6ICRzY29wZS5zdWJ0b3RhbCAqIDEwMFxuICB9KTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICBoYW5kbGVyLmNsb3NlKCk7XG59KTtcblxuXG5cblxuXG59KTsvL2Nsb3NpbmdcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbiwgJHJvb3RTY29wZSl7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMuaWQpO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgKz0gTnVtYmVyKHByb2R1Y3RRdWFudGl0eSk7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5kb2dzKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcub3VyLWRvZ3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNTgwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzM2LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxuICBcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cblxuXG4gIHZhciB2ZWxvY2l0eSA9IDAuNDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLmhvbWUtaGVhZGVyLWltYWdlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNzMwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzUwJSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG4gIHZhciBpID0gMDtcbiAgdmFyIG15VmFyID0gc2V0SW50ZXJ2YWwoY2hhbmdlSW1hZ2UsIDIwMDApO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZUltYWdlKCl7XG4gICAgLy9hcnJheSBvZiBiYWNrZ3JvdW5kc1xuICAgIHZhciBib3R0bGVzID0gW1wiZ2luZ2VyLmpwZ1wiLCBcImhpbnQtb2YtbWludC5qcGdcIiwgXCJqdXN0LWtvbWJ1Y2hhLmpwZ1wiLCBcInJhc3BiZXJyeS5qcGdcIiwgXCJ3aWxkLWJsdWUtZ2luZ2VyLmpwZ1wiLCBcIndpbGQtYmx1ZWJlcnJ5LmpwZ1wiXTtcbiAgICAkKCcucmlnaHQtY29sdW1uLWltYWdlJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcImltYWdlcy9rb21idWNoYWZsYXZvcnMvJytib3R0bGVzW2ldKydcIiknKTtcblxuICAgIGlmKGkgPT0gYm90dGxlcy5sZW5ndGggLTEpe1xuICAgICAgICBpID0gMDtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gLy8gd2luZG93LnNldEludGVydmFsKFwiY2hhbmdlSW1hZ2UoKVwiLCA1MDAwKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSl7XG5cbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSAwO1xuICAvLyAkcm9vdFNjb3BlLiR3YXRjaCgnY2FydFRvdGFsJywgZnVuY3Rpb24oKXtcbiAgLy8gICBjb25zb2xlLmxvZygnaXQgY2hhbmdlZCcpO1xuICAvLyAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY2FydFRvdGFsKTtcbiAgLy9cbiAgLy8gfSlcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignbWVyY2hhbmRpc2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLm1lcmNoYW5kaXNlID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUubWVyY2hhbmRpc2UpO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnByb2ZpbGUpO1xuICAgICRzY29wZS5hZG9wdGVkID0gJHNjb3BlLnByb2ZpbGVbMF0uYWRvcHRlZDtcbiAgICAgIC8vIGlmICgkc2NvcGUudGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdBRE9QVEVEISc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdVUCBGT1IgQURPUFRJT04nXG4gICAgICAvLyB9XG4gIH0pO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignc3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRBZG9wdGVkKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuYWRvcHRlZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmFkb3B0ZWQpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIl19
