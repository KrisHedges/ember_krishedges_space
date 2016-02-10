import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend( authorization,{
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },
  model: function() {
    let self = this
    return this.store.findAll('post').then(function(){
      return self.store.findAll('user');
    });
  },
  actions: {
    deleteUser: function(user){
      if (confirm("Are you sure you want to delete this User?")) {
        user.deleteRecord();
        user.save();
        return this.transitionTo('users');
      }
    }
  }
});
