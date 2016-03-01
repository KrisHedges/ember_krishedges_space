import DS from "ember-data";

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
  keyForRelationship: function(key) {
    return key + '_id';
  }
});

