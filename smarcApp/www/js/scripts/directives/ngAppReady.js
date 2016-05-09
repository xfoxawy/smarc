smarc.directive('ngAppReady', [function() {
    return {
        priority: Number.MIN_SAFE_INTEGER, // execute last, after all other directives if any.
        restrict: "A",
        link: function($scope, $element, $attributes) {
            $scope.$eval($attributes.ngAppReady); // execute the expression in the attribute.
        }
    };
}]);
