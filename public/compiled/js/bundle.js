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
    });
  };

  this.getMerchandise = function () {
    return $http({
      method: 'GET',
      url: '/merchandise-index'
    }).then(function (response) {
      return response;
    });
  };

  this.getMerchandiseDetails = function (id) {
    return $http({
      method: 'GET',
      url: '/merchandise/' + id
    }).then(function (response) {
      return response;
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
    }).success(function () {});
  };

  this.getCart = function () {
    return $http({
      method: 'GET',
      url: '/cart'
    }).then(function (response) {
      return response;
    });
  };

  this.removeFromCart = function (item) {
    var id = item.productId;
    return $http({
      method: 'DELETE',
      url: '/cart/' + id
    }).then(function (response) {
      return response;
    });
  };

  this.updateQuantity = function (productId, productQuantity) {
    var product = {
      productId: productId,
      productQuantity: productQuantity
    };
    return $http({
      method: 'PUT',
      url: '/cart/' + productId,
      data: product
    }).success(function (response) {
      // console.log('SRVC UPDATING', response);
    });
  };

  this.postOrder = function (token, total, cart) {
    // console.log('SRVC TOKEN', token);
    return $http({
      method: 'POST',
      url: '/order',
      data: { token: token, total: total, cart: cart }
    }).success(function (response) {
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
        $scope.subtotal += parseInt(element.productPrice) * parseInt(element.productQuantity);
      });
    };
  };

  var findTotalItems = function findTotalItems() {
    $scope.totalItems = 0;
    for (var i = 0; i < $scope.cart.length; i++) {
      $scope.totalItems += Number($scope.cart[i].productQuantity);
    }
    return $scope.totalItems;
  };

  mainSrvc.getCart().then(function (response) {
    $scope.cart = response.data;
    cartTotal();
  }).catch(function (err) {
    console.log(err);
  });

  $scope.removeFromCart = function (item) {
    $rootScope.cartTotal = findTotalItems();
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
  });
});
'use strict';

angular.module('kombuchadog').controller('profileCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getDogProfile($stateParams.name).then(function (response) {
    $scope.profile = response.data;
    $scope.adopted = $scope.profile[0].adopted;
  });
});
'use strict';

