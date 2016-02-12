import Ember from 'ember';
import authorization from '../../mixins/authorization';

export default Ember.Route.extend( authorization,{

  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(params) {
    return this.store.createRecord('category');
  },

  actions: {
    create: function(){
      let self = this;
      self.currentModel.save().then(function(model){
        self.flashMessages.success("A new category has been Added!");
        self.transitionTo('categories');
      }), function(reason){
        reason.errors.forEach(function(error){
          self.flashMessages.danger( Object.keys(error)[0].capitalize() + ":  " + error[ Object.keys(error)[0] ]);
        })
      };
    },

    cancel: function(){
      if (confirm("Are you sure you want to leave without saving your changes?")) {
        this.currentModel.deleteRecord();
        this.transitionTo('categories');
      }
    },

    willTransition: function(transition){
      if (this.currentModel.get('isNew') ){
        if (confirm("Are you sure you want to leave without saving your changes?")) {
          this.currentModel.deleteRecord();
          return true;
        } else {
          transition.abort();
        }
      }
    }

  }
});



