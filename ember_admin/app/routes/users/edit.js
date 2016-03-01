/* global $:false */
import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{

  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(params) {
    return this.store.peekRecord('user',params.user_id);
  },

  afterModel: function(model){
    if((this.get('currentUser').get('id') === model.get('id')) || (this.get('authenticatedRole') === "admin")){
      return false;
    } else {
      this.transitionTo('users.user', model.get('id'));
    }
  },

  roles: ["admin","editor","author","visitor"],

  isAdmin: function() {
    return this.get('authenticatedRole') === "admin";
  },

  setRole: function(){
    var role = $("#user-role-select").val();
    this.currentModel.set('role', role);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('roles', this.roles);
    controller.set('isAdmin', this.isAdmin());
    controller.set('selectedRole', this.currentModel.get('role'));
  },

  actions: {
    edit: function(){
      var self = this;
      this.setRole();
      this.currentModel.save().then(function(model){
        self.flashMessages.success(model.get('username').capitalize() + " has been saved!");
        if (self.currentModel.get('id') === self.get('currentUser').get('id')){
          if (self.currentModel.get('role') !== self.get('authenticatedRole')){
            self.destroySession();
          }
        }
        self.transitionTo('users');
      }, function(reason){
        self.currentModel.rollbackAttributes();
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    selectRole: function() {
      this.setRole();
    },

    willTransition: function(transition){
      if (this.currentModel.get('hasDirtyAttributes')){
        if (confirm("Are you sure you want to leave without saving your changes?")) {
          this.currentModel.rollbackAttributes();
          return true;
        } else {
          transition.abort();
        }
      }
    }
  }
});
