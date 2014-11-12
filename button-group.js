(function (angular) {
    'use strict';


    // Mix in to our module
    var module;
    try {
        module = angular.module('coUtils');
    } catch (e) {
        module = angular.module('coUtils', []);
    }


    module
        .directive('btnGroup', function() {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', function($scope, $element) {
                    var buttons = [],
                        btnClass = $element.attr('btn-class') || 'btn',
                        addClass = true,
                        value = null;

                    if (btnClass === 'none') {
                        addClass = false;
                    } else {
                        $element.addClass(btnClass + '-group');
                    }

                    this.addBtn = function(btn) {
                        if (addClass) {
                            btn.element.addClass(btnClass);
                        }
                        buttons.push(btn);
                    };

                    this.removeBtn = function(btn) {
                        var index = buttons.indexOf(btn);
                        if (index > -1) {
                            buttons.splice(index, 1);
                        }
                    };

                    this.currentValue = function () {
                        return value;
                    };

                    $scope.$watch($element.attr('btn-group'), function (val) {
                        value = val;

                        angular.forEach(buttons, function (btn) {
                            if (val === btn.value()) {
                                btn.element.addClass('active');
                            } else {
                                btn.element.removeClass('active');
                            };
                        });
                    });
                }]
            };
        })

        .directive('btn', function() {
            return {
                require: '^btnGroup',
                restrict: 'A',
                link: function(scope, element, attrs, groupCtrl) {
                    var btnRef = {
                        value: function () {
                            return scope.$eval(attrs.btn);
                        },
                        element: element
                    };

                    groupCtrl.addBtn(btnRef);

                    // Button might be added after the button group is created
                    if (groupCtrl.currentValue() && groupCtrl.currentValue() === btnRef.value()) {
                        element.addClass('active');
                    }

                    scope.$on('$destroy', function () {
                        groupCtrl.removeBtn(btnRef);
                    });
                }
            };
        });

}(this.angular));
