(function (angular) {
    "use strict";

    angular.module('app', [
        //3rd party
        'ngResource',
        'ui.router',
        //local
        'app.controllers',
        'app.services',
        'app.filters',
        // shared
        'app.core',
        'app.widgets'
    ]).config(config);


    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/gallery');

        var header = {
            templateUrl: 'client/views/layout/header.html',
            controller: 'HeaderController as vm'
        };

        $stateProvider
            .state('gallery', {
                url: '/gallery?term&source',
                views: {
                    '': {
                        templateUrl: 'client/views/imagesGallery/gallery.html',
                        controller: 'GalleryController as vm',
                        resolve: {
                            historyResolver: ['ImagesService', '$stateParams', 'PHOTOS_PROVIDER',
                                function (ImagesService, $stateParams, PHOTOS_PROVIDER) {
                                    if ($stateParams.term) {
                                        switch ($stateParams.source) {
                                            case PHOTOS_PROVIDER.flickr:
                                                return ImagesService.getFlickrPhotos($stateParams.term);
                                                break;
                                            case PHOTOS_PROVIDER.pixabay:
                                                return ImagesService.getPixabayPhotos($stateParams.term);
                                                break;
                                        }
                                    }

                                }]
                        }
                    },
                    HeaderController: header
                }
            })
            .state('history', {
                url: '/history',
                views: {
                    '': {
                        templateUrl: 'client/views/history/history.html',
                        controller: 'HistoryController as vm'
                    },
                    HeaderController: header
                }
            });

    }


    angular.module('app.controllers', []);
    angular.module('app.widgets', []);
    angular.module('app.services', []);
    angular.module('app.filters', []);
    angular.module('app.core', []);

})(window.angular);