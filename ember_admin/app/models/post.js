import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  title: DS.attr('string'),
  slug: DS.attr('string'),
  body: DS.attr('string'),
  published: DS.attr('boolean'),
  published_at: DS.attr('date'),
  inserted_at: DS.attr('date'),
  edits: DS.hasMany('edit'),
  user: DS.belongsTo('user'),

  author_name: Ember.computed.alias('user.username'),
  author_email: Ember.computed.alias('user.email'),

  url_safe_title: Ember.computed('title', function(){
    let title = this.get('title')
    if(title){
      return title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    } else {
      return "url-for-post";
    }
  }),

  last_edit: Ember.computed('edits', function(){
    let editor = this.get('edits').sortBy('inserted_at').get('lastObject').get('user').get('username');
    let time = this.get('edits').sortBy('inserted_at').get('lastObject').get('inserted_at');
    return moment(time).format('MMMM Do YYYY, h:mm:ss A') + " by: " + editor;
  }),

  published_date: Ember.computed('published_at', function(){
    let time = this.get('published_at');
    return moment(time).format('MMMM Do YYYY, h:mm:ss A');
  })
});
