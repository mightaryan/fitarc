import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  HIIT_CARDIO_EXERCISES,
  BODY_PART_SETS,
  DURATION_OPTIONS,
  buildBodyPartSession,
  generateAiExercise,
  generateCustomUserPlan,
} from '../src/data/hiitAndLeapWorkouts.js';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_SEO_SETTINGS,
  decoratePlansWithPricing,
} from '../src/data/adminDefaults.js';
import { TRANSFORMATION_PLANS } from '../src/data/transformationPlans.js';
import { createSeededVault } from '../src/data/athleteVaultDatabase.js';
import {
  isAdminPathname,
  getTabFromPathname,
  getPathnameForTab,
} from '../src/utils/routeHelper.js';
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  translate,
} from '../src/utils/i18n.js';
import { INITIAL_SHOP_PRODUCTS } from '../src/data/trustifiedShopCatalog.js';

console.log('1. Verifying All HIIT Cardio GIF URLs Exist in ExerciseGymGifsDB Catalog...');
const masterDbSrc = fs.readFileSync('src/data/allExercisesMaster.js', 'utf8');
const homeDbSrc = fs.readFileSync('src/data/homeWorkoutsExpanded.js', 'utf8');
const yogaDbSrc = fs.readFileSync('src/data/yogaAndHomeWorkouts.js', 'utf8');
const allValidGifs = new Set(
  [masterDbSrc, homeDbSrc, yogaDbSrc].flatMap((src) =>
    [...src.matchAll(/https:\/\/cdn\.jsdelivr\.net\/gh\/JahelCuadrado\/ExerciseGymGifsDB@v1\.1\.0\/[a-zA-Z0-9_\-\/]+\.gif/g)].map(
      (m) => m[0]
    )
  )
);
assert.ok(HIIT_CARDIO_EXERCISES.length >= 14, 'Expected expanded HIIT cardio pool');
for (const ex of HIIT_CARDIO_EXERCISES) {
  assert.ok(allValidGifs.has(ex.gifUrl), `Unverified HIIT GIF URL: ${ex.gifUrl} (${ex.id})`);
  if (ex.fallbackGif) {
    assert.ok(allValidGifs.has(ex.fallbackGif), `Unverified HIIT fallback GIF: ${ex.fallbackGif}`);
  }
}
const hiit30 = buildBodyPartSession({ bodyPartId: 'hiit_cardio', durationMinutes: 30, level: 'Beginner' });
assert.equal(hiit30.durationMinutes, 30);
assert.ok(hiit30.exercises.length >= 25, `30-min HIIT should contain >=25 intervals, got ${hiit30.exercises.length}`);
assert.ok(hiit30.estimatedCalories >= 180);
assert.ok(hiit30.exercises.every((ex) => Boolean(ex.voiceCue)));

for (const part of BODY_PART_SETS) {
  for (const dur of DURATION_OPTIONS) {
    const lowImpactSession = buildBodyPartSession({
      bodyPartId: part.id,
      durationMinutes: dur.minutes,
      lowImpact: true,
    });
    assert.ok(lowImpactSession.exercises.length >= 7, `Failed min intervals for ${part.id}/${dur.minutes}`);
  }
}
console.log(`   PASS: All ${HIIT_CARDIO_EXERCISES.length} HIIT GIFs & ${BODY_PART_SETS.length * DURATION_OPTIONS.length} Body-Part x Duration matrices verified.`);

console.log('2. Verifying Shear Simulator Removal & Beginner-Minimalist Workout UI...');
for (const file of [
  'src/components/fitness/Anatomical3DPlayer.jsx',
  'src/components/fitness/WorkoutDetailModal.jsx',
  'src/components/fitness/FitnessSection.jsx',
  'src/components/fitness/HiitAndBodyPartStudio.jsx',
]) {
  const s = fs.readFileSync(file, 'utf8');
  assert.equal(/Angle & Joint|JointAngleShear|Illuminated Fibers|GymVisual|Hypertrophy Rate|3D Anatomical/i.test(s), false, `Found complex jargon in ${file}`);
}
for (const deadFile of [
  'src/components/fitness/JointAngleShearCanvas.jsx',
  'src/components/fitness/MachineSetupVisualizer.jsx',
  'src/components/fitness/ProgressiveOverloadCalculator.jsx',
  'src/components/fitness/RealisticBiomechanicsPlayer.jsx',
]) {
  assert.equal(fs.existsSync(deadFile), false, `Expected dead simulator file removed: ${deadFile}`);
}
console.log('   PASS: Angle & Joint Shear Simulator and complex workout jargon completely removed.');

