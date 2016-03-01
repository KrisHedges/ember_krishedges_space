/* global $ */
import Ember from 'ember';
import authorization from '../../../mixins/authorization';

export default Ember.Route.extend(authorization,{
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(params){
    let uploads = this.store.peekAll('upload');
    return uploads.findBy("filename", params.filename);
  },

  isImage: function(){
    let ext = this.get('currentModel').get('extension');
    return ['jpg', 'gif', 'png'].any(function(type){
      return type === ext;
    });
  },

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('isImage', this.isImage())
  }

});
