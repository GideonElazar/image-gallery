(function (angular) {
    "use strict";

    angular.module('app.services')
        .factory('ImagesService', ImagesService);

    ImagesService.$inject = ['$http', 'FLICKR_CONFIG', 'PIXABAY_CONFIG'];

    function ImagesService($http, FLICKR_CONFIG, PIXABAY_CONFIG) {

        var service = {
            getFlickrPhotos: getFlickrPhotos,
            getPixabayPhotos: getPixabayPhotos
        };

        function getFlickrPhotos(term) {

            var _url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + FLICKR_CONFIG.key +
                '&text=' + encodeURIComponent(term.text) +
                '&per_page=' + FLICKR_CONFIG.photosPerPage +
                '&page=' + term.page +
                '&privacy_filter=1&content_type=1&format=json&nojsoncallback=1';

            var req = {
                method: 'GET',
                url: _url,
                cache: false,
                headers: {'Content-Type': 'application/json'}
            };

            return $http(req).then(function (res) {
                if (res && res.status === 200)
                    return res.data;
            });
        }

        function getPixabayPhotos(term) {

            var _url = 'https://pixabay.com/api/?key=' + PIXABAY_CONFIG.key +
                '&image_type=photo' +
                '&q=' + encodeURIComponent(term.text) +
                '&per_page=' + FLICKR_CONFIG.photosPerPage +
                '&page=' + term.page;

            var req = {
                method: 'GET',
                url: _url,
                cache: false,
                headers: {'Content-Type': 'application/json'}
            };

            return $http(req).then(function (res) {
                if (res && res.status === 200)
                    return res.data;
            });
        }

        return service;
    }

})(window.angular);