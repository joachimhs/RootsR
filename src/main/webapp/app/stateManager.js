setTimeout(function() {

    RootsR.stateManager = Ember.StateManager.create({
        rootElement: '#mainArea',
        initialState: 'showPhotoView',

        showPhotoView: Ember.ViewState.create({
            enter: function(stateManager) {
                this._super(stateManager);
                RootsR.PhotoListController.set('content', RootsR.store.findAll(RootsR.Photo));
            },

            view: Em.ContainerView.create({
                childViews: ['photoListView', 'controlButtoniew', 'selectedPhotoView'],

                photoListView: Em.View.extend({
                    elementId: "thumbnailViewList",
                    templateName: 'photo-view-list',
                    contentBinding: 'RootsR.PhotoListController.content'
                }),

                selectedPhotoView: Em.View.extend({
                    templateName: 'selected-photo',
                    contentBinding: 'RootsR.SelectedPhotoController.content',
                    classNames: ['selectedPhoto']
                }),

                controlButtoniew: Em.View.extend({
                    templateName: 'control-button-view',
                    classNames: 'controlButtons'
                })
            })
        })
    });

}, 50);

setTimeout(function() {
    RootsR.routes = Em.Object.create({
        gotoRoute: function(routeParams) {
            if(routeParams.type === 'photo' && routeParams.id) {
                RootsR.PhotoListController.selectPhotoWithId(routeParams.id);
                document.title = 'RootsR - ' + routeParams.id;
                RootsR.stateManager.goToState('showPhotoView');
            }
        }
    });

    SC.routes.add(":type/:id", RootsR.routes, 'gotoRoute');
    SC.routes.add(":type", RootsR.routes, 'gotoRoute');
}, 250)