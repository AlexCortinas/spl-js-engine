import assert from 'assert';

import { TemplateEngine } from '../src/index';
import { getTestPath as p, getTestFileContent as f } from './test-utils';

suite.only('TemplateEngine process feature');

test('create processor', function() {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(p.process('asdf'), 'asdf');
});

test('process static templates', function() {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(p.process('asdf'), 'asdf');
    assert.strictEqual(p.process('<p>'), '<p>');
    assert.strictEqual(p.process('function(){\nasdf\n}'), 'function(){\nasdf\n}');
});

test('process static file templates', function() {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(
        p.process(f('template-engine/static1.txt')),
        f('template-engine/static1.txt')
    );
});

test('process simple conditional true', function() {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: true }, {});

    assert.strictEqual(
        p.process(f('template-engine/simple-conditional.js')),
        f('template-engine/simple-conditional-true.js')
    );
});
