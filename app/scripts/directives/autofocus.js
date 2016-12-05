(function(){

  'use strict';

  angular
  .module('app')
  .directive('autofocus',autofocus);

  function autofocus($timeout) {

    var directive = {
        restrict: 'A',
        link : function($scope, $element) {
          $timeout(function() {
            $element[0].focus();
          });
        }
    };

    return directive;

  }

})();