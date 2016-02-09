import Ember from 'ember';

export default Ember.Component.extend({

  didReceiveAttrs: function(){
    this.set('available_categories', this.availableCategories() );
  },

  availableCategories: function(){
    return this.all_categories.filter( function(item, index, enumerable){
      return !this.post.get('categories').contains(item);
    }, this).sortBy('name')
  },

  actions: {
    addCategory: function(cat, post){
      let self = this;
      if (post.get('categories').pushObject(cat)){
        self.set('available_categories', self.availableCategories() );
        post.set('hasDirtyAttributes', true);
      };
    },

    removeCategory: function(cat, post){
      let self = this;
      if (post.get('categories').removeObject(cat)){
        self.set('available_categories', self.availableCategories() );
        post.set('hasDirtyAttributes', true);
      };
    }
  }
});
