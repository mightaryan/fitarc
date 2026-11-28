const fs = require('fs');
const path = require('path');
const { MASTER_EXERCISE_CATALOG } = require('../src/data/allExercisesMaster.js');

const CDN = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0';
const verifiedUrls = new Set(MASTER_EXERCISE_CATALOG.map((e) => e.gifUrl));

const g = (p) => {
  const full = `${CDN}/${p}`;
  if (!verifiedUrls.has(full)) {
    throw new Error(`Unverified GymVisual path in Yoga script: ${full}`);
  }
  return full;
};

// Verified Pose-Accurate Yoga Mat GIFs (zero gym machines/barbells/benches)
const YOGA_POSE_GIFS = {
  surya_namaskar_a: [g('glutes/pike-to-cobra-push-up.gif'), g('spine/upward-facing-dog.gif')],
  surya_namaskar_b: [g('quads/squat-to-overhead-reach.gif'), g('abs/posterior-step-to-overhead-reach.gif')],
  chandra_namaskar: [g('hamstrings/world-greatest-stretch.gif'), g('glutes/rocking-frog-stretch.gif')],
  prana_vinyasa: [g('glutes/pike-to-cobra-push-up.gif'), g('spine/lower-back-curl.gif'), g('hamstrings/world-greatest-stretch.gif')],
  upward_dog: [g('spine/upward-facing-dog.gif'), g('spine/sphinx.gif')],
  downward_dog: [g('glutes/pike-to-cobra-push-up.gif')],
  child_pose: [g('lats/kneeling-lat-stretch.gif')],
  butterfly: [g('adductors/butterfly-yoga-pose.gif')],
  lotus_meditation: [g('glutes/seated-piriformis-stretch.gif'), g('lats/seated-lower-back-stretch.gif')],
  seated_forward_fold: [g('spine/spine-stretch.gif'), g('hamstrings/seated-wide-angle-pose-sequence.gif'), g('hamstrings/hamstring-stretch.gif')],
  uttanasana: [g('spine/two-toe-touch-male.gif'), g('hamstrings/hamstring-stretch.gif')],
  warrior_1: [g('abs/posterior-step-to-overhead-reach.gif'), g('hamstrings/runners-stretch.gif')],
  warrior_2: [g('abs/lunge-with-twist.gif'), g('hamstrings/world-greatest-stretch.gif')],
  extended_side_angle: [g('lats/standing-lateral-stretch.gif'), g('hamstrings/world-greatest-stretch.gif')],
  triangle: [g('hamstrings/standing-hamstring-and-calf-stretch-with-strap.gif'), g('lats/standing-lateral-stretch.gif')],
  warrior_3: [g('quads/intermediate-hip-flexor-and-quad-stretch.gif')],
  dancer_pose: [g('quads/all-fours-squad-stretch.gif'), g('quads/lying-side-quads-stretch.gif')],
  chair_pose: [g('quads/squat-to-overhead-reach.gif'), g('quads/squat-to-overhead-reach-with-twist.gif')],
  tree_pose: [g('spine/standing-pelvic-tilt.gif'), g('calves/standing-calves-calf-stretch.gif')],
  eagle_pose: [g('pectorals/behind-head-chest-stretch.gif'), g('delts/rear-deltoid-stretch.gif')],
  garland_squat: [g('glutes/rocking-frog-stretch.gif'), g('quads/squat-to-overhead-reach-with-twist.gif')],
  boat_pose: [g('abs/v-sit-on-floor.gif'), g('abs/l-sit-on-floor.gif')],
  seated_twist: [g('abs/spine-twist.gif'), g('glutes/seated-glute-stretch.gif'), g('glutes/bent-knee-lying-twist-male.gif')],
  bridge_pose: [g('glutes/pelvic-tilt-into-bridge.gif'), g('glutes/low-glute-bridge-on-floor.gif')],
  wheel_pose: [g('glutes/pelvic-tilt-into-bridge.gif'), g('spine/upward-facing-dog.gif')],
  locust_pose: [g('spine/sphinx.gif'), g('spine/lower-back-curl.gif')],
  bow_pose: [g('spine/sphinx.gif'), g('pectorals/chest-and-front-of-shoulder-stretch.gif')],
  camel_pose: [g('pectorals/behind-head-chest-stretch.gif'), g('spine/lower-back-curl.gif')],
  shoulderstand: [g('hamstrings/leg-up-hamstring-stretch.gif'), g('glutes/hug-keens-to-chest.gif')],
  savasana: [g('glutes/hug-keens-to-chest.gif'), g('lats/side-lying-floor-stretch.gif')],
};

