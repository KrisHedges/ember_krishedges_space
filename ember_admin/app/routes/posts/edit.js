/* global marked */
/* global $:false */
import Ember from 'ember';
import treeify from '../../mixins/treeify';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization, treeify, {

  beforeModel: function() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
    });
    this.redirectUnauthenticated("login");
  },

  model: function(params) {
    var self = this;
    return this.store.findAll('upload').then(function(){
      return self.store.findAll('category').then( function(){
        return self.store.findRecord('post', params.post_id);
      });
    });
  },

  allCategories: function(){
    return this.store.peekAll('category');
  },

  uploadTree: function(){
    return this.store.peekAll('upload');
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('all_categories', this.allCategories() );
    controller.set('uploads', this.treeify(this.uploadTree()) );
    controller.set('store', this.store );
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
      }, function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    browse: function(){
      $(event.target).parent('li').toggleClass('visible');
    },

    willTransition: function(transition){
      if (this.currentModel.get('isDeleted')){
        return true;
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



