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
                    $('body').addClass('mobile-open');
                    $('body').removeClass('routes-open');
                    $('body').removeClass('social-open');
                    $('body').removeClass('hidden-nav');
                    $('body').removeClass('social-right');
                    // $('body').addClass('menu-close');
                    $('body').addClass('hidden-social');
                } else {
                    $('body').removeClass('mobile-open');
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
                    // $('body').removeClass('mobile-open');
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
                    // $('body').removeClass('mobile-open');
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
                    $('body').removeClass('mobile-open');
                    $('body').removeClass('menu-close');
                    $('body').addClass('hidden-nav');
                } else {
                    // $('body').addClass('hidden-social');
                    $('body').removeClass('routes-open');
                    $('body').removeClass('social-open');
                    $('body').removeClass('social-right');
                    $('body').removeClass('hidden-nav');
                    // $('body').addClass('mobile-open');
                    $('body').addClass('menu-close');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL2NhcnRuYXYuanMiLCJkaXJlY3RpdmVzL2NoZWNrb3V0LmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwidGVtcGxhdGUiLCJzY29wZSIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHJvb3RTY29wZSIsIiRzdGF0ZSIsIiR3YXRjaCIsImNhcnRUb3RhbCIsInRvdGFsSXRlbXMiLCJhbW91bnQiLCJsaW5rIiwiZWxlbWVudCIsImF0dHJzIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwiaW1hZ2UiLCJsb2NhbGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiaXNBY3RpdmUiLCIkIiwib24iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiJHN0YXRlUGFyYW1zIiwic3VidG90YWwiLCJsZW5ndGgiLCJmb3JFYWNoIiwiaW5kZXgiLCJwYXJzZUludCIsImZpbmRUb3RhbEl0ZW1zIiwiaSIsIk51bWJlciIsImNhdGNoIiwiZXJyIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwic2Nyb2xsVG9wIiwiZWFjaCIsIiRlbGVtZW50IiwiaGVpZ2h0IiwiY3NzIiwiTWF0aCIsInJvdW5kIiwiYmluZCIsIm15VmFyIiwic2V0SW50ZXJ2YWwiLCJjaGFuZ2VJbWFnZSIsImJvdHRsZXMiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixD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QUUvRmpDLFdBQVMvQixVQUFULEdBQXNCRixJQUF0QixDQUEyQixVQUFDQyxRQUFELEVBQWM7QUFDdkMrQixXQUFPMEUsT0FBUCxHQUFpQnpHLFNBQVNlLElBQTFCO0FBQ0FJLFlBQVFDLEdBQVIsQ0FBWVcsT0FBTzBFLE9BQW5CO0FBQ0QsR0FIRDs7QUFLQSxNQUFJakIsV0FBVyxHQUFmOztBQUVBLFdBQVNDLE1BQVQsR0FBaUI7QUFDakIsUUFBSUMsTUFBTTdCLEVBQUVILE1BQUYsRUFBVWlDLFNBQVYsRUFBVjtBQUNBOUIsTUFBRSxpQkFBRixFQUFxQitCLElBQXJCLENBQTBCLFlBQVc7QUFDbEMsVUFBSUMsV0FBV2hDLEVBQUUsSUFBRixDQUFmO0FBQ0E7QUFDQSxVQUFJaUMsU0FBU0QsU0FBU0MsTUFBVCxLQUFrQixJQUEvQjtBQUNBakMsUUFBRSxJQUFGLEVBQVFrQyxHQUFSLENBQVksb0JBQVosRUFBa0MsV0FBV0MsS0FBS0MsS0FBTCxDQUFXLENBQUNILFNBQVNKLEdBQVYsSUFBaUJGLFFBQTVCLENBQVgsR0FBb0QsSUFBdEY7QUFDQSxLQUxIO0FBTUc7O0FBRUgzQixJQUFFSCxNQUFGLEVBQVV3QyxJQUFWLENBQWUsUUFBZixFQUF5QlQsTUFBekI7QUFHRCxDQXRCRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICAgbGV0IGlkID0gaXRlbS5wcm9kdWN0SWRcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jYXJ0LycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkUgUkVNT1ZFIEZST00gQ0FSVCcsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgbGV0IHByb2R1Y3QgPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTUlZDIHByb2R1Y3QnLCBwcm9kdWN0KTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyB0b2tlbicsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICBcblxuXG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NhcnRuYXYnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGU6IFwiKHt7dG90YWxJdGVtc319KVwiLFxuICAgIHNjb3BlOiB7fSxcbiAgICBjb250cm9sbGVyOiAoJHNjb3BlLCBtYWluU3J2YywgJHJvb3RTY29wZSwgJHN0YXRlKSA9PiB7XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnaXQgY2hhbmdlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmNhcnRUb3RhbCk7XG4gICAgICAgICRzY29wZS50b3RhbEl0ZW1zID0gJHJvb3RTY29wZS5jYXJ0VG90YWxcblxuICAgICAgfSlcblxuXG4gICAgfVxuXG59XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2hlY2tvdXQnLCAobWFpblNydmMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXRidG4uaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFtb3VudDogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAgICAgICAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICAgICAgICBsb2NhbGU6ICdhdXRvJyxcbiAgICAgICAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgICAgICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gICAgICAgIGhhbmRsZXIub3Blbih7XG4gICAgICAgICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIHppcENvZGU6IHRydWUsXG4gICAgICAgICAgYW1vdW50OiBzY29wZS5hbW91bnRcbiAgICAgICAgfSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFuZGxlci5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSl7XG5cblxuICAgICAgdmFyIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICQoJy5hY3RpdmF0ZS1tb2JpbGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgXHRpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5hZGRDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgXHR9IGVsc2Uge1xuICAgICAgXHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbW9iaWxlLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21lbnUtY2xvc2UnKTtcbiAgICAgIFx0fVxuICAgICAgXHRpc0FjdGl2ZSA9ICFpc0FjdGl2ZTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuc29jaWFsLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0aWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgIFx0fSBlbHNlIHtcbiAgICAgICAgICAvLyAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1yaWdodCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmJhY2snKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0aWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1zb2NpYWwnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH0gZWxzZSB7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3JvdXRlcy1vcGVuJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuICAgICAgJCgnLmNsb3NlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBcdGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtb2JpbGUtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnbWVudS1jbG9zZScpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLW5hdicpO1xuICAgICAgXHR9IGVsc2Uge1xuICAgICAgICAgIC8vICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAvLyAkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICBcdH1cbiAgICAgIFx0aXNBY3RpdmUgPSAhaXNBY3RpdmU7XG4gICAgICB9KTtcblxuXG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgndGVlU2hpcnQnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2R1Y3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RlZS1zaGlydC5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICBsZXQgY2FydFRvdGFsID0gKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5uaW5nIGNhcnRUb3RhbCcsICRzY29wZS5jYXJ0KTtcbiAgICBpZiAoISRzY29wZS5jYXJ0IHx8ICRzY29wZS5jYXJ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgJHNjb3BlLmNhcnQgPSBbXTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzY29wZS5jYXJ0LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAkc2NvcGUuc3VidG90YWwgKz0gcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UHJpY2UpICogcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UXVhbnRpdHkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgZmluZFRvdGFsSXRlbXMgPSAoKSA9PiB7XG4gICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHNjb3BlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICRzY29wZS50b3RhbEl0ZW1zICs9IE51bWJlcigkc2NvcGUuY2FydFtpXS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygkc2NvcGUudG90YWxJdGVtcyk7XG4gICAgcmV0dXJuICRzY29wZS50b3RhbEl0ZW1zO1xuICB9XG5cbiAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCdDYXJ0IGluIGNvbnRyb2xsZXInLCAkc2NvcGUuY2FydCk7XG4gICAgY2FydFRvdGFsKCk7XG4gIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcblxuJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuXG4gIGNvbnNvbGUubG9nKCdyZW1vdmUgQ1RSTCcsIGl0ZW0pXG4gIG1haW5TcnZjLnJlbW92ZUZyb21DYXJ0KGl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuJHNjb3BlLnVwZGF0ZVF1YW50aXR5ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICBjb25zb2xlLmxvZyhpdGVtKVxuICBtYWluU3J2Yy51cGRhdGVRdWFudGl0eShpdGVtLnByb2R1Y3RJZCwgaXRlbS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59O1xuXG52YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgbG9jYWxlOiAnYXV0bycsXG4gIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4sICRzY29wZS5zdWJ0b3RhbCoxMDAsICRzY29wZS5jYXJ0KTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgaGFuZGxlci5vcGVuKHtcbiAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgemlwQ29kZTogdHJ1ZSxcbiAgICBhbW91bnQ6ICRzY29wZS5zdWJ0b3RhbCAqIDEwMFxuICB9KTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICBoYW5kbGVyLmNsb3NlKCk7XG59KTtcblxuXG5cblxuXG59KTsvL2Nsb3NpbmdcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbiwgJHJvb3RTY29wZSl7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMuaWQpO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgKz0gTnVtYmVyKHByb2R1Y3RRdWFudGl0eSk7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5kb2dzKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcub3VyLWRvZ3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNTgwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzM2LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxuICBcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cblxuXG4gIHZhciB2ZWxvY2l0eSA9IDAuNDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLmhvbWUtaGVhZGVyLWltYWdlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNzMwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzUwJSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG4gIHZhciBpID0gMDtcbiAgdmFyIG15VmFyID0gc2V0SW50ZXJ2YWwoY2hhbmdlSW1hZ2UsIDIwMDApO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZUltYWdlKCl7XG4gICAgLy9hcnJheSBvZiBiYWNrZ3JvdW5kc1xuICAgIHZhciBib3R0bGVzID0gW1wiZ2luZ2VyLmpwZ1wiLCBcImhpbnQtb2YtbWludC5qcGdcIiwgXCJqdXN0LWtvbWJ1Y2hhLmpwZ1wiLCBcInJhc3BiZXJyeS5qcGdcIiwgXCJ3aWxkLWJsdWUtZ2luZ2VyLmpwZ1wiLCBcIndpbGQtYmx1ZWJlcnJ5LmpwZ1wiXTtcbiAgICAkKCcucmlnaHQtY29sdW1uLWltYWdlJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcImltYWdlcy9rb21idWNoYWZsYXZvcnMvJytib3R0bGVzW2ldKydcIiknKTtcblxuICAgIGlmKGkgPT0gYm90dGxlcy5sZW5ndGggLTEpe1xuICAgICAgICBpID0gMDtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gLy8gd2luZG93LnNldEludGVydmFsKFwiY2hhbmdlSW1hZ2UoKVwiLCA1MDAwKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdpbmRleEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSl7XG5cbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSAwO1xuICAvLyAkcm9vdFNjb3BlLiR3YXRjaCgnY2FydFRvdGFsJywgZnVuY3Rpb24oKXtcbiAgLy8gICBjb25zb2xlLmxvZygnaXQgY2hhbmdlZCcpO1xuICAvLyAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY2FydFRvdGFsKTtcbiAgLy9cbiAgLy8gfSlcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignbWVyY2hhbmRpc2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLm1lcmNoYW5kaXNlID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUubWVyY2hhbmRpc2UpO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnByb2ZpbGUpO1xuICAgICRzY29wZS5hZG9wdGVkID0gJHNjb3BlLnByb2ZpbGVbMF0uYWRvcHRlZDtcbiAgICAgIC8vIGlmICgkc2NvcGUudGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdBRE9QVEVEISc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdVUCBGT1IgQURPUFRJT04nXG4gICAgICAvLyB9XG4gIH0pO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignc3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRBZG9wdGVkKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuYWRvcHRlZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmFkb3B0ZWQpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIl19
