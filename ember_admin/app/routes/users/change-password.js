import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(params) {
    return this.store.findRecord('user', params.user_id);
  },

  afterModel: function(model){
    if((this.get('currentUser').get('id') === model.get('id')) || (this.get('authenticatedRole') === "admin")){
      return false;
    } else {
      this.transitionTo('users.user', model.get('id'));
    }
  },

  actions: {
    edit: function(){
      var self = this;
      if(this.currentModel.get('password') === this.currentModel.get('confirm')){
        this.currentModel.save().then(function(model){
          if (self.currentUser === model){
            self.flashMessages.success("Your password has been changed.");
            Ember.$('#user-change-password-form')[0].reset();
            self.destroySession();
          } else {
            self.flashMessages.success("The passowrd for '" + model.username + "' has been changed.");
            Ember.$('#user-change-password-form')[0].reset();
            self.transitionTo('users');
          }
        }, function(reason){
          self.currentModel.rollbackAttributes();
          Ember.$('#user-change-password-form')[0].reset();
          reason.errors.forEach(function(error){
            self.flashMessages.danger(Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
          });
        });
      }else{
        this.flashMessages.danger("Your password and confirmation password do not match");
      }
    },
    willTransition: function(){
      Ember.$('#user-change-password-form')[0].reset();
    },

    didTransition: function(){
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$('#user-change-password-form')[0].reset();
      });
    }
  }
});

