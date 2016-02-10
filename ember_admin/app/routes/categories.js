import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend(authorization,{
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    let self = this;
    return this.store.findAll('post').then( function(){
      return self.store.findAll('category');
    })
  },
  actions: {
    deleteCategory: function(cat){
      if (confirm("Are you sure you want to delete this Category?")) {
        cat.deleteRecord();
        cat.save();
        return this.transitionTo('categories');
      }
    }
  }
});
