(function (angular) {
    "use strict";

    angular.module('app.widgets')
        .directive('imageGallery', imageGallery);

    imageGallery.$inject = ['$window'];
    function imageGallery($window) {

        var link = function ($scope, elem, attrs) {
            $scope.LoadNext = loadMore;
            $scope.isPending = false;
            $scope.showLoadMore = false;
            $scope.showGallery = false;
            var windowHeight, body, docHeight, windowBottom, html;

            function loadMore() {
                _fetchPhotos();
            }

            function _isBottomPage() {
                $scope.showLoadMore = false;
                if ($scope.isPending)
                    return;

                if ($scope.endOfResults) {
                    // remove scroll event when there are no more pages to fetch
                    $window.removeEventListener('scroll', _isBottomPage);
                    return;
                }
                _getDimensions();
                windowBottom = windowHeight + window.pageYOffset;
                // load more photos if bottom of page
                if (windowBottom >= docHeight) {
                    $scope.isPending = true;
                    _fetchPhotos();
                }
            }

            // get window scroll dimension
            function _getDimensions() {
                windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
                body = document.body;
                html = document.documentElement;
                docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            }

            function _fetchPhotos() {
                // get next page from service
                $scope.getNextPage({isNewSearch: false})
            }

            // bind scroll and resize event listener to window
            $window.addEventListener('scroll', _isBottomPage);

            $scope.$watch('endOfResults', function (newVal) {
                //bind scroll when there are more pages to fetch
                if (!newVal)
                    $window.addEventListener('scroll', _isBottomPage);
            });

            $scope.$watch('pendingStatus', function (pending) {
                //bind scroll when there are more pages to fetch
                $scope.isPending = pending;
                // show load more photos button if no scroll
                _getDimensions();
                $scope.showLoadMore = (html.clientHeight >= body.scrollHeight - 160 && $scope.datasource) ? true : false;
                $scope.showGallery = ($scope.datasource && $scope.datasource.length > 0);
            });

        };

        return {
            restrict: 'E',
            replace: true,
            templateUrl: './client/widgets/imageGallery/imageGallery.html',
            scope: {
                datasource: '=',
                endOfResults: '=',
                pendingStatus: '=',
                getNextPage: '&'
            },
            link: link
        };

    }

})
(window.angular);

//alfa 33 1.7 16v