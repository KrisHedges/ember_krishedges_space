/*global $:false */
import Ember from 'ember';
import authorization from '../mixins/authorization';
import config from '../config/environment';

export default Ember.Route.extend( authorization,{
  beforeModel: function(){
    if (this.canAuthenticate()){
      this.transitionTo('index');
    }
  },

  afterModel: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $("#login-form")[0].reset();
    });
  },

  actions: {
    login: function(username, password){
      Ember.$.ajax({
        type: 'POST',
        url:  config.apiURL + "/sessions",
        data:{
          user: {
            username: username,
            password: password
          },
        },
        context: this
      }).done(function(data){
        this.createSession(data);
        this.transitionTo('index');
        this.flashMessages.success("Welcome Back! " + data.user.username);
      }).fail(function(reason){
        var self = this;
        reason.responseJSON.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ": " + error[ Object.keys(error)[0] ]);
        });
        $("#login-form")[0].reset();
      });
    }
  }
});
