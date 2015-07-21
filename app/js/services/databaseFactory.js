(function () {
    'use strict';

    angular
        .module('gisto')
        .factory('databaseFactory', databaseFactory);

    databaseFactory.$inject = ['Loki'];

    /* @ngInject */
    function databaseFactory(Loki) {

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

        var gui = require('nw.gui');
        gui.Window.get().on('close', function() {
            db.close();
            this.close(true); // don't forget this line, else you can't close window
        });

        return service;

        ////////////////

        /**
         * Checks if the database file exists and loads it.
         * otherwise generates a DB file and initializes the database.
         */
        function init() {

            db = new Loki(DB_FILE, {
                env: 'NODEJS',
                autoload: true,
                autosave : true,
                autosaveInterval : 5000,
                autoloadCallback: function() {
                    gistCollection = db.getCollection('gists');
                    //changesCollection = db.getCollection('changes');

                    if (gistCollection === null) {
                        gistCollection = db.addCollection('gists');
                    }

                    //if (changesCollection === null) {
                    //    changesCollection = db.addCollection('changes');
                    //}
                }
            });
        }

        function insert(gist) {
            delete gist.$$hashKey;
            return gistCollection.insert(gist);
        }

        function update(gist) {
            delete gist.$$hashKey;
            return gistCollection.update(gist);
        }

        function get(id) {
            return gistCollection.get(id);
        }

        function remove(idOrObject) {
            return gistCollection.remove(idOrObject);
        }

        function find(query) {
            query = query || {};
            return gistCollection.find(query);
        }

        function findOne(query) {
            return gistCollection.findOne(query);
        }

        function addToQueue(action, item) {
            console.log('added to queue', action, item);
            //return changesCollection.insert({
            //    action: action,
            //    item: item
            //});
        }

    }
})();
