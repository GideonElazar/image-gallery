(function (angular) {
    "use strict";

    angular.module('app.controllers')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = [];
    function HeaderController() {
        var vm = this;
        vm.Text = 'Hello World';

    }

})(window.angular);