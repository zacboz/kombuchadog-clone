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
      // console.log('SERVICE', response);
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

  this.addToCart = (productTitle, productImage, productSize, productQuantity, productPrice, productId) => {
    let item = {
      productTitle: productTitle,
      productImage: productImage,
      productSize: productSize,
      productQuantity: productQuantity,
      productPrice: productPrice,
      productId: productId
    }
    return $http({
      method: 'POST',
      url: '/cart',
      data: item
    }).success(() => {
      // console.log('SRVC item added')
    });
  };

  this.getCart = () => {
    return $http({
      method: 'GET',
      url: '/cart'
    }).then((response) => {
      // console.log('SRVC CART', response)
      return response;
    });
  };

  this.removeFromCart = (item) => {
    let id = item.productId
    return $http({
      method: 'DELETE',
      url: '/cart/'+id
    }).then((response) => {
      console.log('SRVE REMOVE FROM CART', response);
      return response;
    });
  };

  this.updateQuantity = (productId, productQuantity) => {
    let product = {
      productId: productId,
      productQuantity: productQuantity
    }
    console.log('SRVC product', product);
    return $http({
      method: 'PUT',
      url: '/cart/'+productId,
      data: product
    }).success((response) => {
      console.log('SRVC UPDATING', response);
    })
  };

  this.postOrder = (token, total, cart) => {
    console.log('SRVC TOKEN', token);
    return $http({
      method: 'POST',
      url: '/order',
      data: {token, total, cart}
    }).success((response) => {
      console.log('SRVC token', response);
      return response;
    });
  };

  



});
