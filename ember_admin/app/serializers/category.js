import DS from "ember-data";

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForRelationship: function(key, relationship, method) {
    return key + '_id';
  }
});

