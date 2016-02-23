(function (angular) {
    'use strict';

    angular.module('app.core')
        .constant('PHOTOS_PROVIDER', {
            'flickr': 'flickr',
            'pixabay': 'Pixabay'
        })
        .constant('FLICKR_CONFIG', {
            'key': '0d8257a89d40f523ec8c377b5512021f',
            'secret': 'e03f1ed0e9e655f4',
            'photosPerPage': '15'
        })
        .constant('PIXABAY_CONFIG', {
            'key': '2087781-a552af6f0e412c583654a4cec',
            'photosPerPage': '15'
        })
        .constant('HISTORY_CONFIG', {
            'historyGalleryKey': 'GALLERY_HISTORY'
        });

})(window.angular);