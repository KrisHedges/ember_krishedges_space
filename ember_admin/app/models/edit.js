import DS from 'ember-data';
// User
export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  inserted_at: DS.attr('date')
});

