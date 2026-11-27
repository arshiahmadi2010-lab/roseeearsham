import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('../analytics-engine.js',import.meta.url),'utf8');
const context={};vm.runInNewContext(source,context);
const result=context.StudyAnalytics.diagnostics();
assert.equal(context.StudyAnalytics.isISODate('2026-11-26'),true,'Valid ISO dates are accepted');
assert.equal(context.StudyAnalytics.isISODate('2026-02-29'),false,'Impossible dates are rejected');
assert.equal(context.StudyAnalytics.isISODate('2026-13-01'),false,'Invalid months are rejected');
assert.equal(context.StudyAnalytics.isISODate('not-a-date'),false,'Malformed dates are rejected');
assert.equal(result.failed.length,0,JSON.stringify(result.failed));
assert.ok(result.total>=14,'Expected at least 14 regression scenarios');
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const appFiles=await Promise.all(['app-core.js','app-views.js','app-actions.js','app-events.js'].map(file=>readFile(new URL('../'+file,import.meta.url),'utf8')));
const app=appFiles.join('');
const pwa=await readFile(new URL('../pwa-update.js',import.meta.url),'utf8');
const appCss=await readFile(new URL('../app.css',import.meta.url),'utf8');
const views=await readFile(new URL('../app-views.js',import.meta.url),'utf8');
const coreContext={
 document:{documentElement:{lang:'',dir:''},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}},
 localStorage:{getItem(){return null},setItem(){},removeItem(){}},
 window:{addEventListener(){}},
 StudyAnalytics:context.StudyAnalytics,
 TextEncoder,
 setTimeout(){return 0;},
 clearTimeout(){},
 console
};
vm.runInNewContext(appFiles[0]+String.fromCharCode(10)+'globalThis.__normForTest=norm;',coreContext);
const imported=JSON.parse('{"__proto__":{"polluted":true},"courses":[{"id":"course-1","name":"Biology"}],"parts":[[],[null,{}],[],[],[],[],[]],"blocks":[null,{"day":9,"s":0,"e":60},{"day":1,"s":30,"e":10},{"day":1,"s":60,"e":120,"c":"course-1","tp":"","n":"test"}],"logs":[{"id":"bad-log","date":"2026-11-26","min":-9},{"id":"good-log","date":"2026-11-26","min":15}],"timerBg":"data:text/html,unsafe"}');
const normalized=coreContext.__normForTest(imported);
assert.equal(normalized.polluted,undefined,'Imported __proto__ data cannot pollute state');
assert.equal(Object.getPrototypeOf(normalized).polluted,undefined,'Imported data cannot mutate the state prototype');
assert.equal(normalized.parts[1].length,1,'Valid legacy blocks still migrate');
assert.equal(normalized.parts[1][0].s,60,'Legacy block time is preserved');
assert.equal(normalized.logs.length,1,'Negative study log durations are rejected');
assert.equal(normalized.logs[0].id,'good-log','Valid study log remains intact');
assert.equal(normalized.blocks,undefined,'Legacy migration payload is removed after processing');
assert.equal(normalized.timerBg,'','Non-image timer data URLs are rejected');
for(const file of ['app-core.js','app-views.js','app-actions.js','app-events.js'])assert.ok(html.includes('src="/'+file+'"'),'Planner layer '+file+' is linked');
assert.match(html,/src="\/pwa-update\.js"/,'PWA updater is loaded as a separate file');
assert.match(html,/href="\/app\.css"/,'Main styles are loaded as a separate file');
for(const [i,source] of appFiles.entries())assert.doesNotThrow(()=>new Function(source),'Planner layer '+i+' parses');
assert.doesNotThrow(()=>new Function(app),'Combined planner layers parse in load order');
assert.doesNotThrow(()=>new Function(pwa),'PWA updater script parses');
assert.ok(appCss.length>40000,'Extracted app stylesheet contains the full UI styles');
assert.match(html,/src="\/analytics-engine\.js"/,'Engine is loaded before the app');
assert.match(html,/href="\/analytics\.css"/,'Analytics stylesheet is linked');
assert.match(app,/StudyAnalytics\.isISODate\(d\)/,'Analytics snapshots survive date validation');
assert.match(app,/const totalAll=S\.logs\.reduce/,'Ordinary stats calculate totals from the full saved history');
assert.match(app,/function analyticsEnsureActivityDays\(\)/,'Past activity dates are checked without inventing plan snapshots');
assert.match(app,/historical-snapshot-unavailable/,'Missing historical plan snapshots are audited without fabrication');
assert.match(app,/reconstructed:!!p\.reconstructed/,'Previously reconstructed snapshots retain their provenance');
assert.match(app,/plans\.some\(p=>p\.reconstructed\)/,'Unverifiable reconstructed days are excluded from scoring');
assert.ok(app.includes('StudyAnalytics.isISODate(x)'),'Imported dates use strict calendar validation');
assert.match(views,/const notice=.*unverified/s,'Analytics explains missing and unverifiable historical scores');
assert.match(views,/async function makeMonth\(y,m\).*?gm=Math\.max\(1,\.\.\.days\)/s,'Monthly poster defines its activity scale before rendering');
assert.ok(views.includes('const bucketSize=Math.max(1,Math.ceil(days.length/42))'),'Analytics charts aggregate the selected range instead of silently truncating it');
assert.match(views,/data-analytics-date=start/,'Analytics date range controls are present');
assert.match(views,/زمان مطالعه و زمان برنامه‌ریزی‌شده/,'Analytics includes a selected-range study versus plan chart');

