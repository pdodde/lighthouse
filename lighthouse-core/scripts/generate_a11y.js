/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Usage:
 *   node scripts/generate_a11y.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const axe = require('axe-core');


const audit_template = `/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @fileoverview ${rules[i].description}
 * See base class in axe-audit.js for audit() implementation.
 */

const AxeAudit = require('./axe-audit');

class ${camelName} extends AxeAudit {
  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      category: 'Accessibility',
      name: '${rules[i].name}',
      description: '${rules[i].description}',
      requiredArtifacts: ['Accessibility']
    };
  }
}

module.exports = ${camelName};\n`

const test_template = `/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const Audit = require('../../../audits/accessibility/${rules[i].name).js');
const assert = require('assert');

/* eslint-env mocha */

describe('Accessibility: ${rules[i].name} audit', () => {
  it('generates an audit output', () => {
    const artifacts = {
      Accessibility: {
        violations: [{
          id: '${rules[i].name}',
          nodes: [],
          help: 'http://example.com/'
        }]
      }
    };

    const output = Audit.audit(artifacts);
    assert.equal(output.rawValue, false);
    assert.equal(output.displayValue, '');
    assert.equal(output.debugString, 'http://example.com/ (Failed on 0 elements)');
  });

  it('generates an audit output (single node)', () => {
    const artifacts = {
      Accessibility: {
        violations: [{
          id: '${rules[i].name}',
          nodes: [{}],
          help: 'http://example.com/'
        }]
      }
    };

    const output = Audit.audit(artifacts);
    assert.equal(output.rawValue, false);
    assert.equal(output.displayValue, '');
    assert.equal(output.debugString, 'http://example.com/ (Failed on 1 element)');
  });

  it('doesn\'t throw an error when violations is undefined', () => {
    const artifacts = {
      Accessibility: {
        violations: undefined
      }
    };

    const output = Audit.audit(artifacts);
    assert.equal(output.description, '${rules[i].description}');
  });
});\n`

function kebabToCamel(name) {
  /**
   * Convert name from kebab-case to CamelCase
   */
  var parts = name.split('-');
  return(parts.map(x => x[0].toUpperCase() + x.slice(1)).join(''));


function generate(tagsOrNames) {
  /**
   * Create code for a11y audits and tests
   */
  var rules = axe.getRules();
  for (int i=0; i < rules.length; i++) {
    // Check that this rule has a name or tag passed from the caller.
    var ruleTagsAndName = rules[i].tags.concat([rules[i].name]);
    if (ruleTagsAndName.filter(x => tagsOrNames.indexOf(x) >= 0).length >= 0) {
      // Sanitize Data
      var camelName = kebabToCamel(rules[i].name);
      // Generate Code


}

generate(['wcag2a', 'color-contrast', 'tabindex');
