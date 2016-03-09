/* global marked */
import Ember from 'ember';
import treeify from '../../mixins/treeify';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization, treeify, {

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

  model: function() {
    var self = this;
    return this.store.findAll('upload').then(function(){
      return self.store.findAll('category').then(function(){
        return self.get('currentUser').then( function(user){
           return self.store.createRecord('post', {user: user});
        });
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
  },

  actions: {
    create: function(){
      let self = this;
      // Set the current user as the owner
      self.currentModel.set('user', this.get('currentUser'));
      // If no slug is given attempt to set it from title
      if(!this.currentModel.get('slug')){ this.currentModel.set('slug', this.currentModel.get('url_safe_title'));}
      self.currentModel.save().then(function(){
        self.flashMessages.success("A new post has been Added!");
        self.transitionTo('posts');
      }, function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    cancel: function(){
      if (confirm("Are you sure you want to leave without saving your changes?")) {
        this.currentModel.deleteRecord();
        this.transitionTo('posts');
      }
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


