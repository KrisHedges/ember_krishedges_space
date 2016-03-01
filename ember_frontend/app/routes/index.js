import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    let self = this;
    return this.store.findAll("category").then(function(){
      return self.store.findAll("post");
    });
  },

  latest_music: function(){
    let post = this.store.peekAll("category").findBy("name", "The Auditory").get("posts").sortBy('published_at').reverse();
    return post[0];
  },

  latest_web: function(){
    let post = this.store.peekAll("category").findBy("name", "The Web").get("posts").sortBy('published_at').reverse();
    return post[0];
  },

  latest_art: function(){
    let post = this.store.peekAll("category").findBy("name", "The Visual").get("posts").sortBy('published_at').reverse();
    return post[0];
  },

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('latest_music_post', this.latest_music());
    controller.set('latest_web_post', this.latest_web());
    controller.set('latest_art_post', this.latest_art());
  }

});

