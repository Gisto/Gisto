(function () {
    'use strict';

    var LinvoDB = require("linvodb3");
    LinvoDB.defaults.store = { db: require("medeadown") };

    // on OSX: ~/Library/Application Support/Gisto
    LinvoDB.dbPath = require('nw.gui').App.dataPath;

    angular
        .module('gisto')
        .factory('databaseFactory', databaseFactory);

    databaseFactory.$inject = ['$q'];

    function databaseFactory($q) {

        var gistCollection = null;
        var changesCollection = null;

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

        function init() {
            gistCollection = new LinvoDB("gists", {});
            changesCollection = new LinvoDB("changes", {});
        }

        function insert(gist) {
            delete gist.$$hashKey;
            console.log('saving', gist.id);
            return gistCollection.insert(gist);
        }

        function update(gist) {
            delete gist.$$hashKey;
            return gistCollection.update({ id: gist.id }, gist);
        }

        function get(id) {
            return findOne({id: id});
        }

        function remove(id) {
            return gistCollection.remove({ id: id });
        }

        function find(query) {
            var defer = $q.defer();
            query = query || {};
            gistCollection.find(query, dbCallback.bind(defer));

            return defer.promise;
        }

        function findOne(query) {
            var defer = $q.defer();
            gistCollection.findOne(query, dbCallback.bind(defer));

            return defer.promise;
        }

        function addToQueue(action, item) {
            console.log('added to queue', action, item);
            return changesCollection.insert({
                action: action,
                item: item
            });
        }

        function getChanges() {
            var defer = $q.defer();
            changesCollection.find({}, dbCallback.bind(defer));
            return defer.promise;
        }

        function removeChange(id) {
            changesCollection.remove(id);
        }

        function dbCallback(err, docs) {
            this.resolve(docs);
        }
    }
})();
