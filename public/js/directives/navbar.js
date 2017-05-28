angular.module('kombuchadog').directive('navbar', () => {
  return {
    templateUrl: './views/navbar.html',
    controller: function($state, $rootScope){

      $('.activate-mobile-menu').on('click', function() {
      		$('body').addClass('mobile-open');
          $('body').addClass('routes-open');
          $('body').addClass('hidden-social');
          $('body').addClass('social-right');
          $('body').addClass('hidden-nav');
          // $('body').removeClass('menu-close');
      });

      $('.social-menu').on('click', function() {
          $('body').removeClass('routes-open');
          $('body').removeClass('hidden-social');
          $('body').removeClass('social-right');
          $('body').addClass('social-open');
      });

      $('.back').on('click', function() {
          $('body').removeClass('social-open');
          $('body').addClass('social-right');
          $('body').addClass('hidden-social');
          $('body').addClass('routes-open');
      });

      $('.close').on('click', function() {
          $('body').removeClass('routes-open');
          $('body').removeClass('social-open');
          $('body').removeClass('social-right');
          $('body').removeClass('hidden-nav');
          $('body').removeClass('mobile-open');
          $('body').addClass('menu-close');
      });

    }
  };
});
