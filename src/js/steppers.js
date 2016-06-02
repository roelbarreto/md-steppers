/*
* Credit: Credit to angular md-tabs
*         All codes are based on md-tabs by angular material
* Reference: https://github.com/angular/material
*/
(function () {
    angular.module('md-steppers', [
        'material.core',
        'material.components.icon']);

    angular.module('md-steppers')
        .config(config)
        .run(run);

    /**
    * @ngInject
    */
    function config($mdIconProvider) {
        $mdIconProvider.icon('md-steppers-check', 'md-steppers-check.svg');
        $mdIconProvider.icon('md-steppers-pencil', 'md-steppers-check.svg');
    };

    /**
    * @ngInject
    */
    function run($templateCache) {

        var shapes = {
            'md-steppers-check': '<path d="M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />',
            'md-steppers-pencil': '<path d="M11.83104,8.61896L3.69,3.69L-5.76,5.76L-3.47,-0.22L-0.22,-3.47L5.76,-5.76ZM2.95,-2.95L-2.03,2.03L3.69,3.69L2.03,-2.03L-3.69,-3.69Z" />'
        };
        for (var i in shapes) {
            if (shapes.hasOwnProperty(i)) {
                $templateCache.put([i, 'svg'].join('.'),
                    ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">', shapes[i], '</svg>'].join(''));
            }
        }

    };
} ());