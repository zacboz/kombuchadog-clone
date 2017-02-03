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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9jaGVja291dC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiLCJkaXJlY3RpdmVzL3RlZVNoaXJ0LmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJjb25maWciLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsInN0YXRlIiwidXJsIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwib3RoZXJ3aXNlIiwic2VydmljZSIsIiRodHRwIiwiZ2V0VXBGb3JBZG9wdGlvbiIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsImdldEFkb3B0ZWQiLCJnZXREb2dQcm9maWxlIiwibmFtZSIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJyZW1vdmVGcm9tQ2FydCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVRdWFudGl0eSIsInByb2R1Y3QiLCJwb3N0T3JkZXIiLCJ0b2tlbiIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwic3VidG90YWwiLCJjYXJ0IiwiY2FydFRvdGFsIiwibGVuZ3RoIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJpbmRleCIsInBhcnNlSW50IiwiY2F0Y2giLCJlcnIiLCIkbG9jYXRpb24iLCJkZXRhaWxzIiwicHJldmlvdXMiLCJuZXh0Iiwic2xhc2giLCJ0aXRsZSIsInByaWNlIiwiaW1hZ2UiLCJhbGVydCIsImNoYW5nZVByb2R1Y3QiLCJkaXJlY3Rpb24iLCJOdW1iZXIiLCJwYXRoIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsIndpbmRvdyIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJpIiwibXlWYXIiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwiYW1vdW50IiwibGluayIsImF0dHJzIiwiaGFuZGxlciIsIlN0cmlwZUNoZWNrb3V0IiwiY29uZmlndXJlIiwia2V5IiwibG9jYWxlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwib3BlbiIsImRlc2NyaXB0aW9uIiwic2hpcHBpbmdBZGRyZXNzIiwiYmlsbGluZ0FkZHJlc3MiLCJ6aXBDb2RlIiwicHJldmVudERlZmF1bHQiLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENBQTlCLEVBQ0dDLE1BREgsQ0FDVSxVQUFDQyxjQUFELEVBQWlCQyxrQkFBakIsRUFBd0M7QUFDNUNELG1CQUNPRSxLQURQLENBQ2EsTUFEYixFQUNvQjtBQUNaQyxhQUFJLEdBRFE7QUFFWkMscUJBQWEsbUJBRkQ7QUFHWkMsb0JBQVk7QUFIQSxLQURwQixFQU1PSCxLQU5Q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Q0FBZSxhQUFmLEVBQThCd0YsU0FBOUIsQ0FBd0MsY0FBeEMsRUFBd0QsWUFBTTtBQUM1RCxTQUFPO0FBQ0xsRixpQkFBYTtBQURSLEdBQVA7QUFHRCxDQUpEOzs7QUNBQVAsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEJ3RixTQUE5QixDQUF3QyxVQUF4QyxFQUFvRCxZQUFNO0FBQ3hELFNBQU87QUFDTEMsY0FBVSxJQURMO0FBRUxDLFdBQU87QUFDTHRELGVBQVM7QUFESixLQUZGO0FBS0w5QixpQkFBYTtBQUxSLEdBQVA7QUFPRCxDQVJEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycsIFsndWkucm91dGVyJ10pXG4gIC5jb25maWcoKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpID0+IHtcbiAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLHtcbiAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdob21lQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Fib3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvYWJvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9hYm91dC5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWtvbWJ1Y2hhLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXItZG9ncycse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1kb2dzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWRvZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RvZ0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdkb2ctcHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL2RvZy1wcm9maWxlLzpuYW1lJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvcHJvZmlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncHJvZmlsZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdzdWNjZXNzLXN0b3JpZXMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9zdWNjZXNzLXN0b3JpZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9zdWNjZXNzLXN0b3JpZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3N1Y2Nlc3NDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZmluZC1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL2ZpbmQta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9maW5kLWtvbWJ1Y2hhLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdmaW5kQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbWVyY2hhbmRpc2VDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UtZGV0YWlscycse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlLWRldGFpbHMvOmlkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UtZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZGV0YWlsc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdjYXJ0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2FydCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NhcnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NhcnRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2hlY2tvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jaGVja291dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2NoZWNrb3V0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjaGVja291dEN0cmwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWRvcHRlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdWNjZXNzLXN0b3JpZXMtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldERvZ1Byb2ZpbGUgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLycrbmFtZVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU0VSVklDRScsIHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZURldGFpbHMgPSAoaWQpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmFkZFRvQ2FydCA9IChwcm9kdWN0VGl0bGUsIHByb2R1Y3RJbWFnZSwgcHJvZHVjdFNpemUsIHByb2R1Y3RRdWFudGl0eSwgcHJvZHVjdFByaWNlLCBwcm9kdWN0SWQpID0+IHtcbiAgICBsZXQgaXRlbSA9IHtcbiAgICAgIHByb2R1Y3RUaXRsZTogcHJvZHVjdFRpdGxlLFxuICAgICAgcHJvZHVjdEltYWdlOiBwcm9kdWN0SW1hZ2UsXG4gICAgICBwcm9kdWN0U2l6ZTogcHJvZHVjdFNpemUsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eSxcbiAgICAgIHByb2R1Y3RQcmljZTogcHJvZHVjdFByaWNlLFxuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWRcbiAgICB9XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NhcnQnLFxuICAgICAgZGF0YTogaXRlbVxuICAgIH0pLnN1Y2Nlc3MoKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1NSVkMgaXRlbSBhZGRlZCcpXG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTUlZDIENBUlQnLCByZXNwb25zZSlcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgICBsZXQgaWQgPSBpdGVtLnByb2R1Y3RJZFxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiAnL2NhcnQvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWRSBSRU1PVkUgRlJPTSBDQVJUJywgcmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMudXBkYXRlUXVhbnRpdHkgPSAocHJvZHVjdElkLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICBsZXQgcHJvZHVjdCA9IHtcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHlcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1NSVkMgcHJvZHVjdCcsIHByb2R1Y3QpO1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgdXJsOiAnL2NhcnQvJytwcm9kdWN0SWQsXG4gICAgICBkYXRhOiBwcm9kdWN0XG4gICAgfSkuc3VjY2VzcygocmVzcG9uc2UpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDIFVQREFUSU5HJywgcmVzcG9uc2UpO1xuICAgIH0pXG4gIH07XG5cbiAgdGhpcy5wb3N0T3JkZXIgPSAodG9rZW4pID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvb3JkZXInLFxuICAgICAgZGF0YTogdG9rZW5cbiAgICB9KS5zdWNjZXNzKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgdG9rZW4nLCByZXNwb25zZSk7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cblxuXG59KTtcbiIsIi8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4vLyAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI2KSB7XG4vLyAgICAgLy8gZmluZCB0aGUgc2Nyb2xsIGFuZCB1c2UgdGhpcyB2YXJpYWJsZSB0byBtb3ZlIGVsZW1lbnRzXG4vLyAgICAgdmFyIHdpblNjcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG4vLyAgICAgLy8gY29uc29sZS5sb2cod2luU2Nyb2xsKTtcbi8vICAgICAvLyBjZW50ZXIgbW92ZXMgZG93biBvbiB0aGUgeS1heGlzIG9uIHNjcm9sbFxuLy9cbi8vICAgICAkKCcjZG9nLWJhbm5lcicpLmNzcyh7XG4vLyAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwcHgsIC0nKyB3aW5TY3JvbGwgLzUwICsnJSknXG4vLyAgICAgfSk7XG4vLyAgIC8vIH1cbi8vIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdjYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiAgJHNjb3BlLnN1YnRvdGFsID0gMDtcbiAgJHNjb3BlLmNhcnQ7XG5cbiAgbGV0IGNhcnRUb3RhbCA9ICgpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygncnVubmluZyBjYXJ0VG90YWwnLCAkc2NvcGUuY2FydCk7XG4gICAgaWYgKCEkc2NvcGUuY2FydCB8fCAkc2NvcGUuY2FydC5sZW5ndGggPT09IDApIHtcbiAgICAgICRzY29wZS5jYXJ0ID0gW107XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAkc2NvcGUuY2FydC5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgJHNjb3BlLnN1YnRvdGFsICs9IHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFByaWNlKSAqIHBhcnNlSW50KGVsZW1lbnQucHJvZHVjdFF1YW50aXR5KTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmNhcnQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCdDYXJ0IGluIGNvbnRyb2xsZXInLCAkc2NvcGUuY2FydCk7XG4gICAgY2FydFRvdGFsKCk7XG4gIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9KTtcblxuJHNjb3BlLnJlbW92ZUZyb21DYXJ0ID0gKGl0ZW0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbW92ZSBDVFJMJywgaXRlbSlcbiAgbWFpblNydmMucmVtb3ZlRnJvbUNhcnQoaXRlbSkudGhlbigoKSA9PiB7XG4gICAgbWFpblNydmMuZ2V0Q2FydCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAkc2NvcGUuc3VidG90YWwgPSAwO1xuICAgICAgY2FydFRvdGFsKCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4kc2NvcGUudXBkYXRlUXVhbnRpdHkgPSAoaXRlbSkgPT4ge1xuICBjb25zb2xlLmxvZyhpdGVtKVxuICAvLyBjb25zb2xlLmxvZygkc2NvcGUuY2FydCk7XG4gIC8vIGNvbnNvbGUubG9nKCRzY29wZS5jYXJ0WzBdLnByb2R1Y3RJZCk7XG4gIC8vIGNvbnN0IHByb2R1Y3RJZCA9ICRzY29wZS5jYXJ0LnByb2R1Y3RJZDtcbiAgbWFpblNydmMudXBkYXRlUXVhbnRpdHkoaXRlbS5wcm9kdWN0SWQsIGl0ZW0ucHJvZHVjdFF1YW50aXR5KTtcbiAgICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICRzY29wZS5zdWJ0b3RhbCA9IDA7XG4gICAgICBjYXJ0VG90YWwoKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufTtcblxuXG5cblxuXG59KTsvL2Nsb3NpbmdcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbil7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMuaWQpO1xuICAgIGlmICgkc2NvcGUuZGV0YWlscy5pZCA8IDIpIHtcbiAgICAgICRzY29wZS5wcmV2aW91cyA9IG51bGw7XG4gICAgICAkc2NvcGUubmV4dCA9IHRydWU7XG4gICAgICAkc2NvcGUuc2xhc2ggPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoJHNjb3BlLmRldGFpbHMuaWQgPiAzKSB7XG4gICAgICAkc2NvcGUubmV4dCA9IG51bGw7XG4gICAgICAkc2NvcGUucHJldmlvdXMgPSB0cnVlO1xuICAgICAgJHNjb3BlLnNsYXNoID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgJHNjb3BlLnByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICRzY29wZS5uZXh0ID0gdHJ1ZTtcbiAgICAgICRzY29wZS5zbGFzaCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG5cbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgICAgIGFsZXJ0KCdwcm9kdWN0IGFkZGVkIHRvIGNhcnQnKTtcbiAgfTtcblxuICAkc2NvcGUuY2hhbmdlUHJvZHVjdCA9IChkaXJlY3Rpb24pID0+IHtcbiAgICBsZXQgaW5kZXggPSAkc2NvcGUuZGV0YWlscy5pZCArIE51bWJlcihkaXJlY3Rpb24pO1xuICAgIGlmIChpbmRleCA8IDEpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbWVyY2hhbmRpc2UtZGV0YWlscy8xJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGluZGV4ID4gNCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL21lcmNoYW5kaXNlLWRldGFpbHMvNCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKGAvbWVyY2hhbmRpc2UtZGV0YWlscy8ke2luZGV4fWApO1xuICAgIH1cbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5ob21lLWhlYWRlci1pbWFnZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTczMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc1MCUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuICB2YXIgaSA9IDA7XG4gIHZhciBteVZhciA9IHNldEludGVydmFsKGNoYW5nZUltYWdlLCAyMDAwKTtcblxuICBmdW5jdGlvbiBjaGFuZ2VJbWFnZSgpe1xuICAgIC8vYXJyYXkgb2YgYmFja2dyb3VuZHNcbiAgICB2YXIgYm90dGxlcyA9IFtcImdpbmdlci5qcGdcIiwgXCJoaW50LW9mLW1pbnQuanBnXCIsIFwianVzdC1rb21idWNoYS5qcGdcIiwgXCJyYXNwYmVycnkuanBnXCIsIFwid2lsZC1ibHVlLWdpbmdlci5qcGdcIiwgXCJ3aWxkLWJsdWViZXJyeS5qcGdcIl07XG4gICAgJCgnLnJpZ2h0LWNvbHVtbi1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCJpbWFnZXMva29tYnVjaGFmbGF2b3JzLycrYm90dGxlc1tpXSsnXCIpJyk7XG5cbiAgICBpZihpID09IGJvdHRsZXMubGVuZ3RoIC0xKXtcbiAgICAgICAgaSA9IDA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuIC8vIHdpbmRvdy5zZXRJbnRlcnZhbChcImNoYW5nZUltYWdlKClcIiwgNTAwMCk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignbWVyY2hhbmRpc2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLm1lcmNoYW5kaXNlID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUubWVyY2hhbmRpc2UpO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnByb2ZpbGUpO1xuICAgICRzY29wZS5hZG9wdGVkID0gJHNjb3BlLnByb2ZpbGVbMF0uYWRvcHRlZDtcbiAgICAgIC8vIGlmICgkc2NvcGUudGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdBRE9QVEVEISc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdVUCBGT1IgQURPUFRJT04nXG4gICAgICAvLyB9XG4gIH0pO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignc3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRBZG9wdGVkKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuYWRvcHRlZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmFkb3B0ZWQpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdjaGVja291dCcsIChtYWluU3J2YykgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dGJ0bi5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgYW1vdW50OiAnPSdcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgdmFyIGhhbmRsZXIgPSBTdHJpcGVDaGVja291dC5jb25maWd1cmUoe1xuICAgICAgICBrZXk6ICdwa190ZXN0XzZwUk5BU0NvQk9LdElzaEZlUWQ0WE1VaCcsXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9zdHJpcGUuY29tL2ltZy9kb2N1bWVudGF0aW9uL2NoZWNrb3V0L21hcmtldHBsYWNlLnBuZycsXG4gICAgICAgIGxvY2FsZTogJ2F1dG8nLFxuICAgICAgICB0b2tlbjogZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbilcbiAgICAgICAgICAvLyBZb3UgY2FuIGFjY2VzcyB0aGUgdG9rZW4gSUQgd2l0aCBgdG9rZW4uaWRgLlxuICAgICAgICAgIC8vIEdldCB0aGUgdG9rZW4gSUQgdG8geW91ciBzZXJ2ZXItc2lkZSBjb2RlIGZvciB1c2UuXG4gICAgICAgICAgbWFpblNydmMucG9zdE9yZGVyKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b21idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy8gT3BlbiBDaGVja291dCB3aXRoIGZ1cnRoZXIgb3B0aW9uczpcbiAgICAgICAgaGFuZGxlci5vcGVuKHtcbiAgICAgICAgICBuYW1lOiAnS09NQlVDSEFET0cnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQWRvcHQgSGFwcGluZXNzJyxcbiAgICAgICAgICBzaGlwcGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgYmlsbGluZ0FkZHJlc3M6IHRydWUsXG4gICAgICAgICAgemlwQ29kZTogdHJ1ZSxcbiAgICAgICAgICBhbW91bnQ6IHNjb3BlLmFtb3VudCAqIDEwMFxuICAgICAgICB9KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIENsb3NlIENoZWNrb3V0IG9uIHBhZ2UgbmF2aWdhdGlvbjpcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBoYW5kbGVyLmNsb3NlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnbmF2YmFyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9uYXZiYXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdzb2NpYWxGb290ZXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Zvb3Rlci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3RlZVNoaXJ0JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9kdWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90ZWUtc2hpcnQuaHRtbCdcbiAgfTtcbn0pO1xuIl19
