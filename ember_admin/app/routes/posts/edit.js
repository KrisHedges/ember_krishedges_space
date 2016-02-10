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
    return this.store.findAll('category').then( function(){
      return self.store.findRecord('post', params.post_id);
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
    update: function(){
      var self = this;
      // If no slug is given attempt to set it from title
      if(!this.currentModel.get('slug')){ this.currentModel.set('slug', this.currentModel.get('url_safe_title'));}
      self.currentModel.save().then(function(){
        self.flashMessages.success("The post has been Updated!");
        self.currentModel.set('hasDirtyAttributes', false);
        self.transitionTo('posts');
      }).catch(function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    willTransition: function(transition){
      if (this.currentModel.get('isDeleted')){
        return true
      }
      if (this.currentModel.get('hasDirtyAttributes')){
        if (confirm("Are you sure you want to leave without saving your changes?")) {
          this.currentModel.rollbackAttributes();
          this.currentModel.set('hasDirtyAttributes', false);
          return true;
        } else {
          transition.abort();
        }
      }
    }

  }
});



