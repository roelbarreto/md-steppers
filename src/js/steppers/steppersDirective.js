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
angular
    .module('md-steppers')
    .directive('mdSteppers', MdSteppers);

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
            return `<md-steppers-data></md-steppers-data>
                    <md-steppers-label-wrapper layout="row" ng-if="!$mdSteppersCtrl.vertical">
                        <md-step-item md-ink-ripple ng-repeat="step in $mdSteppersCtrl.steppers"
                            ng-class="{
                                'md-active':    step.isActive(),
                                'md-focused':   step.hasFocus(),
                                'md-disabled':  step.scope.disabled,
                                'md-editable':  step.scope.editable,
                                'md-optional':  step.scope.optional,
                                'md-complete':  step.scope.complete
                            }" 
                            ng-click="$mdSteppersCtrl.setIndex(step, $index)"
                            flex
                            layout="row" 
                            ng-disabled="step.scope.disabled || step.scope.complete">
                            <md-step-index>{{$index+1}}</md-step-index>
                            <div>
                                <div class="md-step-caption">{{step.label}}</div>
                                <small ng-if="step.scope.optional" class="md-step-subheader">Optional</small>
                            </div>
                        </md-step-item>
                    </md-steppers-label-wrapper>
                    <md-steppers-content-wrapper ng-class="{'md-vertical-steppers' : $mdSteppersCtrl.vertical}">
                        <md-step-content ng-repeat="step in $mdSteppersCtrl.steppers"
                            ng-show="step.isActive() || $mdSteppersCtrl.vertical"
                            layout="column"
                            flex>
                            <md-step-item md-ink-ripple ng-if="$mdSteppersCtrl.vertical"
                                ng-class="{
                                    'md-active':    step.isActive(),
                                    'md-focused':   step.hasFocus(),
                                    'md-disabled':  step.scope.disabled,
                                    'md-editable':  step.scope.editable,
                                    'md-optional':  step.scope.optional,
                                    'md-complete':  step.scope.complete
                                }" 
                                ng-click="$mdSteppersCtrl.setIndex(step, $index)"
                                flex
                                layout="row" 
                                ng-disabled="step.scope.disabled || step.scope.complete">
                                <div class="vertical-step-index-wrapper" layout="column">
                                    <md-step-index>{{$index+1}}</md-step-index>
                                </div>
                                <div>
                                    <div class="md-step-caption">{{step.label}}</div>
                                    <div ng-if="step.scope.optional" class="md-step-subheader">Optional</div>
                                </div>
                            </md-step-item>
                            <div ng-show="step.isActive()" ng-if="::step.template" class="md-step-content-wrapper" layout="{{$mdSteppersCtrl.vertical ? 'row' : 'column'}}">
                                <div flex="grow">
                                    <div class="md-step-template" md-steppers-template="::step.template" 
                                        md-steppers-template-scope="::step.parent">
                                    </div>
                                    <div class="md-step-actions" layout="row">
                                        <div flex ng-if="!$mdSteppersCtrl.vertical">
                                            <md-button ng-click="$mdSteppersCtrl.back(step, $index)" ng-disabled="$index === 0">BACK</md-button>
                                        </div>
                                        <div flex layout="row" layout-align="{{$mdSteppersCtrl.vertical ? 'start' : 'end'}}">
                                            <md-button ng-click="$mdSteppersCtrl.cancel(step, $index)" ng-if="!step.noCancel">CANCEL</md-button>
                                            <md-button flex-order="{{$mdSteppersCtrl.vertical ? '-1' : '0'}}" ng-click="$mdSteppersCtrl.skip(step, $index)" ng-if="step.scope.optional" ng-class="{'md-raised': $mdSteppersCtrl.vertical}">SKIP</md-button>
                                            <md-button flex-order="{{$mdSteppersCtrl.vertical ? '-2' : '1'}}" ng-click="$mdSteppersCtrl.continue(step, $index)" class="md-primary" ng-class="{'md-raised': $mdSteppersCtrl.vertical}">CONTINUE</md-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </md-step-content>
                    </md-steppers-content-wrapper>`;
        },
        controller: 'MdSteppersController',
        controllerAs: '$mdSteppersCtrl',
        bindToController: true,
        link: function (scope, elem, attr, ctrl) {

        }
    };
}