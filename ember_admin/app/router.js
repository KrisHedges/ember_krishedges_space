import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('users', function(){
    this.route('edit',{path: "/:user_id/edit"});
    this.route('new',{path: "/new"});
    this.route('change-password',{path: "/:user_id/change-password"});
  });
  this.route('posts', function(){
    this.route('edit',{path: "/:post_id/edit"});
    this.route('new', {path: "/new"});
  });
  this.route('categories', function(){
    this.route('edit',{path: "/:category_id/edit"});
    this.route('new', {path: "/new"});
  });
  this.route('uploads', function() {
    this.route('index', { path: '/' }, function(){
      this.route('preview', { path: '/:filename' });
    });
  });
  this.route('login');
});

export default Router;
