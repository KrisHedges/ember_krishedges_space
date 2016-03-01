/* global Ember */
import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({
  filename: DS.attr('string'),
  type: DS.attr('string'),

  path: Ember.computed('id', function(){
    return config.staticHostURL + this.get('id');
  }),

  extension: Ember.computed('filname', function(){
    let filename = this.get('filename');
    let ext = filename.replace(/.*\./, '');
    return ext;
  }),

  parent: Ember.computed('id', function(){
    return this.get('id').substr(0, this.get('id').lastIndexOf("/"))
  })

});

