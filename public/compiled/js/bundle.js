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
}).run(function ($rootScope, $state, $stateParams, $anchorScroll) {

    $rootScope.$on('$stateChangeStart', function () {
        $anchorScroll();
    });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwicnVuIiwiJHJvb3RTY29wZSIsIiRzdGF0ZSIsIiRzdGF0ZVBhcmFtcyIsIiRhbmNob3JTY3JvbGwiLCIkb24iLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiZ2V0QWRvcHRlZCIsImdldERvZ1Byb2ZpbGUiLCJuYW1lIiwiZ2V0TWVyY2hhbmRpc2UiLCJnZXRNZXJjaGFuZGlzZURldGFpbHMiLCJpZCIsImFkZFRvQ2FydCIsInByb2R1Y3RUaXRsZSIsInByb2R1Y3RJbWFnZSIsInByb2R1Y3RTaXplIiwicHJvZHVjdFF1YW50aXR5IiwicHJvZHVjdFByaWNlIiwicHJvZHVjdElkIiwiaXRlbSIsImRhdGEiLCJzdWNjZXNzIiwiZ2V0Q2FydCIsInJlbW92ZUZyb21DYXJ0IiwidXBkYXRlUXVhbnRpdHkiLCJwcm9kdWN0IiwicG9zdE9yZGVyIiwidG9rZW4iLCJ0b3RhbCIsImNhcnQiLCIkc2NvcGUiLCJtYWluU3J2YyIsInN1YnRvdGFsIiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJzZUludCIsImZpbmRUb3RhbEl0ZW1zIiwidG90YWxJdGVtcyIsImkiLCJOdW1iZXIiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGVyIiwiU3RyaXBlQ2hlY2tvdXQiLCJjb25maWd1cmUiLCJrZXkiLCJpbWFnZSIsImxvY2FsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwib3BlbiIsImRlc2NyaXB0aW9uIiwic2hpcHBpbmdBZGRyZXNzIiwiYmlsbGluZ0FkZHJlc3MiLCJ6aXBDb2RlIiwiYW1vdW50IiwicHJldmVudERlZmF1bHQiLCJ3aW5kb3ciLCJjbG9zZSIsIiRsb2NhdGlvbiIsImRldGFpbHMiLCJwcmV2aW91cyIsIm5leHQiLCJzbGFzaCIsInRpdGxlIiwicHJpY2UiLCJjaGFuZ2VQcm9kdWN0IiwiZGlyZWN0aW9uIiwicGF0aCIsIiRkb2N1bWVudCIsImRvZ3MiLCJ2ZWxvY2l0eSIsInVwZGF0ZSIsInBvcyIsIiQiLCJzY3JvbGxUb3AiLCJlYWNoIiwiJGVsZW1lbnQiLCJoZWlnaHQiLCJjc3MiLCJNYXRoIiwicm91bmQiLCJiaW5kIiwic2V0SW50ZXJ2YWwiLCJjaGFuZ2VJbWFnZSIsImJvdHRsZXMiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJ0ZW1wbGF0ZSIsInNjb3BlIiwiJHdhdGNoIiwibGluayIsImF0dHJzIiwib24iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxR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SkQ7OztBQ0FBUCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QmlILFNBQTlCLENBQXdDLFVBQXhDLEVBQW9ELFlBQU07QUFDeEQsU0FBTztBQUNMQyxjQUFVLElBREw7QUFFTEUsV0FBTztBQUNMNUUsZUFBUztBQURKLEtBRkY7QUFLTGxDLGlCQUFhO0FBTFIsR0FBUDtBQU9ELENBUkQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjaGVja291dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NoZWNrb3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSlcbiAgLnJ1bihmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRhbmNob3JTY3JvbGwpIHtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGFuY2hvclNjcm9sbCgpO1xuICAgIH0pO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGxldCBpdGVtID0ge1xuICAgICAgcHJvZHVjdFRpdGxlOiBwcm9kdWN0VGl0bGUsXG4gICAgICBwcm9kdWN0SW1hZ2U6IHByb2R1Y3RJbWFnZSxcbiAgICAgIHByb2R1Y3RTaXplOiBwcm9kdWN0U2l6ZSxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5LFxuICAgICAgcHJvZHVjdFByaWNlOiBwcm9kdWN0UHJpY2UsXG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZFxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvY2FydCcsXG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgICBsZXQgaWQgPSBpdGVtLnByb2R1Y3RJZFxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiAnL2NhcnQvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGxldCBwcm9kdWN0ID0ge1xuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWQsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eVxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICBsZXQgY2FydFRvdGFsID0gKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5uaW5nIGNhcnRUb3RhbCcsICRzY29wZS5jYXJ0KTtcbiAgICBpZiAoISRzY29wZS5jYXJ0IHx8ICRzY29wZS5jYXJ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcnQtcGFnZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbXB0eS1jYXJ0Jykuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAkc2NvcGUuc3VidG90YWwgKz0gcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UHJpY2UpICogcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UXVhbnRpdHkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgZmluZFRvdGFsSXRlbXMgPSAoKSA9PiB7XG4gICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJHNjb3BlLmNhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICRzY29wZS50b3RhbEl0ZW1zICs9IE51bWJlcigkc2NvcGUuY2FydFtpXS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gJHNjb3BlLnRvdGFsSXRlbXM7XG4gIH1cblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY2FydFRvdGFsKCk7XG4gIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcblxuJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpO1xuICBtYWluU3J2Yy5yZW1vdmVGcm9tQ2FydChpdGVtKS50aGVuKCgpID0+IHtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICAgICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbiRzY29wZS51cGRhdGVRdWFudGl0eSA9IChpdGVtKSA9PiB7XG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgbWFpblNydmMudXBkYXRlUXVhbnRpdHkoaXRlbS5wcm9kdWN0SWQsIGl0ZW0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufTtcblxudmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICBrZXk6ICdwa190ZXN0XzYwNjVGUk0xYTR0YndJaW9mem5UU1l1NCcsXG4gIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gIGxvY2FsZTogJ2F1dG8nLFxuICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuLCAkc2NvcGUuc3VidG90YWwqMTAwLCAkc2NvcGUuY2FydCk7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gIGhhbmRsZXIub3Blbih7XG4gICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgIHppcENvZGU6IHRydWUsXG4gICAgYW1vdW50OiAkc2NvcGUuc3VidG90YWwgKiAxMDBcbiAgfSk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbn0pO1xuXG4vLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgaGFuZGxlci5jbG9zZSgpO1xufSk7XG5cblxuXG5cblxufSk7Ly9jbG9zaW5nXG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2RldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkbG9jYXRpb24sICRyb290U2NvcGUpe1xuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlRGV0YWlscygkc3RhdGVQYXJhbXMuaWQpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRldGFpbHMgPSByZXNwb25zZS5kYXRhWzBdO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgJHJvb3RTY29wZS5jYXJ0VG90YWwgKz0gTnVtYmVyKHByb2R1Y3RRdWFudGl0eSk7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG5cblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IDA7XG4gIC8vICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAvLyAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gIC8vICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAvL1xuICAvLyB9KVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjYXJ0bmF2JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlOiBcIih7e3RvdGFsSXRlbXN9fSlcIixcbiAgICBzY29wZToge30sXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgbWFpblNydmMsICRyb290U2NvcGUsICRzdGF0ZSkgPT4ge1xuXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnY2FydFRvdGFsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0IGNoYW5nZWQnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAgICAgICAkc2NvcGUudG90YWxJdGVtcyA9ICRyb290U2NvcGUuY2FydFRvdGFsXG5cbiAgICAgIH0pXG5cblxuICAgIH1cblxufVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NoZWNrb3V0JywgKG1haW5TcnZjKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0YnRuLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhbW91bnQ6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gICAgICAgIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgICAgICAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgICAgICAgbG9jYWxlOiAnYXV0bycsXG4gICAgICAgIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRva2VuKVxuICAgICAgICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICAgICAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICAgICAgICBoYW5kbGVyLm9wZW4oe1xuICAgICAgICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICB6aXBDb2RlOiB0cnVlLFxuICAgICAgICAgIGFtb3VudDogc2NvcGUuYW1vdW50XG4gICAgICAgIH0pO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhbmRsZXIuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJyxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc3RhdGUsICRyb290U2NvcGUpe1xuXG4gICAgICAkKCcuYWN0aXZhdGUtbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tbmF2Jyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLnNvY2lhbC1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5iYWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdzb2NpYWxGb290ZXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Zvb3Rlci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3RlZVNoaXJ0JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9kdWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90ZWUtc2hpcnQuaHRtbCdcbiAgfTtcbn0pO1xuIl19
