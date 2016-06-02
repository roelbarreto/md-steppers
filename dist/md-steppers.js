;(function(angular, window) {
/*
* Credit: Credit to angular md-tabs
*         All codes are based on md-tabs by angular material
* Reference: https://github.com/angular/material
*/
MdSteppersController.$inject = ["$scope", "$element", "$window", "$mdConstant", "$mdSteppers", "$mdUtil", "$animateCss", "$attrs", "$compile", "$mdTheming"];
MdSteppersTemplate.$inject = ["$compile", "$mdUtil"];
(function () {
    config.$inject = ["$mdIconProvider"];
    run.$inject = ["$templateCache"];
    angular.module('md-steppers', ['material.core', 'material.components.icon']);

    angular.module('md-steppers').config(config).run(run);

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
                $templateCache.put([i, 'svg'].join('.'), ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">', shapes[i], '</svg>'].join(''));
            }
        }
    };
})();
angular.module('md-steppers').directive('mdStepBody', MdStepBody);

function MdStepBody() {
    return { terminal: true };
}
/**
 * @ngdoc directive
 * @name mdStep
 * @module md-steppers
 *
 * @restrict E
 *
 * @description TODO DOCS
 * Based on md-tabs by angular material https://github.com/angular/material
 *
 */
angular.module('md-steppers').directive('mdStep', MdStep);

function MdStep() {
    return {
        require: '^?mdSteppers',
        terminal: true,
        compile: function (element, attr) {

            var body = firstChild(element, 'md-step-body');

            if (body.length === 0) {
                body = angular.element('<md-step-body></md-step-body>').append(element.contents().detach());
            }

            if (body.html()) element.append(body);

            return postLink;
        },
        scope: {
            complete: '=?mdComplete',
            editable: '=?mdEditable',
            optional: '=?mdOptional',
            active: '=?mdActive',
            disabled: '=?ngDisabled',
            noCancel: '=?mdNoCancel',
            select: '&?mdOnSelect',
            deselect: '&?mdOnDeselect'
        }
    };

    function postLink(scope, element, attr, ctrl) {
        if (!ctrl) return;
        var index = ctrl.getStepElementIndex(element),
            body = firstChild(element, 'md-step-body').remove(),
            label = attr.label;

        ctrl.insertStep({
            scope: scope,
            parent: scope.$parent,
            index: index,
            element: element,
            template: body.html(),
            label: label
        }, index);
    }

    function firstChild(element, tagName) {
        if (element.length === 0) return angular.element();
        var children = element[0].children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.tagName === tagName.toUpperCase()) return angular.element(child);
        }
        return angular.element();
    }
}
angular.module('md-steppers').controller('MdSteppersController', MdSteppersController);

/**
 * @ngInject
 */
