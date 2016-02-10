import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{

  beforeModel: function() {
    this.redirectUnauthenticated("login");
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
    });
  },

  model: function(params) {
    var self = this;
    return this.store.findAll('category').then(function(){
      return self.get('currentUser').then( function(user){
         return self.store.createRecord('post', {user: user});
      });
    });
  },

  allCategories: function(){
    return this.store.peekAll('category');
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('all_categories', this.allCategories() );
  },
  actions: {
    create: function(){
      let self = this;
      // Set the current user as the owner
      self.currentModel.set('user', this.get('currentUser'));
      // If no slug is given attempt to set it from title
      if(!this.currentModel.get('slug')){ this.currentModel.set('slug', this.currentModel.get('url_safe_title'));}
      self.currentModel.save().then(function(model){
        self.flashMessages.success("A new post has been Added!");
        self.transitionTo('posts');
      }).catch(function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        })
      });
    },

    showPublishing: function(){
      $(".publishing-info").toggleClass("visible");
    },

    willTransition: function(transition){
      if (this.currentModel.get('isNew') ){
        if (confirm("Are you sure you want to leave without saving your changes?")) {
          this.currentModel.deleteRecord();
          return true;
        } else {
          transition.abort();
        }
      }
    }

  }
});


