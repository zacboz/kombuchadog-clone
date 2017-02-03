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
    controller: function controller($state, $rootScope) {}
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9pbmRleEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jYXJ0bmF2LmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsInRvdGFsIiwiY2FydCIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwiJHJvb3RTY29wZSIsInN1YnRvdGFsIiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJpbmRleCIsInBhcnNlSW50IiwiZmluZFRvdGFsSXRlbXMiLCJ0b3RhbEl0ZW1zIiwiaSIsIk51bWJlciIsImNhdGNoIiwiZXJyIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwiaW1hZ2UiLCJsb2NhbGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJvcGVuIiwiZGVzY3JpcHRpb24iLCJzaGlwcGluZ0FkZHJlc3MiLCJiaWxsaW5nQWRkcmVzcyIsInppcENvZGUiLCJhbW91bnQiLCJwcmV2ZW50RGVmYXVsdCIsIndpbmRvdyIsImNsb3NlIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInNsYXNoIiwidGl0bGUiLCJwcmljZSIsImFsZXJ0IiwiY2hhbmdlUHJvZHVjdCIsImRpcmVjdGlvbiIsInBhdGgiLCIkZG9jdW1lbnQiLCJkb2dzIiwidmVsb2NpdHkiLCJ1cGRhdGUiLCJwb3MiLCIkIiwic2Nyb2xsVG9wIiwiZWFjaCIsIiRlbGVtZW50IiwiaGVpZ2h0IiwiY3NzIiwiTWF0aCIsInJvdW5kIiwiYmluZCIsIm15VmFyIiwic2V0SW50ZXJ2YWwiLCJjaGFuZ2VJbWFnZSIsImJvdHRsZXMiLCIkc3RhdGUiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJ0ZW1wbGF0ZSIsInNjb3BlIiwiJHdhdGNoIiwibGluayIsImF0dHJzIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixDQUFDLFdBQUQsQ0FBOUIsRUFDR0MsTUFESCxDQUNVLFVB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QUFZLG9CQUFTbUcsTUFBVCxFQUFpQjlELFVBQWpCLEVBQTRCLENBRXZDO0FBSkksR0FBUDtBQU1ELENBUEQ7OztBQ0FBN0MsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEI4RyxTQUE5QixDQUF3QyxjQUF4QyxFQUF3RCxZQUFNO0FBQzVELFNBQU87QUFDTHhHLGlCQUFhO0FBRFIsR0FBUDtBQUdELENBSkQ7OztBQ0FBUCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QjhHLFNBQTlCLENBQXdDLFVBQXhDLEVBQW9ELFlBQU07QUFDeEQsU0FBTztBQUNMQyxjQUFVLElBREw7QUFFTEUsV0FBTztBQUNMN0UsZUFBUztBQURKLEtBRkY7QUFLTDlCLGlCQUFhO0FBTFIsR0FBUDtBQU9ELENBUkQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjaGVja291dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NoZWNrb3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NoZWNrb3V0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5zZXJ2aWNlKCdtYWluU3J2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgdGhpcy5nZXRVcEZvckFkb3B0aW9uID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRBZG9wdGVkID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1Y2Nlc3Mtc3Rvcmllcy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0RG9nUHJvZmlsZSA9IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MvJytuYW1lXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgcmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGxldCBpdGVtID0ge1xuICAgICAgcHJvZHVjdFRpdGxlOiBwcm9kdWN0VGl0bGUsXG4gICAgICBwcm9kdWN0SW1hZ2U6IHByb2R1Y3RJbWFnZSxcbiAgICAgIHByb2R1Y3RTaXplOiBwcm9kdWN0U2l6ZSxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5LFxuICAgICAgcHJvZHVjdFByaWNlOiBwcm9kdWN0UHJpY2UsXG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZFxuICAgIH1cbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvY2FydCcsXG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSkuc3VjY2VzcygoKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBpdGVtIGFkZGVkJylcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldENhcnQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvY2FydCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NSVkMgQ0FSVCcsIHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVtb3ZlRnJvbUNhcnQgPSAoaXRlbSkgPT4ge1xuICAgIGxldCBpZCA9IGl0ZW0ucHJvZHVjdElkXG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6ICcvY2FydC8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZFIFJFTU9WRSBGUk9NIENBUlQnLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy51cGRhdGVRdWFudGl0eSA9IChwcm9kdWN0SWQsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGxldCBwcm9kdWN0ID0ge1xuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWQsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnU1JWQyBwcm9kdWN0JywgcHJvZHVjdCk7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6ICcvY2FydC8nK3Byb2R1Y3RJZCxcbiAgICAgIGRhdGE6IHByb2R1Y3RcbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgVVBEQVRJTkcnLCByZXNwb25zZSk7XG4gICAgfSlcbiAgfTtcblxuICB0aGlzLnBvc3RPcmRlciA9ICh0b2tlbiwgdG90YWwsIGNhcnQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnU1JWQyBUT0tFTicsIHRva2VuKTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvb3JkZXInLFxuICAgICAgZGF0YToge3Rva2VuLCB0b3RhbCwgY2FydH1cbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgdG9rZW4nLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgXG5cblxuXG59KTtcbiIsIi8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4vLyAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI2KSB7XG4vLyAgICAgLy8gZmluZCB0aGUgc2Nyb2xsIGFuZCB1c2UgdGhpcyB2YXJpYWJsZSB0byBtb3ZlIGVsZW1lbnRzXG4vLyAgICAgdmFyIHdpblNjcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG4vLyAgICAgLy8gY29uc29sZS5sb2cod2luU2Nyb2xsKTtcbi8vICAgICAvLyBjZW50ZXIgbW92ZXMgZG93biBvbiB0aGUgeS1heGlzIG9uIHNjcm9sbFxuLy9cbi8vICAgICAkKCcjZG9nLWJhbm5lcicpLmNzcyh7XG4vLyAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwcHgsIC0nKyB3aW5TY3JvbGwgLzUwICsnJSknXG4vLyAgICAgfSk7XG4vLyAgIC8vIH1cbi8vIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdjYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSl7XG5cbiAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgJHNjb3BlLmNhcnQ7XG5cbiAgbGV0IGNhcnRUb3RhbCA9ICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncnVubmluZyBjYXJ0VG90YWwnLCAkc2NvcGUuY2FydCk7XG4gICAgaWYgKCEkc2NvcGUuY2FydCB8fCAkc2NvcGUuY2FydC5sZW5ndGggPT09IDApIHtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgJHNjb3BlLnN1YnRvdGFsICs9IHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFByaWNlKSAqIHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFF1YW50aXR5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IGZpbmRUb3RhbEl0ZW1zID0gKCkgPT4ge1xuICAgICRzY29wZS50b3RhbEl0ZW1zID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRzY29wZS5jYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAkc2NvcGUudG90YWxJdGVtcyArPSBOdW1iZXIoJHNjb3BlLmNhcnRbaV0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJHNjb3BlLnRvdGFsSXRlbXMpO1xuICAgIHJldHVybiAkc2NvcGUudG90YWxJdGVtcztcbiAgfVxuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICAgIGNhcnRUb3RhbCgpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cbiRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW1vdmUgQ1RSTCcsIGl0ZW0pXG4gIG1haW5TcnZjLnJlbW92ZUZyb21DYXJ0KGl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuJHNjb3BlLnVwZGF0ZVF1YW50aXR5ID0gKGl0ZW0pID0+IHtcbiAgJHJvb3RTY29wZS5jYXJ0VG90YWwgPSBmaW5kVG90YWxJdGVtcygpXG5cbiAgY29uc29sZS5sb2coaXRlbSlcbiAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNhcnQpO1xuICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2FydFswXS5wcm9kdWN0SWQpO1xuICAvLyBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuY2FydC5wcm9kdWN0SWQ7XG4gIG1haW5TcnZjLnVwZGF0ZVF1YW50aXR5KGl0ZW0ucHJvZHVjdElkLCBpdGVtLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn07XG5cbnZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAga2V5OiAncGtfdGVzdF82MDY1RlJNMWE0dGJ3SWlvZnpuVFNZdTQnLFxuICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICBsb2NhbGU6ICdhdXRvJyxcbiAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbiwgJHNjb3BlLnN1YnRvdGFsKjEwMCwgJHNjb3BlLmNhcnQpO1xuICB9XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAvLyBPcGVuIENoZWNrb3V0IHdpdGggZnVydGhlciBvcHRpb25zOlxuICBoYW5kbGVyLm9wZW4oe1xuICAgIG5hbWU6ICdLT01CVUNIQURPRycsXG4gICAgZGVzY3JpcHRpb246ICdBZG9wdCBIYXBwaW5lc3MnLFxuICAgIHNoaXBwaW5nQWRkcmVzczogdHJ1ZSxcbiAgICBiaWxsaW5nQWRkcmVzczogdHJ1ZSxcbiAgICB6aXBDb2RlOiB0cnVlLFxuICAgIGFtb3VudDogJHNjb3BlLnN1YnRvdGFsICogMTAwXG4gIH0pO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG59KTtcblxuLy8gQ2xvc2UgQ2hlY2tvdXQgb24gcGFnZSBuYXZpZ2F0aW9uOlxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZnVuY3Rpb24oKSB7XG4gIGhhbmRsZXIuY2xvc2UoKTtcbn0pO1xuXG5cblxuXG5cbn0pOy8vY2xvc2luZ1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlKXtcblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZURldGFpbHMoJHN0YXRlUGFyYW1zLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscy5pZCk7XG4gICAgaWYgKCRzY29wZS5kZXRhaWxzLmlkIDwgMikge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gbnVsbDtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IG51bGw7XG4gICAgfSBlbHNlIGlmICgkc2NvcGUuZGV0YWlscy5pZCA+IDMpIHtcbiAgICAgICRzY29wZS5uZXh0ID0gbnVsbDtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS5wcm9kdWN0UXVhbnRpdHkgPSAxO1xuICAkc2NvcGUuYWRkVG9DYXJ0ID0gKHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICAkcm9vdFNjb3BlLmNhcnRUb3RhbCArPSBOdW1iZXIocHJvZHVjdFF1YW50aXR5KTtcbiAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSAkc2NvcGUuZGV0YWlscy50aXRsZTtcbiAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSAkc2NvcGUuZGV0YWlscy5wcmljZTtcbiAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSAkc2NvcGUuZGV0YWlscy5pbWFnZTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuZGV0YWlscy5pZDtcblxuICAgIG1haW5TcnZjLmFkZFRvQ2FydChwcm9kdWN0VGl0bGUsIHByb2R1Y3RJbWFnZSwgcHJvZHVjdFNpemUsIHByb2R1Y3RRdWFudGl0eSwgcHJvZHVjdFByaWNlLCBwcm9kdWN0SWQpO1xuICAgICAgYWxlcnQoJ3Byb2R1Y3QgYWRkZWQgdG8gY2FydCcpO1xuICB9O1xuXG4gICRzY29wZS5jaGFuZ2VQcm9kdWN0ID0gKGRpcmVjdGlvbikgPT4ge1xuICAgIGxldCBpbmRleCA9ICRzY29wZS5kZXRhaWxzLmlkICsgTnVtYmVyKGRpcmVjdGlvbik7XG4gICAgaWYgKGluZGV4IDwgMSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzEnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaW5kZXggPiA0KXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy80Jyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoYC9tZXJjaGFuZGlzZS1kZXRhaWxzLyR7aW5kZXh9YCk7XG4gICAgfVxuICB9O1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2RvZ0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRkb2N1bWVudCkge1xuXG4gIG1haW5TcnZjLmdldFVwRm9yQWRvcHRpb24oKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kb2dzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuZG9ncyk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLm91ci1kb2dzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTU4MDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICczNi41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbiAgXG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2ZpbmRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignaG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRyb290U2NvcGUpe1xuXG5cblxuICB2YXIgdmVsb2NpdHkgPSAwLjQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5ob21lLWhlYWRlci1pbWFnZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTczMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc1MCUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuICB2YXIgaSA9IDA7XG4gIHZhciBteVZhciA9IHNldEludGVydmFsKGNoYW5nZUltYWdlLCAyMDAwKTtcblxuICBmdW5jdGlvbiBjaGFuZ2VJbWFnZSgpe1xuICAgIC8vYXJyYXkgb2YgYmFja2dyb3VuZHNcbiAgICB2YXIgYm90dGxlcyA9IFtcImdpbmdlci5qcGdcIiwgXCJoaW50LW9mLW1pbnQuanBnXCIsIFwianVzdC1rb21idWNoYS5qcGdcIiwgXCJyYXNwYmVycnkuanBnXCIsIFwid2lsZC1ibHVlLWdpbmdlci5qcGdcIiwgXCJ3aWxkLWJsdWViZXJyeS5qcGdcIl07XG4gICAgJCgnLnJpZ2h0LWNvbHVtbi1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCJpbWFnZXMva29tYnVjaGFmbGF2b3JzLycrYm90dGxlc1tpXSsnXCIpJyk7XG5cbiAgICBpZihpID09IGJvdHRsZXMubGVuZ3RoIC0xKXtcbiAgICAgICAgaSA9IDA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuIC8vIHdpbmRvdy5zZXRJbnRlcnZhbChcImNoYW5nZUltYWdlKClcIiwgNTAwMCk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignaW5kZXhDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpe1xuXG4gICRyb290U2NvcGUuY2FydFRvdGFsID0gMDtcbiAgLy8gJHJvb3RTY29wZS4kd2F0Y2goJ2NhcnRUb3RhbCcsIGZ1bmN0aW9uKCl7XG4gIC8vICAgY29uc29sZS5sb2coJ2l0IGNoYW5nZWQnKTtcbiAgLy8gICBjb25zb2xlLmxvZygkcm9vdFNjb3BlLmNhcnRUb3RhbCk7XG4gIC8vXG4gIC8vIH0pXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ21lcmNoYW5kaXNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5tZXJjaGFuZGlzZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLm1lcmNoYW5kaXNlKTtcbiAgfSlcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ3Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldERvZ1Byb2ZpbGUoJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLnByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wcm9maWxlKTtcbiAgICAkc2NvcGUuYWRvcHRlZCA9ICRzY29wZS5wcm9maWxlWzBdLmFkb3B0ZWQ7XG4gICAgICAvLyBpZiAoJHNjb3BlLnRlc3QgPT09IHRydWUpIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnQURPUFRFRCEnO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnVVAgRk9SIEFET1BUSU9OJ1xuICAgICAgLy8gfVxuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5hZG9wdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuc3VjY2Vzcy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE5MjA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNjUuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2FydG5hdicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZTogXCIoe3t0b3RhbEl0ZW1zfX0pXCIsXG4gICAgc2NvcGU6IHt9LFxuICAgIGNvbnRyb2xsZXI6ICgkc2NvcGUsIG1haW5TcnZjLCAkcm9vdFNjb3BlLCAkc3RhdGUpID0+IHtcblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goJ2NhcnRUb3RhbCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpdCBjaGFuZ2VkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUuY2FydFRvdGFsKTtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAkcm9vdFNjb3BlLmNhcnRUb3RhbFxuXG4gICAgICB9KVxuXG5cbiAgICB9XG5cbn1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjaGVja291dCcsIChtYWluU3J2YykgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dGJ0bi5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgYW1vdW50OiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgdmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICAgICAgICBrZXk6ICdwa190ZXN0XzYwNjVGUk0xYTR0YndJaW9mem5UU1l1NCcsXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gICAgICAgIGxvY2FsZTogJ2F1dG8nLFxuICAgICAgICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbilcbiAgICAgICAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgICAgICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgICAgICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgICAgICAgaGFuZGxlci5vcGVuKHtcbiAgICAgICAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgemlwQ29kZTogdHJ1ZSxcbiAgICAgICAgICBhbW91bnQ6IHNjb3BlLmFtb3VudFxuICAgICAgICB9KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBoYW5kbGVyLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnbmF2YmFyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9uYXZiYXIuaHRtbCcsXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHN0YXRlLCAkcm9vdFNjb3BlKXtcbiAgICBcbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiJdfQ==
