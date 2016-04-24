import assert from 'assert';

import { TemplateEngine } from '../src/index';
import { getTestPath as p, getTestFileContent as f } from './test-utils';

suite('TemplateEngine process feature');

test('create processor', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(p.process('asdf'), 'asdf');
});

test('process static templates', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(p.process('asdf'), 'asdf');
    assert.strictEqual(p.process('<p>'), '<p>');
    assert.strictEqual(p.process('function(){\nasdf\n}'), 'function(){\nasdf\n}');
});

test('process static file templates', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor();

    assert.strictEqual(
        p.process(f('template-engine/static1.txt')),
        f('template-engine/static1.txt')
    );
});

test('process simple conditional true', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: true }, {});

    assert.strictEqual(
        p.process(f('template-engine/simple-conditional.js')),
        f('template-engine/simple-conditional-true.js')
    );
});

test('process simple conditional false', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: false }, {});


    assert.strictEqual(
        p.process(f('template-engine/simple-conditional.js')),
        f('template-engine/simple-conditional-false.js')
    );
});

test('process multiline simple conditional true', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: true }, {});

    assert.strictEqual(
        p.process(f('template-engine/multiline-simple-conditional.js')),
        f('template-engine/simple-conditional-true.js')
    );
});

test('process inline simple conditional true', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: true }, {});

    assert.strictEqual(
        p.process(f('template-engine/inline-conditional.js')),
        f('template-engine/inline-conditional-true.js')
    );
});

test('process inline simple conditional false', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({ greet: false }, {});

    assert.strictEqual(
        p.process(f('template-engine/inline-conditional.js')),
        f('template-engine/inline-conditional-false.js')
    );
});

suite('TemplateEngine process custom delimiters');

test('process text with custom delimiters', () => {
    const te = new TemplateEngine({
        startDelimiter: '<$',
        endDelimiter: '$$$'
    });
    const p = te.createProcessor({ greet: true }, {});

    assert.strictEqual(
        p.process(f('template-engine/custom-delimiters.js')),
        f('template-engine/inline-conditional-true.js')
    );
});

test('process different text with different custom delimiters', () => {
    const te = new TemplateEngine();
    te.addDelimiter('html', '<!--%', '-->');
    te.addDelimiter('py', '#%', '%#');
    const askGreetProcessor = te.createProcessor({ask: true, greet: true});
    const notAskByeProcessor = te.createProcessor({ask: false, bye: true});
    const nothingProcessor = te.createProcessor();


    assert.strictEqual(
        askGreetProcessor.process(f('template-engine/custom-delimiter.py'), 'py'),
        f('template-engine/custom-delimiter-ask.py')
    );
    assert.strictEqual(
        notAskByeProcessor.process(f('template-engine/custom-delimiter.py'), 'py'),
        f('template-engine/custom-delimiter-not-ask.py')
    );

    assert.strictEqual(
        askGreetProcessor.process(f('template-engine/custom-delimiter.html'), 'html'),
        f('template-engine/custom-delimiter-greet.html')
    );
    assert.strictEqual(
        notAskByeProcessor.process(f('template-engine/custom-delimiter.html'), 'html'),
        f('template-engine/custom-delimiter-bye.html')
    );
    assert.strictEqual(
        nothingProcessor.process(f('template-engine/custom-delimiter.html'), 'html'),
        f('template-engine/custom-delimiter-nothing.html')
    );

    assert.strictEqual(
        askGreetProcessor.process(f('template-engine/simple-conditional.js')),
        f('template-engine/simple-conditional-true.js')
    );
    assert.strictEqual(
        notAskByeProcessor.process(f('template-engine/simple-conditional.js')),
        f('template-engine/simple-conditional-false.js')
    );
});

suite('TemplateEngine process data');

test('simple data', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({}, { property: 'asdf' });

    assert.strictEqual(
        p.process('/*%= data.property %*/'),
        'asdf'
    );
});

test('nested data', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({}, { property: { one: 'one', two: 'two' } });

    assert.strictEqual(
        p.process('/*%= data.property.one %*/, /*%= data.property.two %*/'),
        'one, two'
    );
});

test('for loop', () => {
    const te = new TemplateEngine();
    const p = te.createProcessor({}, {
        property: [ {
            name: 'one', value: 1
        }, {
            name: 'two', value: 2
        }
    ]});

    assert.strictEqual(
        p.process(f('template-engine/for-loop.js')),
        'one: 1,\ntwo: 2'
    );
});
