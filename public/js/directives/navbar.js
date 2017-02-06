angular.module('kombuchadog').directive('navbar', () => {
  return {
    templateUrl: './views/navbar.html',
    controller: function($state, $rootScope){


      var isActive = false;

      $('.activate-mobile-menu').on('click', function() {
      	if (isActive) {
          $('body').removeClass('mobile-open');
          $('body').removeClass('routes-open');
          $('body').removeClass('social-open');
          $('body').removeClass('hidden-nav');
          $('body').removeClass('social-right');
          // $('body').addClass('menu-close');
          $('body').addClass('hidden-social');
      	} else {
      		$('body').addClass('mobile-open');
          $('body').addClass('routes-open');
          $('body').addClass('social-right');
          $('body').addClass('hidden-nav');
          $('body').addClass('hidden-social');
          $('body').removeClass('menu-close');
      	}
      	isActive = !isActive;
      });

      $('.social-menu').on('click', function() {
      	if (isActive) {
          $('body').addClass('mobile-open');
          $('body').addClass('routes-open');
          $('body').addClass('hidden-nav');
          $('body').removeClass('hidden-social');
      	} else {
          // $('body').removeClass('hidden-social');
          $('body').removeClass('social-right');
          $('body').addClass('social-open');
          $('body').removeClass('routes-open');
      	}
      	isActive = !isActive;
      });

      $('.back').on('click', function() {
      	if (isActive) {
          $('body').addClass('mobile-open');
          $('body').addClass('social-open');
          $('body').removeClass('hidden-social');
          $('body').addClass('hidden-nav');
          $('body').removeClass('routes-open');
      	} else {
          $('body').addClass('social-right');
          $('body').addClass('routes-open');
      	}
      	isActive = !isActive;
      });

      $('.close').on('click', function() {
      	if (isActive) {
          $('body').addClass('routes-open');
          $('body').addClass('social-open');
          $('body').addClass('mobile-open');
          // $('body').removeClass('menu-close');
          $('body').addClass('hidden-nav');
      	} else {
          $('body').addClass('hidden-social');
          $('body').removeClass('routes-open');
          $('body').removeClass('social-open');
          $('body').removeClass('social-right');
          $('body').removeClass('hidden-nav');
          $('body').removeClass('mobile-open');
          // $('body').addClass('menu-close');
      	}
      	isActive = !isActive;
      });


    }
  };
});
