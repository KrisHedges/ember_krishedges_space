import Ember from 'ember';
import ifAuthorized from '../mixins/authorization';

export default Ember.Route.extend(ifAuthorized,{
  model: function() {
    return this.store.findAll('user');
  }
});
