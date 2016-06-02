(function () {
    'use strict';

    /**
   * @ngdoc service
   * @name $mdSteppers
   * @module md-steppers
   *
   * @description
   * TODO DOCS
   *
   */

    angular.module('md-steppers')
      .factory('$mdSteppers', MdSteppersService);

    /**
    * @ngInject
    */
    function MdSteppersService() {
        return {
            next: next,
            prev: prev,
            skip: skip
        };

        function next() {
            
        }
        
        function prev() {
            
        }
        
        function skip() {
            
        }
    };
})();
