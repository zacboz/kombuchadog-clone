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
        url: '/profile/:name',
        templateUrl: './views/dog-profile.html',
        controller: 'dogCtrl'
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
        url: '/merchandise-details',
        templateUrl: './views/merchandise-details.html',
        controller: 'merchandiseCtrl'
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
      console.log(response);
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
});
'use strict';

angular.module('kombuchadog').controller('cartCtrl', function ($scope, mainSrvc, $stateParams) {});
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

angular.module('kombuchadog').controller('merchandiseCtrl', function ($scope, mainSrvc, $stateParams) {});
'use strict';

angular.module('kombuchadog').controller('successCtrl', function ($scope, mainSrvc, $stateParams) {

  mainSrvc.getAdopted().then(function (response) {
    $scope.adopted = response.data;
    console.log($scope.adopted);
  });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwiY29udHJvbGxlcnMvY2FydEN0cmwuanMiLCJjb250cm9sbGVycy9kb2dDdHJsLmpzIiwiY29udHJvbGxlcnMvZmluZEN0cmwuanMiLCJjb250cm9sbGVycy9tZXJjaGFuZGlzZUN0cmwuanMiLCJjb250cm9sbGVycy9zdWNjZXNzQ3RybC5qcyIsImRpcmVjdGl2ZXMvbmF2YmFyLmpzIiwiZGlyZWN0aXZlcy9zb2NpYWxmb290ZXIuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImdldEFkb3B0ZWQiLCIkc2NvcGUiLCJtYWluU3J2YyIsIiRzdGF0ZVBhcmFtcyIsImRvZ3MiLCJkYXRhIiwiYWRvcHRlZCIsImRpcmVjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsQ0FBQyxXQUFELENBQTlCLEVBQ0dDLE1BREgsQ0FDVSxVQUFDQyxjQUFELEVBQWlCQyxrQkFBakIsRUFBd0M7QUFDNUNELG1CQUNPRSxLQURQLENBQ2EsTUFEYixFQUNvQjtBQUNaQyxhQUFJLEdBRFE7QUFFWkMscUJBQWE7QUFGRCxLQURwQixFQUtPRixLQUxQLENBS2EsT0FMYixFQUtxQjtBQUNYQyxhQUFJLFFBRE87QUFFWEMscUJBQWE7QUFGRixLQUxyQixFQVNPRixLQVRQLENBU2EsY0FUYixFQVM0QjtBQUNsQkMsYUFBSSxlQURjO0FBRWxCQyxxQkFBYTtBQUZLLEtBVDVCLEVBYU9GLEtBYlAsQ0FhYSxVQWJiLEVBYXdCO0FBQ2RDLGFBQUksV0FEVTtBQUVkQyxx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QUFDQyxRQUFELEVBQWM7QUFDdkNJLFdBQU9LLE9BQVAsR0FBaUJULFNBQVNRLElBQTFCO0FBQ0FQLFlBQVFDLEdBQVIsQ0FBWUUsT0FBT0ssT0FBbkI7QUFDRCxHQUhEO0FBS0QsQ0FQRDs7O0FDQUF4QixRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QndCLFNBQTlCLENBQXdDLFFBQXhDLEVBQWtELFlBQU07QUFDdEQsU0FBTztBQUNMbEIsaUJBQWE7QUFEUixHQUFQO0FBR0QsQ0FKRDs7O0FDQUFQLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCd0IsU0FBOUIsQ0FBd0MsY0FBeEMsRUFBd0QsWUFBTTtBQUM1RCxTQUFPO0FBQ0xsQixpQkFBYTtBQURSLEdBQVA7QUFHRCxDQUpEIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycsIFsndWkucm91dGVyJ10pXG4gIC5jb25maWcoKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpID0+IHtcbiAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLHtcbiAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Fib3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvYWJvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9hYm91dC5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWtvbWJ1Y2hhLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXItZG9ncycse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1kb2dzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWRvZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RvZ0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdkb2ctcHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL3Byb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kb2ctcHJvZmlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnc3VjY2Vzc0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdmaW5kLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvZmluZC1rb21idWNoYScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2ZpbmQta29tYnVjaGEuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2ZpbmRDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnbWVyY2hhbmRpc2UnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdtZXJjaGFuZGlzZUN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZS1kZXRhaWxzJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvbWVyY2hhbmRpc2UtZGV0YWlscycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL21lcmNoYW5kaXNlLWRldGFpbHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2NhcnQnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9jYXJ0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvY2FydC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY2FydEN0cmwnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLm90aGVyd2lzZSgnLycpO1xuXG4gIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuc2VydmljZSgnbWFpblNydmMnLCBmdW5jdGlvbigkaHR0cCkge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy1pbmRleCdcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuZ2V0QWRvcHRlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9zdWNjZXNzLXN0b3JpZXMtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdjYXJ0Q3RybCcsICgkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpID0+IHt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ2RvZ0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpIHtcblxuICBtYWluU3J2Yy5nZXRVcEZvckFkb3B0aW9uKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAkc2NvcGUuZG9ncyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgY29uc29sZS5sb2coJHNjb3BlLmRvZ3MpO1xuICB9KTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5jb250cm9sbGVyKCdmaW5kQ3RybCcsICgkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpID0+IHt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ21lcmNoYW5kaXNlQ3RybCcsICgkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpID0+IHt9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmNvbnRyb2xsZXIoJ3N1Y2Nlc3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBtYWluU3J2YywgJHN0YXRlUGFyYW1zKSB7XG5cbiAgbWFpblNydmMuZ2V0QWRvcHRlZCgpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgJHNjb3BlLmFkb3B0ZWQgPSByZXNwb25zZS5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCRzY29wZS5hZG9wdGVkKTtcbiAgfSk7XG5cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuZGlyZWN0aXZlKCduYXZiYXInLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL25hdmJhci5odG1sJ1xuICB9O1xufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ3NvY2lhbEZvb3RlcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZm9vdGVyLmh0bWwnXG4gIH07XG59KTtcbiJdfQ==