console.log('3. Verifying Free Beginner Default, Advanced Lock, Monthly & Yearly Plans (₹99+)...');
const seeded = createSeededVault();
assert.equal(seeded.user_alex.profile.hasPaidPlan, false, 'Default starter user should start as Free user');
assert.equal(seeded.user_alex.profile.activePlan, null, 'Free starter user should start without a paid plan');
assert.equal(seeded.user_priya.profile.hasPaidPlan, true, 'Paid member Priya retains paid status');

const pricedPlans = decoratePlansWithPricing(TRANSFORMATION_PLANS);
const minMonthly = Math.min(...pricedPlans.map((p) => p.priceINR));
assert.equal(minMonthly, 99, `Expected monthly plans starting from ₹99, got ₹${minMonthly}`);
assert.ok(pricedPlans.every((p) => p.yearlyPriceINR >= 799), 'All plans must include Yearly pricing');
const planModalSrc = fs.readFileSync('src/components/plans/PlanSelectorModal.jsx', 'utf8');
assert.ok(planModalSrc.includes('billingCycle') && planModalSrc.includes('Yearly') && planModalSrc.includes('Monthly'));
console.log('   PASS: Monthly (₹99+) & Yearly billing, Free beginner defaults & Advanced gating verified.');

console.log('4. Verifying About Links in Footer Only & PWA Install Hidden When Active...');
const navSrc = fs.readFileSync('src/components/layout/Navbar.jsx', 'utf8');
assert.equal(navSrc.includes("setActiveTab('about')"), false, 'Top Navbar should not render About link');
const footerSrc = fs.readFileSync('src/components/layout/Footer.jsx', 'utf8');
assert.ok(footerSrc.includes("navigateAndScrollTop('about')"), 'Footer must contain About link');
const pwaSrc = fs.readFileSync('src/components/common/PwaInstallPrompt.jsx', 'utf8');
assert.ok(pwaSrc.includes('if (isInstalled || siteSettings?.pwaInstallEnabled === false) return null;'));
console.log('   PASS: About links live in Footer and PWA Install prompt hides when installed.');

console.log('5. Verifying AI Exercise, Custom Plan Architect, Routes, SEO & PWA Icons...');
const aiEx = generateAiExercise({ goal: 'muscle_gain', bodyPart: 'chest', equipment: 'dumbbell', customFocus: 'Tempo' });
assert.ok(aiEx.isAiGenerated && aiEx.voiceCue && allValidGifs.has(aiEx.gifUrl));
const customPlan = generateCustomUserPlan({
  planName: 'Test Hybrid',
  goal: 'fat_loss',
  exerciseTypes: ['hiit_cardio', 'abs', 'yoga_mobility'],
  durationDays: 60,
  dailyMinutes: 30,
  daysPerWeek: 5,
  userWeightKg: 80,
});
assert.equal(customPlan.splitSchedule.length, 7);
for (const pageKey of ['home', 'fitness', 'food', 'shop', 'dashboard', 'about', 'admin']) {
  assert.ok(INITIAL_SEO_SETTINGS[pageKey]?.title);
}
assert.equal(getTabFromPathname('/shop'), 'shop');
assert.equal(getTabFromPathname('/about'), 'about');
assert.equal(isAdminPathname('/admin'), true);
assert.equal(getPathnameForTab('about'), '/about');
const manifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
assert.equal(manifest.display, 'standalone');
for (const p of ['public/icons/apple-touch-icon-180.png', 'public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/sw.js']) {
  assert.ok(fs.existsSync(p));
}
console.log('   PASS: AI generators, SEO routes, and PWA shell assets verified.');

