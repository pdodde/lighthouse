# -*- coding: utf-8 -*-

import requests
import HTMLParser
html_parser = HTMLParser.HTMLParser()

def dash_to_camel(s):
    """ Convert "this-name" to "ThisName" """
    parts = []
    for p in s.split('-'):
        parts.append(p[0].upper()+p[1:])
    return "".join(parts)

tests = requests.get("https://raw.githubusercontent.com/dequelabs/axe-core/master/doc/rule-descriptions.md", verify=False)
audits = []
for test in tests.content.split('\n'):
    print("Test: ", test)
    parts = test.split("|")
    for type in parts[3].split(','):
        if "wcag2a" == type.strip():
            audits.append((dash_to_camel(parts[1].strip()), parts[1].strip(), html_parser.unescape(parts[2].strip()))) 

audit_template = """/**
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
 * @fileoverview {description}
 * See base class in axe-audit.js for audit() implementation.
 */

const AxeAudit = require('./axe-audit');

class {name} extends AxeAudit {{
  /**
   * @return {{!AuditMeta}}
   */
  static get meta() {{
    return {{
      category: 'Accessibility',
      name: '{name_lower}',
      description: '{escaped_description}',
      requiredArtifacts: ['Accessibility']
    }};
  }}
}}

module.exports = {name};
"""

test_template = """/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
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

const Audit = require('../../../audits/accessibility/{name_lower}.js');
const assert = require('assert');

/* eslint-env mocha */

describe('Accessibility: {name_lower} audit', () => {{
  it('generates an audit output', () => {{
    const artifacts = {{
      Accessibility: {{
        violations: [{{
          id: '{name_lower}',
          nodes: [],
          help: 'http://example.com/'
        }}]
      }}
    }};

    const output = Audit.audit(artifacts);
    assert.equal(output.rawValue, false);
    assert.equal(output.displayValue, '');
    assert.equal(output.debugString, 'http://example.com/ (Failed on 0 elements)');
  }});

  it('generates an audit output (single node)', () => {{
    const artifacts = {{
      Accessibility: {{
        violations: [{{
          id: '{name_lower}',
          nodes: [{{}}],
          help: 'http://example.com/'
        }}]
      }}
    }};

    const output = Audit.audit(artifacts);
    assert.equal(output.rawValue, false);
    assert.equal(output.displayValue, '');
    assert.equal(output.debugString, 'http://example.com/ (Failed on 1 element)');
  }});

  it('doesn\\\'t throw an error when violations is undefined', () => {{
    const artifacts = {{
      Accessibility: {{
        violations: undefined
      }}
    }};

    const output = Audit.audit(artifacts);
    assert.equal(output.description, '{escaped_description}');
  }});
}});
"""

for audit in audits:
    fname = "lighthouse-core/audits/accessibility/{name}.js".format(name=audit[1])
    f = open(fname, "w")
    f.write(audit_template.format(name=audit[0], name_lower=audit[1], description=audit[2], escaped_description=audit[2].replace("'", "\\'")))
    f.close()
    print("git add {}".format(fname))

    testfname = "lighthouse-core/test/audits/accessibility/{name}-test.js".format(name=audit[1])
    testf = open(testfname, "w")
    testf.write(test_template.format(name_lower=audit[1], description=audit[2], escaped_description=audit[2].replace("'", "\\'")))
    testf.close()
    print("git add {}".format(testfname))

for audit in audits:
    print '    "accessibility/{name}.js",'.format(name=audit[1])

