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
    }
  }
});
