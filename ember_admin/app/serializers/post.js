import DS from "ember-data";

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    edits: { embedded: 'always'}
  },
  keyForRelationship: function(key, relationship ) {
    if(relationship === 'belongsTo'){
      return key + '_id';
    } else {
      return key;
    }
  }
});

