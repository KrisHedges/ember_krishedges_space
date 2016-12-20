/* global $:FALSE */
import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function(){
      $('body').removeClass('mobile-menu-visible');
      $('.hamburger').removeClass('open');
    }
  }
});
