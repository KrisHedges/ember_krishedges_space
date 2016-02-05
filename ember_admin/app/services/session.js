import Ember from 'ember';

export default Ember.Service.extend({
  isAuthenticated: false,
  authToken: null,
  currentUser: null,
  authenticRole: null
});
