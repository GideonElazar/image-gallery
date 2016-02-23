(function (angular) {
    "use strict";

    angular.module('app.widgets')
        .directive('imageLazySrc', imageLazySrc);

    imageLazySrc.$inject = ['$document', '$window', '$timeout'];

    function imageLazySrc($document, $window, $timeout) {

        var link = function ($scope, elem, attrs) {

            var _preloadTime = attrs.preloadTime ? attrs.preloadTime : 300;

            function isInView() {
                // get current viewport position and dimensions, and image position
                var clientHeight = $document[0].documentElement.clientHeight,
                    clientWidth = $document[0].documentElement.clientWidth,
                    imageRect = elem[0].getBoundingClientRect();

                if (
                    (imageRect.top >= 0 && imageRect.bottom - imageRect.height <= clientHeight)
                    &&
                    (imageRect.left >= 0 && imageRect.right <= clientWidth)
                ) {
                    $timeout(function () {
                        elem[0].src = attrs.imageLazySrc; // set src attribute on element (it will load image)
                    }, _preloadTime);

                    elem[0].onload = function () {
                        // remove preloader css class
                        elem[0].className =  elem[0].className.replace('preloader', '');
                    };
                    // unbind event listeners when image src has been set
                    removeEventListeners();
                }
            }

            function removeEventListeners() {
                $window.removeEventListener('scroll', isInView);
                $window.removeEventListener('resize', isInView);
            }

            // bind scroll and resize event listener to window
            $window.addEventListener('scroll', isInView);
            $window.addEventListener('resize', isInView);

            // unbind event listeners if element was destroyed
            // it happens when you change view, etc
            elem.on('$destroy', function () {
                removeEventListeners();
            });

            // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
            isInView();
        };

        return {
            restrict: 'A',
            link: link
        };

    }

})
(window.angular);
