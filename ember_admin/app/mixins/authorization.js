import Ember from 'ember';

export default Ember.Mixin.create({
  sessionService: Ember.inject.service('session'),
  isAuthenticated: Ember.computed.alias('sessionService.isAuthenticated'),
  authToken: Ember.computed.alias('sessionService.authToken'),
  currentUser: Ember.computed.alias('sessionService.currentUser'),

  activate: function(){
    this.controllerFor('Application').set('isAuthenticated', this.get('isAuthenticated'))
    this.controllerFor('Application').set('currentUser', this.get('currentUser'))
    this.controllerFor('Application').set('authToken', this.get('authToken'))
  },

  beforeModel() {
    if (!this.get('isAuthenticated')){
      this.transitionTo('login');
    }
  },

  actions:{
    logout: function(){
      this.controllerFor('Application').set('isAuthenticated', false)
      this.controllerFor('Application').set('currentUser', null)
      this.controllerFor('Application').set('authToken', null)
      this.transitionTo('login');
    }
  }
});