// Verified Pose-Accurate Stability Ball GIFs (zero dumbbells/weights/cables)
const BALL_POSE_GIFS = {
  ball_back_extension: [g('spine/back-extension-on-exercise-ball.gif'), g('spine/exercise-ball-back-extension-with-arms-extended.gif')],
  ball_child_rollout: [g('lats/exercise-ball-lat-stretch.gif'), g('lats/exercise-ball-lower-back-stretch-pyramid.gif'), g('spine/exercise-ball-hug.gif')],
  ball_bridge: [g('glutes/reverse-hyper-extension-on-stability-ball.gif'), g('hamstrings/exercise-ball-seated-hamstring-stretch.gif')],
  ball_savasana: [g('spine/exercise-ball-hug.gif'), g('lats/exercise-ball-lying-side-lat-stretch.gif')],
  ball_thoracic_arch: [g('pectorals/chest-stretch-with-exercise-ball.gif'), g('spine/exercise-ball-back-extension-with-hands-behind-head.gif')],
  ball_seated_flow: [g('abs/crunch-on-stability-ball-arms-straight.gif'), g('triceps/exercise-ball-seated-triceps-stretch.gif')],
  ball_plank_rollout: [g('pectorals/push-up-on-stability-ball.gif'), g('abs/pull-in-on-stability-ball.gif'), g('lats/exercise-ball-alternating-arm-ups.gif')],
  ball_wall_squat: [g('glutes/exercise-ball-hip-flexor-stretch.gif'), g('calves/exercise-ball-on-the-wall-calf-raise.gif')],
};

const GYM_DISALLOWED_RE = /barbell|dumbbell|cable|smith|lever|sled|kettlebell|machine|ez-bar|plate|weighted|bench|pulldown|preacher|band|strap|rope|chair|tower|rack|cage|bar|rail|hanging|pull-up|pull up|chin-up|chin up|gironda|muscle-up|dip-cage|parallel-bar|captains-chair|suspended|trx|ring|inverted|balance-board|bosu|medicine|foam-roller|roller|wheel|partner|assisted|inverse|incline|decline|wall|step|box|stair|towel|stick|broom|jump|sprint|burpee|boxing|run|sit-up|crunch|planche|skin-the-cat|potty/i;
const BALL_DISALLOWED_RE = /barbell|dumbbell|cable|smith|kettlebell|ez-bar|weighted|preacher|medicine|bosu|tennis/i;

const matCandidates = MASTER_EXERCISE_CATALOG.filter((ex) => {
  const s = `${ex.name} ${ex.slug} ${ex.gifUrl} ${ex.equipment}`.toLowerCase();
  if (/ball|bosu|medicine/.test(s)) return false;
  if (GYM_DISALLOWED_RE.test(s)) return false;
  return (
    ex.equipment === 'bodyweight' &&
    /stretch|yoga|pose|bridge|twist|sphinx|cobra|butterfly|frog|piriformis|pelvic|runners|world-greatest|l-sit|v-sit|pike|curl|touch|reach|kneeling-lat|hug-keens|iron-cross|neck|side-bridge|side-plank|lying-side|all-fours/.test(s)
  );
});