angular.module('kombuchadog').controller('successCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getAdopted().then(function (response) {
    $scope.adopted = response.data;
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
        // console.log('it changed');
        // console.log($rootScope.cartTotal);
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
          // console.log(token)
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsInVwZGF0ZVF1YW50aXR5IiwicHJvZHVjdCIsInBvc3RPcmRlciIsInRva2VuIiwidG90YWwiLCJjYXJ0IiwiJHNjb3BlIiwibWFpblNydmMiLCIkc3RhdGVQYXJhbXMiLCIkcm9vdFNjb3BlIiwic3VidG90YWwiLCJjYXJ0VG90YWwiLCJsZW5ndGgiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiZm9yRWFjaCIsImVsZW1lbnQiLCJpbmRleCIsInBhcnNlSW50IiwiZmluZFRvdGFsSXRlbXMiLCJ0b3RhbEl0ZW1zIiwiaSIsIk51bWJlciIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImhhbmRsZXIiLCJTdHJpcGVDaGVja291dCIsImNvbmZpZ3VyZSIsImtleSIsImltYWdlIiwibG9jYWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJhbW91bnQiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsIiRzdGF0ZSIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInRlbXBsYXRlIiwic2NvcGUiLCIkd2F0Y2giLCJsaW5rIiwiYXR0cnMiLCJvbiIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENB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b3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGxldCBpdGVtID0ge1xuICAgICAgcHJvZHVjdFRpdGxlOiBwcm9kdWN0VGl0bGUsXG4gICAgICBwcm9kdWN0SW1hZ2U6IHByb2R1Y3RJbWFnZSxcbiAgICAgIHByb2R1Y3RTaXplOiBwcm9kdWN0U2l6ZSxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5LFxuICAgICAgcHJvZHVjdFByaWNlOiBwcm9kdWN0UHJpY2UsXG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZFxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvY2FydCcsXG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgICBsZXQgaWQgPSBpdGVtLnByb2R1Y3RJZFxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiAnL2NhcnQvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGxldCBwcm9kdWN0ID0ge1xuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWQsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eVxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICBsZXQgY2FydFRvdGFsID0gKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5uaW5nIGNhcnRUb3RhbCcsICRzY29wZS5jYXJ0KTtcbiAgICBpZiAoISRzY29wZS5jYXJ0IHx8ICRzY29wZS5jYXJ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcnQtcGFnZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXB0eS1jYXJ0Jykuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAkc2NvcGUuc3VidG90YWwgKz0gcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UHJpY2UpICogcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UXVhbnRpdHkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgZmluZFRvdGFsSXRlbXMgPSAoKSA9PiB7XG4gICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHNjb3BlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICRzY29wZS50b3RhbEl0ZW1zICs9IE51bWJlcigkc2NvcGUuY2FydFtpXS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gJHNjb3BlLnRvdGFsSXRlbXM7XG4gIH1cblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY2FydFRvdGFsKCk7XG4gIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcblxuJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICBtYWluU3J2Yy5yZW1vdmVGcm9tQ2FydChpdGVtKS50aGVuKCgpID0+IHtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICAgICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbiRzY29wZS51cGRhdGVRdWFudGl0eSA9IChpdGVtKSA9PiB7XG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgbWFpblNydmMudXBkYXRlUXVhbnRpdHkoaXRlbS5wcm9kdWN0SWQsIGl0ZW0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufTtcblxudmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICBrZXk6ICdwa190ZXN0XzYwNjVGUk0xYTR0YndJaW9mem5UU1l1NCcsXG4gIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gIGxvY2FsZTogJ2F1dG8nLFxuICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuLCAkc2NvcGUuc3VidG90YWwqMTAwLCAkc2NvcGUuY2FydCk7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gIGhhbmRsZXIub3Blbih7XG4gICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgIHppcENvZGU6IHRydWUsXG4gICAgYW1vdW50OiAkc2NvcGUuc3VidG90YWwgKiAxMDBcbiAgfSk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgaGFuZGxlci5jbG9zZSgpO1xufSk7XG5cblxuXG5cblxufSk7Ly9jbG9zaW5nXG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2RldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkbG9jYXRpb24sICRyb290U2NvcGUpe1xuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlRGV0YWlscygkc3RhdGVQYXJhbXMuaWQpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRldGFpbHMgPSByZXNwb25zZS5kYXRhWzBdO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgKz0gTnVtYmVyKHByb2R1Y3RRdWFudGl0eSk7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG5cblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IDA7XG4gIC8vICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAvLyAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gIC8vICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAvL1xuICAvLyB9KVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjYXJ0bmF2JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlOiBcIih7e3RvdGFsSXRlbXN9fSlcIixcbiAgICBzY29wZToge30sXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgbWFpblNydmMsICRyb290U2NvcGUsICRzdGF0ZSkgPT4ge1xuXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnY2FydFRvdGFsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0IGNoYW5nZWQnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAgICAgICAkc2NvcGUudG90YWxJdGVtcyA9ICRyb290U2NvcGUuY2FydFRvdGFsXG5cbiAgICAgIH0pXG5cblxuICAgIH1cblxufVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NoZWNrb3V0JywgKG1haW5TcnZjKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0YnRuLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhbW91bnQ6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gICAgICAgIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgICAgICAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgICAgICAgbG9jYWxlOiAnYXV0bycsXG4gICAgICAgIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRva2VuKVxuICAgICAgICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICAgICAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICAgICAgICBoYW5kbGVyLm9wZW4oe1xuICAgICAgICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICB6aXBDb2RlOiB0cnVlLFxuICAgICAgICAgIGFtb3VudDogc2NvcGUuYW1vdW50XG4gICAgICAgIH0pO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhbmRsZXIuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJyxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc3RhdGUsICRyb290U2NvcGUpe1xuXG4gICAgICAkKCcuYWN0aXZhdGUtbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tbmF2Jyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLnNvY2lhbC1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5iYWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdzb2NpYWxGb290ZXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Zvb3Rlci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3RlZVNoaXJ0JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9kdWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90ZWUtc2hpcnQuaHRtbCdcbiAgfTtcbn0pO1xuIl19
