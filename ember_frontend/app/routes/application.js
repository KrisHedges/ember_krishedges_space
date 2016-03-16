import Ember from 'ember';
import pages from '../mixins/pages';

export default Ember.Route.extend( pages,{
  latest_life_post: function(){
    let post = this.store.peekAll("category").findBy("name", "The Living Mind").get("posts").sortBy('published_at').reverse();
    return post[0];
  },
  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('latest_life_post', this.latest_life_post());
  }
});

