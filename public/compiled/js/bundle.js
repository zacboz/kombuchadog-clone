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

  this.postOrder = function (token) {
    return $http({
      method: 'POST',
      url: '/order',
      data: token
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
        key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
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
          amount: scope.amount * 100
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
}); //closing
'use strict';

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams, $location) {

  mainSrvc.getMerchandiseDetails($stateParams.id).then(function (response) {
    $scope.details = response.data[0];
    console.log('detailsCtrl', $scope.details.id);
    if ($scope.details.id < 2) {
      $scope.previous = null;
      $scope.next = true;
    } else if ($scope.details.id > 3) {
      $scope.next = null;
      $scope.previous = true;
    } else {
      $scope.previous = true;
      $scope.next = true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL2NoZWNrb3V0LmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsImRpcmVjdGl2ZSIsIm1haW5TcnZjIiwicmVzdHJpY3QiLCJzY29wZSIsImFtb3VudCIsImxpbmsiLCJlbGVtZW50IiwiYXR0cnMiLCJoYW5kbGVyIiwiU3RyaXBlQ2hlY2tvdXQiLCJjb25maWd1cmUiLCJrZXkiLCJpbWFnZSIsImxvY2FsZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIm9wZW4iLCJkZXNjcmlwdGlvbiIsInNoaXBwaW5nQWRkcmVzcyIsImJpbGxpbmdBZGRyZXNzIiwiemlwQ29kZSIsInByZXZlbnREZWZhdWx0Iiwid2luZG93IiwiY2xvc2UiLCIkc2NvcGUiLCIkc3RhdGVQYXJhbXMiLCJzdWJ0b3RhbCIsImNhcnQiLCJjYXJ0VG90YWwiLCJsZW5ndGgiLCJmb3JFYWNoIiwiaW5kZXgiLCJwYXJzZUludCIsImNhdGNoIiwiZXJyIiwiJGxvY2F0aW9uIiwiZGV0YWlscyIsInByZXZpb3VzIiwibmV4dCIsInRpdGxlIiwicHJpY2UiLCJhbGVydCIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJOdW1iZXIiLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJpIiwibXlWYXIiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENBQUMsV0FBRCxDQUE5QixFQUNHQyxNQURILENBQ1UsVUFBQ0MsY0FBRCxFQUFpQkMsa0JBQWpCLEVBQXdDO0FBQzVDRCxtQkFDT0UsS0FEUCxDQUNhLE1BRGIsRUFDb0I7QUFDWkMsYUFBSSxHQURRO0FBRVpDLHFCQUFhLG1CQUZEO0FBR1pDLG9CQUFZO0FBSEEsS0FEcEIsRUFNT0gsS0FOUCxDQU1hLE9B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QUUsSUFBRixFQUFRSyxHQUFSLENBQVksb0JBQVosRUFBa0MsV0FBV0MsS0FBS0MsS0FBTCxDQUFXLENBQUNILFNBQVNMLEdBQVYsSUFBaUJGLFFBQTVCLENBQVgsR0FBb0QsSUFBdEY7QUFDQSxLQUxIO0FBTUc7O0FBRUhHLElBQUU3QixNQUFGLEVBQVVxQyxJQUFWLENBQWUsUUFBZixFQUF5QlYsTUFBekI7QUFHRCxDQXRCRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gICAgbGV0IGlkID0gaXRlbS5wcm9kdWN0SWRcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogJy9jYXJ0LycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkUgUkVNT1ZFIEZST00gQ0FSVCcsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnVwZGF0ZVF1YW50aXR5ID0gKHByb2R1Y3RJZCwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgbGV0IHByb2R1Y3QgPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHByb2R1Y3RRdWFudGl0eTogcHJvZHVjdFF1YW50aXR5XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTUlZDIHByb2R1Y3QnLCBwcm9kdWN0KTtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogJy9jYXJ0LycrcHJvZHVjdElkLFxuICAgICAgZGF0YTogcHJvZHVjdFxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBVUERBVElORycsIHJlc3BvbnNlKTtcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucG9zdE9yZGVyID0gKHRva2VuKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL29yZGVyJyxcbiAgICAgIGRhdGE6IHRva2VuXG4gICAgfSkuc3VjY2VzcygocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDIHRva2VuJywgcmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG5cblxufSk7XG4iLCIvLyAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuLy8gICAvLyBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gMTAyNikge1xuLy8gICAgIC8vIGZpbmQgdGhlIHNjcm9sbCBhbmQgdXNlIHRoaXMgdmFyaWFibGUgdG8gbW92ZSBlbGVtZW50c1xuLy8gICAgIHZhciB3aW5TY3JvbGwgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKHdpblNjcm9sbCk7XG4vLyAgICAgLy8gY2VudGVyIG1vdmVzIGRvd24gb24gdGhlIHktYXhpcyBvbiBzY3JvbGxcbi8vXG4vLyAgICAgJCgnI2RvZy1iYW5uZXInKS5jc3Moe1xuLy8gICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoMHB4LCAtJysgd2luU2Nyb2xsIC81MCArJyUpJ1xuLy8gICAgIH0pO1xuLy8gICAvLyB9XG4vLyB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnY2hlY2tvdXQnLCAobWFpblNydmMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2hlY2tvdXRidG4uaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFtb3VudDogJz0nXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHZhciBoYW5kbGVyID0gU3RyaXBlQ2hlY2tvdXQuY29uZmlndXJlKHtcbiAgICAgICAga2V5OiAncGtfdGVzdF82cFJOQVNDb0JPS3RJc2hGZVFkNFhNVWgnLFxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vc3RyaXBlLmNvbS9pbWcvZG9jdW1lbnRhdGlvbi9jaGVja291dC9tYXJrZXRwbGFjZS5wbmcnLFxuICAgICAgICBsb2NhbGU6ICdhdXRvJyxcbiAgICAgICAgdG9rZW46IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgY29uc29sZS5sb2codG9rZW4pXG4gICAgICAgICAgLy8gWW91IGNhbiBhY2Nlc3MgdGhlIHRva2VuIElEIHdpdGggYHRva2VuLmlkYC5cbiAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIElEIHRvIHlvdXIgc2VydmVyLXNpZGUgY29kZSBmb3IgdXNlLlxuICAgICAgICAgIG1haW5TcnZjLnBvc3RPcmRlcih0b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIE9wZW4gQ2hlY2tvdXQgd2l0aCBmdXJ0aGVyIG9wdGlvbnM6XG4gICAgICAgIGhhbmRsZXIub3Blbih7XG4gICAgICAgICAgbmFtZTogJ0tPTUJVQ0hBRE9HJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Fkb3B0IEhhcHBpbmVzcycsXG4gICAgICAgICAgc2hpcHBpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIGJpbGxpbmdBZGRyZXNzOiB0cnVlLFxuICAgICAgICAgIHppcENvZGU6IHRydWUsXG4gICAgICAgICAgYW1vdW50OiBzY29wZS5hbW91bnQgKiAxMDBcbiAgICAgICAgfSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDbG9zZSBDaGVja291dCBvbiBwYWdlIG5hdmlnYXRpb246XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFuZGxlci5jbG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignY2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICRzY29wZS5jYXJ0O1xuXG4gIGxldCBjYXJ0VG90YWwgPSAoKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJ3J1bm5pbmcgY2FydFRvdGFsJywgJHNjb3BlLmNhcnQpO1xuICAgIGlmICghJHNjb3BlLmNhcnQgfHwgJHNjb3BlLmNhcnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAkc2NvcGUuY2FydCA9IFtdO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLmNhcnQuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICRzY29wZS5zdWJ0b3RhbCArPSBwYXJzZUludChlbGVtZW50LnByb2R1Y3RQcmljZSkgKiBwYXJzZUludChlbGVtZW50LnByb2R1Y3RRdWFudGl0eSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICAgIGNhcnRUb3RhbCgpO1xuICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfSk7XG5cbiRzY29wZS5yZW1vdmVGcm9tQ2FydCA9IChpdGVtKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW1vdmUgQ1RSTCcsIGl0ZW0pXG4gIG1haW5TcnZjLnJlbW92ZUZyb21DYXJ0KGl0ZW0pLnRoZW4oKCkgPT4ge1xuICAgIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgICAgIGNhcnRUb3RhbCgpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuJHNjb3BlLnVwZGF0ZVF1YW50aXR5ID0gKGl0ZW0pID0+IHtcbiAgY29uc29sZS5sb2coaXRlbSlcbiAgLy8gY29uc29sZS5sb2coJHNjb3BlLmNhcnQpO1xuICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2FydFswXS5wcm9kdWN0SWQpO1xuICAvLyBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuY2FydC5wcm9kdWN0SWQ7XG4gIG1haW5TcnZjLnVwZGF0ZVF1YW50aXR5KGl0ZW0ucHJvZHVjdElkLCBpdGVtLnByb2R1Y3RRdWFudGl0eSk7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbn07XG5cblxuXG5cblxufSk7Ly9jbG9zaW5nXG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2RldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkbG9jYXRpb24pe1xuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlRGV0YWlscygkc3RhdGVQYXJhbXMuaWQpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRldGFpbHMgPSByZXNwb25zZS5kYXRhWzBdO1xuICAgIGNvbnNvbGUubG9nKCdkZXRhaWxzQ3RybCcsICRzY29wZS5kZXRhaWxzLmlkKTtcbiAgICBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPCAyKSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSBudWxsO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLm5leHQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgJHNjb3BlLnByb2R1Y3RRdWFudGl0eSA9IDE7XG4gICRzY29wZS5hZGRUb0NhcnQgPSAocHJvZHVjdFNpemUsIHByb2R1Y3RRdWFudGl0eSkgPT4ge1xuICAgIGNvbnN0IHByb2R1Y3RUaXRsZSA9ICRzY29wZS5kZXRhaWxzLnRpdGxlO1xuICAgIGNvbnN0IHByb2R1Y3RQcmljZSA9ICRzY29wZS5kZXRhaWxzLnByaWNlO1xuICAgIGNvbnN0IHByb2R1Y3RJbWFnZSA9ICRzY29wZS5kZXRhaWxzLmltYWdlO1xuICAgIGNvbnN0IHByb2R1Y3RJZCA9ICRzY29wZS5kZXRhaWxzLmlkO1xuXG4gICAgbWFpblNydmMuYWRkVG9DYXJ0KHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCk7XG4gICAgICBhbGVydCgncHJvZHVjdCBhZGRlZCB0byBjYXJ0Jyk7XG4gIH07XG5cbiAgJHNjb3BlLmNoYW5nZVByb2R1Y3QgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgbGV0IGluZGV4ID0gJHNjb3BlLmRldGFpbHMuaWQgKyBOdW1iZXIoZGlyZWN0aW9uKTtcbiAgICBpZiAoaW5kZXggPCAxKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvMScpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpbmRleCA+IDQpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9tZXJjaGFuZGlzZS1kZXRhaWxzLzQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkbG9jYXRpb24ucGF0aChgL21lcmNoYW5kaXNlLWRldGFpbHMvJHtpbmRleH1gKTtcbiAgICB9XG4gIH07XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcywgJGRvY3VtZW50KSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5kb2dzKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcub3VyLWRvZ3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNTgwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzM2LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxuICBcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZmluZEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe30pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdob21lQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC40O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuaG9tZS1oZWFkZXItaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE3MzA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNTAlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cbiAgdmFyIGkgPSAwO1xuICB2YXIgbXlWYXIgPSBzZXRJbnRlcnZhbChjaGFuZ2VJbWFnZSwgMjAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlSW1hZ2UoKXtcbiAgICAvL2FycmF5IG9mIGJhY2tncm91bmRzXG4gICAgdmFyIGJvdHRsZXMgPSBbXCJnaW5nZXIuanBnXCIsIFwiaGludC1vZi1taW50LmpwZ1wiLCBcImp1c3Qta29tYnVjaGEuanBnXCIsIFwicmFzcGJlcnJ5LmpwZ1wiLCBcIndpbGQtYmx1ZS1naW5nZXIuanBnXCIsIFwid2lsZC1ibHVlYmVycnkuanBnXCJdO1xuICAgICQoJy5yaWdodC1jb2x1bW4taW1hZ2UnKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiaW1hZ2VzL2tvbWJ1Y2hhZmxhdm9ycy8nK2JvdHRsZXNbaV0rJ1wiKScpO1xuXG4gICAgaWYoaSA9PSBib3R0bGVzLmxlbmd0aCAtMSl7XG4gICAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAvLyB3aW5kb3cuc2V0SW50ZXJ2YWwoXCJjaGFuZ2VJbWFnZSgpXCIsIDUwMDApO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ21lcmNoYW5kaXNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5tZXJjaGFuZGlzZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLm1lcmNoYW5kaXNlKTtcbiAgfSlcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ3Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldERvZ1Byb2ZpbGUoJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLnByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wcm9maWxlKTtcbiAgICAkc2NvcGUuYWRvcHRlZCA9ICRzY29wZS5wcm9maWxlWzBdLmFkb3B0ZWQ7XG4gICAgICAvLyBpZiAoJHNjb3BlLnRlc3QgPT09IHRydWUpIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnQURPUFRFRCEnO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnVVAgRk9SIEFET1BUSU9OJ1xuICAgICAgLy8gfVxuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5hZG9wdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuc3VjY2Vzcy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE5MjA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNjUuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG59KTtcbiJdfQ==
