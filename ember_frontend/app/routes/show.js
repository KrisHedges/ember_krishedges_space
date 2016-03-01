import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    let post = this.store.peekAll('post').filterBy('slug', params.slug).get('firstObject');
    return this.store.find('post', post.id);
  }
});
