(function (angular) {
    "use strict";
    angular.module('app.controllers')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['HISTORY_CONFIG'];
    function HistoryController(HISTORY_CONFIG) {
        var vm = this;
        vm.HistoryArr = undefined;
        vm.clearHistory = clearHistory;

        function clearHistory() {
            window.localStorage.removeItem(HISTORY_CONFIG.historyGalleryKey);
            vm.HistoryArr = undefined;
        }

        function activate() {
            var history = window.localStorage.getItem(HISTORY_CONFIG.historyGalleryKey);
            if (history) {
                vm.HistoryArr = JSON.parse(history);
            }
        }

        activate();
    }

})(window.angular);