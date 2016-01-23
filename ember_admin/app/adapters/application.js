import DS from "ember-data";

export default DS.RESTAdapter.extend({
  host: 'http://localhost:4000/api',
  sessionService: Ember.inject.service('session'),
  authToken: Ember.computed.alias('sessionService.authToken'),

  headers: Ember.computed('authToken', function() {
    return {
      "Authorization": this.get("authToken"),
    };
  }),

  shouldReloadAll() {
    return true;
  }
});
