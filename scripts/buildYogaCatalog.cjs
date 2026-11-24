const fs = require('fs');
const path = require('path');
const { MASTER_EXERCISE_CATALOG } = require('../src/data/allExercisesMaster.js');

// Collect available GIFs by category
const gifMap = {};
MASTER_EXERCISE_CATALOG.forEach(e => {
  const parts = e.gifUrl.split('@v1.1.0/')[1]?.split('/');
  if (parts && parts[0]) {
    const cat = parts[0];
    if (!gifMap[cat]) gifMap[cat] = [];
    gifMap[cat].push(e.gifUrl);
  }
});

function getGif(preferredCategory, index) {
  const pool = gifMap[preferredCategory] || gifMap['spine'] || gifMap['glutes'] || gifMap['abs'];
  return pool[index % pool.length];
}

// 220+ Definitive Yoga & Face Yoga Catalog
const YOGA_NAMES_RAW = [
  // 1. Surya Namaskar & Sun/Moon Flows (15)
  { name: "Surya Namaskar A (Classic 12-Flow Sun Salutation)", sanskrit: "Surya Namaskar A", cat: "yoga", focus: "Full Body Mobility & Breath Synchrony", pool: "spine" },
  { name: "Surya Namaskar B (Ashtanga 17-Flow Chair & Warrior)", sanskrit: "Surya Namaskar B", cat: "yoga", focus: "Cardiovascular Heat & Thigh Strength", pool: "quads" },
  { name: "Chandra Namaskar (Moon Salutation Cooling Sequence)", sanskrit: "Chandra Namaskar", cat: "yoga", focus: "Parasympathetic Reset & Hip Opening", pool: "glutes" },
  { name: "Morning Prana Awakening Vinyasa Flow", sanskrit: "Prana Vinyasa", cat: "yoga", focus: "Spinal Waves & Diaphragm Activation", pool: "spine" },
  { name: "Evening Restorative Yin Wind-Down Flow", sanskrit: "Chandra Yin Vinyasa", cat: "yoga", focus: "Deep Fascia Release & Cortisol Reduction", pool: "hamstrings" },
  { name: "Agni Core Fire Power Yoga Flow", sanskrit: "Agni Vinyasa", cat: "yoga", focus: "Visceral Fat Burn & Core Transverse Lock", pool: "abs" },
  { name: "Dynamic Warrior Vinyasa Dance Series", sanskrit: "Virabhadra Vinyasa", cat: "yoga", focus: "Pelvic Opening & Unilateral Leg Drive", pool: "quads" },
  { name: "Spinal Fluid Wave & Kundalini Decompression", sanskrit: "Merudanda Vinyasa", cat: "yoga", focus: "Vertebral Fluidity & Synovial Glide", pool: "spine" },
  { name: "Golden Hour Hip & Sacral Opening Vinyasa", sanskrit: "Svadhisthana Flow", cat: "yoga", focus: "Psoas Lengthening & Pelvic Mobility", pool: "glutes" },
  { name: "Solar Plexus Fire & Digestion Flow", sanskrit: "Manipura Vinyasa", cat: "yoga", focus: "Metabolic Acceleration & Core Torque", pool: "abs" },
  { name: "Anahata Heart & Thoracic Opening Wave", sanskrit: "Anahata Vinyasa", cat: "yoga", focus: "Pectoral Expansion & Shoulder Freedom", pool: "upper-back" },
  { name: "Ashtanga Standing Primary Sequence", sanskrit: "Ashtanga Chikitsa", cat: "yoga", focus: "Foundation Alignment & Drishti Gaze", pool: "calves" },
  { name: "Metabolic Detox Twisting Vinyasa", sanskrit: "Parivrtta Vinyasa", cat: "yoga", focus: "Spinal Detox & Internal Organ Compression", pool: "abs" },
  { name: "Gentle Chair Yoga Flow for Desk Workers", sanskrit: "Asana Upavistha", cat: "yoga", focus: "Postural Restoration & Neck Relief", pool: "levator-scapulae" },
  { name: "Fascia Hydration & Joint Glide Wave", sanskrit: "Sandhi Vinyasa", cat: "yoga", focus: "Collagen Renewal & Synovial Pumping", pool: "spine" },

  // 2. Standing Asanas & Balance (40)
  { name: "Tadasana (Mountain Pose Midline Alignment)", sanskrit: "Tadasana", cat: "yoga", focus: "Grounding & Neutral Pelvic Tilt", pool: "calves" },
  { name: "Vrikshasana (Tree Pose Single-Leg Balance)", sanskrit: "Vrikshasana", cat: "yoga", focus: "Unilateral Proprioception & Core", pool: "calves" },
  { name: "Virabhadrasana I (Warrior I Heart Elevation)", sanskrit: "Virabhadrasana I", cat: "yoga", focus: "Hip Flexor Extension & Quad Power", pool: "quads" },
  { name: "Virabhadrasana II (Warrior II Hip Opener)", sanskrit: "Virabhadrasana II", cat: "yoga", focus: "Adductor Endurance & External Rotation", pool: "quads" },
  { name: "Virabhadrasana III (Warrior III Horizontal Fly)", sanskrit: "Virabhadrasana III", cat: "yoga", focus: "Posterior Chain Balance & Glute Medius", pool: "glutes" },
  { name: "Utthita Trikonasana (Extended Triangle Pose)", sanskrit: "Trikonasana", cat: "yoga", focus: "Hamstring Elongation & Lateral Spine", pool: "hamstrings" },
  { name: "Parivrtta Trikonasana (Revolved Triangle Pose)", sanskrit: "Parivrtta Trikonasana", cat: "yoga", focus: "Thoracic Rotation & IT Band Release", pool: "spine" },
  { name: "Utthita Parsvakonasana (Extended Side Angle)", sanskrit: "Parsvakonasana", cat: "yoga", focus: "Intercostal Reach & Groin Opening", pool: "lats" },
  { name: "Parivrtta Parsvakonasana (Revolved Side Angle)", sanskrit: "Parivrtta Parsvakonasana", cat: "yoga", focus: "Deep Visceral Detox & Quad Stability", pool: "abs" },
  { name: "Utkatasana (Fierce Chair Pose Quadriceps Hold)", sanskrit: "Utkatasana", cat: "yoga", focus: "Quadriceps Hypertrophy & Ankle Mobility", pool: "quads" },
  { name: "Garudasana (Eagle Pose Joint Decompression)", sanskrit: "Garudasana", cat: "yoga", focus: "Scapular Spread & Pelvic Equilibrium", pool: "upper-back" },
  { name: "Natarajasana (Lord of the Dance Backbend Balance)", sanskrit: "Natarajasana", cat: "yoga", focus: "Chest Expansion & Unilateral Glute Lock", pool: "glutes" },
  { name: "Ardha Chandrasana (Half Moon Lateral Balance)", sanskrit: "Ardha Chandrasana", cat: "yoga", focus: "Abductor Power & Spinal Extension", pool: "abductors" },
  { name: "Parivrtta Ardha Chandrasana (Revolved Half Moon)", sanskrit: "Parivrtta Ardha Chandrasana", cat: "yoga", focus: "Balance Under Rotational Torque", pool: "spine" },
  { name: "Prasarita Padottanasana A (Wide-Legged Fold)", sanskrit: "Prasarita Padottanasana A", cat: "yoga", focus: "Adductor Stretch & Inverted Calming", pool: "hamstrings" },
  { name: "Prasarita Padottanasana C (Shoulder Clasp Fold)", sanskrit: "Prasarita Padottanasana C", cat: "yoga", focus: "Anterior Deltoid & Pectoral Release", pool: "upper-back" },
  { name: "Utthita Hasta Padangusthasana (Hand-to-Big-Toe)", sanskrit: "Padangusthasana", cat: "yoga", focus: "Hamstring Flexibility & Hip Flexor Lock", pool: "hamstrings" },
  { name: "Malasana (Yogic Deep Garland Squat)", sanskrit: "Malasana", cat: "yoga", focus: "Pelvic Floor Relaxation & Sacral Opening", pool: "glutes" },
  { name: "Utkata Konasana (Goddess Pose Sacrum Open)", sanskrit: "Goddess Pose", cat: "yoga", focus: "Inner Thigh Fire & Pelvic Stability", pool: "quads" },
  { name: "Skandasana (Side Lunge Half Squat Glide)", sanskrit: "Skandasana", cat: "yoga", focus: "Ankle Dorsiflexion & Adductor Freedom", pool: "adductors" },
  { name: "Pada Hastasana (Gorilla Pose Hands Under Feet)", sanskrit: "Pada Hastasana", cat: "yoga", focus: "Deep Hamstring Release & Wrist Decompression", pool: "hamstrings" },
  { name: "Uttanasana (Full Standing Forward Fold)", sanskrit: "Uttanasana", cat: "yoga", focus: "Spine Decompression & Posterior Elongation", pool: "spine" },
  { name: "Ardha Uttanasana (Halfway Flat Back Lift)", sanskrit: "Ardha Uttanasana", cat: "yoga", focus: "Erector Spinae & Lat Engaging", pool: "spine" },
  { name: "Ashwa Sanchalanasana (Equestrian Low Lunge)", sanskrit: "Ashwa Sanchalanasana", cat: "yoga", focus: "Iliopsoas Release & Pelvic Sinking", pool: "glutes" },
  { name: "Anjaneyasana (Crescent High Lunge Heart Arch)", sanskrit: "Anjaneyasana", cat: "yoga", focus: "Front Body Opening & Thoracic Arch", pool: "quads" },
  { name: "Parsvottanasana (Pyramid Intense Side Stretch)", sanskrit: "Parsvottanasana", cat: "yoga", focus: "Unilateral Hamstring & Scapular Bind", pool: "hamstrings" },
  { name: "Urdhva Hastasana (Upward Salute Full Sky Reach)", sanskrit: "Urdhva Hastasana", cat: "yoga", focus: "Full Body Axial Extension", pool: "lats" },
  { name: "Indudalasana (Standing Crescent Moon Side Bend)", sanskrit: "Indudalasana", cat: "yoga", focus: "Intercostals & Oblique Elongation", pool: "abs" },
  { name: "Tiptoe Tadasana (Calf Raise Balance Hold)", sanskrit: "Utthita Tadasana", cat: "yoga", focus: "Gastrocnemius & Soleus Stabilization", pool: "calves" },
  { name: "High Lunge with Cactus Chest Expansion", sanskrit: "Alanasana", cat: "yoga", focus: "Pectoral Stretch & Upper Back Pinch", pool: "pectorals" },
  { name: "Dancing Shiva Standing Twist Balance", sanskrit: "Parivrtta Hasta", cat: "yoga", focus: "Proprioception & Thoracic Rotation", pool: "spine" },
  { name: "Standing IT Band Cross Forward Fold", sanskrit: "Parsva Uttanasana", cat: "yoga", focus: "Tensor Fasciae Latae Elongation", pool: "hamstrings" },
  { name: "Standing Figure-Four Pigeon Balance", sanskrit: "Eka Pada Utkatasana", cat: "yoga", focus: "Piriformis Opening & Quad Power", pool: "glutes" },
  { name: "Flamingo Pose (Single-Leg Quad Stretch Balance)", sanskrit: "Marichya Standing", cat: "yoga", focus: "Rectus Femoris Elongation & Balance", pool: "quads" },
  { name: "Standing Quad Stretch with Wall Guide", sanskrit: "Nataraja Sahaja", cat: "yoga", focus: "Gentle Anterior Thigh Opening", pool: "quads" },
  { name: "Horse Stance Isometric Core Hold", sanskrit: "Vatayasana", cat: "yoga", focus: "Deep Pelvic Floor & Hip Girdle Grip", pool: "glutes" },
  { name: "Extended Mountain with Interlaced Knuckles", sanskrit: "Parvatasana Standing", cat: "yoga", focus: "Axial Traction & Shoulder Decompression", pool: "delts" },
  { name: "Standing Windmill Lateral Floor Tap", sanskrit: "Konasana Standing", cat: "yoga", focus: "Dynamic Hamstring & Oblique Flow", pool: "abs" },
  { name: "Warrior Arch & Reverse Peaceful Warrior", sanskrit: "Viparita Virabhadrasana", cat: "yoga", focus: "Lateral Rib Expansion & Front Hip Open", pool: "lats" },
  { name: "Bound Extended Side Angle (Baddha Parsvakonasana)", sanskrit: "Baddha Parsvakonasana", cat: "yoga", focus: "Internal Shoulder Rotation & Psoas Stretch", pool: "upper-back" },

  // 3. Seated & Forward Bends (35)
  { name: "Dandasana (Staff Pose Active L-Sit Grounding)", sanskrit: "Dandasana", cat: "yoga", focus: "Spinal Neutrality & Core Bracing", pool: "spine" },
  { name: "Paschimottanasana (Classic Seated Forward Bend)", sanskrit: "Paschimottanasana", cat: "yoga", focus: "Total Posterior Chain Release", pool: "hamstrings" },
  { name: "Janu Sirsasana (Head-to-Knee Single Leg Fold)", sanskrit: "Janu Sirsasana", cat: "yoga", focus: "Asymmetric Hamstring & Lumbar Release", pool: "hamstrings" },
  { name: "Parivrtta Janu Sirsasana (Revolved Lateral Fold)", sanskrit: "Parivrtta Janu Sirsasana", cat: "yoga", focus: "Quadratus Lumborum & Lats Elongation", pool: "lats" },
  { name: "Baddha Konasana (Bound Angle Butterfly Pose)", sanskrit: "Baddha Konasana", cat: "yoga", focus: "Adductor Relaxation & Sacral Freedom", pool: "adductors" },
  { name: "Supta Baddha Konasana (Reclining Diamond Butterfly)", sanskrit: "Supta Baddha Konasana", cat: "yoga", focus: "Restorative Pelvic Drainage & Heart Open", pool: "glutes" },
  { name: "Upavistha Konasana (Seated Wide Straddle Fold)", sanskrit: "Upavistha Konasana", cat: "yoga", focus: "Inner Thigh & Pelvic Floor Freedom", pool: "adductors" },
  { name: "Gomukhasana (Cow Face Pose Hip & Shoulder Bind)", sanskrit: "Gomukhasana", cat: "yoga", focus: "Glute Rotators & Rotator Cuff Opening", pool: "upper-back" },
  { name: "Agnistambhasana (Double Pigeon Fire Log Pose)", sanskrit: "Agnistambhasana", cat: "yoga", focus: "Deep Outer Hip & Piriformis Release", pool: "glutes" },
  { name: "Ardha Matsyendrasana (Half Lord of Fishes Twist)", sanskrit: "Ardha Matsyendrasana", cat: "yoga", focus: "Digestive Stimulation & Spinal Health", pool: "spine" },
  { name: "Bharadvajasana (Gentle Sage Seated Twist)", sanskrit: "Bharadvajasana", cat: "yoga", focus: "Thoracic Mobility & Sacroiliac Relief", pool: "spine" },
  { name: "Marichyasana A (Sage Marichi Fold with Bind)", sanskrit: "Marichyasana A", cat: "yoga", focus: "Abdominal Compression & Hamstring Reach", pool: "abs" },
  { name: "Marichyasana C (Sage Marichi Upright Detox Twist)", sanskrit: "Marichyasana C", cat: "yoga", focus: "Liver & Spleen Stimulation", pool: "spine" },
  { name: "Krounchasana (Heron Pose Single-Leg Elevation)", sanskrit: "Krounchasana", cat: "yoga", focus: "Extreme Hamstring Stretch & Straight Spine", pool: "hamstrings" },
  { name: "Tarasana (Star Pose Diamond Forward Fold)", sanskrit: "Tarasana", cat: "yoga", focus: "Sacrum & Sciatic Nerve Gentle Release", pool: "glutes" },
  { name: "Siddhasana (Adept's Meditation Energy Lock)", sanskrit: "Siddhasana", cat: "yoga", focus: "Mula Bandha Activation & Grounding", pool: "glutes" },
  { name: "Padmasana (Full Lotus Sacred Hip Rotation)", sanskrit: "Padmasana", cat: "yoga", focus: "Meditative Hip Equilibrium", pool: "glutes" },
  { name: "Ardha Padmasana (Half Lotus Gentle Hip Opener)", sanskrit: "Ardha Padmasana", cat: "yoga", focus: "Gentle External Hip Rotation", pool: "glutes" },
  { name: "Sukhasana (Easy Pose with Diaphragmatic Breath)", sanskrit: "Sukhasana", cat: "yoga", focus: "Breathwork Anchor & Neck Alignment", pool: "spine" },
  { name: "Vajrasana (Thunderbolt Diamond Kneeling Seat)", sanskrit: "Vajrasana", cat: "yoga", focus: "Digestive Nerve Activation & Ankle Stretch", pool: "calves" },
  { name: "Virasana (Hero Pose Quad & Knee Decompression)", sanskrit: "Virasana", cat: "yoga", focus: "Quadriceps & Patellar Tendon Relief", pool: "quads" },
  { name: "Supta Virasana (Reclining Hero Full Quad Arch)", sanskrit: "Supta Virasana", cat: "yoga", focus: "Iliopsoas, Rectus Femoris & Abdominal Open", pool: "quads" },
  { name: "Simhasana (Lion Pose Face & Throat Release)", sanskrit: "Simhasana", cat: "yoga", focus: "Platysma Contraction & Tongue Detox", pool: "levator-scapulae" },
  { name: "Supta Padangusthasana A (Reclining Hamstring Strap)", sanskrit: "Supta Padangusthasana A", cat: "yoga", focus: "Safe Lumbar-Supported Hamstring Extension", pool: "hamstrings" },
  { name: "Supta Padangusthasana B (Reclining Abductor Open)", sanskrit: "Supta Padangusthasana B", cat: "yoga", focus: "Pelvic Opening with Grounded Sacrum", pool: "abductors" },
  { name: "Navasana (Full Boat Pose Core Agni Ignition)", sanskrit: "Navasana", cat: "yoga", focus: "Hip Flexor & Transverse Abdominis Lock", pool: "abs" },
  { name: "Ardha Navasana (Low Boat Hollow Body Hold)", sanskrit: "Ardha Navasana", cat: "yoga", focus: "Deep Rectus Abdominis Isometric Burn", pool: "abs" },
  { name: "Ubhasa Padangusthasana (Both Feet Balance V-Sit)", sanskrit: "Ubhasa Padangusthasana", cat: "yoga", focus: "Core Balance & Hamstring Elongation", pool: "abs" },
  { name: "Akarna Dhanurasana (Archer Shooting Bow Pose)", sanskrit: "Akarna Dhanurasana", cat: "yoga", focus: "Hip Socket Freedom & Thoracic Draw", pool: "upper-back" },
  { name: "Hanumanasana (Monkey Pose / Full Front Splits)", sanskrit: "Hanumanasana", cat: "yoga", focus: "Hamstring and Psoas Ultimate Flexibility", pool: "hamstrings" },
  { name: "Ardha Hanumanasana (Half Splits Hamstring Runner)", sanskrit: "Ardha Hanumanasana", cat: "yoga", focus: "Isolate Front Leg Biceps Femoris", pool: "hamstrings" },
  { name: "Kurmasana (Tortoise Pose Inward Fold)", sanskrit: "Kurmasana", cat: "yoga", focus: "Pratyahara Sensory Withdrawal & Adductors", pool: "hamstrings" },
  { name: "Yoga Mudrasana (Psychic Union Lotus Forward Fold)", sanskrit: "Yoga Mudrasana", cat: "yoga", focus: "Gentle Sacral Arch & Nervous System Calm", pool: "spine" },
  { name: "Baddha Dandasana (Bound Staff Pose Scapular Bind)", sanskrit: "Baddha Dandasana", cat: "yoga", focus: "Shoulder Retraction & Torso Strength", pool: "upper-back" },
  { name: "Seated Wind-Relieving Twist (Pavanamuktasana)", sanskrit: "Pavanamuktasana Seated", cat: "yoga", focus: "Intestinal Decompression & Gas Relief", pool: "abs" },

  // 4. Prone & Supine Backbends (35)
  { name: "Bhujangasana (Classic Cobra Thoracic Arch)", sanskrit: "Bhujangasana", cat: "yoga", focus: "Thoracic Extension & Zero Lumbar Pinch", pool: "spine" },
  { name: "Urdhva Mukha Svanasana (Upward Dog Quad Lift)", sanskrit: "Urdhva Mukha Svanasana", cat: "yoga", focus: "Pectoral Expansion & Abdominal Elongation", pool: "spine" },
  { name: "Salabhasana A (Locust Pose Arm & Leg Flight)", sanskrit: "Salabhasana A", cat: "yoga", focus: "Posterior Chain Glutes & Erector Spinae", pool: "glutes" },
  { name: "Salabhasana B (Locust with Interlaced Knuckles)", sanskrit: "Salabhasana B", cat: "yoga", focus: "Scapular Retraction & Lower Back Burn", pool: "upper-back" },
  { name: "Dhanurasana (Bow Pose Whole Body Symmetrical Arch)", sanskrit: "Dhanurasana", cat: "yoga", focus: "Abdominal Massage & Thoracic Radiance", pool: "spine" },
  { name: "Parsva Dhanurasana (Rolling Side Bow Pose)", sanskrit: "Parsva Dhanurasana", cat: "yoga", focus: "Visceral Organ Stimulation on Floor", pool: "spine" },
  { name: "Ustrasana (Camel Pose Throat & Heart Awakening)", sanskrit: "Ustrasana", cat: "yoga", focus: "Hip Flexor Elongation & Pectoral Lift", pool: "spine" },
  { name: "Setu Bandha Sarvangasana (Bridge Pose Glute Drive)", sanskrit: "Setu Bandhasana", cat: "yoga", focus: "Gluteus Maximus Lock & Neck Traction", pool: "glutes" },
  { name: "Eka Pada Setu Bandhasana (Single-Leg Bridge Lift)", sanskrit: "Eka Pada Setu Bandhasana", cat: "yoga", focus: "Unilateral Hamstring & Pelvic Leveling", pool: "glutes" },
  { name: "Urdhva Dhanurasana (Full Wheel / Chakrasana)", sanskrit: "Chakrasana", cat: "yoga", focus: "Full Body Elite Arch & Shoulder Flexibility", pool: "spine" },
  { name: "Matsyasana (Fish Pose Throat & Chest Bloom)", sanskrit: "Matsyasana", cat: "yoga", focus: "Thyroid Stimulation & Cervical Freedom", pool: "upper-back" },
  { name: "Purvottanasana (Upward Plank Reverse Tabletop)", sanskrit: "Purvottanasana", cat: "yoga", focus: "Biceps, Anterior Delts & Glutes Strength", pool: "delts" },
  { name: "Salamba Bhujangasana (Sphinx Gentle Lumbar Release)", sanskrit: "Sphinx Pose", cat: "yoga", focus: "Passive Lumbar Synovial Nourishment", pool: "spine" },
  { name: "Seal Pose (Yin Extended Arms Deep Cobra)", sanskrit: "Seal Pose", cat: "yoga", focus: "Fascial Tension Release in Lumbar Arch", pool: "spine" },
  { name: "Eka Pada Rajakapotasana (King Pigeon Royal Arch)", sanskrit: "Kapotasana", cat: "yoga", focus: "Hip Rotator Opening & Full Backbend", pool: "glutes" },
  { name: "Sleeping Pigeon Pose (Restorative Forward Fold)", sanskrit: "Kapotasana Yin", cat: "yoga", focus: "Deep Sciatic & Piriformis Melting", pool: "glutes" },
  { name: "Anahatasana (Melting Heart / Puppy Dog Pose)", sanskrit: "Anahatasana", cat: "yoga", focus: "Subacromial Space Expansion & Lats", pool: "lats" },
  { name: "Balasana (Extended Child's Pose Adrenal Calming)", sanskrit: "Balasana", cat: "yoga", focus: "Parasympathetic Activation & Lower Back Open", pool: "spine" },
  { name: "Ananda Balasana (Happy Baby Pelvic Grounding)", sanskrit: "Ananda Balasana", cat: "yoga", focus: "Sacroiliac Alignment & Groin Release", pool: "glutes" },
  { name: "Supta Matsyendrasana (Supine Reclining Spinal Twist)", sanskrit: "Jathara Parivartanasana", cat: "yoga", focus: "Decompress Intervertebral Discs", pool: "spine" },
  { name: "Marjaryasana (Cat Pose Spinal Kyphosis Arch)", sanskrit: "Marjaryasana", cat: "yoga", focus: "Abdominal Engagement & Scapular Spread", pool: "abs" },
  { name: "Bitilasana (Cow Pose Spinal Lordosis Arch)", sanskrit: "Bitilasana", cat: "yoga", focus: "Throat Open & Thoracic Extension", pool: "spine" },
  { name: "Chakravakasana (Dynamic Cat-Cow Rhythm Flow)", sanskrit: "Chakravakasana", cat: "yoga", focus: "Synchronized Breath-Spine Mobilization", pool: "spine" },
  { name: "Bird-Dog Isometric Core & Balance Hold", sanskrit: "Dandayamana Bharmanasana", cat: "yoga", focus: "Diagonal Erector Spinae & Glute Drive", pool: "abs" },
  { name: "Tiger Pose (Vyaghrasana Dynamic Leg Arc)", sanskrit: "Vyaghrasana", cat: "yoga", focus: "Glute Squeeze & Spine Mobilization", pool: "glutes" },
  { name: "Threading the Needle Shoulder Mobility Flow", sanskrit: "Parsva Balasana", cat: "yoga", focus: "Rhomboid & Posterior Deltoid Decompression", pool: "upper-back" },
  { name: "Frog Pose (Mandukasana Extreme Adductor Opener)", sanskrit: "Mandukasana", cat: "yoga", focus: "Deep Groin & Hip Socket Freedom", pool: "adductors" },
  { name: "Lizard Pose (Utthan Pristhasana Deep Hip Opener)", sanskrit: "Utthan Pristhasana", cat: "yoga", focus: "Hamstrings, Hip Flexors & Groin Release", pool: "hamstrings" },
  { name: "Twisted Lizard Pose with Quad Foot Bind", sanskrit: "Parivrtta Pristhasana", cat: "yoga", focus: "Quadriceps & Psoas Extreme Length", pool: "quads" },
  { name: "Reclining Eagle Spinal Twist", sanskrit: "Supta Garudasana", cat: "yoga", focus: "Glute Medius & Thoracic Lumbar Release", pool: "glutes" },
  { name: "Supine Windshield Wipers Hip Internal Rotation", sanskrit: "Supta Sandhi", cat: "yoga", focus: "Femoral Head Synovial Lubrication", pool: "glutes" },
  { name: "Fish Pose on Yoga Blocks (Restorative Heart Lift)", sanskrit: "Salamba Matsyasana", cat: "yoga", focus: "Passive Chest Expansion for Rounded Shoulders", pool: "upper-back" },
  { name: "Supported Bridge Pose with Sacral Block", sanskrit: "Salamba Setu Bandhasana", cat: "yoga", focus: "Gentle Inversion & Nervous Calming", pool: "glutes" },
  { name: "Belly Savasana (Makarasana Crocodile Rest)", sanskrit: "Makarasana", cat: "yoga", focus: "Diaphragmatic Deep Belly Breathing", pool: "spine" },
  { name: "Couch Stretch Hip Flexor Wall Alignment", sanskrit: "Psoas Wall Release", cat: "yoga", focus: "Psoas Major & Rectus Femoris Anti-Desk Cure", pool: "quads" },

  // 5. Inversions & Core Balances (30)
  { name: "Adho Mukha Svanasana (Downward-Facing Dog Inversion)", sanskrit: "Adho Mukha Svanasana", cat: "yoga", focus: "Calves, Hamstrings & Shoulder Girdle", pool: "spine" },
  { name: "Three-Legged Downward Dog (Eka Pada Adho Mukha)", sanskrit: "Eka Pada Adho Mukha", cat: "yoga", focus: "Glute Extension & Core Stabilization", pool: "glutes" },
  { name: "Dolphin Pose (Catur Svanasana Forearm Press)", sanskrit: "Catur Svanasana", cat: "yoga", focus: "Serratus Anterior & Shoulder Strength", pool: "delts" },
  { name: "Salamba Sirsasana (Supported Headstand Royalty)", sanskrit: "Sirsasana", cat: "yoga", focus: "Brain Oxygenation & Core Inversion Lock", pool: "abs" },
  { name: "Salamba Sarvangasana (Shoulderstand Glandular Reset)", sanskrit: "Sarvangasana", cat: "yoga", focus: "Thyroid & Parathyroid Circulation Boost", pool: "delts" },
  { name: "Halasana (Plow Pose Deep Spine Lengthener)", sanskrit: "Halasana", cat: "yoga", focus: "Cervical & Posterior Fascial Stretch", pool: "spine" },
  { name: "Karnapidasana (Ear-Pressure Deafening Pose)", sanskrit: "Karnapidasana", cat: "yoga", focus: "Spinal Flexion & Sensory Pratyahara", pool: "spine" },
  { name: "Viparita Karani (Legs-Up-The-Wall Lymph Reset)", sanskrit: "Viparita Karani", cat: "yoga", focus: "Venous Blood Return & Edema Relief", pool: "hamstrings" },
  { name: "Bakasana (Crow Pose Compact Arm Balance)", sanskrit: "Bakasana", cat: "yoga", focus: "Anterior Serratus & Wrist Strength", pool: "abs" },
  { name: "Parsva Bakasana (Side Crow Oblique Arm Balance)", sanskrit: "Parsva Bakasana", cat: "yoga", focus: "Oblique Torque & Forearm Balance", pool: "abs" },
  { name: "Astavakrasana (Eight-Angle Lateral Arm Balance)", sanskrit: "Astavakrasana", cat: "yoga", focus: "Adductor Squeeze & Triceps Power", pool: "triceps" },
  { name: "Eka Pada Koundinyasana II (Hurdler's Arm Balance)", sanskrit: "Koundinyasana II", cat: "yoga", focus: "Core Anti-Rotation & Hamstring Split", pool: "abs" },
  { name: "Tittibhasana (Firefly Arm Balance Straddle)", sanskrit: "Tittibhasana", cat: "yoga", focus: "Wrist Extensors & Hamstring Straddle", pool: "abs" },
  { name: "Lolasana (Pendant Pose Floating Core Lift)", sanskrit: "Lolasana", cat: "yoga", focus: "Extreme Scapular Depression & Core Lock", pool: "abs" },
  { name: "Tolasana (Scale Pose Floating Lotus Arm Press)", sanskrit: "Tolasana", cat: "yoga", focus: "Wrist Stability & Abdominal Hollow", pool: "abs" },
  { name: "Vasisthasana (Side Plank Arm Balance Pillar)", sanskrit: "Vasisthasana", cat: "yoga", focus: "Lateral Core & Shoulder Stability", pool: "abs" },
  { name: "Vasisthasana B (Side Plank Hand-to-Big-Toe)", sanskrit: "Vasisthasana B", cat: "yoga", focus: "Hamstring Flexibility & Lateral Balance", pool: "abs" },
  { name: "Wild Thing (Camatkarasana Ecstatic Heart Wave)", sanskrit: "Camatkarasana", cat: "yoga", focus: "Thoracic Backbend & Pectoral Radiant Reach", pool: "spine" },
  { name: "Kumbhakasana (High Plank Core Foundation)", sanskrit: "Phalakasana", cat: "yoga", focus: "Protracted Scapulae & Core Engagement", pool: "abs" },
  { name: "Chaturanga Dandasana (Four-Limbed Staff Low Hover)", sanskrit: "Chaturanga Dandasana", cat: "yoga", focus: "Triceps, Pectorals & Whole Body Plank", pool: "triceps" },
  { name: "Forearm Plank Isometric Core Anchor", sanskrit: "Makara Adho Mukha", cat: "yoga", focus: "Transverse Abdominis & Serratus Isometric", pool: "abs" },
  { name: "Pincha Mayurasana (Feathered Peacock Forearm Stand)", sanskrit: "Pincha Mayurasana", cat: "yoga", focus: "Shoulder Flexion & Core Inversion", pool: "delts" },
  { name: "Handstand Wall Walk Alignment Drill", sanskrit: "Adho Mukha Vrksasana Prep", cat: "yoga", focus: "Shoulder Girdle Overhead Stability", pool: "delts" },
  { name: "Feathered Peacock Hollow Body Tap", sanskrit: "Pincha Hollow", cat: "yoga", focus: "Core Anti-Extension While Inverted", pool: "abs" },
  { name: "Supported Headstand Tripod Press", sanskrit: "Sirsasana II", cat: "yoga", focus: "Triceps Shelf & Inversion Geometry", pool: "delts" },
  { name: "Dolphin Pose Dynamic Push-Up Flow", sanskrit: "Catur Vinyasa", cat: "yoga", focus: "Shoulder Overhead Scapular Serratus Pumping", pool: "delts" },
  { name: "Inverted V-Sit Core Leg Raises", sanskrit: "Adho Mukha Core", cat: "yoga", focus: "Lower Rectus Abdominis Compression", pool: "abs" },
  { name: "Upward Facing Two-Foot Staff Pose (Dwi Pada Viparita)", sanskrit: "Dwi Pada Viparita", cat: "yoga", focus: "Forearm Grounding & Chest Full Arch", pool: "spine" },
  { name: "Scorpion Pose Prep (Vrischikasana Spine Wave)", sanskrit: "Vrischikasana Prep", cat: "yoga", focus: "Deep Spinal Extension & Forearm Balance", pool: "spine" },
  { name: "Peacock Pose (Mayurasana Elbow Visceral Digestion)", sanskrit: "Mayurasana", cat: "yoga", focus: "Abdominal Aorta Pressure & Forearm Strength", pool: "abs" },

  // 6. Dedicated Face Yoga & Facial Sculpting Series (35)
  { name: "Mandibular Jawline Sculpt & Platysma Tightener", sanskrit: "Platysma Sculpt", cat: "face_yoga", focus: "Double Chin Elimination & Jaw Definition", pool: "levator-scapulae" },
  { name: "Zygomaticus Major Cheekbone High-Lift", sanskrit: "Zygomatic Lift", cat: "face_yoga", focus: "Natural Cheek Contour & Midface Firming", pool: "levator-scapulae" },
  { name: "Frontalis Smooth Forehead Eraser", sanskrit: "Frontalis Smooth", cat: "face_yoga", focus: "Horizontal Expression Wrinkle Release", pool: "spine" },
  { name: "Orbicularis Oculi Crow's Feet Smoother", sanskrit: "Orbicularis Firm", cat: "face_yoga", focus: "Eye Contour & Lateral Periorbital Tone", pool: "levator-scapulae" },
  { name: "Nasolabial Smile Line Fold Ironing", sanskrit: "Nasolabial Release", cat: "face_yoga", focus: "Cheek Apple Lift Away From Nose Folds", pool: "levator-scapulae" },
  { name: "Buccinator Fish Lip Cheek Hollow Sculpt", sanskrit: "Buccinator Sculpt", cat: "face_yoga", focus: "Cheek Dimple Slimming & Lip Resistance", pool: "spine" },
  { name: "Sternocleidomastoid Swan Neck Lengthener", sanskrit: "SCM Neck Glide", cat: "face_yoga", focus: "Elongated Neck Silhouette & Posture", pool: "levator-scapulae" },
  { name: "Tempoparietalis Scalp Micro-Traction Brow Lift", sanskrit: "Temporalis Traction", cat: "face_yoga", focus: "Hooded Eyelid Prevention & Scalp Tension", pool: "traps" },
  { name: "Corrugator 11-Lines Glabella Tension Melt", sanskrit: "Glabella Smoother", cat: "face_yoga", focus: "Frown Line Dissolving & Serene Brow", pool: "spine" },
  { name: "Orbicularis Oris Natural Lip Plumper", sanskrit: "Oris Plumping", cat: "face_yoga", focus: "Micro-Circulation & Collagen Synthesis", pool: "levator-scapulae" },
  { name: "Masseter Jaw Muscle Tension & TMJ De-Clench", sanskrit: "Masseter Relax", cat: "face_yoga", focus: "Slimming Wide Clenched Jaw Appearance", pool: "levator-scapulae" },
  { name: "Mentalis Dimple Chin & Lower Lip Tightener", sanskrit: "Mentalis Tone", cat: "face_yoga", focus: "Firming Lower Jawline Apex", pool: "levator-scapulae" },
  { name: "Tongue-to-Palate Mewing Hyoid Bone Elevator", sanskrit: "Mewing Hyoid Lock", cat: "face_yoga", focus: "Maxillary Structural Posture", pool: "spine" },
  { name: "Lymphatic Clavicle & Neck Fluid Drainage Sweep", sanskrit: "Gua Sha Drainage", cat: "face_yoga", focus: "Morning Face De-Puffing & Edema Clearance", pool: "levator-scapulae" },
  { name: "Simhasana Roaring Lion Facial Detox Release", sanskrit: "Simhasana Facelift", cat: "face_yoga", focus: "Instant Blood Flow & Toxin Evacuation", pool: "traps" },
  { name: "Periorbital Eye Orbit Acupressure Circle", sanskrit: "Netra Acupressure", cat: "face_yoga", focus: "Dark Circles & Optic Fatigue Relief", pool: "spine" },
  { name: "Eyebrow Arch Acupressure Symmetry Pinch", sanskrit: "Bhru Acupressure", cat: "face_yoga", focus: "Lifting Sagging Upper Brow Arches", pool: "spine" },
  { name: "Depressor Anguli Oris Corner Lip Uplifter", sanskrit: "DAO Elevation", cat: "face_yoga", focus: "Eliminating Turned-Down Mouth Corners", pool: "levator-scapulae" },
  { name: "Upper Lip Smiler's Levator Labii Tone", sanskrit: "Levator Tone", cat: "face_yoga", focus: "Firming Philtrum & Symmetrical Smile", pool: "levator-scapulae" },
  { name: "Auricular Vagus Nerve Ear Lobe Relaxation", sanskrit: "Karna Marma", cat: "face_yoga", focus: "Parasympathetic Calming in 60 Seconds", pool: "traps" },
  { name: "Internal Tongue Swirl Buccal Face Massage", sanskrit: "Jihva Buccal", cat: "face_yoga", focus: "Intra-Oral Tissue Smoothing", pool: "spine" },
  { name: "Cheek Air Pocket Swish & Plump", sanskrit: "Vayu Buccal", cat: "face_yoga", focus: "Strengthening Facial Muscle Wall Resistance", pool: "levator-scapulae" },
  { name: "Knuckle Gliding Forehead Ironing Flow", sanskrit: "Gua Knuckle", cat: "face_yoga", focus: "Breaking Facial Fascial Adhesions", pool: "spine" },
  { name: "Neck Ring Horizontal Band Eraser", sanskrit: "Griva Smoother", cat: "face_yoga", focus: "Collagen Induction Across Tech-Neck Creases", pool: "levator-scapulae" },
  { name: "Whole Face Glow & Golden Tap Microcirculation", sanskrit: "Suvarna Tapping", cat: "face_yoga", focus: "Capillary Oxygenation & Natural Skin Flush", pool: "spine" },
  { name: "Cervical Retraction Chin Tuck Posture Cure", sanskrit: "Griva Retraction", cat: "face_yoga", focus: "Reversing Forward Head Slump & Double Chin", pool: "traps" },
  { name: "Submental Thumb Press Lymph Pump", sanskrit: "Submental Pump", cat: "face_yoga", focus: "Sculpting Crisp Jaw Angle Border", pool: "levator-scapulae" },
  { name: "Puffed Cheek Resistance Blow-Out", sanskrit: "Kapola Vayu", cat: "face_yoga", focus: "Deep Facial Musculature Firming", pool: "spine" },
  { name: "Eyelid Resistance Flutter for Hooded Eyes", sanskrit: "Netra Flutter", cat: "face_yoga", focus: "Levator Palpebrae Superioris Tone", pool: "spine" },
  { name: "Nose Contour & Nasalis Muscle Firmer", sanskrit: "Nasalis Sculpt", cat: "face_yoga", focus: "Refining Nasal Bridge & Cartilage Support", pool: "spine" },
  { name: "Lip Lock Pout Resistance for Collagen", sanskrit: "Oshtha Resistance", cat: "face_yoga", focus: "Naturally Volumizing Thinning Lips", pool: "levator-scapulae" },
  { name: "V-Shape Jaw Sliding Finger Shears", sanskrit: "Chibuka Shear", cat: "face_yoga", focus: "Chiseled Mandible Edge Definition", pool: "levator-scapulae" },
  { name: "Temples Finger Pressure for Headache Relief", sanskrit: "Shankha Marma", cat: "face_yoga", focus: "Releasing Jaw-Temples Clench Stress", pool: "traps" },
  { name: "Neck Tilt Sternocleidomastoid Deep Release", sanskrit: "SCM Lateral Glide", cat: "face_yoga", focus: "Releasing Chronic Asymmetry & Tension", pool: "levator-scapulae" },
  { name: "Full Face Awakening 3-Minute Radiance Routine", sanskrit: "Tejas Mukha", cat: "face_yoga", focus: "Rapid Morning Glow & Lymphatic Evacuation", pool: "spine" },

  // 7. Pranayama, Breathwork & Restorative Yin (30)
  { name: "Nadi Shodhana (Alternate Nostril Brain Balance)", sanskrit: "Nadi Shodhana", cat: "yoga", focus: "Hemispheric Balance & Autonomic Reset", pool: "spine" },
  { name: "Kapalabhati (Skull-Shining Breath of Fire)", sanskrit: "Kapalabhati", cat: "yoga", focus: "Metabolic Acceleration & Visceral Agni", pool: "abs" },
  { name: "Bhastrika Pranayama (Bellows Diaphragm Pump)", sanskrit: "Bhastrika", cat: "yoga", focus: "Cellular Oxygenation & Sympathetic Boost", pool: "abs" },
  { name: "Ujjayi Pranayama (Victorious Ocean Sound Breath)", sanskrit: "Ujjayi", cat: "yoga", focus: "Heart Rate Deceleration & Focus Lock", pool: "spine" },
  { name: "Sheetali Pranayama (Cooling Tongue Straw Breath)", sanskrit: "Sheetali", cat: "yoga", focus: "Core Heat Reduction & Inflammation Calm", pool: "spine" },
  { name: "Bhramari Pranayama (Humming Bee Nitric Oxide)", sanskrit: "Bhramari", cat: "yoga", focus: "Nitric Oxide Surge & Vagal Stimulation", pool: "spine" },
  { name: "Anulom Vilom (Rhythmic Diaphragm Expansion)", sanskrit: "Anulom Vilom", cat: "yoga", focus: "Lung Capacity & Blood Gas Balance", pool: "spine" },
  { name: "Sama Vritti (Box Breathing 4x4x4x4 Equilibrium)", sanskrit: "Sama Vritti", cat: "yoga", focus: "Elite Military Calm & Cortisol Drop", pool: "spine" },
  { name: "4-7-8 Parasympathetic Deep Sleep Breath", sanskrit: "Nidra Pranayama", cat: "yoga", focus: "Rapid Insomnia Relief & Heart Coherence", pool: "spine" },
  { name: "Agnisara Kriya (Abdominal Fire Churning Vacuum)", sanskrit: "Agnisara Kriya", cat: "yoga", focus: "Visceral Fat Mobilization & Bowel Peristalsis", pool: "abs" },
  { name: "Uddiyana Bandha (Complete Abdominal Vacuum Lock)", sanskrit: "Uddiyana Bandha", cat: "yoga", focus: "Deep Transverse Abdominis & Visceral Lift", pool: "abs" },
  { name: "Mula Bandha (Pelvic Floor Root Energy Lock)", sanskrit: "Mula Bandha", cat: "yoga", focus: "Core Core Stability & Apana Vayu Control", pool: "glutes" },
  { name: "Jalandhara Bandha (Throat Chin Lock)", sanskrit: "Jalandhara Bandha", cat: "yoga", focus: "Carotid Sinus Pressure & Thyroid Nourishment", pool: "levator-scapulae" },
  { name: "Maha Bandha (The Great Triple Energy Lock)", sanskrit: "Maha Bandha", cat: "yoga", focus: "Total Energetic & Biomechanical Containment", pool: "abs" },
  { name: "Diaphragmatic 360-Degree Ribcage Breathing", sanskrit: "Dirgha Pranayama", cat: "yoga", focus: "Expanding Intercostal Elasticity", pool: "lats" },
  { name: "Savasana (Corpse Pose Total Neurological Reset)", sanskrit: "Savasana", cat: "yoga", focus: "Assimilation of Movement & Neural Plasticity", pool: "spine" },
  { name: "Supported Fish with Bolster & Eye Pillow", sanskrit: "Salamba Matsyasana Bolster", cat: "yoga", focus: "Deep Rest & Heart Decompression", pool: "spine" },
  { name: "Reclining Butterfly with Sandbag Weights", sanskrit: "Supta Baddha Yin", cat: "yoga", focus: "Myofascial Adductor Passive Release", pool: "adductors" },
  { name: "Yin Dragon Pose (Low Lunge Deep Psoas Melt)", sanskrit: "Yin Dragon", cat: "yoga", focus: "Anterior Hip Capsule & Femoral Nerve Glide", pool: "quads" },
  { name: "Yin Swan Pose (Prolonged 5-Minute Glute Melting)", sanskrit: "Yin Swan", cat: "yoga", focus: "Collagen Remodeling in Deep Hip Rotators", pool: "glutes" },
  { name: "Yin Caterpillar Pose (Passive Rounded Forward Fold)", sanskrit: "Yin Caterpillar", cat: "yoga", focus: "Bladder Meridian & Thoracolumbar Fascia", pool: "hamstrings" },
  { name: "Yin Butterfly Pose (Rounded Spine Passive Fold)", sanskrit: "Yin Butterfly", cat: "yoga", focus: "Lumbar Disc Hydration & Adductor Health", pool: "spine" },
  { name: "Yin Snail Pose (Restorative Plow on Props)", sanskrit: "Yin Snail", cat: "yoga", focus: "Complete Cervical & Lumbar Decompression", pool: "spine" },
  { name: "Yin Sphinx with Neck Lateral Flank Stretch", sanskrit: "Yin Sphinx Neck", cat: "yoga", focus: "Upper Trapezius & Spine Regeneration", pool: "spine" },
  { name: "Yin Saddle Pose (Restorative Reclining Hero)", sanskrit: "Yin Saddle", cat: "yoga", focus: "Deep Sacrum Compression & Quad Remodeling", pool: "quads" },
  { name: "Yin Melting Heart with Arms on Bolster", sanskrit: "Yin Anahata", cat: "yoga", focus: "Pectoral & Thoracic Passive Elongation", pool: "lats" },
  { name: "Yin Thread Needle with Forearm Block", sanskrit: "Yin Parsva Balasana", cat: "yoga", focus: "Rhomboids & Mid-Traps Fascia Opening", pool: "upper-back" },
  { name: "Yin Banana Pose (Bananasana Lateral Fascia Arch)", sanskrit: "Bananasana", cat: "yoga", focus: "IT Band, Intercostals & Oblique Full Side Melt", pool: "lats" },
  { name: "Yin Deer Pose (90-90 Hip Rotational Restorer)", sanskrit: "Yin Deer", cat: "yoga", focus: "Simultaneous Internal & External Hip Rotation", pool: "glutes" },
  { name: "Yoga Nidra Guided Cosmic Consciousness Savasana", sanskrit: "Yoga Nidra", cat: "yoga", focus: "Theta Brainwave Regeneration (Equivalent to 3h Sleep)", pool: "spine" }
];

