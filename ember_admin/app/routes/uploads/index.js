import Ember from 'ember';
import authorization from '../../mixins/authorization';
import treeify from '../../mixins/treeify';

export default Ember.Route.extend( authorization, treeify, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    let self = this;
    return this.store.findAll('upload').then(function(files){
      return self.treeify(files).sortBy('filename');
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('store', this.store );
  }
 });
