/* global Ember */
/* global moment */
import DS from 'ember-data';
// User
export default DS.Model.extend({
  username: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  confirm: "",
  inserted_at: DS.attr('string'),
  role: DS.attr('string'),
  posts: DS.hasMany('post'),

  post_count: Ember.computed('posts', function(){
    return this.get('posts').length;
  }),

  created: Ember.computed('inserted_at', function(){
    let time = this.get('inertedt_at');
    return moment(time).format('MMMM Do, YYYY');
  })
});
