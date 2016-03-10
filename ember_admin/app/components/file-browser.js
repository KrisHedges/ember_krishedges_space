/* global $:false */
import Ember from 'ember';
import config from '../config/environment';
import treeify from '../mixins/treeify';
import authorization from '../mixins/authorization';

export default Ember.Component.extend( treeify, authorization, {

  createDirectory: function(path) {
    if(path.substr(-1) === '/') { path = path.substr(0, path.length - 1);}
    if(path.substr(0,1) === '/') { path = path.substr(1, path.length - 1);}
    Ember.$.ajax({
      type: 'POST',
      url:  config.apiURL + "/uploads",
      headers:{'Authorization': this.get('authToken')},
      data:{
        file: {
          'type': 'directory',
          'path': path,
        },
        path: path
      },
      context: this
    }).done(function(){
      $(".create-path-field").val("");
      this.reloadFiles();
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
      let path = directorylink.attr('href').replace(/.*public/,'');
      xhr.setRequestHeader('Authorization', self.get('authToken'));
      data.append("path", path);
    };
  }),

  uploadComplete: Ember.computed(function(){
    let self = this;
    return function(file) {
      if(file.status === "error"){
        this.removeFile(file);
        return self.flashMessages.danger("Unable to upload " + file.name + " please check that file isn't too large");
      }
      this.removeFile(file);
      return self.reloadFiles();
    };
  }),

  previewTemplate: Ember.computed(function(){
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
  }),

  reloadFiles: function(){
    return this.store.findAll('upload').then(function(files){
      return this.set('files', this.treeify(files));
    }.bind(this));
  },

  uploadURL: function(){
    return config.apiURL + "/uploads";
  },

  setupController: function(controller, model){
    this._super(controller, model);
    controller.set('sendingFileEvent', this.get('sendingFileEvent') );
    controller.set('uploadComplete', this.get('uploadComplete') );
    controller.set('selectedFile', false);
    controller.set('pathToCreate', '');
    controller.set('copiedToClipboard', this.copiedToClipboard);
  },

  actions: {
    browse: function(){
      $(event.target).parent('li').toggleClass('visible');
    },

    preview: function(file){
      this.controller.set('selectedFile', file);
    },

    createDirectory: function(path){
      this.createDirectory(path);
    },

    copiedToClipboard: function(){
      this.flashMessages.success("Copied Url to clipboard.");
    },

    deleteFile: function(upload){
      let confirmation = upload.get('type') === "directory" ? "Are you sure you want to delete this directory and all of it's contents?" : "Are you sure you want to delete this file?";
      if(confirm(confirmation)){
        if(upload.children.length > 0){
          Ember.RSVP.all(
            upload.children.map(function(child){
              return this.killAllTreeChildren(child);
            }.bind(this))
          ).then(function(){
            upload.destroyRecord().then(function(){
              this.reloadFiles();
            }.bind(this));
          }.bind(this));
        } else {
          upload.destroyRecord().then(function(){
            this.reloadFiles();
          }.bind(this));
        }
      }
    }
  }
});
