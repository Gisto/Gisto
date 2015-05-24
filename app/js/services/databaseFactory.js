(function () {
    'use strict';

    angular
        .module('gisto')
        .factory('databaseFactory', databaseFactory);

    databaseFactory.$inject = ['Loki'];

    /* @ngInject */
    function databaseFactory(Loki) {

        var fs = require('fs');
        var DB_FILE = './gisto.json';
        var gistCollection = null;
        var db = null;

        var service = {
            insert: insert,
            update: update,
            get: get,
            remove: remove,
            find: find,
            findOne: findOne,
            getGist: getGist
        };

        init();

        return service;

        ////////////////

        /**
         * Checks if the database file exists and loads it.
         * otherwise generates a DB file and initializes the database.
         */
        function init() {

            db = new Loki(DB_FILE, {
                env: 'NODEJS',
                autosave: true
            });

            fs.exists(DB_FILE, function(exists) {
                if (exists) {
                    db.loadDatabase({}, function(data) {
                        gistCollection = db.getCollection('gists');
                    });
                } else {
                    gistCollection = db.addCollection('gists');
                }
            });
        }

        // look ma, no internet.

        function insert(gist) {
            return gistCollection.insert(gist);
        }

        function update(gist) {
            return gistCollection.update(gist);
        }

        function get(id) {
            return gistCollection.get(id);
        }

        function remove(idOrObject) {
            return gistCollection.remove(idOrObject);
        }

        function find(query) {
            return gistCollection.find(query);
        }

        function findOne(query) {
            return gistCollection.findOne(query);
        }

        function getGist(gistId) {
            return gistCollection.findOne({id: gistId});
        }

    }
})();