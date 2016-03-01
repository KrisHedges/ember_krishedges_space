import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    let self = this;
    return this.store.findAll("post").then(function(){
      return self.store.findAll("category").then(function(cats){
        return cats.findBy("name", "Pages").get("posts");
      });
    });
  }
});

