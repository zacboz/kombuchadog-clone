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
      console.log('SERVICE', response);
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
      console.log('SRVC item added');
    });
  };

  this.getCart = function () {
    return $http({
      method: 'GET',
      url: '/cart'
    }).then(function (response) {
      console.log('SRVC CART', response);
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

  $scope.test = 'hello';

  mainSrvc.getCart().then(function (response) {
    $scope.cart = response.data;
    console.log('Cart in controller', $scope.cart);
  });
});
'use strict';

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getMerchandiseDetails($stateParams.id).then(function (response) {
    $scope.details = response.data[0];
    // console.log('detailsCtrl', $scope.details);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJkaXJlY3RpdmVzL25hdmJhci5qcyIsImRpcmVjdGl2ZXMvc29jaWFsZm9vdGVyLmpzIiwiZGlyZWN0aXZlcy90ZWVTaGlydC5qcyIsImNvbnRyb2xsZXJzL2NhcnRDdHJsLmpzIiwiY29udHJvbGxlcnMvZGV0YWlsc0N0cmwuanMiLCJjb250cm9sbGVycy9kb2dDdHJsLmpzIiwiY29udHJvbGxlcnMvZmluZEN0cmwuanMiLCJjb250cm9sbGVycy9ob21lQ3RybC5qcyIsImNvbnRyb2xsZXJzL21lcmNoYW5kaXNlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3Byb2ZpbGVDdHJsLmpzIiwiY29udHJvbGxlcnMvc3VjY2Vzc0N0cmwuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiZ2V0QWRvcHRlZCIsImdldERvZ1Byb2ZpbGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwicHJvZHVjdCIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIiwidGVzdCIsImNhcnQiLCJkZXRhaWxzIiwidGl0bGUiLCJwcmljZSIsImltYWdlIiwiYWxlcnQiLCIkZG9jdW1lbnQiLCJkb2dzIiwidmVsb2NpdHkiLCJ1cGRhdGUiLCJwb3MiLCIkIiwid2luZG93Iiwic2Nyb2xsVG9wIiwiZWFjaCIsIiRlbGVtZW50IiwiaGVpZ2h0IiwiY3NzIiwiTWF0aCIsInJvdW5kIiwiYmluZCIsImkiLCJteVZhciIsInNldEludGVydmFsIiwiY2hhbmdlSW1hZ2UiLCJib3R0bGVzIiwibGVuZ3RoIiwibWVyY2hhbmRpc2UiLCJwcm9maWxlIiwiYWRvcHRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENBQTlCLEVBQ0dDLE1BREgsQ0FDVSxVQUFDQyxjQUFELEVBQWlCQyxrQkFBakIsRUFBd0M7QUFDNUNELG1CQUNPRSxLQURQLENBQ2EsTUFEYixFQUNvQjtBQUNaQyxhQUFJLEdBRFE7QUFFWkMscUJBQWEsbUJBRkQ7QUFHWkMsb0JBQVk7QUFIQSxLQURwQixFQU1PSCxLQU5QLENBTWEsT0FOYixFQU1xQjtBQUNYQyxhQUFJLFFBRE87QUFFWEMscUJBQWE7QUFGRixLQU5yQixFQVVPRixLQVZQLENBVWEsY0FWYixFQVU0QjtBQUNsQkMsYUFBSSxlQURjO0FBRWxCQyxxQkFBYTtBQUZLLEtBVjVCLEVBY09GLEtBZFAsQ0FjYSxVQWRiLEVBY3dCO0FBQ2RDLGFBQUksV0FEVTtBQUVkQyxxQkFBYSx1QkFGQztBQUdkQyxvQkFBWTtBQUhFLEtBZHhCLEVBbUJPSCxLQW5CUCxDQW1CYSxhQW5CYixFQW1CMkI7QUFDakJDLGFBQUksb0JBRGE7QUFFakJDLHFCQUFhLHNCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBbkIzQixFQXdCT0gsS0F4QlAsQ0F3QmEsaUJBeEJiLEVBd0IrQjtBQUNyQkMsYUFBSSxrQkFEaUI7QUFFckJDLHFCQUFhLDhCQUZRO0FBR3JCQyxvQkFBWTtBQUhTLEtBeEIvQixFQTZCT0gsS0E3QlAsQ0E2QmEsZUE3QmIsRUE2QjZCO0FBQ25CQyxhQUFJLGdCQURlO0FB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b2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NoZWNrb3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvY2hlY2tvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jaGVja291dC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2hlY2tvdXRDdHJsJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgICAgICAgICAgIC5vdGhlcndpc2UoJy8nKTtcblxuICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLnNlcnZpY2UoJ21haW5TcnZjJywgZnVuY3Rpb24oJGh0dHApIHtcblxuICB0aGlzLmdldFVwRm9yQWRvcHRpb24gPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXREb2dQcm9maWxlID0gKG5hbWUpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy8nK25hbWVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgY29uc29sZS5sb2coJ1NFUlZJQ0UnLCByZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZSA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzID0gKGlkKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UvJytpZFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5hZGRUb0NhcnQgPSAocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IHtcbiAgICAgIHByb2R1Y3RUaXRsZTogcHJvZHVjdFRpdGxlLFxuICAgICAgcHJvZHVjdEltYWdlOiBwcm9kdWN0SW1hZ2UsXG4gICAgICBwcm9kdWN0U2l6ZTogcHJvZHVjdFNpemUsXG4gICAgICBwcm9kdWN0UXVhbnRpdHk6IHByb2R1Y3RRdWFudGl0eSxcbiAgICAgIHByb2R1Y3RQcmljZTogcHJvZHVjdFByaWNlLFxuICAgICAgcHJvZHVjdElkOiBwcm9kdWN0SWRcbiAgICB9XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NhcnQnLFxuICAgICAgZGF0YTogaXRlbVxuICAgIH0pLnN1Y2Nlc3MoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgaXRlbSBhZGRlZCcpXG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQnLFxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQyBDQVJUJywgcmVzcG9uc2UpXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSlcbiAgfVxuXG5cblxuXG5cbn0pO1xuIiwiLy8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbi8vICAgLy8gaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjYpIHtcbi8vICAgICAvLyBmaW5kIHRoZSBzY3JvbGwgYW5kIHVzZSB0aGlzIHZhcmlhYmxlIHRvIG1vdmUgZWxlbWVudHNcbi8vICAgICB2YXIgd2luU2Nyb2xsID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcbi8vICAgICAvLyBjb25zb2xlLmxvZyh3aW5TY3JvbGwpO1xuLy8gICAgIC8vIGNlbnRlciBtb3ZlcyBkb3duIG9uIHRoZSB5LWF4aXMgb24gc2Nyb2xsXG4vL1xuLy8gICAgICQoJyNkb2ctYmFubmVyJykuY3NzKHtcbi8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIHdpblNjcm9sbCAvNTAgKyclKSdcbi8vICAgICB9KTtcbi8vICAgLy8gfVxuLy8gfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignY2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gICRzY29wZS50ZXN0ID0gJ2hlbGxvJztcblxuICBtYWluU3J2Yy5nZXRDYXJ0KCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuY2FydCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJ0NhcnQgaW4gY29udHJvbGxlcicsICRzY29wZS5jYXJ0KTtcbiAgfSk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGFbMF07XG4gICAgLy8gY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMpO1xuICB9KTtcblxuICAkc2NvcGUucHJvZHVjdFF1YW50aXR5ID0gMTtcbiAgJHNjb3BlLmFkZFRvQ2FydCA9IChwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5KSA9PiB7XG4gICAgY29uc3QgcHJvZHVjdFRpdGxlID0gJHNjb3BlLmRldGFpbHMudGl0bGU7XG4gICAgY29uc3QgcHJvZHVjdFByaWNlID0gJHNjb3BlLmRldGFpbHMucHJpY2U7XG4gICAgY29uc3QgcHJvZHVjdEltYWdlID0gJHNjb3BlLmRldGFpbHMuaW1hZ2U7XG4gICAgY29uc3QgcHJvZHVjdElkID0gJHNjb3BlLmRldGFpbHMuaWQ7XG5cbiAgICBtYWluU3J2Yy5hZGRUb0NhcnQocHJvZHVjdFRpdGxlLCBwcm9kdWN0SW1hZ2UsIHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHksIHByb2R1Y3RQcmljZSwgcHJvZHVjdElkKTtcbiAgICAgIGFsZXJ0KCdwcm9kdWN0IGFkZGVkIHRvIGNhcnQnKTtcbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zLCAkZG9jdW1lbnQpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5vdXItZG9ncy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE1ODA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnMzYuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5ob21lLWhlYWRlci1pbWFnZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTczMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc1MCUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuICB2YXIgaSA9IDA7XG4gIHZhciBteVZhciA9IHNldEludGVydmFsKGNoYW5nZUltYWdlLCAyMDAwKTtcblxuICBmdW5jdGlvbiBjaGFuZ2VJbWFnZSgpe1xuICAgIC8vYXJyYXkgb2YgYmFja2dyb3VuZHNcbiAgICB2YXIgYm90dGxlcyA9IFtcImdpbmdlci5qcGdcIiwgXCJoaW50LW9mLW1pbnQuanBnXCIsIFwianVzdC1rb21idWNoYS5qcGdcIiwgXCJyYXNwYmVycnkuanBnXCIsIFwid2lsZC1ibHVlLWdpbmdlci5qcGdcIiwgXCJ3aWxkLWJsdWViZXJyeS5qcGdcIl07XG4gICAgJCgnLnJpZ2h0LWNvbHVtbi1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCJpbWFnZXMva29tYnVjaGFmbGF2b3JzLycrYm90dGxlc1tpXSsnXCIpJyk7XG5cbiAgICBpZihpID09IGJvdHRsZXMubGVuZ3RoIC0xKXtcbiAgICAgICAgaSA9IDA7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIGkrKztcbiAgICB9XG4gIH1cblxuIC8vIHdpbmRvdy5zZXRJbnRlcnZhbChcImNoYW5nZUltYWdlKClcIiwgNTAwMCk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignbWVyY2hhbmRpc2VDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgJHNjb3BlLm1lcmNoYW5kaXNlID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUubWVyY2hhbmRpc2UpO1xuICB9KVxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcigncHJvZmlsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0RG9nUHJvZmlsZSgkc3RhdGVQYXJhbXMubmFtZSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUucHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgLy8gY29uc29sZS5sb2coJHNjb3BlLnByb2ZpbGUpO1xuICAgICRzY29wZS5hZG9wdGVkID0gJHNjb3BlLnByb2ZpbGVbMF0uYWRvcHRlZDtcbiAgICAgIC8vIGlmICgkc2NvcGUudGVzdCA9PT0gdHJ1ZSkge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdBRE9QVEVEISc7XG4gICAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gICAkc2NvcGUuYWRvcHRlZCA9ICdVUCBGT1IgQURPUFRJT04nXG4gICAgICAvLyB9XG4gIH0pO1xuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignc3VjY2Vzc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRBZG9wdGVkKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuYWRvcHRlZCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmFkb3B0ZWQpO1xuICB9KTtcblxuICB2YXIgdmVsb2NpdHkgPSAwLjI7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCl7XG4gIHZhciBwb3MgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICQoJy5zdWNjZXNzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTkyMDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICc2NS41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbn0pO1xuIl19