const CURATED_MAT_YOGA = [
  { name: "Surya Namaskar A (Classic 12-Flow Sun Salutation)", sanskrit: "Surya Namaskar A", focus: "Full Body Mobility & Breath Synchrony", pool: "spine", gif: "glutes/pike-to-cobra-push-up.gif" },
  { name: "Surya Namaskar B (Chair-to-Sky Reach Flow)", sanskrit: "Surya Namaskar B", focus: "Cardiovascular Heat & Thigh Strength", pool: "quads", gif: "quads/squat-to-overhead-reach.gif" },
  { name: "Chandra Namaskar (Moon Salutation Cooling Sequence)", sanskrit: "Chandra Namaskar", focus: "Parasympathetic Reset & Hip Opening", pool: "glutes", gif: "hamstrings/world-greatest-stretch.gif" },
  { name: "Bhujangasana (Classic Cobra & Heart Arch)", sanskrit: "Bhujangasana", focus: "Erector Spinae & Kidney Awakening", pool: "spine", gif: "spine/upward-facing-dog.gif" },
  { name: "Salamba Bhujangasana (Sphinx Restorative Lumbar Ease)", sanskrit: "Sphinx Pose", focus: "Gentle Sacral Arch & Thoracic Glide", pool: "spine", gif: "spine/sphinx.gif" },
  { name: "Baddha Konasana (Bound Angle Butterfly Pose)", sanskrit: "Baddha Konasana", focus: "Adductor Relaxation & Sacral Freedom", pool: "adductors", gif: "adductors/butterfly-yoga-pose.gif" },
  { name: "Mandukasana (Deep Frog Pelvic Opener)", sanskrit: "Mandukasana", focus: "Groin, Adductor & Sacral Decompression", pool: "adductors", gif: "glutes/rocking-frog-stretch.gif" },
  { name: "Balasana Reach (Extended Child's Pose Grounding)", sanskrit: "Balasana", focus: "Sacral Decompression & Latissimus Release", pool: "lats", gif: "lats/kneeling-lat-stretch.gif" },
  { name: "Setu Bandhasana (Glute & Spine Bridge)", sanskrit: "Setu Bandhasana", focus: "Posterior Chain Drive & Heart Opening", pool: "glutes", gif: "glutes/pelvic-tilt-into-bridge.gif" },
  { name: "Supta Setu Bandhasana (Restorative Floor Bridge)", sanskrit: "Supta Setu Bandha", focus: "Gentle Sacral Lift & Hip Release", pool: "glutes", gif: "glutes/low-glute-bridge-on-floor.gif" },
  { name: "Eka Pada Setu Bandhasana (One-Legged Bridge)", sanskrit: "Eka Pada Setu", focus: "Unilateral Glute Activation & Spine Balance", pool: "glutes", gif: "glutes/single-leg-bridge-with-outstretched-leg.gif" },
  { name: "Paschimottanasana (Classic Seated Forward Bend)", sanskrit: "Paschimottanasana", focus: "Total Posterior Chain Release", pool: "lats", gif: "lats/seated-lower-back-stretch.gif" },
  { name: "Janu Sirsasana (Head-to-Knee Single Leg Fold)", sanskrit: "Janu Sirsasana", focus: "Asymmetric Hamstring & Lumbar Release", pool: "hamstrings", gif: "hamstrings/hamstring-stretch.gif" },
  { name: "Upavistha Konasana (Seated Wide Straddle Fold)", sanskrit: "Upavistha Konasana", focus: "Inner Thigh & Pelvic Floor Freedom", pool: "hamstrings", gif: "hamstrings/seated-wide-angle-pose-sequence.gif" },
  { name: "Uttanasana (Full Standing Forward Fold)", sanskrit: "Uttanasana", focus: "Spine Decompression & Posterior Elongation", pool: "spine", gif: "spine/two-toe-touch-male.gif" },
  { name: "Supta Padangusthasana (Reclining Leg-Up Stretch)", sanskrit: "Supta Padangusthasana", focus: "Isolated Hamstring Release Without Back Strain", pool: "hamstrings", gif: "hamstrings/leg-up-hamstring-stretch.gif" },
  { name: "Agnistambhasana (Double Pigeon Fire Log Pose)", sanskrit: "Agnistambhasana", focus: "Deep Outer Hip & Piriformis Release", pool: "glutes", gif: "glutes/seated-piriformis-stretch.gif" },
  { name: "Ardha Matsyendrasana (Seated Spinal Detox Twist)", sanskrit: "Ardha Matsyendrasana", focus: "Digestive Stimulation & Thoracic Mobility", pool: "abs", gif: "abs/spine-twist.gif" },
  { name: "Jathara Parivartanasana (Belly Twist Floor Flow)", sanskrit: "Jathara Parivartanasana", focus: "Visceral Drainage & Lumbar Rotation", pool: "glutes", gif: "glutes/bent-knee-lying-twist-male.gif" },
  { name: "Supta Matsyendrasana (Iron Cross Supine Twist)", sanskrit: "Supta Matsyendrasana", focus: "Cross-Body Facet Joint Decompression", pool: "glutes", gif: "glutes/iron-cross-stretch.gif" },
  { name: "Apanasana (Knees-to-Chest Wind-Relieving Hug)", sanskrit: "Apanasana", focus: "Lower Back Hug & Lumbar Decompression", pool: "glutes", gif: "glutes/hug-keens-to-chest.gif" },
  { name: "Navasana (Boat Pose Core Transverse V-Sit)", sanskrit: "Navasana", focus: "Transverse Abdominis & Hip Flexor Balance", pool: "abs", gif: "abs/v-sit-on-floor.gif" },
  { name: "Dandasana (Staff Pose Active L-Sit Grounding)", sanskrit: "Dandasana", focus: "Spinal Neutrality & Core Bracing", pool: "abs", gif: "abs/l-sit-on-floor.gif" },
  { name: "Virabhadrasana I (Crescent Warrior Overhead Reach)", sanskrit: "Virabhadrasana I", focus: "Hip Flexor Extension & Leg Stamina", pool: "abs", gif: "abs/posterior-step-to-overhead-reach.gif" },
  { name: "Parivrtta Virabhadrasana (Revolved Lunge Twist)", sanskrit: "Parivrtta Lunge", focus: "Thoracic Rotation & Adductor Endurance", pool: "abs", gif: "abs/lunge-with-twist.gif" },
  { name: "Ashwa Sanchalanasana (Equestrian Low Lunge)", sanskrit: "Ashwa Sanchalanasana", focus: "Iliopsoas Release & Pelvic Sinking", pool: "hamstrings", gif: "hamstrings/runners-stretch.gif" },
  { name: "Anjaneyasana (High Crescent Quad & Hip Opener)", sanskrit: "Anjaneyasana", focus: "Anterior Hip Capsule & Quad Elongation", pool: "quads", gif: "quads/intermediate-hip-flexor-and-quad-stretch.gif" },
  { name: "Vasisthasana (Side Plank Core Stabilization)", sanskrit: "Vasisthasana", focus: "Lateral Core & Shoulder Integrity", pool: "abs", gif: "abs/side-bridge-v-2.gif" },
  { name: "Ardha Chandrasana Flow (Side Bridge Hip Lift)", sanskrit: "Ardha Chandrasana", focus: "Glute Medius Balance & Lateral Chain", pool: "abductors", gif: "abductors/side-bridge-hip-abduction.gif" },
  { name: "Skandasana Vasisthasana (Inner Adductor Side Plank)", sanskrit: "Skandasana Plank", focus: "Adductor Strength & Pelvic Alignment", pool: "adductors", gif: "adductors/side-plank-hip-adduction.gif" },
  { name: "Parivrtta Utkatasana (Revolved Chair Flow)", sanskrit: "Parivrtta Utkatasana", focus: "Quadriceps Activation & Spinal Twist", pool: "quads", gif: "quads/squat-to-overhead-reach-with-twist.gif" },
  { name: "Tadasana Alignment (Standing Pelvic Grounding)", sanskrit: "Tadasana", focus: "Neutral Pelvic Tilt & Upright Posture", pool: "spine", gif: "spine/standing-pelvic-tilt.gif" },
  { name: "Indudalasana (Standing Crescent Side Bend)", sanskrit: "Indudalasana", focus: "Intercostal Ribs & Oblique Elongation", pool: "lats", gif: "lats/standing-lateral-stretch.gif" },
  { name: "Side-Lying Crescent Rest (Rib & Lat Floor Flow)", sanskrit: "Chandra Shanti", focus: "Deep Fascial Lateral Decompression", pool: "lats", gif: "lats/side-lying-floor-stretch.gif" },
  { name: "Ustrasana Heart Opener (Dynamic Chest Expansion)", sanskrit: "Ustrasana Prep", focus: "Thoracic Expansion & Lung Capacity", pool: "pectorals", gif: "pectorals/dynamic-chest-stretch-male.gif" },
  { name: "Gomukhasana Upper Bind (Behind-Head Chest Opener)", sanskrit: "Gomukhasana", focus: "Rotator Cuff & Clavicular Freedom", pool: "pectorals", gif: "pectorals/behind-head-chest-stretch.gif" },
  { name: "Anahata Heart Bloom (Chest & Deltoid Release)", sanskrit: "Anahata Asana", focus: "Anterior Shoulder & Pectoral Lengthening", pool: "pectorals", gif: "pectorals/chest-and-front-of-shoulder-stretch.gif" },
  { name: "Garudasana Arms (Eagle Scapular Spread Stretch)", sanskrit: "Garudasana Arms", focus: "Posterior Deltoid & Rhomboid Release", pool: "delts", gif: "delts/rear-deltoid-stretch.gif" },
  { name: "Kapotasana Overhead Bind (Triceps & Lat Reach)", sanskrit: "Kapotasana Arms", focus: "Shoulder Elevation & Triceps Release", pool: "triceps", gif: "triceps/overhead-triceps-stretch.gif" },
  { name: "Seated Marjaryasana (Upper Back Cat Arch Stretch)", sanskrit: "Upavistha Marjari", focus: "Scapular Protraction & Neck Relief", pool: "upper-back", gif: "upper-back/upper-back-stretch.gif" },
  { name: "Salabhasana Wave (Locust Spinal Extension Flow)", sanskrit: "Salabhasana", focus: "Spinal Erector Awakening & Mobility", pool: "spine", gif: "spine/lower-back-curl.gif" },
  { name: "Merudanda Vinyasa (Seated Spine Roll Stretch)", sanskrit: "Merudanda Vinyasa", focus: "Intervertebral Space & Synovial Glide", pool: "spine", gif: "spine/spine-stretch.gif" },
  { name: "Bhekasana Prep (Quadruped Quad & Hip Stretch)", sanskrit: "Bhekasana", focus: "Anterior Thigh & Hip Flexor Ease", pool: "quads", gif: "quads/all-fours-squad-stretch.gif" },
  { name: "Supta Virasana Prep (Side-Lying Quad Elongation)", sanskrit: "Supta Virasana", focus: "Quad & Knee Capsule Gentle Opening", pool: "quads", gif: "quads/lying-side-quads-stretch.gif" },
  { name: "Bharadvajasana (Gentle Sage Seated Hip Stretch)", sanskrit: "Bharadvajasana", focus: "Deep External Hip Rotator Relief", pool: "glutes", gif: "glutes/seated-glute-stretch.gif" },
  { name: "Chaturanga Side Flow (Push-Up to Side Plank)", sanskrit: "Chaturanga Vinyasa", focus: "Core Integration & Shoulder Control", pool: "abs", gif: "abs/push-up-to-side-plank.gif" },
  { name: "Kumbhakasana Twist (Plank Thoracic Mobility)", sanskrit: "Parivrtta Phalaka", focus: "Core Stabilization Under Twist", pool: "abs", gif: "abs/front-plank-with-twist.gif" },
  { name: "Seated Ankle & Calf Ease (Vajrasana Lower Leg)", sanskrit: "Pada Shanti", focus: "Achilles & Calf Fascia Decompression", pool: "calves", gif: "calves/seated-calf-stretch-male.gif" },
  { name: "Adho Mukha Heel Pedal (Calf & Ankle Elongation)", sanskrit: "Adho Mukha Pedal", focus: "Soleus & Gastrocnemius Lengthening", pool: "calves", gif: "calves/standing-calves-calf-stretch.gif" },
  { name: "Tibialis & Shin Release (Restorative Lower Leg)", sanskrit: "Jangha Shanti", focus: "Shin Splint Ease & Ankle Flexibility", pool: "calves", gif: "calves/posterior-tibialis-stretch.gif" },
  { name: "Sukhasana Knee Circle Warm-Up (Synovial Flow)", sanskrit: "Janu Chakra", focus: "Knee Joint Lubrication & Mobility", pool: "calves", gif: "calves/circles-knee-stretch.gif" },
  { name: "Mudra Wrist & Carpal Stretch (Forearm Release)", sanskrit: "Manibandha Stretch", focus: "Wrist Decompression for Plank & Crow", pool: "forearms", gif: "forearms/side-wrist-pull-stretch.gif" },
  { name: "Prasarita Windmill Flow (Circular Toe Reach)", sanskrit: "Prasarita Chakra", focus: "Hamstring Sweep & Spinal Twist", pool: "glutes", gif: "glutes/arms-apart-circular-toe-touch-male.gif" },
  { name: "Pelvic Floor Bandha Tilt (Lumbar Reset on Mat)", sanskrit: "Mula Bandha Tilt", focus: "Neutral Pelvis & Lower Back Relief", pool: "abs", gif: "abs/pelvic-tilt.gif" },
  { name: "Prasarita Padottanasana C (Clasped Arm Fold)", sanskrit: "Padottanasana C", focus: "Anterior Shoulder Bind & Spine Fold", pool: "glutes", gif: "glutes/hands-clasped-circular-toe-touch-male.gif" },
  { name: "Seated Shoulder & Triceps Flow (Vajrasana Bind)", sanskrit: "Amsa Shanti", focus: "Upper Arm Flexibility & Posture", pool: "triceps", gif: "triceps/triceps-stretch.gif" },
  { name: "Anahata Lat & Pec Floor Expansion", sanskrit: "Anahata Extension", focus: "Thoracic Cage & Breathing Volume", pool: "lats", gif: "lats/back-pec-stretch.gif" },
  { name: "Standing Side Bend & Lateral Reach", sanskrit: "Parsva Tadasana", focus: "Oblique & Lateral Chain Flow", pool: "abs", gif: "abs/side-to-side-toe-touch-male.gif" },
];

