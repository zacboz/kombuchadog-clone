angular.module('kombuchadog').directive('cartnav', () => {
  return {
    restrict: 'AE',
    template: "({{totalItems}})",
    scope: {},
    controller: ($scope, mainSrvc, $rootScope, $state) => {

      $rootScope.$watch('cartTotal', function(){
        // console.log('it changed');
        // console.log($rootScope.cartTotal);
        $scope.totalItems = $rootScope.cartTotal

      })


    }

}
});
