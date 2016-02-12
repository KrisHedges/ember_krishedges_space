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
        let name = cat.get('name');
        cat.deleteRecord();
        cat.save();
        this.flashMessages.success("The category '" + name + "' has been deleted.");
        return this.transitionTo('categories');
      }
    }
  }
});
