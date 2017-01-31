angular.module('kombuchadog', ['ui.router'])
  .config(($stateProvider, $urlRouterProvider) => {
      $stateProvider
            .state('home',{
              url:'/',
              templateUrl: './views/home.html',
              controller: 'homeCtrl'
            })
            .state('about',{
                url:'/about',
                templateUrl: './views/about.html'
            })
            .state('our-kombucha',{
                url:'/our-kombucha',
                templateUrl: './views/our-kombucha.html'
            })
            .state('our-dogs',{
                url:'/our-dogs',
                templateUrl: './views/our-dogs.html',
                controller: 'dogCtrl'
            })
            .state('dog-profile',{
                url:'/dog-profile/:name',
                templateUrl: './views/profile.html',
                controller: 'profileCtrl'
            })
            .state('success-stories',{
                url:'/success-stories',
                templateUrl: './views/success-stories.html',
                controller: 'successCtrl'
            })
            .state('find-kombucha',{
                url:'/find-kombucha',
                templateUrl: './views/find-kombucha.html',
                controller: 'findCtrl'
            })
            .state('merchandise',{
                url:'/merchandise',
                templateUrl: './views/merchandise.html',
                controller: 'merchandiseCtrl'
            })
            .state('merchandise-details',{
                url:'/merchandise-details/:id',
                templateUrl: './views/merchandise-details.html',
                controller: 'detailsCtrl'
            })
            .state('cart',{
                url:'/cart',
                templateUrl: './views/cart.html',
                controller: 'cartCtrl'
            });

            $urlRouterProvider
                .otherwise('/');

  });
