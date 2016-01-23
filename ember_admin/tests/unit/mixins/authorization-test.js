import Ember from 'ember';
import AuthorizationMixin from '../../../mixins/authorization';
import { module, test } from 'qunit';

module('Unit | Mixin | authorization');

// Replace this with your real tests.
test('it works', function(assert) {
  let AuthorizationObject = Ember.Object.extend(AuthorizationMixin);
  let subject = AuthorizationObject.create();
  assert.ok(subject);
});
