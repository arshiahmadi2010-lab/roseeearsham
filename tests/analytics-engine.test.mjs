import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../analytics-engine.js',import.meta.url),'utf8');
const context={};vm.runInNewContext(source,context);
const result=context.StudyAnalytics.diagnostics();
assert.equal(result.failed.length,0,JSON.stringify(result.failed));
assert.ok(result.total>=14,'Expected at least 14 regression scenarios');
console.log('Analytics engine tests:',result.passed+'/'+result.total,'passed');
