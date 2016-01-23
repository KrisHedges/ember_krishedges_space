import Ember from 'ember';

export default Ember.Controller.extend({
  sessionService: Ember.inject.service('session'),
  isAuthenticated: Ember.computed.alias('sessionService.isAuthenticated'),
  authToken: Ember.computed.alias('sessionService.authToken'),
  currentUser: Ember.computed.alias('sessionService.currentUser'),

  actions:{
    login: function(username, password){
      var self = this;
      Ember.$.ajax({
        type: 'POST',
        url: "http://localhost:4000/api/sessions",
        data:{
          user: {
            username: username,
            password: password
          },
        },
        context: this
      }).then(function(data){
        this.set('isAuthenticated', true);
        this.set('authToken', data.token);
        this.set('currentUser', data.user);
        this.transitionToRoute('index');
      });
    }
  }
});
