angular
    .module('md-steppers')
    .controller('MdSteppersController', MdSteppersController);

/**
 * @ngInject
 */
function MdSteppersController($scope, $element, $window, $mdConstant, $mdSteppers,
    $mdUtil, $animateCss, $attrs, $compile, $mdTheming) {
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
    function attachRipple(scope, element) {
        //var options = { colorElement: angular.element(elements.inkBar) };
        //$mdStepInkRipple.attach(scope, element, options);
    }


    /**
     * Create an entry in the steppers array for a new step at the specified index.
     * @param stepData
     * @param index
     * @returns {*}
     */
    function insertStep(stepData, index) {
        var hasLoaded = loaded;
        var proto = {
            getIndex: function () { return ctrl.steppers.indexOf(step); },
            isActive: function () { return this.getIndex() === ctrl.selectedIndex; },
            isLeft: function () { return this.getIndex() < ctrl.selectedIndex; },
            isRight: function () { return this.getIndex() > ctrl.selectedIndex; },
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
                $mdUtil.nextTick(function () { select(ctrl.steppers.indexOf(step)); });
            });
        });
        return step;
    }
    
    function next(step, index){
        if(typeof ctrl.onClickContinue === 'function'){
            ctrl.onClickContinue({stepData: step, index: index});
        }
    }
    
    function back(step, index){
        if(typeof ctrl.onClickBack === 'function'){
            ctrl.onClickBack({stepData: step, index: index});
        }
    }
    
    function cancel(step, index){
        if(typeof ctrl.onClickCancel === 'function'){
            ctrl.onClickCancel({stepData: step, index: index});
        }
    }
    
    function skip(step, index){
        if(typeof ctrl.onClickSkip === 'function'){
            ctrl.onClickSkip({stepData: step, index: index});
        }
    }
}
