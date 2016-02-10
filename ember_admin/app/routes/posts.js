import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend(authorization, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    var self = this;
    return this.store.findAll('user').then(function(){
      return self.store.findAll('post');
    });
  },

  actions: {
    showPublishing: function(){
      $(".publishing-info").toggleClass("visible");
    },

    deletePost: function(post){
      if (confirm("Are you sure you want to delete this Post?")) {
        post.deleteRecord();
        post.save();
        return this.transitionTo('posts');
      }
    }
  }
});