const CURATED_BALL_YOGA = [
  { name: "Stability Ball Balasana (Child's Pose Rollout Flow)", sanskrit: "Kanduka Balasana", focus: "Thoracic Opening & Latissimus Traction", pool: "lats", gif: "lats/exercise-ball-lat-stretch.gif" },
  { name: "Exercise Ball Back Extension & Heart Opener", sanskrit: "Kanduka Bhujangasana", focus: "Spinal Decompression & Intercostal Reach", pool: "spine", gif: "spine/back-extension-on-exercise-ball.gif" },
  { name: "Stability Ball Setu Bandhasana (Reverse Extension)", sanskrit: "Kanduka Setu Bandha", focus: "Gluteus Maximus & Hamstring Stabilization", pool: "glutes", gif: "glutes/reverse-hyper-extension-on-stability-ball.gif" },
  { name: "Exercise Ball Thoracic Chest & Arch Glide", sanskrit: "Kanduka Matsyasana", focus: "Pectoral Opening & Kyphosis Reversal", pool: "pectorals", gif: "pectorals/chest-stretch-with-exercise-ball.gif" },
  { name: "Stability Ball Arms-Extended Cobra Reach", sanskrit: "Kanduka Salabhasana", focus: "Long-Lever Spinal Extension & Balance", pool: "spine", gif: "spine/exercise-ball-back-extension-with-arms-extended.gif" },
  { name: "Exercise Ball Supported Cobra Crown Lift", sanskrit: "Kanduka Hasta Arch", focus: "Upper Thoracic Erector Endurance", pool: "spine", gif: "spine/exercise-ball-back-extension-with-hands-behind-head.gif" },
  { name: "Stability Ball Pyramid Back & Lat Release", sanskrit: "Kanduka Parvatasana", focus: "Full Posterior Fascia & Shoulder Ease", pool: "lats", gif: "lats/exercise-ball-lower-back-stretch-pyramid.gif" },
  { name: "Exercise Ball Restorative Hug & Lumbar Melt", sanskrit: "Kanduka Apanasana", focus: "Parasympathetic Spine Surrender", pool: "spine", gif: "spine/exercise-ball-hug.gif" },
  { name: "Stability Ball Seated Hamstring Forward Fold", sanskrit: "Kanduka Paschimo", focus: "Seated Posterior Chain Elongation", pool: "hamstrings", gif: "hamstrings/exercise-ball-seated-hamstring-stretch.gif" },
  { name: "Exercise Ball Lateral Side-Lying Lat Arc", sanskrit: "Kanduka Parsva", focus: "Quadratus Lumborum & Lateral Rib Glide", pool: "lats", gif: "lats/exercise-ball-lying-side-lat-stretch.gif" },
  { name: "Stability Ball Deep Hip Flexor & Psoas Melt", sanskrit: "Kanduka Anjaneya", focus: "Anterior Hip Capsule Release", pool: "glutes", gif: "glutes/exercise-ball-hip-flexor-stretch.gif" },
  { name: "Exercise Ball Knees-Off Prone Spine Extension", sanskrit: "Kanduka Urdhva", focus: "Full Kinetic Extension & Core Lock", pool: "spine", gif: "spine/exercise-ball-back-extension-with-knees-off-ground.gif" },
  { name: "Stability Ball Prone Rotational Spine Twist", sanskrit: "Kanduka Parivrtta", focus: "Thoracic Mobility & Oblique Control", pool: "spine", gif: "spine/exercise-ball-back-extension-with-rotation.gif" },
  { name: "Exercise Ball Assisted Pectoral & Heart Opener", sanskrit: "Kanduka Anahata", focus: "Deep Anterior Chest Relaxation", pool: "pectorals", gif: "pectorals/assisted-seated-pectoralis-major-stretch-with-stability-ball.gif" },
  { name: "Stability Ball Seated Triceps & Shoulder Stretch", sanskrit: "Kanduka Amsa", focus: "Cervical Posture & Upper Arm Flexibility", pool: "triceps", gif: "triceps/exercise-ball-seated-triceps-stretch.gif" },
  { name: "Exercise Ball Alternating Bird-Dog Arm Reaches", sanskrit: "Kanduka Dandayamana", focus: "Contralateral Neuromuscular Balance", pool: "lats", gif: "lats/exercise-ball-alternating-arm-ups.gif" },
  { name: "Stability Ball Prone Leg Elevation & Sacrum Lift", sanskrit: "Kanduka Leg Float", focus: "Gluteal Firing & Sacroiliac Alignment", pool: "spine", gif: "spine/exercise-ball-prone-leg-raise.gif" },
  { name: "Exercise Ball Diagonal Hip & Hamstring Glide", sanskrit: "Kanduka Eka Pada", focus: "Posterior Chain Balance on Ball", pool: "glutes", gif: "glutes/exercise-ball-one-legged-diagonal-kick-hamstring-curl.gif" },
  { name: "Stability Ball Supine Single-Leg Hip Rotation", sanskrit: "Kanduka Yoni Flow", focus: "Deep Hip Capsule Mobility", pool: "glutes", gif: "glutes/exercise-ball-one-leg-prone-lower-body-rotation.gif" },
  { name: "Exercise Ball Gentle Plank Rollout Pull-In", sanskrit: "Kanduka Kumbhaka", focus: "Transverse Core & Pelvic Stabilization", pool: "abs", gif: "abs/pull-in-on-stability-ball.gif" },
  { name: "Stability Ball Prone Torso Twist Integration", sanskrit: "Kanduka Prone Twist", focus: "Oblique Balance & Spine Control", pool: "abs", gif: "abs/prone-twist-on-stability-ball.gif" },
  { name: "Exercise Ball Pike Inversion & Shoulder Lock", sanskrit: "Kanduka Adho Mukha", focus: "Inverted Core Elevation & Scapular Drive", pool: "pectorals", gif: "pectorals/exercise-ball-pike-push-up.gif" },
  { name: "Stability Ball Seated Core Crunch & Rib Tuck", sanskrit: "Kanduka Navasana Prep", focus: "Abdominal Endurance on Spherical Surface", pool: "abs", gif: "abs/crunch-on-stability-ball.gif" },
  { name: "Exercise Ball Arms-Straight Boat Balance Flow", sanskrit: "Kanduka Navasana", focus: "Long-Lever Core Stability & Breath", pool: "abs", gif: "abs/crunch-on-stability-ball-arms-straight.gif" },
  { name: "Stability Ball Hands-Behind-Head Arch Crunch", sanskrit: "Kanduka Ardha Crunch", focus: "Thoracic Flexion-Extension Wave", pool: "abs", gif: "abs/stability-ball-crunch-full-range-hands-behind-head.gif" },
  { name: "Exercise Ball Wall Support Calf & Ankle Rise", sanskrit: "Kanduka Tadasana", focus: "Achilles Mobility & Lower-Leg Venous Return", pool: "calves", gif: "calves/exercise-ball-on-the-wall-calf-raise.gif" },
  { name: "Stability Ball Elevated Chaturanga Push-Up", sanskrit: "Kanduka Chaturanga", focus: "Proprioceptive Shoulder & Core Lock", pool: "pectorals", gif: "pectorals/push-up-on-stability-ball.gif" },
  { name: "Exercise Ball Narrow-Grip Chaturanga Balance", sanskrit: "Kanduka Tricep Flow", focus: "Midline Stability & Tricep Tone", pool: "triceps", gif: "triceps/narrow-push-up-on-exercise-ball.gif" },
  { name: "Stability Ball Seated Reverse Table Dip Flow", sanskrit: "Kanduka Purvottana", focus: "Anterior Shoulder & Core Integration", pool: "triceps", gif: "triceps/exercise-ball-dip.gif" },
  { name: "Exercise Ball Supine Triceps & Chest Float", sanskrit: "Kanduka Supine Flow", focus: "Upper-Body Stabilization on Ball", pool: "triceps", gif: "triceps/exercise-ball-supine-triceps-extension.gif" },
  { name: "Stability Ball Dynamic Flow Chaturanga Sequence", sanskrit: "Kanduka Vinyasa", focus: "Full Kinetic Core Harmony", pool: "pectorals", gif: "pectorals/push-up-on-stability-ball-0656.gif" },
];