function MdSteppersController($scope, $element, $window, $mdConstant, $mdSteppers, $mdUtil, $animateCss, $attrs, $compile, $mdTheming) {
    // Major cleanup and refactor

    var ctrl = this,
        elements = getElements(),
        loaded = false;

    // define public properties
    ctrl.scope = $scope;
    ctrl.parent = $scope.$parent;
    ctrl.steppers = [];

    ctrl.attachRipple = attachRipple;
    ctrl.insertStep = insertStep;
    ctrl.getStepElementIndex = getStepElementIndex;

    //events
    ctrl.continue = next;
    ctrl.back = back;
    ctrl.skip = skip;
    ctrl.cancel = cancel;
    ctrl.setIndex = setIndex;

    init();

    function init() {
        ctrl.selectedIndex = ctrl.selectedIndex || 0;
        compileTemplate();
        $mdTheming($element);
        $mdUtil.nextTick(function () {
            loaded = true;
        });
    }

    function setIndex(stepData, index) {
        console.log('Index Set', index);
        if (!stepData.scope.disabled) {
            ctrl.selectedIndex = index;
        }
    }

    /**
    * Configure watcher(s) used by Tabs
    */
    function configureWatchers() {
        $scope.$watch('$mdSteppersCtrl.selectedIndex', handleSelectedIndexChange);
    }

    /**
    * Update the UI whenever the selected index changes. Calls user-defined select/deselect methods.
    * @param newValue
    * @param oldValue
    */
    function handleSelectedIndexChange(newValue, oldValue) {
        if (newValue === oldValue) return;

        ctrl.selectedIndex = getNearestSafeIndex(newValue);
        //ctrl.lastSelectedIndex = oldValue;
        //ctrl.updateInkBarStyles();
        //updateHeightFromContent();
        //adjustOffset(newValue);
        $scope.$broadcast('$mdSteppersChanged');
        ctrl.steppers[oldValue] && ctrl.steppers[oldValue].scope.deselect();
        ctrl.steppers[newValue] && ctrl.steppers[newValue].scope.select();
    }

    /**
    * Compiles the template provided by the user.  This is passed as an attribute from the steppers
    * directive's template function.
    */
    function compileTemplate() {
        var template = $attrs.$mdSteppersTemplate,
            element = angular.element(elements.data);
        element.html(template);
        console.log(ctrl.parent);
        $compile(element.contents())(ctrl.parent);
        delete $attrs.$mdSteppersTemplate;
    }

    // Getter methods

    /**
     * Gathers references to all of the DOM elements used by this controller.
     * @returns {{}}
     */
    function getElements() {
        var elements = {};

        // gather step bar elements
        elements.wrapper = $element[0].getElementsByTagName('md-steppers-wrapper')[0];
        elements.data = $element[0].getElementsByTagName('md-steppers-data')[0];
        elements.steppers = $element[0].getElementsByTagName('md-step-item');

        // gather step content elements
        //elements.contents = $element[0].getElementsByTagName('md-step-content');

        return elements;
    }

    function getStepElementIndex(stepEl) {
        var steppers = $element[0].getElementsByTagName('md-step');
        return Array.prototype.indexOf.call(steppers, stepEl[0]);
    }

    /**
     * Attaches a ripple to the step item element.
     * @param scope
     * @param element
     */
    function attachRipple(scope, element) {}
    //var options = { colorElement: angular.element(elements.inkBar) };
    //$mdStepInkRipple.attach(scope, element, options);


    /**
     * Create an entry in the steppers array for a new step at the specified index.
     * @param stepData
     * @param index
     * @returns {*}
     */
    function insertStep(stepData, index) {
        var hasLoaded = loaded;
        var proto = {
            getIndex: function () {
                return ctrl.steppers.indexOf(step);
            },
            isActive: function () {
                return this.getIndex() === ctrl.selectedIndex;
            },
            isLeft: function () {
                return this.getIndex() < ctrl.selectedIndex;
            },
            isRight: function () {
                return this.getIndex() > ctrl.selectedIndex;
            },
            //shouldRender: function () { return !ctrl.noDisconnect || this.isActive(); },
            //hasFocus: function () {
            //    return !ctrl.lastClick
            //        && ctrl.hasFocus && this.getIndex() === ctrl.focusIndex;
            //},
            id: $mdUtil.nextUid()
        },
            step = angular.extend(proto, stepData);
        if (angular.isDefined(index)) {
            ctrl.steppers.splice(index, 0, step);
        } else {
            ctrl.steppers.push(step);
        }
        //processQueue();
        //updateHasContent();
        $mdUtil.nextTick(function () {
            //updatePagination();
            // if autoselect is enabled, select the newly added step
            if (hasLoaded && ctrl.autoselect) $mdUtil.nextTick(function () {
                $mdUtil.nextTick(function () {
                    select(ctrl.steppers.indexOf(step));
                });
            });
        });
        return step;
    }

    function next(step, index) {
        if (typeof ctrl.onClickContinue === 'function') {
            ctrl.onClickContinue({ stepData: step, index: index });
        }
    }

    function back(step, index) {
        if (typeof ctrl.onClickBack === 'function') {
            ctrl.onClickBack({ stepData: step, index: index });
        }
    }

    function cancel(step, index) {
        if (typeof ctrl.onClickCancel === 'function') {
            ctrl.onClickCancel({ stepData: step, index: index });
        }
    }

    function skip(step, index) {
        if (typeof ctrl.onClickSkip === 'function') {
            ctrl.onClickSkip({ stepData: step, index: index });
        }
    }
}
/**
 * @ngdoc directive
 * @name mdSteppers
 * @module md-steppers
 *
 * @restrict E
 *
 * @description
 * TODO DOCS
 *
 */
angular.module('md-steppers').directive('mdSteppers', MdSteppers);

