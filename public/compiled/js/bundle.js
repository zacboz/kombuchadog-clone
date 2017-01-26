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
        controller: 'dogCtrl'
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

  undefined.getUpForAdoption = function () {
    return $http({
      method: 'GET',
      url: '/our-dogs-up-for-adoption-index'
    }).then(function (response) {
      return response;
    });
  };

  undefined.getAdopted = function () {
    return $http({
      method: 'GET',
      url: '/success-stories-adopted-index'
    }).then(function (response) {
      return response;
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

angular.module('kombuchadog').controller('dogCtrl', function ($scope, mainSrvc, $stateParams) {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1haW5TcnZjLmpzIiwiZGlyZWN0aXZlcy9uYXZiYXIuanMiLCJkaXJlY3RpdmVzL3NvY2lhbGZvb3Rlci5qcyIsImNvbnRyb2xsZXJzL2RvZ0N0cmwuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJvdGhlcndpc2UiLCJzZXJ2aWNlIiwiJGh0dHAiLCJnZXRVcEZvckFkb3B0aW9uIiwibWV0aG9kIiwidGhlbiIsInJlc3BvbnNlIiwiZ2V0QWRvcHRlZCIsImRpcmVjdGl2ZSIsIiRzY29wZSIsIm1haW5TcnZjIiwiJHN0YXRlUGFyYW1zIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QixDQUFDLFdBQUQsQ0FBOUIsRUFDR0MsTUFESCxDQUNVLFVBQVNDLGNBQVQsRUFBeUJDLGtCQUF6QixFQUE0QztBQUNoREQsbUJBQ09FLEtBRFAsQ0FDYSxNQURiLEVBQ29CO0FBQ1pDLGFBQUksR0FEUTtBQUVaQyxxQkFBYTtBQUZELEtBRHBCLEVBS09GLEtBTFAsQ0FLYSxPQUxiLEVBS3FCO0FBQ1hDLGFBQUksUUFETztBQUVYQyxxQkFBYTtBQUZGLEtBTHJCLEVBU09GLEtBVFAsQ0FTYSxjQVRiLEVBUzRCO0FBQ2xCQyxhQUFJLGVBRGM7QUFFbEJDLHFCQUFhO0FBRkssS0FUNUIsRUFhT0YsS0FiUCxDQWFhLFVBYmIsRUFhd0I7QUFDZEMsYUFBSSxXQURVO0FBRWRDLHFCQUFhLHVCQUZDO0FBR2RDLG9CQUFZO0FBSEUsS0FieEIsRUFrQk9ILEtBbEJQLENBa0JhLGFBbEJiLEVBa0IyQjtBQUNqQkMsYUFBSSxnQkFEYTtBQUVqQkMscUJBQWEsMEJBRkk7QUFHakJDLG9CQUFZO0FBSEssS0FsQjNCLEVBdUJPSCxLQXZCUCxDQXVCYSxpQkF2QmIsRUF1QitCO0FBQ3JCQyxhQUFJLGtCQURpQjtBQUVyQkMscUJBQWEsOEJBRlE7QUFHckJDLG9CQUFZO0FBSFMsS0F2Qi9CLEVBNEJPSCxLQTVCUCxDQTRCYSxlQTVCYixFQTRCNkI7QUFDbkJDLGFBQUksZ0JBRGU7QUFFbkJDLHFCQUFhLDRCQUZNO0FBR25CQyxvQkFBWTtBQUhPLEtBNUI3QixFQWlDT0gsS0FqQ1AsQ0FpQ2EsYUFqQ2IsRUFpQzJCO0FBQ2pCQyxhQUFJLGNBRGE7QUFFakJDLHFCQUFhLDBCQUZJO0FBR2pCQyxvQkFBWTtBQUhLLEtBakMzQixFQXNDT0gsS0F0Q1AsQ0FzQ2EscUJBdENiLEVBc0NtQztBQUN6QkMsYUFBSSxzQkFEcUI7QUFFekJDLHFCQUFhLGtDQUZZO0FBR3pCQyxvQkFBWTtBQUhhLEtBdENuQyxFQTJDT0gsS0EzQ1AsQ0EyQ2EsTUEzQ2IsRUEyQ29CO0FBQ1ZDLGFBQUksT0FETTtBQUVWQyxxQkFBYSxtQkFGSDtBQUdWQyxvQkFBWTtBQUhGLEtBM0NwQjs7QUFpRE1KLHVCQUNLSyxTQURMLENBQ2UsR0FEZjtBQUdULENBdERIOzs7QUNBQVQsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEJTLE9BQTlCLENBQXNDLFVBQXRDLEVBQWtELFVBQUNDLEtBQUQsRUFBVzs7QUFFM0QsWUFBS0MsZ0JBQUwsR0FBd0IsWUFBTTtBQUM1QixXQUFPRCxNQUFNO0FBQ1hFLGNBQVEsS0FERztBQUVYUCxXQUFLO0FBRk0sS0FBTixFQUdKUSxJQUhJLENBR0MsVUFBQ0MsUUFBRCxFQUFjO0FBQ3BCLGFBQU9BLFFBQVA7QUFDRCxLQUxNLENBQVA7QUFNRCxHQVBEOztBQVNBLFlBQUtDLFVBQUwsR0FBa0IsWUFBTTtBQUN0QixXQUFPTCxNQUFNO0FBQ1hFLGNBQVEsS0FERztBQUVYUCxXQUFLO0FBRk0sS0FBTixFQUdKUSxJQUhJLENBR0MsVUFBQ0MsUUFBRCxFQUFjO0FBQ3BCLGFBQU9BLFFBQVA7QUFDRCxLQUxNLENBQVA7QUFNRCxHQVBEO0FBU0QsQ0FwQkQ7OztBQ0FBZixRQUFRQyxNQUFSLENBQWUsYUFBZixFQUE4QmdCLFNBQTlCLENBQXdDLFFBQXhDLEVBQWtELFlBQU07QUFDdEQsU0FBTztBQUNMVixpQkFBYTtBQURSLEdBQVA7QUFHRCxDQUpEOzs7QUNBQVAsUUFBUUMsTUFBUixDQUFlLGFBQWYsRUFBOEJnQixTQUE5QixDQUF3QyxjQUF4QyxFQUF3RCxZQUFNO0FBQzVELFNBQU87QUFDTFYsaUJBQWE7QUFEUixHQUFQO0FBR0QsQ0FKRDs7O0FDQUFQLFFBQVFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCTyxVQUE5QixDQUF5QyxTQUF6QyxFQUFvRCxVQUFDVSxNQUFELEVBQVNDLFFBQVQsRUFBbUJDLFlBQW5CLEVBQW9DLENBQUUsQ0FBMUYiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJywgWyd1aS5yb3V0ZXInXSlcbiAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKXtcbiAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLHtcbiAgICAgICAgICAgICAgdXJsOicvJyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL2hvbWUuaHRtbCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Fib3V0Jyx7XG4gICAgICAgICAgICAgICAgdXJsOicvYWJvdXQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9hYm91dC5odG1sJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnb3VyLWtvbWJ1Y2hhJyx7XG4gICAgICAgICAgICAgICAgdXJsOicvb3VyLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWtvbWJ1Y2hhLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdvdXItZG9ncycse1xuICAgICAgICAgICAgICAgIHVybDonL291ci1kb2dzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3Mvb3VyLWRvZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2RvZ0N0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdkb2ctcHJvZmlsZScse1xuICAgICAgICAgICAgICAgIHVybDonL3Byb2ZpbGUvOm5hbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9kb2ctcHJvZmlsZS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ3N1Y2Nlc3Mtc3Rvcmllcycse1xuICAgICAgICAgICAgICAgIHVybDonL3N1Y2Nlc3Mtc3RvcmllcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL3ZpZXdzL3N1Y2Nlc3Mtc3Rvcmllcy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZG9nQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2ZpbmQta29tYnVjaGEnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9maW5kLWtvbWJ1Y2hhJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvZmluZC1rb21idWNoYS5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZmluZEN0cmwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdtZXJjaGFuZGlzZScse1xuICAgICAgICAgICAgICAgIHVybDonL21lcmNoYW5kaXNlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ21lcmNoYW5kaXNlQ3RybCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ21lcmNoYW5kaXNlLWRldGFpbHMnLHtcbiAgICAgICAgICAgICAgICB1cmw6Jy9tZXJjaGFuZGlzZS1kZXRhaWxzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbWVyY2hhbmRpc2UtZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbWVyY2hhbmRpc2VDdHJsJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnY2FydCcse1xuICAgICAgICAgICAgICAgIHVybDonL2NhcnQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9jYXJ0Lmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdjYXJ0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAub3RoZXJ3aXNlKCcvJyk7XG5cbiAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5zZXJ2aWNlKCdtYWluU3J2YycsICgkaHR0cCkgPT4ge1xuXG4gIHRoaXMuZ2V0VXBGb3JBZG9wdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJy9vdXItZG9ncy11cC1mb3ItYWRvcHRpb24taW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmdldEFkb3B0ZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6ICcvc3VjY2Vzcy1zdG9yaWVzLWFkb3B0ZWQtaW5kZXgnXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgna29tYnVjaGFkb2cnKS5kaXJlY3RpdmUoJ25hdmJhcicsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdmlld3MvbmF2YmFyLmh0bWwnXG4gIH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdrb21idWNoYWRvZycpLmRpcmVjdGl2ZSgnc29jaWFsRm9vdGVyJywgKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlVXJsOiAnLi92aWV3cy9mb290ZXIuaHRtbCdcbiAgfTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2tvbWJ1Y2hhZG9nJykuY29udHJvbGxlcignZG9nQ3RybCcsICgkc2NvcGUsIG1haW5TcnZjLCAkc3RhdGVQYXJhbXMpID0+IHt9KTtcbiJdfQ==
