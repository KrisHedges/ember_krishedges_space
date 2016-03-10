import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend( authorization, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  }
});

