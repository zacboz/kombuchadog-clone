angular.module('kombuchadog').service('mainSrvc', function($http) {

  this.getUpForAdoption = () => {
    return $http({
      method: 'GET',
      url: '/our-dogs-index'
    }).then((response) => {
      return response;
    });
  };

  this.getAdopted = () => {
    return $http({
      method: 'GET',
      url: '/success-stories-index'
    }).then((response) => {
      return response;
    });
  };

  this.getDogProfile = (name) => {
    return $http({
      method: 'GET',
      url: '/our-dogs/'+name
    }).then((response) => {
      return response;
      console.log('SERVICE', response);
    });
  };

  this.getMerchandise = () => {
    return $http({
      method: 'GET',
      url: '/merchandise-index'
    }).then((response) => {
      return response;
      // console.log(response);
    });
  };

  this.getMerchandiseDetails = (id) => {
    return $http({
      method: 'GET',
      url: '/merchandise/'+id
    }).then((response) => {
      return response;
      // console.log(response);
    });
  };



});