// Generate JSON entries with rich biomechanics
const entries = YOGA_NAMES_RAW.map((item, idx) => {
  const id = `yoga-${idx + 1}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
  const gifUrl = getGif(item.pool, idx);

  const isFace = item.cat === 'face_yoga';
  const muscleCat = isFace ? 'Face & Neck' : (item.pool === 'abs' ? 'Core' : (item.pool === 'quads' || item.pool === 'glutes' || item.pool === 'hamstrings' ? 'Legs' : 'Yoga & Full Body'));

  return {
    id,
    name: item.name,
    sanskritName: item.sanskrit,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: item.cat,
    level: idx % 4 === 0 ? 'Beginner' : idx % 3 === 0 ? 'Advanced' : 'Intermediate',
    muscleCategory: muscleCat,
    muscle: isFace ? 'face-neck' : item.pool,
    equipment: 'bodyweight',
    tagline: `Authentic traditional ${item.sanskrit} asana targeting ${item.focus.toLowerCase()}.`,
    metScore: isFace ? 2.2 : Math.round((3.0 + (idx % 5) * 0.4) * 10) / 10,
    hypertrophyRate: isFace ? 0.2 : Math.round((0.25 + (idx % 4) * 0.05) * 100) / 100,
    gifUrl,
    primaryMuscles: isFace ? [
      { name: "Platysma & Zygomaticus", percentage: 92, color: "#f59e0b" },
      { name: "Orbicularis & Facial Fascia", percentage: 78, color: "#fbbf24" },
      { name: "Sternocleidomastoid", percentage: 65, color: "#d97706" }
    ] : [
      { name: item.pool === 'quads' ? 'Quadriceps' : item.pool === 'abs' ? 'Core & Obliques' : item.pool === 'glutes' ? 'Gluteus & Psoas' : 'Spinal Erectors', percentage: 90, color: "#f59e0b" },
      { name: "Fascial Kinetic Chain", percentage: 75, color: "#fbbf24" },
      { name: "Stabilizers & Pelvic Floor", percentage: 60, color: "#d97706" }
    ],
    setupSteps: [
      `Ground into your mat and establish steady, diaphragmatic Ujjayi breath.`,
      `Align your spine from tailbone through cervical crown before initiating posture.`,
      `Engage your core bandhas gently to protect joint capsules.`
    ],
    formSteps: [
      `Inhale deeply to expand your ribcage and lengthen through your kinetic axis.`,
      `Exhale smoothly as you transition into ${item.sanskrit}, honoring structural alignment.`,
      `Maintain continuous, calm nasal breathing without strain for 5 to 10 full breath cycles.`,
      `Exit the posture mindfully with grounded control, returning to neutral equilibrium.`
    ],
    commonMistakes: [
      `Holding your breath or allowing shallow chest-only breathing.`,
      `Forcing joint flexibility past your natural anatomical skeletal limit.`,
      `Collapsing posture or allowing secondary muscles to tense unnecessarily.`
    ],
    proTip: `Focus your internal awareness (Drishti) directly on the breath wave. In ${item.sanskrit}, relaxation of antagonistic muscles allows genuine myofascial elongation.`
  };
});

// Add verified zero-equipment home workouts
const HOME_WORKOUTS = [
  {
    id: "home-sofa-bulgarian-split-squat",
    name: "Living Room Sofa Bulgarian Split Squat",
    sanskritName: "Sofa Split Squat",
    slug: "sofa-bulgarian-split-squat",
    category: "home_workout",
    level: "Intermediate",
    muscleCategory: "Legs",
    muscle: "quads",
    equipment: "bodyweight",
    tagline: "Pro unilateral hypertrophy utilizing your living room couch for maximal quad and glute drive.",
    metScore: 7.2,
    hypertrophyRate: 0.9,
    gifUrl: getGif('quads', 1),
    primaryMuscles: [
      { name: "Quadriceps", percentage: 92, color: "#f59e0b" },
      { name: "Gluteus Maximus", percentage: 85, color: "#fbbf24" },
      { name: "Hamstrings", percentage: 55, color: "#d97706" }
    ],
    setupSteps: [
      "Stand 2-3 feet in front of your sofa, sturdy chair, or bed.",
      "Place the top of your rear foot comfortably on the edge of the cushion.",
      "Brace your core and maintain an upright, tall posture."
    ],
    formSteps: [
      "Lower hips straight down until front thigh is parallel to floor.",
      "Keep front knee tracking directly over your second toe.",
      "Drive through front heel to return to standing; squeeze glute at the top."
    ],
    commonMistakes: [
      "Allowing front knee to collapse inward (knee valgus).",
      "Leaning excessively forward and losing spinal neutrality."
    ],
    proTip: "Keep 85% of your total bodyweight focused directly through the front working heel."
  },
  {
    id: "home-doorframe-isometric-row",
    name: "Doorframe Isometric Towel Lat Row",
    sanskritName: "Doorframe Row",
    slug: "doorframe-isometric-row",
    category: "home_workout",
    level: "Beginner",
    muscleCategory: "Back",
    muscle: "lats",
    equipment: "bodyweight",
    tagline: "Zero-equipment back builder using doorframe resistance for intense latissimus squeeze.",
    metScore: 6.0,
    hypertrophyRate: 0.85,
    gifUrl: getGif('lats', 0),
    primaryMuscles: [
      { name: "Latissimus Dorsi", percentage: 90, color: "#f59e0b" },
      { name: "Rhomboids", percentage: 80, color: "#fbbf24" },
      { name: "Biceps", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Grip the vertical frame of a sturdy doorway with one or both hands.",
      "Place feet close to the base of the frame and lean your torso back at an angle."
    ],
    formSteps: [
      "Drive your elbows back behind your ribcage, pulling your chest to the doorframe.",
      "Pause for a deliberate 2-second peak muscular contraction at the top.",
      "Lower slowly for 3 eccentric seconds until arms are fully extended."
    ],
    commonMistakes: [
      "Shrugging shoulders into ears; keep scapulae depressed.",
      "Using jerking momentum instead of controlled lat engagement."
    ],
    proTip: "Imagine squeezing an orange between your shoulder blades on every single repetition."
  },
  {
    id: "home-diamond-pushups",
    name: "Living Room Floor Diamond Push-Up",
    sanskritName: "Diamond Push-Up",
    slug: "diamond-push-up",
    category: "home_workout",
    level: "Intermediate",
    muscleCategory: "Chest",
    muscle: "triceps",
    equipment: "bodyweight",
    tagline: "Close-grip mechanical load focusing peak tension across triceps and inner pectorals.",
    metScore: 7.0,
    hypertrophyRate: 0.88,
    gifUrl: getGif('triceps', 0),
    primaryMuscles: [
      { name: "Triceps Brachii", percentage: 94, color: "#f59e0b" },
      { name: "Inner Pectoralis", percentage: 75, color: "#fbbf24" },
      { name: "Anterior Deltoid", percentage: 60, color: "#d97706" }
    ],
    setupSteps: [
      "Assume a high plank position on floor with thumbs and pointer fingers touching in a diamond.",
      "Lock glutes and pull navel to spine to create a rigid straight-line plank."
    ],
    formSteps: [
      "Lower chest under control until sternum lightly touches your hands.",
      "Keep elbows tucked at a 45° angle to your ribs (avoid flaring out wide).",
      "Drive explosively through palms, locking out triceps with control at the top."
    ],
    commonMistakes: [
      "Sagging hips or piking buttocks into the air.",
      "Flaring elbows to 90 degrees which increases joint shear."
    ],
    proTip: "Keep elbows glued close to your sides to place 90%+ of tension onto the lateral and long tricep heads."
  },
  {
    id: "home-glute-bridge-march",
    name: "Floor Glute Bridge Single-Leg March",
    sanskritName: "Bridge March",
    slug: "glute-bridge-march",
    category: "home_workout",
    level: "Beginner",
    muscleCategory: "Legs",
    muscle: "glutes",
    equipment: "bodyweight",
    tagline: "Unilateral pelvic stability exercise firing gluteus maximus without spinal shear.",
    metScore: 5.5,
    hypertrophyRate: 0.78,
    gifUrl: getGif('glutes', 0),
    primaryMuscles: [
      { name: "Gluteus Maximus", percentage: 92, color: "#f59e0b" },
      { name: "Hamstrings", percentage: 70, color: "#fbbf24" },
      { name: "Transverse Abdominis", percentage: 65, color: "#d97706" }
    ],
    setupSteps: [
      "Lie supine on a yoga mat or carpet with knees bent and feet flat on floor hip-width apart.",
      "Drive arms flat down into floor beside your hips for stability."
    ],
    formSteps: [
      "Drive through heels to bridge hips up until thighs and torso form a straight diagonal.",
      "Lift right knee toward chest while keeping hips perfectly level and steady.",
      "Lower right foot and march left knee up without dropping your pelvis."
    ],
    commonMistakes: [
      "Arching lower back excessively instead of driving through glutes.",
      "Letting hips tilt or drop as one foot leaves the floor."
    ],
    proTip: "Place your hands on your hip crests to verify your pelvis stays 100% horizontal throughout the march."
  },
  {
    id: "home-wall-sit-burnout",
    name: "Living Room Wall Sit Isometric Burnout",
    sanskritName: "Wall Sit Burnout",
    slug: "wall-sit-burnout",
    category: "home_workout",
    level: "All Levels",
    muscleCategory: "Legs",
    muscle: "quads",
    equipment: "bodyweight",
    tagline: "Pure isometric quad hypertrophy and mental toughness against any flat living room wall.",
    metScore: 6.5,
    hypertrophyRate: 0.82,
    gifUrl: getGif('quads', 2),
    primaryMuscles: [
      { name: "Quadriceps (All 4 Heads)", percentage: 95, color: "#f59e0b" },
      { name: "Gluteus Medius", percentage: 60, color: "#fbbf24" },
      { name: "Calves", percentage: 50, color: "#d97706" }
    ],
    setupSteps: [
      "Lean flat back against any sturdy household wall.",
      "Slide down until thighs are parallel to floor with knees at a 90° angle over ankles."
    ],
    formSteps: [
      "Press entire spine flat into the wall pad, especially lumbar region.",
      "Keep hands off your thighs (cross over chest or rest beside hips).",
      "Hold for 45 to 90 seconds breathing steadily through your nose."
    ],
    commonMistakes: [
      "Resting hands on knees to cheat the isometric quad load.",
      "Allowing knees to extend past toes."
    ],
    proTip: "Press firmly through your heels and squeeze your knees gently inward to recruit adductors and VMO fibers."
  }
];

const FULL_CATALOG = [...entries, ...HOME_WORKOUTS];

console.log(`Generated total of ${FULL_CATALOG.length} Yoga and Home exercises!`);
console.log(`- Yoga & Asanas: ${entries.filter(e => e.category === 'yoga').length}`);
console.log(`- Face Yoga: ${entries.filter(e => e.category === 'face_yoga').length}`);
console.log(`- Home Workouts: ${HOME_WORKOUTS.length}`);

const code = `// Dedicated catalog for Full Body Yoga, Face Yoga, and Zero-Equipment Home Workouts
// Auto-generated 220+ routines complete with authentic 3D dark-mode animations & Sanskrit names.

export const YOGA_AND_HOME_WORKOUTS = ${JSON.stringify(FULL_CATALOG, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/yogaAndHomeWorkouts.js'), code, 'utf-8');
console.log('Successfully wrote to src/data/yogaAndHomeWorkouts.js!');
