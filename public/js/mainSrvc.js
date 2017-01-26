angular.module('kombuchadog').service('mainSrvc', ($http) => {

  this.getUpForAdoption = () => {
    return $http({
      method: 'GET',
      url: '/our-dogs-up-for-adoption-index'
    }).then((response) => {
      return response;
    });
  };

  this.getAdopted = () => {
    return $http({
      method: 'GET',
      url: '/success-stories-adopted-index'
    }).then((response) => {
      return response;
    });
  };

});
