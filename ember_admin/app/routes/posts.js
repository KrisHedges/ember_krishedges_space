/* global $:false */
import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend(authorization, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    return this.store.findAll('user').then(function(){
      return this.store.findAll('post');
    }.bind(this));
  },

  actions: {
    showPublishing: function(){
      $('.show-publishing').toggleClass('active');
      if($('.post-edit-form').hasClass('file-browser-visible')){
        $('.show-files').removeClass('active');
        $('.post-edit-form').removeClass('file-browser-visible');
        setTimeout(function(){
          $('.post-edit-form').toggleClass('publishing-info-visible');
        }, 175);
      } else {
        $('.post-edit-form').toggleClass('publishing-info-visible');
      }
    },

    showFiles: function(){
      $('.show-files').toggleClass('active');
      if($('.post-edit-form').hasClass('publishing-info-visible')){
        $('.show-publishing').removeClass('active');
        $('.post-edit-form').removeClass('publishing-info-visible');
        setTimeout(function(){
          $('.post-edit-form').toggleClass('file-browser-visible');
        }, 175);
      } else {
        $('.post-edit-form').toggleClass('file-browser-visible');
      }
    },

    deletePost: function(post){
      if (confirm("Are you sure you want to delete this Post?")) {
        post.destroyRecord().then(function(){this.transitionTo('posts')}.bind(this))
      }
    }
  }
});
