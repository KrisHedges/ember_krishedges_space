/* global $:false */
import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{

  beforeModel: function() {
    this.redirectUnauthenticated("login");
    if(this.get('authenticatedRole' !== "admin")){
      this.transitionTo('users');
    }
  },

  model: function() {
    return this.store.createRecord('user');
  },

  roles: ["admin","editor","author", "visitor"],

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
  },

  actions: {
    create: function(){
      var self = this;
      this.setRole();
      this.currentModel.save().then(function(model){
        self.flashMessages.success(model.get('username').capitalize() + " has been Added!");
        if (self.currentModel.get('id') === self.get('currentUser').get('id')){
          if (self.currentModel.get('role') !== self.get('authenticatedRole')){
            self.destroySession();
          }
        }
        self.transitionTo('users');
      }, function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    selectRole: function() {
      this.setRole();
    },

    cancel: function(){
      if (confirm("Are you sure you want to leave without saving your changes?")) {
        this.currentModel.deleteRecord();
        this.transitionTo('users');
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