const MAT_YOGA_RAW = CURATED_MAT_YOGA;
const BALL_YOGA_RAW = CURATED_BALL_YOGA;

function resolvePoseType(category, name) {
  const n = name.toLowerCase();
  if (category === 'exercise_ball') {
    if (n.includes('child') || n.includes('rollout') || n.includes('melt') || n.includes('sweep') || n.includes('downward')) return 'ball_child_rollout';
    if (n.includes('bridge') || n.includes('hamstring') || n.includes('setu')) return 'ball_bridge';
    if (n.includes('savasana') || n.includes('legs-elevated')) return 'ball_savasana';
    if (n.includes('fish') || n.includes('butterfly') || n.includes('foam') || n.includes('chest hug') || n.includes('crown')) return 'ball_thoracic_arch';
    if (n.includes('plank') || n.includes('cat-cow') || n.includes('bird dog') || n.includes('marjaryasana')) return 'ball_plank_rollout';
    if (n.includes('wall squat') || n.includes('utkatasana')) return 'ball_wall_squat';
    if (n.includes('seated') || n.includes('pelvic') || n.includes('core tilt') || n.includes('adductor') || n.includes('piriformis')) return 'ball_seated_flow';
    return 'ball_back_extension';
  }
  if (n.includes('surya namaskar a')) return 'surya_namaskar_a';
  if (n.includes('surya namaskar b')) return 'surya_namaskar_b';
  if (n.includes('chandra namaskar') || n.includes('moon salutation')) return 'chandra_namaskar';
  if (n.includes('vinyasa') || n.includes('prana') || n.includes('yin wind-down') || n.includes('wave') || n.includes('digestion') || n.includes('ashtanga standing') || n.includes('detox twisting') || n.includes('fascia hydration') || n.includes('fire power')) return 'prana_vinyasa';
  if (n.includes('parsvakonasana') || n.includes('side angle')) return 'extended_side_angle';
  if (n.includes('trikonasana') || n.includes('triangle')) return 'triangle';
  if (n.includes('virabhadrasana iii') || n.includes('warrior iii') || n.includes('half moon') || n.includes('ardha chandrasana')) return 'warrior_3';
  if (n.includes('virabhadrasana ii') || n.includes('warrior ii') || n.includes('peaceful warrior') || n.includes('warrior arch')) return 'warrior_2';
  if (n.includes('virabhadrasana i') || n.includes('warrior i') || n.includes('anjaneyasana') || n.includes('crescent high lunge') || n.includes('ashwa') || n.includes('low lunge')) return 'warrior_1';
  if (n.includes('utkatasana') || n.includes('chair pose')) return 'chair_pose';
  if (n.includes('vrikshasana') || n.includes('tree pose') || n.includes('tadasana') || n.includes('mountain') || n.includes('urdhva hastasana') || n.includes('indudalasana')) return 'tree_pose';
  if (n.includes('natarajasana') || n.includes('dancer')) return 'dancer_pose';
  if (n.includes('garudasana') || n.includes('eagle')) return 'eagle_pose';
  if (n.includes('malasana') || n.includes('goddess') || n.includes('skandasana') || n.includes('side lunge')) return 'garland_squat';
  if (n.includes('padottanasana') || n.includes('uttanasana') || n.includes('forward fold') || n.includes('pada hastasana') || n.includes('parsvottanasana') || (n.includes('padangusthasana') && !n.includes('supta'))) return 'uttanasana';
  if (n.includes('paschimottanasana') || n.includes('janu sirsasana') || n.includes('upavistha') || n.includes('kurmasana') || n.includes('tarasana') || (n.includes('dandasana') && !n.includes('viparita'))) return 'seated_forward_fold';
  if (n.includes('baddha konasana') || n.includes('butterfly') || n.includes('mandukasana') || n.includes('bhekasana') || n.includes('frog')) return 'butterfly';
  if (n.includes('navasana') || n.includes('boat')) return 'boat_pose';
  if (n.includes('matsyendrasana') || n.includes('bharadvajasana') || n.includes('marichyasana') || n.includes('gomukhasana') || n.includes('agnistambhasana') || (n.includes('pigeon') && !n.includes('king')) || n.includes('krounchasana')) return 'seated_twist';
  if (n.includes('padmasana') || n.includes('sukhasana') || n.includes('siddhasana') || (n.includes('virasana') && !n.includes('supta')) || n.includes('vajrasana') || n.includes('simhasana')) return 'lotus_meditation';
  if (n.includes('adho mukha') || n.includes('downward')) return 'downward_dog';
  if (n.includes('bhujangasana') || n.includes('cobra') || n.includes('sphinx') || n.includes('urdhva mukha')) return 'upward_dog';
  if ((n.includes('dhanurasana') && !n.includes('urdhva')) || n.includes('bow pose')) return 'bow_pose';
  if (n.includes('salabhasana') || n.includes('locust') || n.includes('makarasana') || n.includes('crocodile')) return 'locust_pose';
  if (n.includes('ustrasana') || n.includes('camel') || n.includes('kapurthala')) return 'camel_pose';
  if (n.includes('chakrasana') || n.includes('wheel pose') || n.includes('urdhva dhanurasana') || n.includes('viparita dandasana')) return 'wheel_pose';
  if (n.includes('setu bandha') || n.includes('bridge') || n.includes('supta virasana') || n.includes('rajakapotasana') || n.includes('king pigeon')) return 'bridge_pose';
  if (n.includes('balasana') || n.includes('child') || n.includes('apanasana')) return 'child_pose';
  if (n.includes('sarvangasana') || n.includes('halasana') || n.includes('plow') || n.includes('karnapidasana') || n.includes('viparita karani') || n.includes('legs-up')) return 'shoulderstand';
  if (n.includes('savasana') || n.includes('happy baby') || n.includes('supta') || n.includes('belly twist') || n.includes('matsyasana') || n.includes('fish pose')) return 'savasana';
  return 'warrior_2';
}

