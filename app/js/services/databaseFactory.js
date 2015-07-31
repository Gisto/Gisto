(function () {
    'use strict';

    var minimongo = require('minimongo');

    angular
        .module('gisto')
        .factory('databaseFactory', databaseFactory);

    databaseFactory.$inject = ['$q'];

    /* @ngInject */
    function databaseFactory($q) {

        var gistCollection = null;
        var changesCollection = null;
        var db = null;

        var service = {
            insert: insert,
            update: update,
            get: get,
            remove: remove,
            find: find,
            findOne: findOne,
            addToQueue: addToQueue,
            getChanges: getChanges,
            removeChange: removeChange
        };

        init();

        return service;

        ////////////////

        /**
         * Checks if the database file exists and loads it.
         * otherwise generates a DB file and initializes the database.
         */
        function init() {

            var LocalDb = minimongo.LocalStorageDb;

            db = new LocalDb({namespace: 'gisto'});

            db.addCollection('gists');
            db.addCollection('changes');

            gistCollection = db.gists;
            changesCollection = db.changes;

            window.cc = changesCollection;
        }

        function insert(gist) {
            delete gist.$$hashKey;
            gist._id = gist.id;
            return gistCollection.upsert(gist);
        }

        function update(gist) {
            delete gist.$$hashKey;
            gist._id = gist.id;
            return gistCollection.upsert(gist);
        }

        function get(id) {
            return findOne({id: id});
        }

        function remove(idOrObject) {
            return gistCollection.remove(idOrObject);
        }

        function find(query) {
            var defer = $q.defer();
            query = query || {};
            gistCollection.find(query).fetch(success.bind(defer), error.bind(defer));

            return defer.promise;
        }

        function findOne(query) {
            var defer = $q.defer();
            gistCollection.findOne(query, success.bind(defer), error.bind(defer));

            return defer.promise;
        }

        function addToQueue(action, item) {
            console.log('added to queue', action, item);
            return changesCollection.upsert({
                action: action,
                item: item
            });
        }

        function getChanges() {
            var defer = $q.defer();
            changesCollection.find().fetch(success.bind(defer), error.bind(defer));
            return defer.promise;
        }

        function removeChange(id) {
            changesCollection.remove(id);
        }

        function success(data) {
            this.resolve(data);
        }

        function error(error) {
            this.reject(error);
        }

    }
})();
