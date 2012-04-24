RootsR.Photo = DS.Model.extend({
    primaryKey: 'id',
    id: DS.attr('string'),
    imageTitle: DS.attr('string'),
    imageUrl: DS.attr('string')
});

RootsR.Photo.reopenClass({
    url: '/photos.json'
});

RootsR.PhotoListController = Em.ArrayProxy.create({
    content: [],
    selected: null,
    timerId: null,

    startSlideshow: function() {
        this.nextPhoto();
        this.set('timerId', setInterval("RootsR.PhotoListController.nextPhoto()", 4000));
    },

    stopSlideshow: function() {
        clearInterval(this.get('timerId'));
        this.set('timerId', null);
    },

    nextPhoto: function() {
        if (!this.get('selected')) {
            SC.routes.set("location", "photo/0");
        } else {
            var selectedIndex = this.findSelectedItemIndex();

            if (selectedIndex >= (this.get('content').get('length') - 1)) {
                selectedIndex = 0;
            } else {
                selectedIndex++;
            }
            SC.routes.set("location", "photo/" + selectedIndex);
        }
    },

    prevPhoto: function() {
        if (!this.get('selected')) {
            SC.routes.set("location", "photo/0");
        } else {
            var selectedIndex = this.findSelectedItemIndex();

            if (selectedIndex <= 0) {
                selectedIndex = this.get('content').get('length') - 1;
            } else {
                selectedIndex--;
            }
            SC.routes.set("location", "photo/" + selectedIndex);
        }
    },

    findSelectedItemIndex: function() {
        var content = this.get('content');

        for (index = 0; index < content.get('length'); index++) {
            if (this.get('selected') === content.objectAt(index)) {
                return index;
            }
        }

        return 0;
    },

    selectPhotoWithId: function(id) {
        var selectedPhoto = this.get('content').objectAt(id);
        if (selectedPhoto) {
            this.set('selected', selectedPhoto);
        } else {
            SC.routes.set("location", "photo/0");
        }
    }
});

RootsR.SelectedPhotoController = Em.Object.create({
    contentBinding: 'RootsR.PhotoListController.selected'
});

RootsR.ThumbnailPhotoView = Em.View.extend({
    click: function(evt) {
        SC.routes.set("location", "photo/" + (this.get('content').get('id')-1));
    },

    tapEnd: function(recognizer) {
        SC.routes.set("location", "photo/" + (this.get('content').get('id')-1));
    },

    panOptions: {
        numberOfRequiredTouches: 1
    },

    panChange: function(recognizer) {
        var val = recognizer.get('translation');

        this.$().css({
            zIndex: 20,
            x: '%@=%@'.fmt((val.x < 0) ? '-' : '+', Math.abs(val.x)),
            y: '%@=%@'.fmt((val.y < 0) ? '-' : '+', Math.abs(val.y))
        });
    },

    classNameBindings: "isSelected",

    isSelected: function() {
        console.log(RootsR.PhotoListController.get('selected') == this.get('content'));
        return RootsR.PhotoListController.get('selected') == this.get('content');
    }.property('RootsR.PhotoListController.selected')
});

RootsR.SelectedPhotoView = Em.View.extend({
    swipeOptions: {
        direction: Em.OneGestureDirection.Left | Em.OneGestureDirection.Right,
        cancelPeriod: 100,
        numberOfRequiredTouches: 2
    },

    swipeEnd: function(recognizer) {
        if (recognizer.swipeDirection === Em.OneGestureDirection.Left) {
            RootsR.PhotoListController.nextPhoto();
        } else if (recognizer.swipeDirection === Em.OneGestureDirection.Right) {
            RootsR.PhotoListController.prevPhoto();
        }
    },

    pinchChange: function(recognizer) {
        var newScale = recognizer.get('scale');
        var curScale = this.$().css('scale');

        this.$("#selectedImage").css('scale', function(index, value) {
            return newScale * value;
        });
    },

    panOptions: {
        numberOfRequiredTouches: 1
    },

    panChange: function(recognizer) {
        var val = recognizer.get('translation');

        this.$("#selectedImage").css({
            zIndex: 10,
            x: '%@=%@'.fmt((val.x < 0) ? '-' : '+', Math.abs(val.x)),
            y: '%@=%@'.fmt((val.y < 0) ? '-' : '+', Math.abs(val.y))
        });
    }
});