const activityStart=app.indexOf('function analyticsEnsureActivityDays(){');
const activityEnd=app.indexOf(String.fromCharCode(10)+'}',activityStart);
const activity=activityStart>=0&&activityEnd>activityStart?app.slice(activityStart,activityEnd):'';
assert.ok(activityStart>=0&&activityEnd>activityStart,'Historical activity check exists');
assert.ok(!activity.includes('analyticsEnsureDay(date)'),'Missing historical plans are never generated from current recurring templates');
assert.ok(app.includes("['__proto__','prototype','constructor'].includes(x)"),'Reserved object keys are rejected as IDs');
assert.ok(app.includes("function norm(o){const s=blank();"),'Imported state is merged without Object.assign prototype mutation');
assert.ok(!app.includes('Object.assign(blank(),o||{})'),'Unsafe state merge has been removed');
assert.ok(app.includes("!['__proto__','prototype','constructor'].includes(k)"),'Top-level imported object keys are filtered');
assert.ok(app.includes('data:image')&&app.includes('png|jpeg|webp')&&app.includes(';base64,'),'Imported timer background accepts only known image data URLs');
assert.ok(app.includes('Array.isArray(s.blocks)'),'Legacy backup blocks are type-checked before migration');
assert.ok(app.includes('!Number.isInteger(day)||day<0||day>6'),'Legacy backup day index is checked');
assert.ok(app.includes('ic:cut(c.ic,8).replace'),'Imported course icons are sanitized');
assert.ok(!app.includes("S.logs.forEach(l=>{if(l.part==p.id&&l.src=='part'){syncPartLog(l.date,p.id)}})"),'Editing recurring parts does not rewrite historical completion logs');
assert.ok(app.includes('function save(initial=false)'),'Startup can persist state without advancing the cloud timestamp');
assert.ok(app.includes('analyticsEnsureDay(today());save(true)'),'Startup does not mark old local data as freshly edited');
assert.match(app,/StudyAnalytics\.isISODate\(from\)/,'Emergency date validation uses the shared validator');
assert.ok(app.includes('const wasIncluded=priorPart?priorPart.wasIncluded!==false:p.included!==false'),'Emergency exclusions retain the prior inclusion state');
assert.match(app,/typeof x\.wasIncluded==='boolean'\?x\.wasIncluded/,'Emergency undo restores the prior inclusion state');
assert.match(app,/S\.activeTimer\.elapsedSec=timerSeconds\(\);S\.activeTimer\.running=false/,'Emergency confirmation safely pauses the timer');
const css=await readFile(new URL('../analytics.css',import.meta.url),'utf8');
assert.match(css,/\.an-wrap/,'Glass dashboard styles exist');
const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
assert.match(sw,/const CACHE='planner-pwa-v[0-9]+'/,'Service worker has a versioned cache');
assert.match(sw,/status:503/,'Missing offline static assets return an error instead of the app shell');
assert.match(sw,/analytics-engine\.js/,'Service worker caches the engine');
assert.match(sw,/app-core\.js/,'Service worker caches the app core');
assert.match(sw,/app-views\.js/,'Service worker caches the view layer');
assert.match(sw,/app-actions\.js/,'Service worker caches the action layer');
assert.match(sw,/app-events\.js/,'Service worker caches the event layer');
assert.match(sw,/app\.css/,'Service worker caches the app stylesheet');
assert.match(sw,/pwa-update\.js/,'Service worker caches the update handler');
assert.match(sw,/analytics\.css/,'Service worker caches analytics styles');
console.log('Analytics engine tests:',result.passed+'/'+result.total,'passed; app syntax and PWA assets verified');
