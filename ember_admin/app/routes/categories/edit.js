import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{

  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(params) {
    return this.store.findRecord('category', params.category_id);
  },

  isDeleting: false,

  actions: {
    update: function(){
      var self = this;
      self.currentModel.save().then(function(){
        self.flashMessages.success("The Category has been Updated!");
        self.transitionTo('categories');
      }).catch(function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        });
      });
    },

    deleteCategory: function(){
      if (confirm("Are you sure you want to delete this Category?")) {
        this.set('isDeleting', true);
        this.currentModel.deleteRecord();
        this.currentModel.save();
        this.transitionTo('posts');
        return true;
      }
    },

    willTransition: function(transition){
      if (this.isDeleting){
        return true
      }
      if (this.currentModel.get('hasDirtyAttributes')){
        if (confirm("Are you sure you want to leave without saving your changes?")) {
          this.currentModel.rollbackAttributes();
          return true;
        } else {
          transition.abort();
        }
      }
    }

  }
});




