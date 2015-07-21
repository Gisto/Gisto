(function () {
    'use strict';

    var minimongo = require('minimongo');

    angular
        .module('gisto')
        .factory('databaseFactory', databaseFactory);

    databaseFactory.$inject = ['$q'];

    /* @ngInject */
    function databaseFactory($q) {

        var fs = require('fs');
        var DB_FILE = 'gisto.json';
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
            addToQueue: addToQueue
        };

        init();

        //var gui = require('nw.gui');
        //gui.Window.get().on('close', function() {
        //    db.close();
        //    this.close(true); // don't forget this line, else you can't close window
        //});

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
        }

        function insert(gist) {
            delete gist.$$hashKey;
            return gistCollection.upsert(gist);
        }

        function update(gist) {
            delete gist.$$hashKey;
            return gistCollection.upsert(gist);
        }

        function get(id) {
            return gistCollection.findOne({id: id});
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
            //return changesCollection.insert({
            //    action: action,
            //    item: item
            //});
        }

        function success(data) {
            this.resolve(data);
        }

        function error(error) {
            this.reject(error);
        }

    }
})();
