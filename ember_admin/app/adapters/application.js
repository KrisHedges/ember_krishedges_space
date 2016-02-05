import DS from "ember-data";
import config from '../config/environment';

export default DS.RESTAdapter.extend({
  host: config.apiURL,
  sessionService: Ember.inject.service('session'),
  authToken: Ember.computed.alias('sessionService.authToken'),

  headers: Ember.computed('authToken', function() {
    return {
      "Authorization": this.get("authToken"),
    };
  }),

  shouldReloadAll: function() {
    return true;
  },

  shouldBackgroundReloadRecord: function(store, snapshot){
    return true;
  }
});