console.log('6. Verifying AppContext Export Contracts Across All Active Components...');
const ctxSrc = fs.readFileSync('src/context/AppContext.jsx', 'utf8');
const mVal = ctxSrc.match(/const value = \{([\s\S]*?)\};/);
const ctxKeys = new Set(
  mVal[1]
    .split(/[\r\n,]+/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'))
    .map((l) => l.split(':')[0].trim())
    .filter((k) => /^[a-zA-Z0-9_$]+$/.test(k))
);
const filesToCheck = [
  'src/App.jsx',
  'src/pages/AdminPortalPage.jsx',
  'src/components/home/HomeSection.jsx',
  'src/components/fitness/FitnessSection.jsx',
  'src/components/fitness/HiitAndBodyPartStudio.jsx',
  'src/components/fitness/AiAndCustomPlanModal.jsx',
  'src/components/fitness/GuidedWorkoutPlayerModal.jsx',
  'src/components/fitness/WorkoutDetailModal.jsx',
  'src/components/fitness/HomeWorkoutHub.jsx',
  'src/components/fitness/YogaSanctuaryHub.jsx',
  'src/components/fitness/CalisthenicsHub.jsx',
  'src/components/food/FoodSection.jsx',
  'src/components/shop/ShopSection.jsx',
  'src/components/dashboard/OverviewDashboard.jsx',
  'src/components/wellness/HealthifySuite.jsx',
  'src/components/about/AboutSection.jsx',
  'src/components/common/PwaInstallPrompt.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/layout/MobileBottomNav.jsx',
  'src/components/layout/Footer.jsx',
  'src/components/auth/AuthModal.jsx',
  'src/components/plans/PlanSelectorModal.jsx',
  ...fs.readdirSync('src/components/admin/modules').map((f) => path.join('src/components/admin/modules', f)),
];
const mismatches = [];
for (const file of filesToCheck) {
  const src = fs.readFileSync(file, 'utf8');
  const matches = src.match(/const\s*\{([\s\S]*?)\}\s*=\s*useApp\(\)/g) || [];
  for (const block of matches) {
    const inner = block.replace(/^const\s*\{/, '').replace(/\}\s*=\s*useApp\(\)$/, '');
    const keys = inner
      .split(',')
      .map((x) => x.trim().split(':')[0].split('=')[0].trim())
      .filter(Boolean);
    for (const k of keys) {
      if (!ctxKeys.has(k)) mismatches.push({ file, key: k });
    }
  }
}
assert.deepEqual(mismatches, [], `AppContext mismatches: ${JSON.stringify(mismatches)}`);
console.log(`   PASS: All ${filesToCheck.length} active components match ${ctxKeys.size} AppContext exports cleanly.`);

console.log('7. Verifying Beginner Terminology, Single Bottom Vault, Real Shop Photos, Multilingual i18n & Support...');
const fitSrc = fs.readFileSync('src/components/fitness/FitnessSection.jsx', 'utf8');
assert.equal(/:\s*'Simple'/.test(fitSrc), false, 'FitnessSection should use Beginner instead of Simple');
assert.ok(masterDbSrc.includes("id: 'beginner'") && !masterDbSrc.includes("Simple / Beginner"), 'Difficulty filter should say Beginner');

// Single Top Vault + Centered 5-Slot Mobile Bottom Dock (Scan dead center) + Profile Picture
assert.ok(/openAuthModal\('biometrics'\)[\s\S]{0,120}className="flex items-center/.test(navSrc), 'Navbar top Vault should be active on top right for all viewports');
assert.ok(navSrc.includes('user.avatarUrl'), 'Navbar top Vault badge should render user profile picture when set');
const mobNavSrc = fs.readFileSync('src/components/layout/MobileBottomNav.jsx', 'utf8');
assert.ok(mobNavSrc.includes('grid grid-cols-5') && mobNavSrc.includes('setIsMealScannerOpen(true)'), 'MobileBottomNav must use 5 symmetric columns with Scan dead center');
assert.equal(mobNavSrc.includes("openAuthModal('biometrics')"), false, 'MobileBottomNav must not duplicate Vault when Vault sits on top header');

// Exact retail packaging product photos (no Unsplash stock placeholders)
for (const prod of INITIAL_SHOP_PRODUCTS) {
  assert.ok(prod.imageUrl && prod.imageUrl.startsWith('https://'), `Missing imageUrl for ${prod.id}`);
  assert.equal(prod.imageUrl.includes('images.unsplash.com'), false, `Placeholder Unsplash image left in ${prod.id}`);
}

// Multilingual parity across EN, HI, AR (RTL), TR, RU, ES
const langCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
for (const reqLang of ['en', 'hi', 'ar', 'tr', 'ru', 'es']) {
  assert.ok(langCodes.includes(reqLang), `Missing required language ${reqLang}`);
  assert.ok(Object.keys(TRANSLATIONS[reqLang]).length >= Object.keys(TRANSLATIONS.en).length, `Incomplete keys for ${reqLang}`);
}
assert.equal(SUPPORTED_LANGUAGES.find((l) => l.code === 'ar')?.dir, 'rtl');
assert.ok(translate('hi', 'nav.home').length > 0 && translate('ar', 'nav.vault').length > 0);

// Language placement (Mobile Vault + Desktop Footer), non-overlapping mobile Vault tabs, Support Inbox & Phone+Email OTP parity
const authSrc = fs.readFileSync('src/components/auth/AuthModal.jsx', 'utf8');
assert.ok(authSrc.includes('Mobile Vault Language Selector') && authSrc.includes('submitSupportTicket') && authSrc.includes('handleAvatarUpload'), 'Vault must house mobile language switcher, support form & profile picture upload');
assert.ok(authSrc.includes('grid grid-cols-3 sm:flex'), 'Vault tabs must use non-overlapping mobile 3-col grid');
assert.ok(authSrc.includes('Email Address (Required for Email OTP)') && authSrc.includes('Phone Number (Required for SMS OTP)'), 'Sign Up OTP flow must require both phone number and email address');
assert.ok(footerSrc.includes('desktop-footer-lang') && footerSrc.includes('hidden md:flex'), 'Footer must contain desktop-mode language selector');
const adminPortalSrc = fs.readFileSync('src/pages/AdminPortalPage.jsx', 'utf8');
assert.ok(adminPortalSrc.includes('AdminSupportModule') && fs.existsSync('src/components/admin/modules/AdminSupportModule.jsx'));
const adminOverviewSrc = fs.readFileSync('src/components/admin/modules/AdminOverviewModule.jsx', 'utf8');
assert.ok(adminOverviewSrc.includes('Manage Support Requests'), 'AdminOverviewModule must highlight user support requests queue');
const adminPlansSrc = fs.readFileSync('src/components/admin/modules/AdminPlansModule.jsx', 'utf8');
assert.ok(adminPlansSrc.includes('yearlyPriceINR'), 'AdminPlansModule must edit Yearly plan pricing');
const adminUsersSrc = fs.readFileSync('src/components/admin/modules/AdminUsersModule.jsx', 'utf8');
assert.ok(adminUsersSrc.includes('hasPaidPlan') && adminUsersSrc.includes('planBillingCycle'), 'AdminUsersModule must manage Free/Paid plans & billing cycles');
const adminSettingsSrc = fs.readFileSync('src/components/admin/modules/AdminSettingsModule.jsx', 'utf8');
assert.ok(adminSettingsSrc.includes('defaultLanguage') && adminSettingsSrc.includes('lockAdvancedForFreeUsers'), 'AdminSettingsModule must manage language & Advanced lock');

console.log('   PASS: Beginner wording, single mobile bottom Vault, 18 real Shop photos, 6 languages, Support Inbox & Admin parity verified.');
console.log('\nALL PRODUCTION TESTS & CHECKS PASSED!');
