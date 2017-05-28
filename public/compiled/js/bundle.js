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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL2NhcnRuYXYuanMiLCJkaXJlY3RpdmVzL2NoZWNrb3V0LmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0IiwidGVtcGxhdGUiLCJzY29wZSIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHJvb3RTY29wZSIsIiRzdGF0ZSIsIiR3YXRjaCIsImNhcnRUb3RhbCIsInRvdGFsSXRlbXMiLCJhbW91bnQiLCJsaW5rIiwiZWxlbWVudCIsImF0dHJzIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwiaW1hZ2UiLCJsb2NhbGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJCIsIm9uIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIiRzdGF0ZVBhcmFtcyIsInN1YnRvdGFsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImluZGV4IiwicGFyc2VJbnQiLCJmaW5kVG90YWxJdGVtcyIsImkiLCJOdW1iZXIiLCJjYXRjaCIsImVyciIsIiRsb2NhdGlvbiIsImRldGFpbHMiLCJwcmV2aW91cyIsIm5leHQiLCJzbGFzaCIsInRpdGxlIiwicHJpY2UiLCJjaGFuZ2VQcm9kdWN0IiwiZGlyZWN0aW9uIiwicGF0aCIsIiRkb2N1bWVudCIsImRvZ3MiLCJ2ZWxvY2l0eSIsInVwZGF0ZSIsInBvcyIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJteVZhciIsInNldEludGVydmFsIiwiY2hhbmdlSW1hZ2UiLCJib3R0bGVzIiwibWVyY2hhbmRpc2UiLCJwcm9maWxlIiwiYWRvcHRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENB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Qzs7QUFFL0ZoQyxXQUFTL0IsVUFBVCxHQUFzQkYsSUFBdEIsQ0FBMkIsVUFBQ0MsUUFBRCxFQUFjO0FBQ3ZDK0IsV0FBT3lFLE9BQVAsR0FBaUJ4RyxTQUFTZSxJQUExQjtBQUNBSSxZQUFRQyxHQUFSLENBQVlXLE9BQU95RSxPQUFuQjtBQUNELEdBSEQ7O0FBS0EsTUFBSWpCLFdBQVcsR0FBZjs7QUFFQSxXQUFTQyxNQUFULEdBQWlCO0FBQ2pCLFFBQUlDLE1BQU03QixFQUFFRixNQUFGLEVBQVVnQyxTQUFWLEVBQVY7QUFDQTlCLE1BQUUsaUJBQUYsRUFBcUIrQixJQUFyQixDQUEwQixZQUFXO0FBQ2xDLFVBQUlDLFdBQVdoQyxFQUFFLElBQUYsQ0FBZjtBQUNBO0FBQ0EsVUFBSWlDLFNBQVNELFNBQVNDLE1BQVQsS0FBa0IsSUFBL0I7QUFDQWpDLFFBQUUsSUFBRixFQUFRa0MsR0FBUixDQUFZLG9CQUFaLEVBQWtDLFdBQVdDLEtBQUtDLEtBQUwsQ0FBVyxDQUFDSCxTQUFTSixHQUFWLElBQWlCRixRQUE1QixDQUFYLEdBQW9ELElBQXRGO0FBQ0EsS0FMSDtBQU1HOztBQUVIM0IsSUFBRUYsTUFBRixFQUFVdUMsSUFBVixDQUFlLFFBQWYsRUFBeUJULE1BQXpCO0FBR0QsQ0F0QkQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjaGVja291dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NoZWNrb3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5zZXJ2aWNlKCdtYWluU3J2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgdGhpcy5nZXRVcEZvckFkb3B0aW9uID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRBZG9wdGVkID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1Y2Nlc3Mtc3Rvcmllcy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0RG9nUHJvZmlsZSA9IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MvJytuYW1lXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgcmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGxldCBpdGVtID0ge1xuICAgICAgcHJvZHVjdFRpdGxlOiBwcm9kdWN0VGl0bGUsXG4gICAgICBwcm9kdWN0SW1hZ2U6IHByb2R1Y3RJbWFnZSxcbiAgICAgIHByb2R1Y3RTaXplOiBwcm9kdWN0U2l6ZSxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5LFxuICAgICAgcHJvZHVjdFByaWNlOiBwcm9kdWN0UHJpY2UsXG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZFxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvY2FydCcsXG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBpdGVtIGFkZGVkJylcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldENhcnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvY2FydCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NSVkMgQ0FSVCcsIHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICAgIGxldCBpZCA9IGl0ZW0ucHJvZHVjdElkXG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvY2FydC8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZFIFJFTU9WRSBGUk9NIENBUlQnLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGxldCBwcm9kdWN0ID0ge1xuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWQsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnU1JWQyBwcm9kdWN0JywgcHJvZHVjdCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6ICcvY2FydC8nK3Byb2R1Y3RJZCxcbiAgICAgIGRhdGE6IHByb2R1Y3RcbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgVVBEQVRJTkcnLCByZXNwb25zZSk7XG4gICAgfSlcbiAgfTtcblxuICB0aGlzLnBvc3RPcmRlciA9ICh0b2tlbiwgdG90YWwsIGNhcnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnU1JWQyBUT0tFTicsIHRva2VuKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvb3JkZXInLFxuICAgICAgZGF0YToge3Rva2VuLCB0b3RhbCwgY2FydH1cbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgdG9rZW4nLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgXG5cblxuXG59KTtcbiIsIi8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4vLyAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI2KSB7XG4vLyAgICAgLy8gZmluZCB0aGUgc2Nyb2xsIGFuZCB1c2UgdGhpcyB2YXJpYWJsZSB0byBtb3ZlIGVsZW1lbnRzXG4vLyAgICAgdmFyIHdpblNjcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG4vLyAgICAgLy8gY29uc29sZS5sb2cod2luU2Nyb2xsKTtcbi8vICAgICAvLyBjZW50ZXIgbW92ZXMgZG93biBvbiB0aGUgeS1heGlzIG9uIHNjcm9sbFxuLy9cbi8vICAgICAkKCcjZG9nLWJhbm5lcicpLmNzcyh7XG4vLyAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwcHgsIC0nKyB3aW5TY3JvbGwgLzUwICsnJSknXG4vLyAgICAgfSk7XG4vLyAgIC8vIH1cbi8vIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjYXJ0bmF2JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlOiBcIih7e3RvdGFsSXRlbXN9fSlcIixcbiAgICBzY29wZToge30sXG4gICAgY29udHJvbGxlcjogKCRzY29wZSwgbWFpblNydmMsICRyb290U2NvcGUsICRzdGF0ZSkgPT4ge1xuXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaCgnY2FydFRvdGFsJywgZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2l0IGNoYW5nZWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAgICAgICAkc2NvcGUudG90YWxJdGVtcyA9ICRyb290U2NvcGUuY2FydFRvdGFsXG5cbiAgICAgIH0pXG5cblxuICAgIH1cblxufVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NoZWNrb3V0JywgKG1haW5TcnZjKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0YnRuLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhbW91bnQ6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gICAgICAgIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgICAgICAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgICAgICAgbG9jYWxlOiAnYXV0bycsXG4gICAgICAgIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgICAgICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICAgICAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICAgICAgICBoYW5kbGVyLm9wZW4oe1xuICAgICAgICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICB6aXBDb2RlOiB0cnVlLFxuICAgICAgICAgIGFtb3VudDogc2NvcGUuYW1vdW50XG4gICAgICAgIH0pO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhbmRsZXIuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJyxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc3RhdGUsICRyb290U2NvcGUpe1xuXG4gICAgICAkKCcuYWN0aXZhdGUtbW9iaWxlLW1lbnUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIFx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tbmF2Jyk7XG4gICAgICAgICAgLy8gJCgnYm9keScpLnJlbW92ZUNsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLnNvY2lhbC1tZW51Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnaGlkZGVuLXNvY2lhbCcpO1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5iYWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtb3BlbicpO1xuICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnc29jaWFsLXJpZ2h0Jyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdoaWRkZW4tc29jaWFsJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdyb3V0ZXMtb3BlbicpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncm91dGVzLW9wZW4nKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3NvY2lhbC1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdzb2NpYWwtcmlnaHQnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2hpZGRlbi1uYXYnKTtcbiAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdtZW51LWNsb3NlJyk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdzb2NpYWxGb290ZXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Zvb3Rlci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3RlZVNoaXJ0JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9kdWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90ZWUtc2hpcnQuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdjYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgJHNjb3BlLmNhcnQ7XG5cbiAgbGV0IGNhcnRUb3RhbCA9ICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncnVubmluZyBjYXJ0VG90YWwnLCAkc2NvcGUuY2FydCk7XG4gICAgaWYgKCEkc2NvcGUuY2FydCB8fCAkc2NvcGUuY2FydC5sZW5ndGggPT09IDApIHtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgJHNjb3BlLnN1YnRvdGFsICs9IHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFByaWNlKSAqIHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFF1YW50aXR5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IGZpbmRUb3RhbEl0ZW1zID0gKCkgPT4ge1xuICAgICRzY29wZS50b3RhbEl0ZW1zID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRzY29wZS5jYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAkc2NvcGUudG90YWxJdGVtcyArPSBOdW1iZXIoJHNjb3BlLmNhcnRbaV0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnRvdGFsSXRlbXMpO1xuICAgIHJldHVybiAkc2NvcGUudG90YWxJdGVtcztcbiAgfVxuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICAgIGNhcnRUb3RhbCgpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cbiRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gZmluZFRvdGFsSXRlbXMoKTtcbiAgY29uc29sZS5sb2coJ3JlbW92ZSBDVFJMJywgaXRlbSlcbiAgbWFpblNydmMucmVtb3ZlRnJvbUNhcnQoaXRlbSkudGhlbigoKSA9PiB7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4kc2NvcGUudXBkYXRlUXVhbnRpdHkgPSAoaXRlbSkgPT4ge1xuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IGZpbmRUb3RhbEl0ZW1zKCk7XG4gIGNvbnNvbGUubG9nKGl0ZW0pXG4gIG1haW5TcnZjLnVwZGF0ZVF1YW50aXR5KGl0ZW0ucHJvZHVjdElkLCBpdGVtLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn07XG5cbnZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICBsb2NhbGU6ICdhdXRvJyxcbiAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbiwgJHNjb3BlLnN1YnRvdGFsKjEwMCwgJHNjb3BlLmNhcnQpO1xuICB9XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICBoYW5kbGVyLm9wZW4oe1xuICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICB6aXBDb2RlOiB0cnVlLFxuICAgIGFtb3VudDogJHNjb3BlLnN1YnRvdGFsICogMTAwXG4gIH0pO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gIGhhbmRsZXIuY2xvc2UoKTtcbn0pO1xuXG5cblxuXG5cbn0pOy8vY2xvc2luZ1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKXtcblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZURldGFpbHMoJHN0YXRlUGFyYW1zLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscy5pZCk7XG4gICAgaWYgKCRzY29wZS5kZXRhaWxzLmlkIDwgMikge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgkc2NvcGUuZGV0YWlscy5pZCA+IDMpIHtcbiAgICAgICRzY29wZS5uZXh0ID0gbnVsbDtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS5wcm9kdWN0UXVhbnRpdHkgPSAxO1xuICAkc2NvcGUuYWRkVG9DYXJ0ID0gKHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCArPSBOdW1iZXIocHJvZHVjdFF1YW50aXR5KTtcbiAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSAkc2NvcGUuZGV0YWlscy50aXRsZTtcbiAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSAkc2NvcGUuZGV0YWlscy5wcmljZTtcbiAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSAkc2NvcGUuZGV0YWlscy5pbWFnZTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuZGV0YWlscy5pZDtcbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgfTtcblxuICAkc2NvcGUuY2hhbmdlUHJvZHVjdCA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBsZXQgaW5kZXggPSAkc2NvcGUuZGV0YWlscy5pZCArIE51bWJlcihkaXJlY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy8xJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4ID4gNCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvNCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKGAvbWVyY2hhbmRpc2UtZGV0YWlscy8ke2luZGV4fWApO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkcm9vdFNjb3BlKXtcblxuXG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICB2YXIgbXlWYXIgPSBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAvLyB3aW5kb3cuc2V0SW50ZXJ2YWwoXCJjaGFuZ2VJbWFnZSgpXCIsIDUwMDApO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2luZGV4Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKXtcblxuICAkcm9vdFNjb3BlLmNhcnRUb3RhbCA9IDA7XG4gIC8vICRyb290U2NvcGUuJHdhdGNoKCdjYXJ0VG90YWwnLCBmdW5jdGlvbigpe1xuICAvLyAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gIC8vICAgY29uc29sZS5sb2coJHJvb3RTY29wZS5jYXJ0VG90YWwpO1xuICAvL1xuICAvLyB9KVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5tZXJjaGFuZGlzZSk7XG4gIH0pXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXREb2dQcm9maWxlKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUucHJvZmlsZSk7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICAgICAgLy8gaWYgKCRzY29wZS50ZXN0ID09PSB0cnVlKSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ0FET1BURUQhJztcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ1VQIEZPUiBBRE9QVElPTidcbiAgICAgIC8vIH1cbiAgfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdzdWNjZXNzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcykge1xuXG4gIG1haW5TcnZjLmdldEFkb3B0ZWQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5hZG9wdGVkID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuYWRvcHRlZCk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLnN1Y2Nlc3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xOTIwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzY1LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxufSk7XG4iXX0=
