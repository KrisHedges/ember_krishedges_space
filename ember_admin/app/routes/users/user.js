import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },
  model: function(params) {
    return this.store.find('user',params.user_id);
  },

  isUser: function(){
    return this.get('currentUser').get('id') == this.currentModel.id;
  },

  isAdmin: function() {
    return this.get('authenticatedRole') == "admin";
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('isUser', this.isUser());
    controller.set('isAdmin', this.isAdmin());
  },
  actions: {
    deleteUser: function(user){
      user.destroyRecord();
      this.transitionTo('users');
    }
  }
});

