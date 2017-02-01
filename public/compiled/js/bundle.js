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

  this.addToCart = function (productId, title, price, image, size, quantity) {
    var item = {
      productId: productId,
      title: title,
      price: price,
      image: image,
      size: size,
      quantity: quantity
    };
    return $http({
      method: 'POST',
      url: '/cart',
      data: item
    }).success(function (response) {
      console.log('SRVC', response);
      return response;
    });
  };

  this.getCart = function () {
    return $http({
      method: 'GET',
      url: '/cart-index'
    }).then(function (response) {
      return response;
      console.log('SRVC', response);
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

angular.module('kombuchadog').controller('cartCtrl', function ($scope, mainSrvc, $stateParams) {});
'use strict';

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getMerchandiseDetails($stateParams.id).then(function (response) {
    // console.log($stateParams.id);
    $scope.details = response.data;
    console.log('detailsCtrl', $scope.details);
  });
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

  // $('.parallax-window').parallax({imageSrc: '/images/dog-banners-v2.jpg'});


  // ADDITIONAL CODE TO MAKE THE PARALLAX FOR THIS CONTAINER STOP ONCE IT LEAVES THE VIEW.
  // $(window).scroll(function() {
  //   var bannerContainerHeight = $('.banner-container').height();
  //   var winScroll = $(this).scrollTop();
  //   if (winScroll >= $('.banner-container').offset().top - $(window).height() && winScroll <= $('.banner-container').offset().top + bannerContainerHeight) {
  //     var offset = winScroll - $('.banner-container').offset().top + $(window).height() - 0;
  //     // center moves down on the y-axis on scroll
  //     $('#dog-banner').css({
  //       'transform': 'translate(0px, -'+ offset /50 +'%)'
  //     });
  //   }
  // });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwicGFyYWxsYXguanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvaG9tZUN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9wcm9maWxlQ3RybC5qcyIsImNvbnRyb2xsZXJzL3N1Y2Nlc3NDdHJsLmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiZ2V0QWRvcHRlZCIsImdldERvZ1Byb2ZpbGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsImdldE1lcmNoYW5kaXNlIiwiZ2V0TWVyY2hhbmRpc2VEZXRhaWxzIiwiaWQiLCJhZGRUb0NhcnQiLCJwcm9kdWN0SWQiLCJ0aXRsZSIsInByaWNlIiwiaW1hZ2UiLCJzaXplIiwicXVhbnRpdHkiLCJpdGVtIiwiZGF0YSIsInN1Y2Nlc3MiLCJnZXRDYXJ0IiwiJHNjb3BlIiwibWFpblNydmMiLCIkc3RhdGVQYXJhbXMiLCJkZXRhaWxzIiwiJGRvY3VtZW50IiwiZG9ncyIsInZlbG9jaXR5IiwidXBkYXRlIiwicG9zIiwiJCIsIndpbmRvdyIsInNjcm9sbFRvcCIsImVhY2giLCIkZWxlbWVudCIsImhlaWdodCIsImNzcyIsIk1hdGgiLCJyb3VuZCIsImJpbmQiLCJtZXJjaGFuZGlzZSIsInByb2ZpbGUiLCJhZG9wdGVkIiwiZGlyZWN0aXZlIiwicmVzdHJpY3QiLCJzY29wZSIsInByb2R1Y3QiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLENBQUMsV0FBRCxDQUE5QixFQUNHQyxNQURILENBQ1UsVUFBQ0MsY0FBRCxFQUFpQkMsa0JBQWpCLEVBQXdDO0FBQzVDRCxtQkFDT0UsS0FEUCxDQUNhLE1BRGIsRUFDb0I7QUFDWkMsYUFBSSxHQURRO0FBRVpDLHFCQUFhLG1CQUZEO0FBR1pDLG9CQUFZO0FBSEEsS0FEcEIsRUFNT0gsS0FOUCxDQU1hLE9BTmIsRUFNcUI7QUFDWEMsYUFBSSxRQURPO0FBRVhDLHFCQUFhO0FBRkYsS0FOckIsRUFVT0YsS0FWUCxDQVVhLGNBVmIsRUFVNEI7QUFDbEJDLGFBQUksZUFEYztBQUVsQkMscUJBQWE7QUFGSyxLQVY1QixFQWNPRixLQWRQLENBY2EsVUFkYixFQWN3QjtBQUNkQyxhQUFJLFdBRFU7QUFFZEMscUJBQWEsdUJBRkM7QUFHZEMsb0JBQVk7QUFIRSxLQWR4QixFQW1CT0gsS0FuQlAsQ0FtQmEsYUFuQmIsRUFtQjJCO0FBQ2pCQyxhQUFJLG9CQURhO0FBRWpCQyxxQkFBYSxzQkFGSTtBQUdqQkMsb0JBQVk7QUFISyxLQW5CM0IsRUF3Qk9ILEtBeEJQLENBd0JhLGlCQXhCYixFQXdCK0I7QUFDckJDLGFBQUksa0JBRGlCO0FBRXJCQyxxQkFBYSw4QkFGUTtBQUdyQkMsb0JBQVk7QUFIUyxLQXhCL0IsRUE2Qk9ILEtBN0JQLENBNkJhLGVBN0JiLEVBNkI2QjtBQUNuQkMsYUFBSSxnQkFEZTtBQUVuQkMscUJBQWEsNEJBRk07QUFHbkJDLG9CQUFZO0FBSE8sS0E3QjdCLEVBa0NPSCxLQWxDUCxDQWtDYSxhQWxDYixFQWtDMkI7QUFDakJDLGFBQUksY0FEYTtBQUVqQkMscUJBQWEsMEJBRkk7QUFHakJDLG9CQUFZO0FBSEssS0FsQzNCLEVBdUNP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QUYsRUFBVUMsU0FBVixFQUFWO0FBQ0FGLE1BQUUsaUJBQUYsRUFBcUJHLElBQXJCLENBQTBCLFlBQVc7QUFDbEMsVUFBSUMsV0FBV0osRUFBRSxJQUFGLENBQWY7QUFDQTtBQUNBLFVBQUlLLFNBQVNELFNBQVNDLE1BQVQsS0FBa0IsSUFBL0I7QUFDQUwsUUFBRSxJQUFGLEVBQVFNLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxXQUFXQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ0gsU0FBU04sR0FBVixJQUFpQkYsUUFBNUIsQ0FBWCxHQUFvRCxJQUF0RjtBQUNBLEtBTEg7QUFNRzs7QUFFSEcsSUFBRUMsTUFBRixFQUFVUSxJQUFWLENBQWUsUUFBZixFQUF5QlgsTUFBekI7QUFHRCxDQXRCRDs7O0FDQUExQyxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QndELFNBQTlCLENBQXdDLFFBQXhDLEVBQWtELFlBQU07QUFDdEQsU0FBTztBQUNMbEQsaUJBQWE7QUFEUixHQUFQO0FBR0QsQ0FKRDs7O0FDQUFQLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCd0QsU0FBOUIsQ0FBd0MsY0FBeEMsRUFBd0QsWUFBTTtBQUM1RCxTQUFPO0FBQ0xsRCxpQkFBYTtBQURSLEdBQVA7QUFHRCxDQUpEOzs7QUNBQVAsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEJ3RCxTQUE5QixDQUF3QyxVQUF4QyxFQUFvRCxZQUFNO0FBQ3hELFNBQU87QUFDTEMsY0FBVSxJQURMO0FBRUxDLFdBQU87QUFDTEMsZUFBUztBQURKLEtBRkY7QUFLTHJELGlCQUFhO0FBTFIsR0FBUDtBQU9ELENBUkQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2hvbWVDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWRvcHRlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdWNjZXNzLXN0b3JpZXMtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldERvZ1Byb2ZpbGUgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLycrbmFtZVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICBjb25zb2xlLmxvZygnU0VSVklDRScsIHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZURldGFpbHMgPSAoaWQpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmFkZFRvQ2FydCA9IChwcm9kdWN0SWQsIHRpdGxlLCBwcmljZSwgaW1hZ2UsIHNpemUsIHF1YW50aXR5KSA9PiB7XG4gICAgbGV0IGl0ZW0gPSB7XG4gICAgICBwcm9kdWN0SWQ6IHByb2R1Y3RJZCxcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgIGltYWdlOiBpbWFnZSxcbiAgICAgIHNpemU6IHNpemUsXG4gICAgICBxdWFudGl0eTogcXVhbnRpdHlcbiAgICB9XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiAnL2NhcnQnLFxuICAgICAgZGF0YTogaXRlbVxuICAgIH0pLnN1Y2Nlc3MoKHJlc3BvbnNlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnU1JWQycsIHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRDYXJ0ID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL2NhcnQtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIGNvbnNvbGUubG9nKCdTUlZDJywgcmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG5cblxufSk7XG4iLCIvLyAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuLy8gICAvLyBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPj0gMTAyNikge1xuLy8gICAgIC8vIGZpbmQgdGhlIHNjcm9sbCBhbmQgdXNlIHRoaXMgdmFyaWFibGUgdG8gbW92ZSBlbGVtZW50c1xuLy8gICAgIHZhciB3aW5TY3JvbGwgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuLy8gICAgIC8vIGNvbnNvbGUubG9nKHdpblNjcm9sbCk7XG4vLyAgICAgLy8gY2VudGVyIG1vdmVzIGRvd24gb24gdGhlIHktYXhpcyBvbiBzY3JvbGxcbi8vXG4vLyAgICAgJCgnI2RvZy1iYW5uZXInKS5jc3Moe1xuLy8gICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUoMHB4LCAtJysgd2luU2Nyb2xsIC81MCArJyUpJ1xuLy8gICAgIH0pO1xuLy8gICAvLyB9XG4vLyB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignY2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gIFxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdkZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2VEZXRhaWxzKCRzdGF0ZVBhcmFtcy5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZygkc3RhdGVQYXJhbXMuaWQpO1xuICAgICRzY29wZS5kZXRhaWxzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygnZGV0YWlsc0N0cmwnLCAkc2NvcGUuZGV0YWlscyk7XG4gIH0pO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2RvZ0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMsICRkb2N1bWVudCkge1xuXG4gIG1haW5TcnZjLmdldFVwRm9yQWRvcHRpb24oKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5kb2dzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuZG9ncyk7XG4gIH0pO1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuMjtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLm91ci1kb2dzLWJhbm5lcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG4gICAgIC8vIHN1YnRyYWN0IHNvbWUgZnJvbSB0aGUgaGVpZ2h0IGIvYyBvZiB0aGUgcGFkZGluZ1xuICAgICB2YXIgaGVpZ2h0ID0gJGVsZW1lbnQuaGVpZ2h0KCktMTU4MDtcbiAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmRQb3NpdGlvbicsICczNi41JSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG5cbiAgLy8gJCgnLnBhcmFsbGF4LXdpbmRvdycpLnBhcmFsbGF4KHtpbWFnZVNyYzogJy9pbWFnZXMvZG9nLWJhbm5lcnMtdjIuanBnJ30pO1xuXG5cbiAgLy8gQURESVRJT05BTCBDT0RFIFRPIE1BS0UgVEhFIFBBUkFMTEFYIEZPUiBUSElTIENPTlRBSU5FUiBTVE9QIE9OQ0UgSVQgTEVBVkVTIFRIRSBWSUVXLlxuICAgIC8vICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgLy8gICB2YXIgYmFubmVyQ29udGFpbmVySGVpZ2h0ID0gJCgnLmJhbm5lci1jb250YWluZXInKS5oZWlnaHQoKTtcbiAgICAvLyAgIHZhciB3aW5TY3JvbGwgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuICAgIC8vICAgaWYgKHdpblNjcm9sbCA+PSAkKCcuYmFubmVyLWNvbnRhaW5lcicpLm9mZnNldCgpLnRvcCAtICQod2luZG93KS5oZWlnaHQoKSAmJiB3aW5TY3JvbGwgPD0gJCgnLmJhbm5lci1jb250YWluZXInKS5vZmZzZXQoKS50b3AgKyBiYW5uZXJDb250YWluZXJIZWlnaHQpIHtcbiAgICAvLyAgICAgdmFyIG9mZnNldCA9IHdpblNjcm9sbCAtICQoJy5iYW5uZXItY29udGFpbmVyJykub2Zmc2V0KCkudG9wICsgJCh3aW5kb3cpLmhlaWdodCgpIC0gMDtcbiAgICAvLyAgICAgLy8gY2VudGVyIG1vdmVzIGRvd24gb24gdGhlIHktYXhpcyBvbiBzY3JvbGxcbiAgICAvLyAgICAgJCgnI2RvZy1iYW5uZXInKS5jc3Moe1xuICAgIC8vICAgICAgICd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlKDBweCwgLScrIG9mZnNldCAvNTAgKyclKSdcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2ZpbmRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignaG9tZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gIHZhciB2ZWxvY2l0eSA9IDAuNDtcblxuICBmdW5jdGlvbiB1cGRhdGUoKXtcbiAgdmFyIHBvcyA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgJCgnLmhvbWUtaGVhZGVyLWltYWdlJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgdmFyICRlbGVtZW50ID0gJCh0aGlzKTtcbiAgICAgLy8gc3VidHJhY3Qgc29tZSBmcm9tIHRoZSBoZWlnaHQgYi9jIG9mIHRoZSBwYWRkaW5nXG4gICAgIHZhciBoZWlnaHQgPSAkZWxlbWVudC5oZWlnaHQoKS0xNzMwO1xuICAgICAkKHRoaXMpLmNzcygnYmFja2dyb3VuZFBvc2l0aW9uJywgJzUwJSAnICsgTWF0aC5yb3VuZCgoaGVpZ2h0IC0gcG9zKSAqIHZlbG9jaXR5KSArICAncHgnKTtcbiAgICB9KTtcbiAgICB9O1xuXG4gICQod2luZG93KS5iaW5kKCdzY3JvbGwnLCB1cGRhdGUpO1xuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ21lcmNoYW5kaXNlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXRNZXJjaGFuZGlzZSgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICRzY29wZS5tZXJjaGFuZGlzZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLm1lcmNoYW5kaXNlKTtcbiAgfSlcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ3Byb2ZpbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXtcblxuXG4gIG1haW5TcnZjLmdldERvZ1Byb2ZpbGUoJHN0YXRlUGFyYW1zLm5hbWUpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLnByb2ZpbGUgPSByZXNwb25zZS5kYXRhO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wcm9maWxlKTtcbiAgICAkc2NvcGUuYWRvcHRlZCA9ICRzY29wZS5wcm9maWxlWzBdLmFkb3B0ZWQ7XG4gICAgICAvLyBpZiAoJHNjb3BlLnRlc3QgPT09IHRydWUpIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnQURPUFRFRCEnO1xuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgJHNjb3BlLmFkb3B0ZWQgPSAnVVAgRk9SIEFET1BUSU9OJ1xuICAgICAgLy8gfVxuICB9KTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5hZG9wdGVkKTtcbiAgfSk7XG5cbiAgdmFyIHZlbG9jaXR5ID0gMC4yO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpe1xuICB2YXIgcG9zID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAkKCcuc3VjY2Vzcy1iYW5uZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpO1xuICAgICAvLyBzdWJ0cmFjdCBzb21lIGZyb20gdGhlIGhlaWdodCBiL2Mgb2YgdGhlIHBhZGRpbmdcbiAgICAgdmFyIGhlaWdodCA9ICRlbGVtZW50LmhlaWdodCgpLTE5MjA7XG4gICAgICQodGhpcykuY3NzKCdiYWNrZ3JvdW5kUG9zaXRpb24nLCAnNjUuNSUgJyArIE1hdGgucm91bmQoKGhlaWdodCAtIHBvcykgKiB2ZWxvY2l0eSkgKyAgJ3B4Jyk7XG4gICAgfSk7XG4gICAgfTtcblxuICAkKHdpbmRvdykuYmluZCgnc2Nyb2xsJywgdXBkYXRlKTtcblxuXG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnbmF2YmFyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9uYXZiYXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCdzb2NpYWxGb290ZXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Zvb3Rlci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3RlZVNoaXJ0JywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcm9kdWN0OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy90ZWUtc2hpcnQuaHRtbCdcbiAgfTtcbn0pO1xuIl19
