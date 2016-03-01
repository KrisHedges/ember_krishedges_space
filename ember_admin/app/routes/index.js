/* global Chart */
import Ember from 'ember';
import authorization from '../mixins/authorization';

export default Ember.Route.extend( authorization, {
  beforeModel: function() {
    this.redirectUnauthenticated("login");
  },

  model: function(){
    var self = this;
    return this.store.findAll('user').then(function(){
      return self.store.findAll('category').then(function(){
        return self.store.findAll('post');
      });
    });
  },

  categoryFrequency: function(){
    let totalPosts = this.controller.get('model').get('length');
    let category_post_frequency = this.store.peekAll('category').map( function(category){
      let cat = {};
      cat.name = category.get('name');
      cat.frequency = Math.round(category.get('post_count') / totalPosts * 100);
      return cat;
    });
    let chart_data = {};
    chart_data.labels = category_post_frequency.map(function(item){return item.name;});
    chart_data.datasets = [{
      fillColor: "#efefef",
      strokeColor: "#444",
      highlightFill: "#444",
      highlightStroke: "#efefef",
      data: category_post_frequency.map(function(item){return item.frequency;})
    }];
    return chart_data;
  },

  mostActiveUsers: function(){
    let totalPosts = this.controller.get('model').get('length');
    let user_post_frequency = this.store.peekAll('user').filterBy('post_count').map( function(user){
      let data = {};
      data.username = user.get('username').capitalize();
      data.frequency = Math.round(user.get('post_count') / totalPosts * 100);
      return data;
    });
    let chart_data = {};
    chart_data.labels = user_post_frequency.map(function(item){return item.username;});
    chart_data.datasets = [{
      fillColor: "#efefef",
      strokeColor: "#444",
      highlightFill: "#444",
      highlightStroke: "#efefef",
      data: user_post_frequency.map(function(item){return item.frequency;})
    }];
    return chart_data;
  },

  latestPosts: function(){
    return this.controller.get('model').sortBy('inserted_at').reverse().slice(0,3);
  },

  setDashboardData: function(){
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.scaleFontSize = 15;
    Chart.defaults.global.maintainAspectRatio = true;
    Chart.defaults.global.showTooltips = false;
    let radarOptions = {pointLabelFontSize: 15};
    this.controllerFor('index').set('categoryFrequency', this.categoryFrequency());
    this.controllerFor('index').set('radarOptions', radarOptions);
    this.controllerFor('index').set('mostActiveUsers', this.mostActiveUsers());
    this.controllerFor('index').set('latestPosts', this.latestPosts());
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    this.setDashboardData();
  },

  actions: {
    deletePost: function(post){
      let self = this;
      if (confirm("Are you sure you want to delete this Post?")) {
        post.deleteRecord();
        post.save().then(function(){
          self.flashMessages.success("Post Deleted!");
          self.setDashboardData();
        });
      }
    }
  }
});
