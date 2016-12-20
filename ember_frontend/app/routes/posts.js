/* global $:FALSE */
import Ember from 'ember';
import pages from '../mixins/pages';

export default Ember.Route.extend(pages,{
  model: function(){
    let self = this;
    return this.store.findAll('category').then(function(){
      return self.store.findAll('post').then(function(posts){
        return posts.filter(function(post){
          return post.get('categories').any(function(cat){
            return cat.get('name') !== "Pages";
          });
        }).sortBy('published_at').reverse();
      });
    });
  },
  actions: {
    didTransition: function(){
      $('body').removeClass('mobile-menu-visible'); 
      $('.hamburger').removeClass('open');
      if(screen.width < 1023){
        Ember.run.schedule('afterRender', function () {
          $("#main").animate({scrollTop: $("header").outerHeight() - 60}, 450);
        });
      }
    }
  }
});
