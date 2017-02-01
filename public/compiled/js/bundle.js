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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiZ2V0QWRvcHRlZCIsImdldERvZ1Byb2ZpbGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0VGl0bGUiLCJwcm9kdWN0SW1hZ2UiLCJwcm9kdWN0U2l6ZSIsInByb2R1Y3RRdWFudGl0eSIsInByb2R1Y3RQcmljZSIsInByb2R1Y3RJZCIsIml0ZW0iLCJkYXRhIiwic3VjY2VzcyIsImdldENhcnQiLCIkc2NvcGUiLCJtYWluU3J2YyIsIiRzdGF0ZVBhcmFtcyIsInRlc3QiLCJjYXJ0IiwiZGV0YWlscyIsInRpdGxlIiwicHJpY2UiLCJpbWFnZSIsImFsZXJ0IiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsIndpbmRvdyIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJpIiwibXlWYXIiLCJzZXRJbnRlcnZhbCIsImNoYW5nZUltYWdlIiwiYm90dGxlcyIsImxlbmd0aCIsIm1lcmNoYW5kaXNlIiwicHJvZmlsZSIsImFkb3B0ZWQiLCJkaXJlY3RpdmUiLCJyZXN0cmljdCIsInNjb3BlIiwicHJvZHVjdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENBQTlCLEVBQ0dDLE1BREgsQ0FDVSxVQUFDQyxjQUFELEVBQWlCQyxrQkFBakIsRUFBd0M7QUFDNUNELG1CQUNPRSxLQURQLENBQ2EsTUFEYixFQUNvQjtBQUNaQyxhQUFJLEdBRFE7QUFFWkMscUJBQWEsbUJBRkQ7QUFHWkMsb0JBQVk7QUFIQSxLQURwQixFQU1PSCxLQU5QLENBTWEsT0FOYixFQU1xQjtBQUNYQyxhQUFJLFFBRE87QUFFWEMscUJBQWE7QUFGRixLQU5yQixFQVVPRixLQVZQLENBVWEsY0FWYixFQVU0QjtBQUNsQkMsYUFBSSxlQURjO0FBRWxCQyxxQkFBYTtBQUZLLEtBVjVCLEVBY09GLEtBZFAsQ0FjYSxVQWRiLEVBY3dCO0FBQ2RDLGFBQUksV0FEVTtBQUVkQyxxQkFBYSx1QkFGQztBQUdkQyxvQkFBWTtBQUhFLEtBZHhCLEVBbUJPSCxLQW5CUCxDQW1CYSxhQW5CYixFQW1CMkI7QUFDakJDLGFBQUksb0JBRGE7QUFFakJDLHFCQUFhLHNCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBbkIzQixFQXdCT0gsS0F4QlAsQ0F3QmEsaUJBeEJiLEVBd0IrQjtBQUNyQkMsYUFBSSxrQkFEaUI7QUFFckJDLHFCQUFhLDhCQUZRO0FBR3JCQyxvQkFBWTtBQUhTLEtBeEIvQixFQTZCT0gsS0E3QlAsQ0E2QmEsZUE3QmIsRUE2QjZCO0FBQ25CQyxhQUFJLGdCQURlO0FB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QUFDakIsUUFBSUMsTUFBTUMsRUFBRUMsTUFBRixFQUFVQyxTQUFWLEVBQVY7QUFDQUYsTUFBRSxpQkFBRixFQUFxQkcsSUFBckIsQ0FBMEIsWUFBVztBQUNsQyxVQUFJQyxXQUFXSixFQUFFLElBQUYsQ0FBZjtBQUNBO0FBQ0EsVUFBSUssU0FBU0QsU0FBU0MsTUFBVCxLQUFrQixJQUEvQjtBQUNBTCxRQUFFLElBQUYsRUFBUU0sR0FBUixDQUFZLG9CQUFaLEVBQWtDLFdBQVdDLEtBQUtDLEtBQUwsQ0FBVyxDQUFDSCxTQUFTTixHQUFWLElBQWlCRixRQUE1QixDQUFYLEdBQW9ELElBQXRGO0FBQ0EsS0FMSDtBQU1HOztBQUVIRyxJQUFFQyxNQUFGLEVBQVVRLElBQVYsQ0FBZSxRQUFmLEVBQXlCWCxNQUF6QjtBQUdELENBdEJEOzs7QUNBQWhELFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCb0UsU0FBOUIsQ0FBd0MsUUFBeEMsRUFBa0QsWUFBTTtBQUN0RCxTQUFPO0FBQ0w5RCxpQkFBYTtBQURSLEdBQVA7QUFHRCxDQUpEOzs7QUNBQVAsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEJvRSxTQUE5QixDQUF3QyxjQUF4QyxFQUF3RCxZQUFNO0FBQzVELFNBQU87QUFDTDlELGlCQUFhO0FBRFIsR0FBUDtBQUdELENBSkQ7OztBQ0FBUCxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4Qm9FLFNBQTlCLENBQXdDLFVBQXhDLEVBQW9ELFlBQU07QUFDeEQsU0FBTztBQUNMQyxjQUFVLElBREw7QUFFTEMsV0FBTztBQUNMQyxlQUFTO0FBREosS0FGRjtBQUtMakUsaUJBQWE7QUFMUixHQUFQO0FBT0QsQ0FSRCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnLCBbJ3VpLnJvdXRlciddKVxuICAuY29uZmlnKCgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSA9PiB7XG4gICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJyx7XG4gICAgICAgICAgICAgIHVybDonLycsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnaG9tZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcse1xuICAgICAgICAgICAgICAgIHVybDonL2Fib3V0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvYWJvdXQuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1rb21idWNoYScse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1rb21idWNoYS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWRvZ3MnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXItZG9ncycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL291ci1kb2dzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkb2dDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnZG9nLXByb2ZpbGUnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9kb2ctcHJvZmlsZS86bmFtZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnc3VjY2Vzcy1zdG9yaWVzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvc3VjY2Vzcy1zdG9yaWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvc3VjY2Vzcy1zdG9yaWVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdzdWNjZXNzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzLzppZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RldGFpbHNDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5zZXJ2aWNlKCdtYWluU3J2YycsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgdGhpcy5nZXRVcEZvckFkb3B0aW9uID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRBZG9wdGVkID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL3N1Y2Nlc3Mtc3Rvcmllcy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0RG9nUHJvZmlsZSA9IChuYW1lKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvb3VyLWRvZ3MvJytuYW1lXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIGNvbnNvbGUubG9nKCdTRVJWSUNFJywgcmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0TWVyY2hhbmRpc2UgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvbWVyY2hhbmRpc2UtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlRGV0YWlscyA9IChpZCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLycraWRcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuYWRkVG9DYXJ0ID0gKHByb2R1Y3RUaXRsZSwgcHJvZHVjdEltYWdlLCBwcm9kdWN0U2l6ZSwgcHJvZHVjdFF1YW50aXR5LCBwcm9kdWN0UHJpY2UsIHByb2R1Y3RJZCkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0VGl0bGU6IHByb2R1Y3RUaXRsZSxcbiAgICAgIHByb2R1Y3RJbWFnZTogcHJvZHVjdEltYWdlLFxuICAgICAgcHJvZHVjdFNpemU6IHByb2R1Y3RTaXplLFxuICAgICAgcHJvZHVjdFF1YW50aXR5OiBwcm9kdWN0UXVhbnRpdHksXG4gICAgICBwcm9kdWN0UHJpY2U6IHByb2R1Y3RQcmljZSxcbiAgICAgIHByb2R1Y3RJZDogcHJvZHVjdElkXG4gICAgfVxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICAgIGRhdGE6IGl0ZW1cbiAgICB9KS5zdWNjZXNzKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDIGl0ZW0gYWRkZWQnKVxuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0Q2FydCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9jYXJ0JyxcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NSVkMgQ0FSVCcsIHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pXG4gIH1cblxuXG5cblxuXG59KTtcbiIsIi8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4vLyAgIC8vIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI2KSB7XG4vLyAgICAgLy8gZmluZCB0aGUgc2Nyb2xsIGFuZCB1c2UgdGhpcyB2YXJpYWJsZSB0byBtb3ZlIGVsZW1lbnRzXG4vLyAgICAgdmFyIHdpblNjcm9sbCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG4vLyAgICAgLy8gY29uc29sZS5sb2cod2luU2Nyb2xsKTtcbi8vICAgICAvLyBjZW50ZXIgbW92ZXMgZG93biBvbiB0aGUgeS1heGlzIG9uIHNjcm9sbFxuLy9cbi8vICAgICAkKCcjZG9nLWJhbm5lcicpLmNzcyh7XG4vLyAgICAgICAndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZSgwcHgsIC0nKyB3aW5TY3JvbGwgLzUwICsnJSknXG4vLyAgICAgfSk7XG4vLyAgIC8vIH1cbi8vIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdjYXJ0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiAgJHNjb3BlLnRlc3QgPSAnaGVsbG8nO1xuXG4gIG1haW5TcnZjLmdldENhcnQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5jYXJ0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnQ2FydCBpbiBjb250cm9sbGVyJywgJHNjb3BlLmNhcnQpO1xuICB9KTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2RldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZURldGFpbHMoJHN0YXRlUGFyYW1zLmlkKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YVswXTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscyk7XG4gIH0pO1xuXG4gICRzY29wZS5wcm9kdWN0UXVhbnRpdHkgPSAxO1xuICAkc2NvcGUuYWRkVG9DYXJ0ID0gKHByb2R1Y3RTaXplLCBwcm9kdWN0UXVhbnRpdHkpID0+IHtcbiAgICBjb25zdCBwcm9kdWN0VGl0bGUgPSAkc2NvcGUuZGV0YWlscy50aXRsZTtcbiAgICBjb25zdCBwcm9kdWN0UHJpY2UgPSAkc2NvcGUuZGV0YWlscy5wcmljZTtcbiAgICBjb25zdCBwcm9kdWN0SW1hZ2UgPSAkc2NvcGUuZGV0YWlscy5pbWFnZTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSAkc2NvcGUuZGV0YWlscy5pZDtcblxuICAgIG1haW5TcnZjLmFkZFRvQ2FydChwcm9kdWN0VGl0bGUsIHByb2R1Y3RJbWFnZSwgcHJvZHVjdFNpemUsIHByb2R1Y3RRdWFudGl0eSwgcHJvZHVjdFByaWNlLCBwcm9kdWN0SWQpO1xuICAgICAgYWxlcnQoJ3Byb2R1Y3QgYWRkZWQgdG8gY2FydCcpO1xuICB9O1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2RvZ0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRkb2N1bWVudCkge1xuXG4gIG1haW5TcnZjLmdldFVwRm9yQWRvcHRpb24oKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kb2dzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuZG9ncyk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLm91ci1kb2dzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTU4MDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICczNi41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbiAgXG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2ZpbmRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignaG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuNDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLmhvbWUtaGVhZGVyLWltYWdlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNzMwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzUwJSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG4gIHZhciBpID0gMDtcbiAgdmFyIG15VmFyID0gc2V0SW50ZXJ2YWwoY2hhbmdlSW1hZ2UsIDIwMDApO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZUltYWdlKCl7XG4gICAgLy9hcnJheSBvZiBiYWNrZ3JvdW5kc1xuICAgIHZhciBib3R0bGVzID0gW1wiZ2luZ2VyLmpwZ1wiLCBcImhpbnQtb2YtbWludC5qcGdcIiwgXCJqdXN0LWtvbWJ1Y2hhLmpwZ1wiLCBcInJhc3BiZXJyeS5qcGdcIiwgXCJ3aWxkLWJsdWUtZ2luZ2VyLmpwZ1wiLCBcIndpbGQtYmx1ZWJlcnJ5LmpwZ1wiXTtcbiAgICAkKCcucmlnaHQtY29sdW1uLWltYWdlJykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcImltYWdlcy9rb21idWNoYWZsYXZvcnMvJytib3R0bGVzW2ldKydcIiknKTtcblxuICAgIGlmKGkgPT0gYm90dGxlcy5sZW5ndGggLTEpe1xuICAgICAgICBpID0gMDtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gLy8gd2luZG93LnNldEludGVydmFsKFwiY2hhbmdlSW1hZ2UoKVwiLCA1MDAwKTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5tZXJjaGFuZGlzZSk7XG4gIH0pXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXREb2dQcm9maWxlKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUucHJvZmlsZSk7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICAgICAgLy8gaWYgKCRzY29wZS50ZXN0ID09PSB0cnVlKSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ0FET1BURUQhJztcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ1VQIEZPUiBBRE9QVElPTidcbiAgICAgIC8vIH1cbiAgfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdzdWNjZXNzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcykge1xuXG4gIG1haW5TcnZjLmdldEFkb3B0ZWQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5hZG9wdGVkID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuYWRvcHRlZCk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLnN1Y2Nlc3MtYmFubmVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xOTIwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzY1LjUlICcgKyBNYXRoLnJvdW5kKChoZWlnaHQgLSBwb3MpICogdmVsb2NpdHkpICsgICdweCcpO1xuICAgIH0pO1xuICAgIH07XG5cbiAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIHVwZGF0ZSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCd0ZWVTaGlydCcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICBzY29wZToge1xuICAgICAgcHJvZHVjdDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvdGVlLXNoaXJ0Lmh0bWwnXG4gIH07XG59KTtcbiJdfQ==
