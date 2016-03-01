/* global $ */
import Ember from 'ember';
import authorization from '../../mixins/authorization';
import config from '../../config/environment';

export default Ember.Route.extend(authorization,{
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    let self = this;
    return this.store.findAll('upload').then(function(files){
      return self.treeify(files).sortBy('filename');
    });
  },

  treeify: function(list) {
      var treeList = [];
      var lookup = {};
      list.forEach(function(obj) {
        lookup[obj.get('id')] = obj;
        Ember.set(obj, 'children', []);
      });
      list.forEach(function(obj) {
        if (obj.get('parent') !== "") {
          lookup[obj.get('parent')]['children'].push(obj);
        } else {
          treeList.push(obj);
        }
      });
      return treeList;
  },

  apiURL: function(){
    return config.apiURL;
  },

  createDirectory: function(path) {
    if(path.substr(-1) === '/') {
      path = path.substr(0, path.length - 1);
    }
    if(path.substr(0,1) === '/') {
      path = path.substr(1, path.length - 1);
    }
    Ember.$.ajax({
      type: 'POST',
      url:  config.apiURL + "/uploads",
      headers:{
        'Authorization': this.get('authToken')
      },
      data:{
        file: {
          'type': 'directory',
          'path': path,
        },
        path: path
      },
      context: this
    }).done(function(){
      this.send('reloadFiles');
      this.flashMessages.success("Path Created!");
    }).fail(function(reason){
      var self = this;
      reason.responseJSON.errors.forEach(function(error){
        self.flashMessages.danger( Object.keys(error)[0].capitalize() + ": " + error[ Object.keys(error)[0] ]);
      });
    });
  },


  sendingFileEvent: Ember.computed(function() {
    let self = this;
    return function(file, xhr, data) {
      let directorylink = $(this.element).next('a');
      let path = "/uploads";
      if(directorylink.length > 0){
        path = directorylink.attr('href').replace(/.*public/,'');
      }
      xhr.setRequestHeader('Authorization', self.get('authToken'));
      data.append("path", path);
    };
  }),

  uploadComplete: Ember.computed(function(){
    let self = this;
    return function(file) {
      this.removeFile(file);
      return self.send('reloadFiles');
    };
  }),

  previewTemplate: function(){
    /*jshint multistr: true */
    return "<li class='file-preview'>\
        <div class='dz-filename'>\
          <span data-dz-name></span></div>\
        </div>\
        <a class='dz-remove' data-dz-remove>7</a>\
        <div class='dz-progress'>\
          <span class='dz-upload' data-dz-uploadprogress></span>\
        </div>\
      </li>";
  },

  killAllChildren: function(child){
    if(child.children.length > 0){
      child.children.map(function(child){
        return this.killAllChildren(child);
      }.bind(this))
    }
    return child.destroyRecord();
    this.refresh();
  },

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('uploadURL', this.apiURL() + "/uploads");
    controller.set('authToken', this.get('authToken') );
    controller.set('sendingFileEvent', this.get('sendingFileEvent') );
    controller.set('uploadComplete', this.get('uploadComplete') );
    controller.set('previewTemplate', this.previewTemplate() );
    controller.set('pathToCreate', '');
  },

  actions: {
    browse: function(){
      $(event.target).parent('li').toggleClass('visible');
    },

    preview: function(file){
      this.transitionTo('uploads.index.preview', file);
    },

    createDirectory: function(path){
      this.createDirectory(path);
    },

    reloadFiles: function(){
      this.refresh();
    },

    deleteFile: function(upload){
      let confirmation = upload.get('type') === "directory" ? "Are you sure you want to delete this directory and all of it's contents?" : "Are you sure you want to delete this file?";
      if(confirm(confirmation)){
        if(upload.children.length > 0){
          Ember.RSVP.all(
            upload.children.map(function(child){
              return this.killAllChildren(child);
            }.bind(this))
          ).then(function(){
            upload.destroyRecord().then(function(){
              this.refresh();
            }.bind(this));
          }.bind(this));
        } else {
          upload.destroyRecord();
          upload.save().then(function(){
            this.refresh();
          }.bind(this));
        }
      }
    }
  }
});
