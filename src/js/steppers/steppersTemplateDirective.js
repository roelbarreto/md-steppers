angular
    .module('md-steppers')
    .directive('mdSteppersTemplate', MdSteppersTemplate);

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
