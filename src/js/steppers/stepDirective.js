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
angular
    .module('md-steppers')
    .directive('mdStep', MdStep);

function MdStep() {
    return {
        require: '^?mdSteppers',
        terminal: true,
        compile: function (element, attr) {

            var body = firstChild(element, 'md-step-body');

            if(body.length === 0){
                body = angular
                    .element('<md-step-body></md-step-body>')
                    .append(element.contents().detach());
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
