'use strict';

angular.module('kombuchadog', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/home.html'
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

angular.module('kombuchadog').controller('cartCtrl', function ($scope, mainSrvc, $stateParams) {});
'use strict';

angular.module('kombuchadog').controller('detailsCtrl', function ($scope, mainSrvc, $stateParams) {

  $scope.test = 'hello';

  mainSrvc.getMerchandiseDetails($stateParams.id).then(function (response) {
    // console.log($stateParams.id);
    $scope.details = response.data;
    console.log('detailsCtrl', $scope.details);
  });
});
'use strict';

angular.module('kombuchadog').controller('dogCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getUpForAdoption().then(function (response) {
    $scope.dogs = response.data;
    console.log($scope.dogs);
  });
});
'use strict';

angular.module('kombuchadog').controller('findCtrl', function ($scope, mainSrvc, $stateParams) {});
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
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImRpcmVjdGl2ZXMvdGVlU2hpcnQuanMiLCJjb250cm9sbGVycy9jYXJ0Q3RybC5qcyIsImNvbnRyb2xsZXJzL2RldGFpbHNDdHJsLmpzIiwiY29udHJvbGxlcnMvZG9nQ3RybC5qcyIsImNvbnRyb2xsZXJzL2ZpbmRDdHJsLmpzIiwiY29udHJvbGxlcnMvbWVyY2hhbmRpc2VDdHJsLmpzIiwiY29udHJvbGxlcnMvcHJvZmlsZUN0cmwuanMiLCJjb250cm9sbGVycy9zdWNjZXNzQ3RybC5qcyJdLCJuYW1lcyI6WyJhbmd1bGFyIiwibW9kdWxlIiwiY29uZmlnIiwiJHN0YXRlUHJvdmlkZXIiLCIkdXJsUm91dGVyUHJvdmlkZXIiLCJzdGF0ZSIsInVybCIsInRlbXBsYXRlVXJsIiwiY29udHJvbGxlciIsIm90aGVyd2lzZSIsInNlcnZpY2UiLCIkaHR0cCIsImdldFVwRm9yQWRvcHRpb24iLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJnZXRBZG9wdGVkIiwiZ2V0RG9nUHJvZmlsZSIsIm5hbWUiLCJjb25zb2xlIiwibG9nIiwiZ2V0TWVyY2hhbmRpc2UiLCJnZXRNZXJjaGFuZGlzZURldGFpbHMiLCJpZCIsImRpcmVjdGl2ZSIsInJlc3RyaWN0Iiwic2NvcGUiLCJwcm9kdWN0IiwiJHNjb3BlIiwibWFpblNydmMiLCIkc3RhdGVQYXJhbXMiLCJ0ZXN0IiwiZGV0YWlscyIsImRhdGEiLCJkb2dzIiwibWVyY2hhbmRpc2UiLCJwcm9maWxlIiwiYWRvcHRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENBQTlCLEVBQ0dDLE1BREgsQ0FDVSxVQUFDQyxjQUFELEVBQWlCQyxrQkFBakIsRUFBd0M7QUFDNUNELG1CQUNPRSxLQURQLENBQ2EsTUFEYixFQUNvQjtB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VUFBOUIsQ0FBeUMsYUFBekMsRUFBd0QsVUFBU29CLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCQyxZQUEzQixFQUF5Qzs7QUFFL0ZELFdBQVNiLFVBQVQsR0FBc0JGLElBQXRCLENBQTJCLFVBQUNDLFFBQUQsRUFBYztBQUN2Q2EsV0FBT1MsT0FBUCxHQUFpQnRCLFNBQVNrQixJQUExQjtBQUNBZCxZQUFRQyxHQUFSLENBQVlRLE9BQU9TLE9BQW5CO0FBQ0QsR0FIRDtBQUtELENBUEQiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZygoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgPT4ge1xuICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnaG9tZScse1xuICAgICAgICAgICAgICB1cmw6Jy8nLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvaG9tZS5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYWJvdXQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9hYm91dCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2Fib3V0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXIta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9vdXIta29tYnVjaGEnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXIta29tYnVjaGEuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ291ci1kb2dzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWRvZ3MnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9vdXItZG9ncy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2RvZy1wcm9maWxlJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZG9nLXByb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9wcm9maWxlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwcm9maWxlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscy86aWQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9tZXJjaGFuZGlzZS1kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdkZXRhaWxzQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWRvcHRlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdWNjZXNzLXN0b3JpZXMtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldERvZ1Byb2ZpbGUgPSAobmFtZSkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL291ci1kb2dzLycrbmFtZVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICBjb25zb2xlLmxvZygnU0VSVklDRScsIHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldE1lcmNoYW5kaXNlID0gKCkgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiAnL21lcmNoYW5kaXNlLWluZGV4J1xuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5nZXRNZXJjaGFuZGlzZURldGFpbHMgPSAoaWQpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9tZXJjaGFuZGlzZS8nK2lkXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfTtcblxuXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgndGVlU2hpcnQnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHByb2R1Y3Q6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3RlZS1zaGlydC5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKVxuLmNvbnRyb2xsZXIoJ2NhcnRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKXt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpXG4uY29udHJvbGxlcignZGV0YWlsc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG4gICRzY29wZS50ZXN0ID0gJ2hlbGxvJ1xuXG4gIG1haW5TcnZjLmdldE1lcmNoYW5kaXNlRGV0YWlscygkc3RhdGVQYXJhbXMuaWQpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAkc2NvcGUuZGV0YWlscyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJ2RldGFpbHNDdHJsJywgJHNjb3BlLmRldGFpbHMpO1xuICB9KTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdkb2dDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0VXBGb3JBZG9wdGlvbigpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmRvZ3MgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5kb2dzKTtcbiAgfSk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdmaW5kQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7fSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdtZXJjaGFuZGlzZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpe1xuXG5cbiAgbWFpblNydmMuZ2V0TWVyY2hhbmRpc2UoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAkc2NvcGUubWVyY2hhbmRpc2UgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5tZXJjaGFuZGlzZSk7XG4gIH0pXG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJylcbi5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcyl7XG5cblxuICBtYWluU3J2Yy5nZXREb2dQcm9maWxlKCRzdGF0ZVBhcmFtcy5uYW1lKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5wcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUucHJvZmlsZSk7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSAkc2NvcGUucHJvZmlsZVswXS5hZG9wdGVkO1xuICAgICAgLy8gaWYgKCRzY29wZS50ZXN0ID09PSB0cnVlKSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ0FET1BURUQhJztcbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgICRzY29wZS5hZG9wdGVkID0gJ1VQIEZPUiBBRE9QVElPTidcbiAgICAgIC8vIH1cbiAgfSk7XG5cblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdzdWNjZXNzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgbWFpblNydmMsICRzdGF0ZVBhcmFtcykge1xuXG4gIG1haW5TcnZjLmdldEFkb3B0ZWQoKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICRzY29wZS5hZG9wdGVkID0gcmVzcG9uc2UuZGF0YTtcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuYWRvcHRlZCk7XG4gIH0pO1xuXG59KTtcbiJdfQ==
