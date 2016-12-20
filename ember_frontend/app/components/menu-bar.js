/* global $:FALSE */
import Ember from 'ember';

export default Ember.Component.extend({
  didRender: function(){
    Ember.run.scheduleOnce('afterRender', function(){
      $('#main').scroll(function(){
        if ($("#main").scrollTop() > 200) {
          $('.logo').addClass('jumpable');
        } else {
          $('.logo').removeClass('jumpable');
        }
      });
    });
  },
 actions: {
   toggleMenu: function(){
    $('.hamburger').toggleClass('open');
    $('body').toggleClass('mobile-menu-visible');
   },

   scrollToTop: function(){
     $("#main").animate({scrollTop: 0}, 450);
   }
 }
});
