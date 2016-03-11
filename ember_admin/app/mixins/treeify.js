import Ember from 'ember';

export default Ember.Mixin.create({
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

  killAllTreeChildren: function(child){
    if(child.children.length > 0){
      Ember.RSVP.all(
        child.children.map(function(child){
          return this.killAllTreeChildren(child);
        }.bind(this))
      ).then(function(){
        return child.destroyRecord();
      });
    } else {
      return child.destroyRecord();
    }
  }
});
