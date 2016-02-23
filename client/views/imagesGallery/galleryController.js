(function (angular) {
    "use strict";

    angular.module('app.controllers')
        .controller('GalleryController', GalleryController);

    GalleryController.$inject = ['ImagesService', 'PIXABAY_CONFIG','HistoryManager', 'PHOTOS_PROVIDER', '$state', 'historyResolver'];
    function GalleryController(ImagesService, PIXABAY_CONFIG, HistoryManager,PHOTOS_PROVIDER, $state, historyResolver) {
        var vm = this;
        // props
        vm.provider = PHOTOS_PROVIDER;
        vm.form = {};
        vm.currentPage = 0;
        vm.endOfResults = false;
        vm.photos = [];
        // public methods
        vm.searchFlickr = searchFlickr;
        vm.searchPixabay = searchPixabay;
        vm.callback = undefined; // func to pass the to gallery directive

        function searchFlickr(isNewSearch, source) {

            _validationCheck(isNewSearch, source);

            if (!vm.callback)
                vm.callback = searchFlickr;
            vm.currentPage = vm.currentPage + 1;
            var req = {text: vm.form.searchTerm, page: vm.currentPage};
            vm.pending = true;
            ImagesService.getFlickrPhotos(req).then(function (res) {
                setServiceData(res, vm.currentProvider, isNewSearch)
            });

        }

        function searchPixabay(isNewSearch, source) {

            _validationCheck(isNewSearch, source);

            vm.callback = searchPixabay;
            vm.currentPage = vm.currentPage + 1;
            var req = {text: vm.form.searchTerm, page: vm.currentPage};
            vm.pending = true;

            ImagesService.getPixabayPhotos(req).then(function (res) {
                setServiceData(res, isNewSearch)
            });
        }

        function setServiceData(res, isNewSearch) {
            if (res) {
                switch (vm.currentProvider) {
                    case PHOTOS_PROVIDER.flickr :
                        _setFlickrResponse(res, isNewSearch);
                        break;
                    case PHOTOS_PROVIDER.pixabay :
                        _setPixabayRespons(res, isNewSearch);
                        break;
                }
            }

        }

        //private methods
        function _validationCheck(isNewSearch, source){
            // if new search is preform reset params
            if (isNewSearch) {
                vm.currentPage = 0;
                vm.endOfResults = false;
                vm.photos = [];
                vm.currentProvider = source;
            }

            if (!vm.form.searchTerm || vm.form.searchTerm === '' && vm.endOfResults)
                return;
        }

        function _setFlickrResponse(res, isNewSearch) {

            if (res.photos) {
                vm.currentPage = res.photos.page;
                var photos = [], photo, img;
                for (var i = 0; i < res.photos.photo.length; i++) {
                    photo = res.photos.photo[i];
                    img = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg'
                    photos.push(img);
                }

                vm.photos = vm.photos.concat(photos);
                // set no more results
                vm.endOfResults = !(res.photos.pages >= vm.currentPage + 1);
                vm.pending = false;
                if (isNewSearch)
                    _setHistorySearch(vm.form.searchTerm, res.photos.total)
            }
        }

        function _setPixabayRespons(res, isNewSearch) {

            if (res.hits) {
                var photos = [];
                for (var i = 0; i < res.hits.length; i++) {
                    photos.push(res.hits[i].webformatURL);
                }

                var totalPages = Math.ceil(res.totalHits / PIXABAY_CONFIG.photosPerPage);
                vm.photos = vm.photos.concat(photos);
                // set no more results
                vm.endOfResults = !(totalPages >= vm.currentPage + 1);
                vm.pending = false;
                if (isNewSearch)
                    _setHistorySearch(vm.form.searchTerm, res.totalhits)
            }
        }

        function _setHistorySearch(searchTerm, resultsCount) {

            HistoryManager.setHistory({
                term: searchTerm,
                source: vm.currentProvider,
                time: new Date().toString(),
                resultsCount: resultsCount
            });
        }

        function _activate() {
            if (historyResolver) {
                vm.currentPage = vm.currentPage + 1;
                vm.currentProvider = $state.params.source;
                vm.form.searchTerm = $state.params.term;

                switch (vm.currentProvider) {
                    case PHOTOS_PROVIDER.flickr : vm.callback = searchFlickr;
                        break;
                    case PHOTOS_PROVIDER.pixabay :vm.callback = searchPixabay;
                        break;
                }
                setServiceData(historyResolver, false);
            }
        }

        _activate();

    }
})(window.angular);

