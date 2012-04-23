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
        currentRoute: null,

        gotoRoute: function(routeParams) {
            console.log('RootsR.routes gotoRoute. type: ' + routeParams.type + " id: " + routeParams.id);
            if(routeParams.type === 'photo' && routeParams.id) {
                RootsR.PhotoListController.selectPhotoWithId(routeParams.id);
                document.title = 'RootsR - ' + routeParams.id;
                //RootsR.stateManager.goToState('showPostView');
            } /*else if(routeParams.type === 'page' && routeParams.id) {
                RootsR.HeaderLinksController.selectLinkWithId(routeParams.id);
                ember_disqus_identifier = '/page/' + routeParams.id ;
                document.title = 'Haagen.name - ' + routeParams.id;
                ember_disqus_title = routeParams.id;
                RootsR.stateManager.goToState('showPageView');
            } else if (routeParams.type === 'main') {
                RootsR.stateManager.goToState('showMainView');
                ember_disqus_identifier = '/main';
                ember_disqus_title = 'Haagen.name';
                document.title = 'Haagen.name - Home';
                RootsR.PostListController.set('selectedPost', null);
            }*/
        }
    });

    SC.routes.add(":type/:id", RootsR.routes, 'gotoRoute');
    SC.routes.add(":type", RootsR.routes, 'gotoRoute');
}, 250)