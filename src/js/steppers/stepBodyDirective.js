angular
    .module('md-steppers')
    .directive('mdStepBody', MdStepBody);

function MdStepBody() {
    return { terminal: true };
}