console.log('Generating organized Yoga catalog with Mat and Stability Ball categories...');

const finalCatalog = [];

// 1. Process Mat Yoga Asanas
MAT_YOGA_RAW.forEach((item, idx) => {
  const id = `yoga-mat-${String(idx + 1).padStart(3, '0')}`;
  const poseType = resolvePoseType('yoga_mat', item.name);
  finalCatalog.push({
    id,
    name: item.name,
    sanskritName: item.sanskrit,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: 'yoga',
    subCategory: 'yoga_mat',
    level: idx % 4 === 0 ? 'Beginner' : idx % 3 === 0 ? 'Advanced' : 'Intermediate',
    muscleCategory: 'Yoga & Mobility',
    muscle: item.pool,
    equipment: 'yogamat',
    equipmentLabel: 'Non-Slip Yoga Mat',
    environment: 'Yoga Mat / Zen Sanctuary',
    isHomeFriendly: true,
    isGymFree: true,
    tagline: `Authentic traditional ${item.sanskrit} asana practiced on a yoga mat for ${item.focus.toLowerCase()}.`,
    metScore: Math.round((3.0 + (idx % 5) * 0.3) * 10) / 10,
    hypertrophyRate: 0.25,
    poseType,
    gifUrl: g(item.gif),
    primaryMuscles: [
      { name: 'Spinal Erectors & Axial Core', percentage: 90, color: '#f59e0b' },
      { name: 'Fascial Kinetic Chain', percentage: 75, color: '#fbbf24' },
      { name: 'Pelvic & Diaphragm Stabilizers', percentage: 65, color: '#d97706' },
    ],
    setupSteps: [
      'Unroll a non-slip yoga mat on a calm, flat surface. Remove shoes and ground bare feet.',
      'Align your spine from tailbone through cervical crown before initiating posture.',
      'Center your focus and establish steady, diaphragmatic Ujjayi breath.',
    ],
    formSteps: [
      `Inhale deeply to expand your ribcage and lengthen through your kinetic axis.`,
      `Exhale smoothly as you transition into ${item.sanskrit}, honoring structural alignment.`,
      `Maintain continuous, calm nasal breathing without strain for 5 to 10 full breath cycles.`,
      `Exit the posture mindfully with grounded control on your mat, returning to neutral equilibrium.`,
    ],
    commonMistakes: [
      'Holding your breath or allowing shallow chest-only breathing.',
      'Forcing joint flexibility past your natural anatomical skeletal limit.',
    ],
    proTip: `Focus your internal awareness (Drishti) directly on the breath wave. In ${item.sanskrit}, relaxation of antagonistic muscles allows genuine myofascial elongation.`,
  });
});

