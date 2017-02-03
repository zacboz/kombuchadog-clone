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
    templateUrl: './views/navbar.html'
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

angular.module('kombuchadog').controller('cartCtrl', function ($scope, mainSrvc, $stateParams) {

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

  mainSrvc.getCart().then(function (response) {
    $scope.cart = response.data;
    console.log('Cart in controller', $scope.cart);
    cartTotal();
  }).catch(function (err) {
    console.log(err);
  });

  $scope.removeFromCart = function (item) {
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
    console.log(item);
    // console.log($scope.cart);
    // console.log($scope.cart[0].productId);
    // const productId = $scope.cart.productId;
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

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams, $location) {

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
    var productTitle = $scope.details.title;
    var productPrice = $scope.details.price;
    var productImage = $scope.details.image;
    var productId = $scope.details.id;

    mainSrvc.addToCart(productTitle, productImage, productSize, productQuantity, productPrice, productId);
    alert('product added to cart');
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

angular.module('kombuchadog').controller('homeCtrl', function ($scope, mainSrvc, $stateParams) {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL2NoZWNrb3V0LmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsImRpcmVjdGl2ZSIsIm1haW5TcnZjIiwicmVzdHJpY3QiLCJzY29wZSIsImFtb3VudCIsImxpbmsiLCJlbGVtZW50IiwiYXR0cnMiLCJoYW5kbGVyIiwiU3RyaXBlQ2hlY2tvdXQiLCJjb25maWd1cmUiLCJrZXkiLCJpbWFnZSIsImxvY2FsZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIm9wZW4iLCJkZXNjcmlwdGlvbiIsInNoaXBwaW5nQWRkcmVzcyIsImJpbGxpbmdBZGRyZXNzIiwiemlwQ29kZSIsInByZXZlbnREZWZhdWx0Iiwid2luZG93IiwiY2xvc2UiLCIkc2NvcGUiLCIkc3RhdGVQYXJhbXMiLCJzdWJ0b3RhbCIsImNhcnRUb3RhbCIsImxlbmd0aCIsImZvckVhY2giLCJpbmRleCIsInBhcnNlSW50IiwiY2F0Y2giLCJlcnIiLCIkbG9jYXRpb24iLCJkZXRhaWxzIiwicHJldmlvdXMiLCJuZXh0Iiwic2xhc2giLCJ0aXRsZSIsInByaWNlIiwiYWxlcnQiLCJjaGFuZ2VQcm9kdWN0IiwiZGlyZWN0aW9uIiwiTnVtYmVyIiwicGF0aCIsIiRkb2N1bWVudCIsImRvZ3MiLCJ2ZWxvY2l0eSIsInVwZGF0ZSIsInBvcyIsIiQiLCJzY3JvbGxUb3AiLCJlYWNoIiwiJGVsZW1lbnQiLCJoZWlnaHQiLCJjc3MiLCJNYXRoIiwicm91bmQiLCJiaW5kIiwiaSIsIm15VmFyIiwic2V0SW50ZXJ2YWwiLCJjaGFuZ2VJbWFnZSIsImJvdHRsZXMiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixDQUFDLFdBQUQsQ0FBOUIsRUFDR0MsTUFESCxDQUNVLFVBQUNDLGNBQUQsRUFBaUJDLGtCQUFqQixFQUF3QztBQUM1Q0QsbUJBQ09FLEtBRFAsQ0FDYSxNQURiLEVBQ29CO0FBQ1pDLGFBQUksR0FEUTtBQUVaQyxxQkFBYSxtQkFGRDtBQUdaQyxvQkFBWTtBQUhBLEtBRHBCLEVB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b0QsSUFBdEY7QUFDQSxLQUxIO0FBTUc7O0FBRUhHLElBQUU3QixNQUFGLEVBQVVxQyxJQUFWLENBQWUsUUFBZixFQUF5QlYsTUFBekI7QUFHRCxDQXRCRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICAgbGV0IGlkID0gaXRlbS5wcm9kdWN0SWRcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jYXJ0LycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkUgUkVNT1ZFIEZST00gQ0FSVCcsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgbGV0IHByb2R1Y3QgPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTUlZDIHByb2R1Y3QnLCBwcm9kdWN0KTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuLCB0b3RhbCwgY2FydCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdTUlZDIFRPS0VOJywgdG9rZW4pO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9vcmRlcicsXG4gICAgICBkYXRhOiB7dG9rZW4sIHRvdGFsLCBjYXJ0fVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyB0b2tlbicsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuXG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ2NoZWNrb3V0JywgKG1haW5TcnZjKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0YnRuLmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhbW91bnQ6ICc9J1xuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gICAgICAgIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgICAgICAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgICAgICAgbG9jYWxlOiAnYXV0bycsXG4gICAgICAgIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgICAgICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICAgICAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICAgICAgICBoYW5kbGVyLm9wZW4oe1xuICAgICAgICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgICAgICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICAgICAgICB6aXBDb2RlOiB0cnVlLFxuICAgICAgICAgIGFtb3VudDogc2NvcGUuYW1vdW50XG4gICAgICAgIH0pO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGhhbmRsZXIuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgndGVlU2hpcnQnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2R1Y3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RlZS1zaGlydC5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAkc2NvcGUuY2FydDtcblxuICBsZXQgY2FydFRvdGFsID0gKCkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKCdydW5uaW5nIGNhcnRUb3RhbCcsICRzY29wZS5jYXJ0KTtcbiAgICBpZiAoISRzY29wZS5jYXJ0IHx8ICRzY29wZS5jYXJ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgJHNjb3BlLmNhcnQgPSBbXTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzY29wZS5jYXJ0LmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAkc2NvcGUuc3VidG90YWwgKz0gcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UHJpY2UpICogcGFyc2VJbnQoZWxlbWVudC5wcm9kdWN0UXVhbnRpdHkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJ0NhcnQgaW4gY29udHJvbGxlcicsICRzY29wZS5jYXJ0KTtcbiAgICBjYXJ0VG90YWwoKTtcbiAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH0pO1xuXG4kc2NvcGUucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICBjb25zb2xlLmxvZygncmVtb3ZlIENUUkwnLCBpdGVtKVxuICBtYWluU3J2Yy5yZW1vdmVGcm9tQ2FydChpdGVtKS50aGVuKCgpID0+IHtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbiRzY29wZS51cGRhdGVRdWFudGl0eSA9IChpdGVtKSA9PiB7XG4gIGNvbnNvbGUubG9nKGl0ZW0pXG4gIC8vIGNvbnNvbGUubG9nKCRzY29wZS5jYXJ0KTtcbiAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNhcnRbMF0ucHJvZHVjdElkKTtcbiAgLy8gY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmNhcnQucHJvZHVjdElkO1xuICBtYWluU3J2Yy51cGRhdGVRdWFudGl0eShpdGVtLnByb2R1Y3RJZCwgaXRlbS5wcm9kdWN0UXVhbnRpdHkpO1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG59O1xuXG52YXIgaGFuZGxlciA9IFN0cmlwZUNoZWNrb3V0LmNvbmZpZ3VyZSh7XG4gIGtleTogJ3BrX3Rlc3RfNjA2NUZSTTFhNHRid0lpb2Z6blRTWXU0JyxcbiAgaW1hZ2U6ICdodHRwczovL3N0cmlwZS5jb20vaW1nL2RvY3VtZW50YXRpb24vY2hlY2tvdXQvbWFya2V0cGxhY2UucG5nJyxcbiAgbG9jYWxlOiAnYXV0bycsXG4gIHRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHRva2VuKVxuICAgIC8vIFlvdSBjYW4gYWNjZXNzIHRoZSB0b2tlbiBJRCB3aXRoIGB0b2tlbi5pZGAuXG4gICAgLy8gR2V0IHRoZSB0b2tlbiBJRCB0byB5b3VyIHNlcnZlci1zaWRlIGNvZGUgZm9yIHVzZS5cbiAgICBtYWluU3J2Yy5wb3N0T3JkZXIodG9rZW4sICRzY29wZS5zdWJ0b3RhbCoxMDAsICRzY29wZS5jYXJ0KTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgaGFuZGxlci5vcGVuKHtcbiAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgemlwQ29kZTogdHJ1ZSxcbiAgICBhbW91bnQ6ICRzY29wZS5zdWJ0b3RhbCAqIDEwMFxuICB9KTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufSk7XG5cbi8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICBoYW5kbGVyLmNsb3NlKCk7XG59KTtcblxuXG5cblxuXG59KTsvL2Nsb3NpbmdcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbil7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMuaWQpO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG5cbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgICAgIGFsZXJ0KCdwcm9kdWN0IGFkZGVkIHRvIGNhcnQnKTtcbiAgfTtcblxuICAkc2NvcGUuY2hhbmdlUHJvZHVjdCA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBsZXQgaW5kZXggPSAkc2NvcGUuZGV0YWlscy5pZCArIE51bWJlcihkaXJlY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy8xJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4ID4gNCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvNCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKGAvbWVyY2hhbmRpc2UtZGV0YWlscy8ke2luZGV4fWApO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5ob21lLWhlYWRlci1pbWFnZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTczMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc1MCUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuICB2YXIgaSA9IDA7XG4gIHZhciBteVZhciA9IHNldEludGVydmFsKGNoYW5nZUltYWdlLCAyMDAwKTtcblxuICBmdW5jdGlvbiBjaGFuZ2VJbWFnZSgpe1xuICAgIC8vYXJyYXkgb2YgYmFja2dyb3VuZHNcbiAgICB2YXIgYm90dGxlcyA9IFtcImdpbmdlci5qcGdcIiwgXCJoaW50LW9mLW1pbnQuanBnXCIsIFwianVzdC1rb21idWNoYS5qcGdcIiwgXCJyYXNwYmVycnkuanBnXCIsIFwid2lsZC1ibHVlLWdpbmdlci5qcGdcIiwgXCJ3aWxkLWJsdWViZXJyeS5qcGdcIl07XG4gICAgJCgnLnJpZ2h0LWNvbHVtbi1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCJpbWFnZXMva29tYnVjaGFmbGF2b3JzLycrYm90dGxlc1tpXSsnXCIpJyk7XG5cbiAgICBpZihpID09IGJvdHRsZXMubGVuZ3RoIC0xKXtcbiAgICAgICAgaSA9IDA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuIC8vIHdpbmRvdy5zZXRJbnRlcnZhbChcImNoYW5nZUltYWdlKClcIiwgNTAwMCk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignbWVyY2hhbmRpc2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLm1lcmNoYW5kaXNlID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUubWVyY2hhbmRpc2UpO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnByb2ZpbGUpO1xuICAgICRzY29wZS5hZG9wdGVkID0gJHNjb3BlLnByb2ZpbGVbMF0uYWRvcHRlZDtcbiAgICAgIC8vIGlmICgkc2NvcGUudGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdBRE9QVEVEISc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdVUCBGT1IgQURPUFRJT04nXG4gICAgICAvLyB9XG4gIH0pO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignc3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRBZG9wdGVkKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuYWRvcHRlZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmFkb3B0ZWQpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIl19
