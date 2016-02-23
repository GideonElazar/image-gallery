(function (angular) {
    "use strict";
    angular.module('app.core')
        .service('HistoryManager', HistoryManager);

    HistoryManager.$inject = ['HISTORY_CONFIG'];
    function HistoryManager(HISTORY_CONFIG) {

        function setHistory(newHistory) {
            var historyArr = [];
            var historyJson = getHistory(HISTORY_CONFIG.historyGalleryKey);

            if (!historyJson) {
                historyArr.push(newHistory);
                window.localStorage.setItem(HISTORY_CONFIG.historyGalleryKey, JSON.stringify(historyArr));
            }
            else {
                historyArr = JSON.parse(historyJson);
                historyArr.push(newHistory);
                window.localStorage.setItem(HISTORY_CONFIG.historyGalleryKey, JSON.stringify(historyArr));
            }
        }

        function getHistory() {
            return window.localStorage.getItem(HISTORY_CONFIG.historyGalleryKey);
        }

        return {
            setHistory: setHistory
        };
    }
})(window.angular);