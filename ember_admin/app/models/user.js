import DS from 'ember-data';
// User
export default DS.Model.extend({
  username: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  confirm: "",
  insertedAt: DS.attr('date'),
  role: DS.attr('string'),
  posts: DS.hasMany('post')
});