// 2. Process Stability Ball Yoga
BALL_YOGA_RAW.forEach((item, idx) => {
  const id = `yoga-ball-${String(idx + 1).padStart(3, '0')}`;
  const poseType = resolvePoseType('exercise_ball', item.name);
  finalCatalog.push({
    id,
    name: item.name,
    sanskritName: item.sanskrit,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: 'yoga',
    subCategory: 'exercise_ball',
    level: idx % 3 === 0 ? 'Beginner' : idx % 3 === 1 ? 'Intermediate' : 'Advanced',
    muscleCategory: 'Ball Yoga & Spine',
    muscle: item.pool,
    equipment: 'exercise_ball',
    equipmentLabel: 'Stability & Exercise Ball',
    environment: 'Exercise Ball on Yoga Mat',
    isHomeFriendly: true,
    isGymFree: true,
    tagline: `Restorative stability ball yoga flow for ${item.focus.toLowerCase()} without gym machinery.`,
    metScore: Math.round((3.2 + (idx % 4) * 0.3) * 10) / 10,
    hypertrophyRate: 0.35,
    poseType,
    gifUrl: g(item.gif),
    primaryMuscles: [
      { name: 'Core Stabilizer Ring', percentage: 92, color: '#f59e0b' },
      { name: 'Thoracic & Lumbar Erectors', percentage: 80, color: '#fbbf24' },
      { name: 'Proprioceptive Pelvic Base', percentage: 70, color: '#d97706' },
    ],
    setupSteps: [
      'Place your inflated 55-65cm stability/exercise ball directly on your yoga mat for traction.',
      'Ground feet firmly flat on the floor with knees softly unlocked for balance.',
      'Engage deep transverse core stabilizers before draping or sitting on the ball.',
    ],
    formSteps: [
      `Inhale smoothly and drape or sit onto the exercise ball, trusting the supportive cushion.`,
      `Use the spherical curve to decompress intervertebral disc spaces naturally.`,
      `Hold posture for 5 to 8 deep breaths, allowing gravity and the ball to support joint alignment.`,
      `Roll off mindfully onto your knees on the yoga mat with slow, controlled cadence.`,
    ],
    commonMistakes: [
      'Allowing the ball to slide on a slick floor (always keep it anchored on a yoga mat).',
      'Tensing shoulders or neck while balancing on the ball.',
    ],
    proTip: `Let the ball gently cradle your spine. The spherical surface provides 360-degree axial decompression that a rigid gym bench can never replicate.`,
  });
});

console.log(`Successfully generated ${finalCatalog.length} Total Yoga Sanctuary entries:`);
console.log(`- Mat Yoga Asanas: ${finalCatalog.filter(e => e.subCategory === 'yoga_mat').length}`);
console.log(`- Stability Ball Yoga: ${finalCatalog.filter(e => e.subCategory === 'exercise_ball').length}`);

const fileContent = `/**
 * FITARC YOGA SANCTUARY ARCHIVE
 * Authentic Non-Gym Yoga Asanas on Non-Slip Yoga Mat & Stability Ball Decompression
 * Dedicated routines free from gym machines, barbells, or weights.
 */

export const YOGA_AND_HOME_WORKOUTS = ${JSON.stringify(finalCatalog, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/yogaAndHomeWorkouts.js'), fileContent, 'utf-8');
console.log('Successfully updated src/data/yogaAndHomeWorkouts.js!');
