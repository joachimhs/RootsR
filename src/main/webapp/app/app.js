RootsR = Ember.Application.create({
    ready: function() {
        this._super();
    }
});

RootsR.Adapter = DS.Adapter.create({
    findAll: function(store, type) {
        var url = type.url;

        jQuery.getJSON(url, function(data) {
            // data is a Hash of key/value pairs. If your server returns a
            // root, simply do something like:
            //   store.load(type, id, data.person)
            store.loadMany(type, data);
        });
    }
});

RootsR.store = DS.Store.create({
    adapter: RootsR.Adapter
});