function MdSteppers() {
    return {
        scope: {
            selectedIndex: '=?mdSelected',
            vertical: '=?mdVerticalSteppers',
            onClickContinue: '&?onClickContinue',
            onClickBack: '&?onClickBack',
            onClickCancel: '&?onClickCancel',
            onClickSkip: '&?onClickSkip'
        },
        template: function (element, attr) {
            attr.$mdSteppersTemplate = element.html();
            return '<md-steppers-data></md-steppers-data>\n                    <md-steppers-label-wrapper layout="row" ng-if="!$mdSteppersCtrl.vertical">\n                        <md-step-item md-ink-ripple ng-repeat="step in $mdSteppersCtrl.steppers"\n                            ng-class="{\n                                \'md-active\':    step.isActive(),\n                                \'md-focused\':   step.hasFocus(),\n                                \'md-disabled\':  step.scope.disabled,\n                                \'md-editable\':  step.scope.editable,\n                                \'md-optional\':  step.scope.optional,\n                                \'md-complete\':  step.scope.complete\n                            }" \n                            ng-click="$mdSteppersCtrl.setIndex(step, $index)"\n                            flex\n                            layout="row" \n                            ng-disabled="step.scope.disabled || step.scope.complete">\n                            <md-step-index>{{$index+1}}</md-step-index>\n                            <div>\n                                <div class="md-step-caption">{{step.label}}</div>\n                                <small ng-if="step.scope.optional" class="md-step-subheader">Optional</small>\n                            </div>\n                        </md-step-item>\n                    </md-steppers-label-wrapper>\n                    <md-steppers-content-wrapper ng-class="{\'md-vertical-steppers\' : $mdSteppersCtrl.vertical}">\n                        <md-step-content ng-repeat="step in $mdSteppersCtrl.steppers"\n                            ng-show="step.isActive() || $mdSteppersCtrl.vertical"\n                            layout="column"\n                            flex>\n                            <md-step-item md-ink-ripple ng-if="$mdSteppersCtrl.vertical"\n                                ng-class="{\n                                    \'md-active\':    step.isActive(),\n                                    \'md-focused\':   step.hasFocus(),\n                                    \'md-disabled\':  step.scope.disabled,\n                                    \'md-editable\':  step.scope.editable,\n                                    \'md-optional\':  step.scope.optional,\n                                    \'md-complete\':  step.scope.complete\n                                }" \n                                ng-click="$mdSteppersCtrl.setIndex(step, $index)"\n                                flex\n                                layout="row" \n                                ng-disabled="step.scope.disabled || step.scope.complete">\n                                <div class="vertical-step-index-wrapper" layout="column">\n                                    <md-step-index>{{$index+1}}</md-step-index>\n                                </div>\n                                <div>\n                                    <div class="md-step-caption">{{step.label}}</div>\n                                    <div ng-if="step.scope.optional" class="md-step-subheader">Optional</div>\n                                </div>\n                            </md-step-item>\n                            <div ng-show="step.isActive()" ng-if="::step.template" class="md-step-content-wrapper" layout="{{$mdSteppersCtrl.vertical ? \'row\' : \'column\'}}">\n                                <div flex="grow">\n                                    <div class="md-step-template" md-steppers-template="::step.template" \n                                        md-steppers-template-scope="::step.parent">\n                                    </div>\n                                    <div class="md-step-actions" layout="row">\n                                        <div flex ng-if="!$mdSteppersCtrl.vertical">\n                                            <md-button ng-click="$mdSteppersCtrl.back(step, $index)" ng-disabled="$index === 0">BACK</md-button>\n                                        </div>\n                                        <div flex layout="row" layout-align="{{$mdSteppersCtrl.vertical ? \'start\' : \'end\'}}">\n                                            <md-button ng-click="$mdSteppersCtrl.cancel(step, $index)" ng-if="!step.noCancel">CANCEL</md-button>\n                                            <md-button flex-order="{{$mdSteppersCtrl.vertical ? \'-1\' : \'0\'}}" ng-click="$mdSteppersCtrl.skip(step, $index)" ng-if="step.scope.optional" ng-class="{\'md-raised\': $mdSteppersCtrl.vertical}">SKIP</md-button>\n                                            <md-button flex-order="{{$mdSteppersCtrl.vertical ? \'-2\' : \'1\'}}" ng-click="$mdSteppersCtrl.continue(step, $index)" class="md-primary" ng-class="{\'md-raised\': $mdSteppersCtrl.vertical}">CONTINUE</md-button>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </md-step-content>\n                    </md-steppers-content-wrapper>';
        },
        controller: 'MdSteppersController',
        controllerAs: '$mdSteppersCtrl',
        bindToController: true,
        link: function (scope, elem, attr, ctrl) {}
    };
}
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

    angular.module('md-steppers').factory('$mdSteppers', MdSteppersService);

    /**
    * @ngInject
    */
    function MdSteppersService() {
        return {
            next: next,
            prev: prev,
            skip: skip
        };

        function next() {}

        function prev() {}

        function skip() {}
    };
})();
angular.module('md-steppers').directive('mdSteppersTemplate', MdSteppersTemplate);

function MdSteppersTemplate($compile, $mdUtil) {
    return {
        restrict: 'A',
        link: link,
        scope: {
            template: '=mdSteppersTemplate',
            compileScope: '=mdSteppersTemplateScope'
        },
        require: '^?mdSteppers'
    };
    function link(scope, element, attr, ctrl) {
        if (!ctrl) return;
        element.html(scope.template);
        $compile(element.contents())(scope.compileScope);
        element.on('DOMSubtreeModified', function () {
            //TODO:
            //ctrl.updatePagination();
            //ctrl.updateInkBarStyles();
        });
    }
}
})(angular, window);