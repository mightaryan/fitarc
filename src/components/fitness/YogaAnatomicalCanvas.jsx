import React, { useEffect, useRef, useMemo } from 'react';
import { getEcorcheWebGLStudio } from './EcorcheWebGL3DEngine';
import { drawRealisticFaceYoga } from './FaceYogaIllustrationRenderer';

/**
 * POSE & FACIAL ANATOMY RESOLVER
 * Maps any Yoga Mat, Stability Ball Yoga, or Face Yoga exercise to its exact poseType / flow sequence.
 */
export function resolveYogaAnimationSpec(exercise) {
  const cat = (exercise?.category || '').toLowerCase();
  const sub = (exercise?.subCategory || '').toLowerCase();
  const name = (exercise?.name || '').toLowerCase();
  const explicitPose = exercise?.poseType;

  if (cat === 'face_yoga' || sub === 'face_yoga' || exercise?.equipment === 'face_hands') {
    let mode = explicitPose || 'face_jawline';
    if (!explicitPose) {
      if (name.includes('double chin') || name.includes('mewing') || name.includes('hyoid') || name.includes('tongue')) mode = 'face_mewing_chin';
      else if (name.includes('cheek') || name.includes('zygomatic') || name.includes('buccinator') || name.includes('smile')) mode = 'face_cheek';
      else if (name.includes('forehead') || name.includes('brow') || name.includes('corrugator') || name.includes('scalp')) mode = 'face_forehead';
      else if (name.includes('eye') || name.includes('oculi') || name.includes('eyelid') || name.includes('tear')) mode = 'face_eyes';
      else if (name.includes('lip') || name.includes('fish') || name.includes('oral')) mode = 'face_lips';
      else if (name.includes('lion') || name.includes('simhasana') || name.includes('bhramari') || name.includes('sitali')) mode = 'face_lion_breath';
      else if (name.includes('gua sha') || name.includes('lymph') || name.includes('neck') || name.includes('collarbone') || name.includes('ear') || name.includes('clavicular') || name.includes('masseter') || name.includes('temple') || name.includes('nose')) mode = 'face_lymphatic';
      else mode = 'face_jawline';
    }
    return { domain: 'face', mode };
  }

  if (sub === 'exercise_ball' || exercise?.equipment === 'exercise_ball' || name.includes('stability ball') || name.includes('exercise ball')) {
    let mode = explicitPose || 'ball_back_extension';
    if (!explicitPose) {
      if (name.includes('child') || name.includes('rollout') || name.includes('melt') || name.includes('sweep') || name.includes('downward')) mode = 'ball_child_rollout';
      else if (name.includes('bridge') || name.includes('hamstring') || name.includes('setu')) mode = 'ball_bridge';
      else if (name.includes('savasana') || name.includes('legs-elevated')) mode = 'ball_savasana';
      else if (name.includes('fish') || name.includes('butterfly') || name.includes('foam') || name.includes('chest hug') || name.includes('crown')) mode = 'ball_thoracic_arch';
      else if (name.includes('plank') || name.includes('cat-cow') || name.includes('bird dog') || name.includes('marjaryasana')) mode = 'ball_plank_rollout';
      else if (name.includes('wall squat') || name.includes('utkatasana')) mode = 'ball_wall_squat';
      else if (name.includes('seated') || name.includes('pelvic') || name.includes('core tilt') || name.includes('adductor') || name.includes('piriformis')) mode = 'ball_seated_flow';
      else mode = 'ball_back_extension';
    }
    return { domain: 'ball', mode };
  }

  if (explicitPose) return { domain: 'mat', mode: explicitPose };

  if (name.includes('surya namaskar a')) return { domain: 'mat', mode: 'surya_namaskar_a' };
  if (name.includes('surya namaskar b')) return { domain: 'mat', mode: 'surya_namaskar_b' };
  if (name.includes('chandra namaskar') || name.includes('moon salutation')) return { domain: 'mat', mode: 'chandra_namaskar' };
  if (name.includes('vinyasa') || name.includes('prana') || name.includes('yin wind-down') || name.includes('wave') || name.includes('digestion') || name.includes('ashtanga standing') || name.includes('detox twisting') || name.includes('fascia hydration') || name.includes('fire power')) {
    return { domain: 'mat', mode: 'prana_vinyasa' };
  }
  if (name.includes('parsvakonasana') || name.includes('side angle')) return { domain: 'mat', mode: 'extended_side_angle' };
  if (name.includes('trikonasana') || name.includes('triangle')) return { domain: 'mat', mode: 'triangle' };
  if (name.includes('virabhadrasana iii') || name.includes('warrior iii') || name.includes('half moon') || name.includes('ardha chandrasana')) return { domain: 'mat', mode: 'warrior_3' };
  if (name.includes('virabhadrasana ii') || name.includes('warrior ii') || name.includes('peaceful warrior') || name.includes('warrior arch')) return { domain: 'mat', mode: 'warrior_2' };
  if (name.includes('virabhadrasana i') || name.includes('warrior i') || name.includes('anjaneyasana') || name.includes('crescent high lunge') || name.includes('ashwa') || name.includes('low lunge')) return { domain: 'mat', mode: 'warrior_1' };
  if (name.includes('utkatasana') || name.includes('chair pose')) return { domain: 'mat', mode: 'chair_pose' };
  if (name.includes('vrikshasana') || name.includes('tree pose') || name.includes('tadasana') || name.includes('mountain') || name.includes('urdhva hastasana') || name.includes('indudalasana')) return { domain: 'mat', mode: 'tree_pose' };
  if (name.includes('natarajasana') || name.includes('dancer')) return { domain: 'mat', mode: 'dancer_pose' };
  if (name.includes('garudasana') || name.includes('eagle')) return { domain: 'mat', mode: 'eagle_pose' };
  if (name.includes('malasana') || name.includes('goddess') || name.includes('skandasana') || name.includes('side lunge')) return { domain: 'mat', mode: 'garland_squat' };
  if (name.includes('padottanasana') || name.includes('uttanasana') || name.includes('forward fold') || name.includes('pada hastasana') || name.includes('parsvottanasana') || (name.includes('padangusthasana') && !name.includes('supta'))) return { domain: 'mat', mode: 'uttanasana' };
  if (name.includes('paschimottanasana') || name.includes('janu sirsasana') || name.includes('upavistha') || name.includes('kurmasana') || name.includes('tarasana') || (name.includes('dandasana') && !name.includes('viparita'))) return { domain: 'mat', mode: 'seated_forward_fold' };
  if (name.includes('baddha konasana') || name.includes('butterfly') || name.includes('mandukasana') || name.includes('bhekasana') || name.includes('frog')) return { domain: 'mat', mode: 'butterfly' };
  if (name.includes('navasana') || name.includes('boat')) return { domain: 'mat', mode: 'boat_pose' };
  if (name.includes('matsyendrasana') || name.includes('bharadvajasana') || name.includes('marichyasana') || name.includes('gomukhasana') || name.includes('agnistambhasana') || (name.includes('pigeon') && !name.includes('king')) || name.includes('krounchasana')) return { domain: 'mat', mode: 'seated_twist' };
  if (name.includes('padmasana') || name.includes('sukhasana') || name.includes('siddhasana') || (name.includes('virasana') && !name.includes('supta')) || name.includes('vajrasana') || name.includes('simhasana')) return { domain: 'mat', mode: 'lotus_meditation' };
  if (name.includes('adho mukha') || name.includes('downward')) return { domain: 'mat', mode: 'downward_dog' };
  if (name.includes('bhujangasana') || name.includes('cobra') || name.includes('sphinx') || name.includes('urdhva mukha')) return { domain: 'mat', mode: 'upward_dog' };
  if ((name.includes('dhanurasana') && !name.includes('urdhva')) || name.includes('bow pose')) return { domain: 'mat', mode: 'bow_pose' };
  if (name.includes('salabhasana') || name.includes('locust') || name.includes('makarasana') || name.includes('crocodile')) return { domain: 'mat', mode: 'locust_pose' };
  if (name.includes('ustrasana') || name.includes('camel') || name.includes('kapurthala')) return { domain: 'mat', mode: 'camel_pose' };
  if (name.includes('chakrasana') || name.includes('wheel pose') || name.includes('urdhva dhanurasana') || name.includes('viparita dandasana')) return { domain: 'mat', mode: 'wheel_pose' };
  if (name.includes('setu bandha') || name.includes('bridge') || name.includes('supta virasana') || name.includes('rajakapotasana') || name.includes('king pigeon')) return { domain: 'mat', mode: 'bridge_pose' };
  if (name.includes('balasana') || name.includes('child') || name.includes('apanasana')) return { domain: 'mat', mode: 'child_pose' };
  if (name.includes('sarvangasana') || name.includes('halasana') || name.includes('plow') || name.includes('karnapidasana') || name.includes('viparita karani') || name.includes('legs-up')) return { domain: 'mat', mode: 'shoulderstand' };
  if (name.includes('savasana') || name.includes('happy baby') || name.includes('supta') || name.includes('belly twist') || name.includes('matsyasana') || name.includes('fish pose')) return { domain: 'mat', mode: 'savasana' };

  return { domain: 'mat', mode: 'warrior_2' };
}

/**
 * POSE KEYFRAME COORDINATE SPACE
 * facing: 'side' | 'front' | 'quarter'
 */
const MAT_POSES = {
  pranamasana: {
    label: 'Pranamasana · Prayer Pose',
    facing: 'front',
    glow: ['core', 'calves'],
    hips: [0, 0.78], waist: [0, 0.96], chest: [0, 1.18], neck: [0, 1.30], head: [0, 1.44],
    lShoulder: [-0.14, 1.18], lElbow: [-0.18, 0.99], lHand: [-0.04, 1.07],
    rShoulder: [0.14, 1.18], rElbow: [0.18, 0.99], rHand: [0.04, 1.07],
    lKnee: [-0.07, 0.41], lFoot: [-0.08, 0.03],
    rKnee: [0.07, 0.41], rFoot: [0.08, 0.03],
  },
  urdhva_hastasana: {
    label: 'Urdhva Hastasana · Sky Salute',
    facing: 'quarter',
    glow: ['back', 'shoulders', 'core'],
    hips: [0.02, 0.78], waist: [0.0, 0.96], chest: [-0.03, 1.18], neck: [-0.05, 1.30], head: [-0.06, 1.43],
    lShoulder: [-0.12, 1.19], lElbow: [-0.14, 1.44], lHand: [-0.09, 1.66],
    rShoulder: [0.08, 1.19], rElbow: [0.05, 1.44], rHand: [0.02, 1.66],
    lKnee: [-0.05, 0.41], lFoot: [-0.06, 0.03],
    rKnee: [0.07, 0.41], rFoot: [0.08, 0.03],
  },
  uttanasana: {
    label: 'Uttanasana · Standing Forward Fold',
    facing: 'side',
    glow: ['hamstrings', 'back', 'calves'],
    hips: [-0.06, 0.80], waist: [0.09, 0.64], chest: [0.19, 0.43], neck: [0.21, 0.30], head: [0.18, 0.19],
    lShoulder: [0.16, 0.43], lElbow: [0.14, 0.23], lHand: [0.09, 0.04],
    rShoulder: [0.22, 0.43], rElbow: [0.20, 0.23], rHand: [0.15, 0.04],
    lKnee: [-0.07, 0.41], lFoot: [-0.05, 0.03],
    rKnee: [-0.01, 0.41], rFoot: [0.03, 0.03],
  },
  ardha_uttanasana: {
    label: 'Ardha Uttanasana · Flat-Back Lift',
    facing: 'side',
    glow: ['back', 'hamstrings'],
    hips: [-0.14, 0.78], waist: [0.06, 0.79], chest: [0.28, 0.79], neck: [0.40, 0.80], head: [0.51, 0.82],
    lShoulder: [0.25, 0.78], lElbow: [0.23, 0.48], lHand: [0.15, 0.22],
    rShoulder: [0.31, 0.78], rElbow: [0.29, 0.48], rHand: [0.21, 0.22],
    lKnee: [-0.14, 0.40], lFoot: [-0.13, 0.03],
    rKnee: [-0.08, 0.40], rFoot: [-0.06, 0.03],
  },
  chaturanga: {
    label: 'Chaturanga · Low Core Plank',
    facing: 'side',
    glow: ['core', 'shoulders', 'arms'],
    hips: [-0.12, 0.24], waist: [0.06, 0.25], chest: [0.26, 0.26], neck: [0.41, 0.27], head: [0.53, 0.29],
    lShoulder: [0.24, 0.27], lElbow: [0.09, 0.22], lHand: [0.21, 0.03],
    rShoulder: [0.29, 0.25], rElbow: [0.15, 0.22], rHand: [0.27, 0.03],
    lKnee: [-0.41, 0.16], lFoot: [-0.69, 0.05],
    rKnee: [-0.35, 0.15], rFoot: [-0.63, 0.04],
  },
  upward_dog: {
    label: 'Bhujangasana / Urdhva Mukha · Heart Arch',
    facing: 'side',
    glow: ['back', 'core', 'shoulders'],
    hips: [-0.14, 0.15], waist: [0.03, 0.24], chest: [0.21, 0.44], neck: [0.28, 0.58], head: [0.32, 0.72],
    lShoulder: [0.18, 0.44], lElbow: [0.20, 0.24], lHand: [0.21, 0.03],
    rShoulder: [0.24, 0.43], rElbow: [0.26, 0.24], rHand: [0.27, 0.03],
    lKnee: [-0.44, 0.08], lFoot: [-0.74, 0.05],
    rKnee: [-0.38, 0.08], rFoot: [-0.68, 0.05],
  },
  downward_dog: {
    label: 'Adho Mukha Svanasana · Downward Dog',
    facing: 'side',
    glow: ['hamstrings', 'calves', 'back', 'shoulders'],
    hips: [-0.02, 0.85], waist: [0.12, 0.65], chest: [0.27, 0.44], neck: [0.36, 0.32], head: [0.40, 0.24],
    lShoulder: [0.25, 0.45], lElbow: [0.39, 0.24], lHand: [0.53, 0.03],
    rShoulder: [0.30, 0.43], rElbow: [0.44, 0.24], rHand: [0.58, 0.03],
    lKnee: [-0.27, 0.45], lFoot: [-0.51, 0.04],
    rKnee: [-0.21, 0.44], rFoot: [-0.44, 0.03],
  },
  warrior_1: {
    label: 'Virabhadrasana I · Crescent Warrior Lunge',
    facing: 'side',
    glow: ['quads', 'glutes', 'shoulders'],
    hips: [0.02, 0.53], waist: [0.03, 0.72], chest: [0.04, 0.94], neck: [0.04, 1.07], head: [0.04, 1.21],
    lShoulder: [-0.01, 0.94], lElbow: [-0.02, 1.19], lHand: [-0.01, 1.43],
    rShoulder: [0.07, 0.94], rElbow: [0.06, 1.19], rHand: [0.07, 1.43],
    lKnee: [0.36, 0.46], lFoot: [0.39, 0.03],
    rKnee: [-0.28, 0.29], rFoot: [-0.57, 0.03],
  },
  warrior_2: {
    label: 'Virabhadrasana II · Warrior II Expansion',
    facing: 'front',
    glow: ['quads', 'glutes', 'shoulders'],
    hips: [0.0, 0.56], waist: [0.0, 0.74], chest: [0.0, 0.96], neck: [0.01, 1.09], head: [0.02, 1.23],
    lShoulder: [-0.15, 0.96], lElbow: [-0.37, 0.96], lHand: [-0.60, 0.96],
    rShoulder: [0.15, 0.96], rElbow: [0.38, 0.96], rHand: [0.62, 0.96],
    lKnee: [-0.27, 0.30], lFoot: [-0.54, 0.03],
    rKnee: [0.39, 0.48], rFoot: [0.43, 0.03],
  },
  extended_side_angle: {
    label: 'Utthita Parsvakonasana · Extended Side Angle',
    facing: 'front',
    glow: ['core', 'quads', 'back', 'shoulders'],
    hips: [0.04, 0.51], waist: [0.16, 0.62], chest: [0.30, 0.74], neck: [0.40, 0.84], head: [0.49, 0.93],
    lShoulder: [0.27, 0.80], lElbow: [0.45, 0.95], lHand: [0.65, 1.12],
    rShoulder: [0.33, 0.68], rElbow: [0.37, 0.38], rHand: [0.41, 0.04],
    lKnee: [-0.28, 0.27], lFoot: [-0.60, 0.03],
    rKnee: [0.45, 0.47], rFoot: [0.47, 0.03],
  },
  triangle: {
    label: 'Utthita Trikonasana · Extended Triangle',
    facing: 'front',
    glow: ['hamstrings', 'core', 'back'],
    hips: [-0.04, 0.72], waist: [0.13, 0.70], chest: [0.32, 0.67], neck: [0.44, 0.66], head: [0.55, 0.66],
    lShoulder: [0.32, 0.75], lElbow: [0.31, 0.98], lHand: [0.31, 1.24],
    rShoulder: [0.33, 0.59], rElbow: [0.37, 0.34], rHand: [0.41, 0.09],
    lKnee: [-0.28, 0.37], lFoot: [-0.51, 0.03],
    rKnee: [0.22, 0.37], rFoot: [0.46, 0.03],
  },
  warrior_3: {
    label: 'Virabhadrasana III · Horizontal Flight',
    facing: 'side',
    glow: ['glutes', 'hamstrings', 'back', 'core'],
    hips: [-0.02, 0.78], waist: [0.16, 0.79], chest: [0.36, 0.80], neck: [0.49, 0.81], head: [0.61, 0.82],
    lShoulder: [0.36, 0.83], lElbow: [0.57, 0.85], lHand: [0.78, 0.87],
    rShoulder: [0.36, 0.77], rElbow: [0.57, 0.79], rHand: [0.78, 0.81],
    lKnee: [-0.01, 0.40], lFoot: [-0.01, 0.03],
    rKnee: [-0.36, 0.79], rFoot: [-0.71, 0.79],
  },
  chair_pose: {
    label: 'Utkatasana · Fierce Chair Pose',
    facing: 'quarter',
    glow: ['quads', 'glutes', 'shoulders'],
    hips: [-0.14, 0.56], waist: [-0.04, 0.74], chest: [0.08, 0.94], neck: [0.14, 1.07], head: [0.20, 1.19],
    lShoulder: [0.04, 0.94], lElbow: [0.20, 1.15], lHand: [0.36, 1.36],
    rShoulder: [0.12, 0.93], rElbow: [0.28, 1.14], rHand: [0.44, 1.35],
    lKnee: [0.13, 0.41], lFoot: [0.02, 0.03],
    rKnee: [0.19, 0.41], rFoot: [0.09, 0.03],
  },
  tree_pose: {
    label: 'Vrikshasana · Single-Leg Balance',
    facing: 'front',
    glow: ['calves', 'core', 'glutes'],
    hips: [0, 0.78], waist: [0, 0.96], chest: [0, 1.18], neck: [0, 1.32], head: [0, 1.46],
    lShoulder: [-0.14, 1.18], lElbow: [-0.16, 1.39], lHand: [-0.04, 1.60],
    rShoulder: [0.14, 1.18], rElbow: [0.16, 1.39], rHand: [0.04, 1.60],
    lKnee: [-0.03, 0.41], lFoot: [-0.03, 0.03],
    rKnee: [0.28, 0.65], rFoot: [0.03, 0.49],
  },
  dancer_pose: {
    label: 'Natarajasana · Lord of Dance Arch',
    facing: 'side',
    glow: ['quads', 'glutes', 'back'],
    hips: [0, 0.78], waist: [0.14, 0.92], chest: [0.29, 1.07], neck: [0.36, 1.18], head: [0.41, 1.31],
    lShoulder: [0.28, 1.07], lElbow: [0.48, 1.20], lHand: [0.68, 1.32],
    rShoulder: [0.24, 1.05], rElbow: [-0.01, 1.10], rHand: [-0.26, 1.14],
    lKnee: [0.0, 0.40], lFoot: [0.0, 0.03],
    rKnee: [-0.28, 0.85], rFoot: [-0.27, 1.15],
  },
  eagle_pose: {
    label: 'Garudasana · Eagle Joint Decompression',
    facing: 'front',
    glow: ['shoulders', 'quads', 'glutes'],
    hips: [0, 0.64], waist: [0, 0.82], chest: [0, 1.03], neck: [0, 1.17], head: [0, 1.30],
    lShoulder: [-0.13, 1.03], lElbow: [0.04, 0.96], lHand: [0.01, 1.16],
    rShoulder: [0.13, 1.03], rElbow: [-0.04, 0.99], rHand: [-0.01, 1.16],
    lKnee: [-0.02, 0.34], lFoot: [0.0, 0.03],
    rKnee: [-0.08, 0.39], rFoot: [0.07, 0.21],
  },
  garland_squat: {
    label: 'Malasana · Yogic Deep Garland Squat',
    facing: 'front',
    glow: ['glutes', 'quads'],
    hips: [0, 0.25], waist: [0, 0.43], chest: [0, 0.64], neck: [0, 0.78], head: [0, 0.91],
    lShoulder: [-0.14, 0.64], lElbow: [-0.19, 0.44], lHand: [-0.03, 0.58],
    rShoulder: [0.14, 0.64], rElbow: [0.19, 0.44], rHand: [0.03, 0.58],
    lKnee: [-0.28, 0.42], lFoot: [-0.22, 0.03],
    rKnee: [0.28, 0.42], rFoot: [0.22, 0.03],
  },
  seated_forward_fold: {
    label: 'Paschimottanasana · Seated Forward Fold',
    facing: 'side',
    glow: ['hamstrings', 'back'],
    hips: [-0.30, 0.07], waist: [-0.14, 0.17], chest: [0.05, 0.24], neck: [0.18, 0.24], head: [0.28, 0.20],
    lShoulder: [0.04, 0.27], lElbow: [0.23, 0.22], lHand: [0.42, 0.14],
    rShoulder: [0.07, 0.23], rElbow: [0.26, 0.19], rHand: [0.45, 0.11],
    lKnee: [0.05, 0.07], lFoot: [0.44, 0.09],
    rKnee: [0.09, 0.05], rFoot: [0.48, 0.07],
  },
  butterfly: {
    label: 'Baddha Konasana · Butterfly Hip Opener',
    facing: 'front',
    glow: ['glutes', 'core'],
    hips: [0, 0.08], waist: [0, 0.27], chest: [0, 0.50], neck: [0, 0.64], head: [0, 0.78],
    lShoulder: [-0.14, 0.49], lElbow: [-0.15, 0.28], lHand: [-0.05, 0.09],
    rShoulder: [0.14, 0.49], rElbow: [0.15, 0.28], rHand: [0.05, 0.09],
    lKnee: [-0.32, 0.13], lFoot: [-0.05, 0.06],
    rKnee: [0.32, 0.13], rFoot: [0.05, 0.06],
  },
  lotus_meditation: {
    label: 'Padmasana / Sukhasana · Spine Grounding',
    facing: 'front',
    glow: ['core', 'back'],
    hips: [0, 0.08], waist: [0, 0.28], chest: [0, 0.52], neck: [0, 0.66], head: [0, 0.80],
    lShoulder: [-0.15, 0.51], lElbow: [-0.22, 0.31], lHand: [-0.28, 0.15],
    rShoulder: [0.15, 0.51], rElbow: [0.22, 0.31], rHand: [0.28, 0.15],
    lKnee: [-0.31, 0.10], lFoot: [0.10, 0.07],
    rKnee: [0.31, 0.10], rFoot: [-0.10, 0.07],
  },
  boat_pose: {
    label: 'Navasana · Transverse Core V-Boat',
    facing: 'side',
    glow: ['core', 'quads'],
    hips: [-0.02, 0.08], waist: [-0.13, 0.25], chest: [-0.24, 0.43], neck: [-0.30, 0.55], head: [-0.36, 0.67],
    lShoulder: [-0.25, 0.44], lElbow: [-0.04, 0.43], lHand: [0.17, 0.42],
    rShoulder: [-0.21, 0.40], rElbow: [0.0, 0.39], rHand: [0.21, 0.38],
    lKnee: [0.20, 0.35], lFoot: [0.42, 0.60],
    rKnee: [0.24, 0.32], rFoot: [0.46, 0.57],
  },
  seated_twist: {
    label: 'Ardha Matsyendrasana · Seated Detox Twist',
    facing: 'quarter',
    glow: ['core', 'back', 'glutes'],
    hips: [-0.05, 0.09], waist: [-0.05, 0.28], chest: [-0.04, 0.51], neck: [-0.06, 0.65], head: [-0.08, 0.79],
    lShoulder: [-0.19, 0.50], lElbow: [-0.25, 0.27], lHand: [-0.27, 0.05],
    rShoulder: [0.10, 0.51], rElbow: [0.05, 0.32], rHand: [0.15, 0.14],
    lKnee: [-0.26, 0.11], lFoot: [0.08, 0.06],
    rKnee: [0.14, 0.37], rFoot: [-0.14, 0.05],
  },
  bow_pose: {
    label: 'Dhanurasana · Kinetic Bow Backbend',
    facing: 'side',
    glow: ['back', 'quads', 'glutes'],
    hips: [-0.02, 0.09], waist: [0.12, 0.16], chest: [0.25, 0.34], neck: [0.31, 0.46], head: [0.34, 0.60],
    lShoulder: [0.23, 0.36], lElbow: [-0.04, 0.43], lHand: [-0.31, 0.50],
    rShoulder: [0.27, 0.33], rElbow: [0.0, 0.40], rHand: [-0.27, 0.47],
    lKnee: [-0.37, 0.20], lFoot: [-0.32, 0.51],
    rKnee: [-0.33, 0.18], rFoot: [-0.28, 0.48],
  },
  locust_pose: {
    label: 'Salabhasana · Pure Posterior Lift',
    facing: 'side',
    glow: ['back', 'glutes', 'hamstrings'],
    hips: [0.0, 0.08], waist: [0.15, 0.13], chest: [0.31, 0.23], neck: [0.43, 0.29], head: [0.54, 0.35],
    lShoulder: [0.29, 0.24], lElbow: [0.05, 0.26], lHand: [-0.19, 0.26],
    rShoulder: [0.33, 0.21], rElbow: [0.09, 0.23], rHand: [-0.15, 0.23],
    lKnee: [-0.33, 0.18], lFoot: [-0.65, 0.30],
    rKnee: [-0.29, 0.16], rFoot: [-0.61, 0.27],
  },
  camel_pose: {
    label: 'Ustrasana · Deep Heart Throat Arch',
    facing: 'side',
    glow: ['core', 'quads', 'back'],
    hips: [0.12, 0.39], waist: [0.04, 0.57], chest: [-0.06, 0.76], neck: [-0.17, 0.85], head: [-0.28, 0.89],
    lShoulder: [-0.08, 0.77], lElbow: [-0.22, 0.53], lHand: [-0.37, 0.28],
    rShoulder: [-0.03, 0.75], rElbow: [-0.18, 0.51], rHand: [-0.33, 0.26],
    lKnee: [0.04, 0.08], lFoot: [-0.37, 0.05],
    rKnee: [0.09, 0.07], rFoot: [-0.32, 0.04],
  },
  wheel_pose: {
    label: 'Chakrasana · Full Wheel Arch',
    facing: 'side',
    glow: ['back', 'shoulders', 'glutes', 'quads'],
    hips: [0.04, 0.56], waist: [-0.12, 0.59], chest: [-0.28, 0.51], neck: [-0.34, 0.42], head: [-0.30, 0.31],
    lShoulder: [-0.30, 0.51], lElbow: [-0.36, 0.28], lHand: [-0.39, 0.05],
    rShoulder: [-0.25, 0.49], rElbow: [-0.31, 0.26], rHand: [-0.34, 0.04],
    lKnee: [0.30, 0.42], lFoot: [0.37, 0.05],
    rKnee: [0.35, 0.40], rFoot: [0.42, 0.03],
  },
  bridge_pose: {
    label: 'Setu Bandhasana · Glute Spine Bridge',
    facing: 'side',
    glow: ['glutes', 'quads', 'back'],
    hips: [0.08, 0.38], waist: [-0.10, 0.24], chest: [-0.28, 0.11], neck: [-0.41, 0.08], head: [-0.53, 0.09],
    lShoulder: [-0.29, 0.12], lElbow: [-0.10, 0.07], lHand: [0.10, 0.05],
    rShoulder: [-0.25, 0.09], rElbow: [-0.06, 0.05], rHand: [0.14, 0.03],
    lKnee: [0.36, 0.37], lFoot: [0.43, 0.05],
    rKnee: [0.41, 0.35], rFoot: [0.48, 0.03],
  },
  child_pose: {
    label: 'Balasana · Restorative Child Pose',
    facing: 'side',
    glow: ['back', 'shoulders'],
    hips: [-0.36, 0.16], waist: [-0.18, 0.20], chest: [0.02, 0.18], neck: [0.15, 0.14], head: [0.26, 0.09],
    lShoulder: [0.03, 0.19], lElbow: [0.28, 0.10], lHand: [0.53, 0.04],
    rShoulder: [0.06, 0.16], rElbow: [0.31, 0.08], rHand: [0.56, 0.03],
    lKnee: [-0.09, 0.07], lFoot: [-0.45, 0.04],
    rKnee: [-0.05, 0.05], rFoot: [-0.40, 0.03],
  },
  shoulderstand: {
    label: 'Salamba Sarvangasana · Shoulderstand Inversion',
    facing: 'side',
    glow: ['core', 'glutes', 'calves'],
    hips: [-0.02, 0.62], waist: [-0.06, 0.42], chest: [-0.10, 0.22], neck: [-0.17, 0.11], head: [-0.30, 0.09],
    lShoulder: [-0.11, 0.16], lElbow: [-0.06, 0.06], lHand: [-0.04, 0.39],
    rShoulder: [-0.06, 0.13], rElbow: [-0.01, 0.04], rHand: [0.01, 0.38],
    lKnee: [-0.01, 0.99], lFoot: [0.01, 1.36],
    rKnee: [0.04, 0.98], rFoot: [0.06, 1.35],
  },
  savasana: {
    label: 'Savasana · Parasympathetic Grounding',
    facing: 'side',
    glow: ['core', 'back'],
    hips: [0.0, 0.08], waist: [-0.18, 0.08], chest: [-0.36, 0.09], neck: [-0.50, 0.08], head: [-0.62, 0.10],
    lShoulder: [-0.37, 0.13], lElbow: [-0.19, 0.09], lHand: [-0.01, 0.04],
    rShoulder: [-0.35, 0.05], rElbow: [-0.17, 0.04], rHand: [0.02, 0.03],
    lKnee: [0.35, 0.08], lFoot: [0.70, 0.07],
    rKnee: [0.39, 0.05], rFoot: [0.74, 0.04],
  },
  cat_cow: {
    label: 'Marjaryasana · Spinal Wave',
    facing: 'side',
    glow: ['back', 'core'],
    hips: [-0.25, 0.44], waist: [-0.03, 0.56], chest: [0.19, 0.46], neck: [0.32, 0.50], head: [0.43, 0.54],
    lShoulder: [0.18, 0.46], lElbow: [0.18, 0.25], lHand: [0.18, 0.03],
    rShoulder: [0.23, 0.44], rElbow: [0.23, 0.23], rHand: [0.23, 0.03],
    lKnee: [-0.26, 0.06], lFoot: [-0.55, 0.04],
    rKnee: [-0.21, 0.05], rFoot: [-0.50, 0.03],
  },
};

const SEQUENCES = {
  surya_namaskar_a: [
    'upward_dog', 'downward_dog', 'uttanasana', 'ardha_uttanasana',
    'chaturanga', 'upward_dog', 'downward_dog', 'ardha_uttanasana',
    'uttanasana', 'urdhva_hastasana', 'pranamasana',
  ],
  surya_namaskar_b: [
    'warrior_1', 'downward_dog', 'chair_pose', 'uttanasana',
    'ardha_uttanasana', 'chaturanga', 'upward_dog', 'downward_dog', 'warrior_1',
  ],
  chandra_namaskar: [
    'garland_squat', 'triangle', 'warrior_1', 'extended_side_angle', 'urdhva_hastasana', 'garland_squat',
  ],
  prana_vinyasa: [
    'upward_dog', 'downward_dog', 'camel_pose', 'cat_cow', 'child_pose',
  ],
};

const BALL_POSES = {
  ball_child_rollout: {
    label: 'Stability Ball · Child Rollout Traction',
    facing: 'side',
    ball: [0.24, 0.32, 0.28],
    glow: ['back', 'shoulders'],
    hips: [-0.46, 0.26], waist: [-0.29, 0.40], chest: [-0.11, 0.55], neck: [0.02, 0.62], head: [0.14, 0.64],
    lShoulder: [-0.11, 0.56], lElbow: [0.10, 0.63], lHand: [0.32, 0.62],
    rShoulder: [-0.07, 0.52], rElbow: [0.14, 0.59], rHand: [0.36, 0.58],
    lKnee: [-0.25, 0.06], lFoot: [-0.57, 0.04],
    rKnee: [-0.21, 0.04], rFoot: [-0.52, 0.03],
  },
  ball_back_extension: {
    label: 'Stability Ball · Thoracic Spine Extension',
    facing: 'side',
    ball: [0.0, 0.28, 0.28],
    glow: ['back', 'glutes'],
    hips: [-0.14, 0.48], waist: [0.03, 0.57], chest: [0.22, 0.64], neck: [0.35, 0.69], head: [0.46, 0.74],
    lShoulder: [0.20, 0.65], lElbow: [0.33, 0.77], lHand: [0.44, 0.87],
    rShoulder: [0.24, 0.61], rElbow: [0.37, 0.73], rHand: [0.48, 0.83],
    lKnee: [-0.41, 0.28], lFoot: [-0.68, 0.07],
    rKnee: [-0.36, 0.25], rFoot: [-0.63, 0.05],
  },
  ball_bridge: {
    label: 'Stability Ball · Elevated Glute Bridge',
    facing: 'side',
    ball: [0.44, 0.27, 0.27],
    glow: ['glutes', 'hamstrings', 'core'],
    hips: [0.0, 0.42], waist: [-0.18, 0.28], chest: [-0.36, 0.14], neck: [-0.48, 0.10], head: [-0.60, 0.11],
    lShoulder: [-0.37, 0.15], lElbow: [-0.18, 0.08], lHand: [0.03, 0.05],
    rShoulder: [-0.33, 0.12], rElbow: [-0.14, 0.05], rHand: [0.07, 0.03],
    lKnee: [0.24, 0.51], lFoot: [0.47, 0.56],
    rKnee: [0.28, 0.48], rFoot: [0.51, 0.53],
  },
  ball_savasana: {
    label: 'Stability Ball · Venous Drainage Float',
    facing: 'side',
    ball: [0.46, 0.27, 0.27],
    glow: ['core', 'calves'],
    hips: [0.02, 0.09], waist: [-0.17, 0.09], chest: [-0.36, 0.09], neck: [-0.49, 0.09], head: [-0.61, 0.10],
    lShoulder: [-0.37, 0.12], lElbow: [-0.19, 0.08], lHand: [-0.01, 0.04],
    rShoulder: [-0.34, 0.06], rElbow: [-0.16, 0.04], rHand: [0.02, 0.03],
    lKnee: [0.25, 0.39], lFoot: [0.51, 0.56],
    rKnee: [0.29, 0.36], rFoot: [0.55, 0.53],
  },
  ball_thoracic_arch: {
    label: 'Stability Ball · Heart Opener Spine Arch',
    facing: 'side',
    ball: [-0.08, 0.29, 0.28],
    glow: ['shoulders', 'back', 'core'],
    hips: [0.16, 0.40], waist: [0.0, 0.54], chest: [-0.16, 0.61], neck: [-0.30, 0.56], head: [-0.42, 0.47],
    lShoulder: [-0.17, 0.62], lElbow: [-0.37, 0.72], lHand: [-0.57, 0.73],
    rShoulder: [-0.12, 0.58], rElbow: [-0.32, 0.68], rHand: [-0.52, 0.69],
    lKnee: [0.41, 0.37], lFoot: [0.44, 0.05],
    rKnee: [0.46, 0.35], rFoot: [0.49, 0.03],
  },
  ball_seated_flow: {
    label: 'Stability Ball · Pelvic Alignment Seat',
    facing: 'quarter',
    ball: [-0.04, 0.27, 0.27],
    glow: ['core', 'glutes'],
    hips: [-0.03, 0.55], waist: [-0.03, 0.73], chest: [-0.03, 0.94], neck: [-0.03, 1.07], head: [-0.03, 1.21],
    lShoulder: [-0.16, 0.93], lElbow: [-0.23, 0.74], lHand: [-0.11, 0.59],
    rShoulder: [0.10, 0.93], rElbow: [0.17, 0.74], rHand: [0.06, 0.59],
    lKnee: [0.25, 0.45], lFoot: [0.28, 0.04],
    rKnee: [0.31, 0.42], rFoot: [0.34, 0.03],
  },
  ball_plank_rollout: {
    label: 'Stability Ball · Core Plank Sync',
    facing: 'side',
    ball: [0.34, 0.25, 0.25],
    glow: ['core', 'shoulders'],
    hips: [-0.18, 0.38], waist: [0.0, 0.43], chest: [0.20, 0.48], neck: [0.33, 0.52], head: [0.44, 0.58],
    lShoulder: [0.19, 0.49], lElbow: [0.31, 0.50], lHand: [0.47, 0.46],
    rShoulder: [0.23, 0.45], rElbow: [0.35, 0.46], rHand: [0.51, 0.42],
    lKnee: [-0.44, 0.22], lFoot: [-0.68, 0.06],
    rKnee: [-0.40, 0.20], rFoot: [-0.64, 0.04],
  },
  ball_wall_squat: {
    label: 'Stability Ball · Wall Support Squat',
    facing: 'side',
    ball: [-0.26, 0.68, 0.24],
    glow: ['quads', 'glutes'],
    hips: [-0.02, 0.50], waist: [-0.01, 0.68], chest: [0.01, 0.90], neck: [0.02, 1.03], head: [0.02, 1.16],
    lShoulder: [-0.05, 0.90], lElbow: [0.07, 0.73], lHand: [0.20, 0.65],
    rShoulder: [0.05, 0.89], rElbow: [0.16, 0.72], rHand: [0.28, 0.64],
    lKnee: [0.31, 0.46], lFoot: [0.31, 0.04],
    rKnee: [0.36, 0.44], rFoot: [0.36, 0.03],
  },
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function interpolatePose(pA, pB, t) {
  const keys = [
    'hips', 'waist', 'chest', 'neck', 'head',
    'lShoulder', 'lElbow', 'lHand',
    'rShoulder', 'rElbow', 'rHand',
    'lKnee', 'lFoot', 'rKnee', 'rFoot',
  ];
  const res = {
    label: t < 0.5 ? pA.label : pB.label,
    glow: t < 0.5 ? pA.glow : pB.glow,
    facing: t < 0.5 ? pA.facing : pB.facing,
  };
  keys.forEach((k) => {
    res[k] = [lerp(pA[k][0], pB[k][0], t), lerp(pA[k][1], pB[k][1], t)];
  });
  return res;
}

/**
 * Draw GymVisual-Matched 3D Ecorché Striated Muscle Capsule
 * Pitch charcoal core + crisp silver rim light + muscle-fiber striation hairlines + translucent terracotta belly glow
 */
function drawEcorcheLimb(ctx, p1, p2, r1, r2, isActive, breathGlow = 0.5, isFarSide = false, bulgeOffset = 0.5) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const len = Math.hypot(dx, dy);
  if (len < 1) return;

  const angle = Math.atan2(dy, dx);
  const nx = -dy / len;
  const ny = dx / len;
  const sidePlus = angle + Math.PI / 2;
  const sideMinus = angle - Math.PI / 2;

  const mx = lerp(p1[0], p2[0], bulgeOffset);
  const my = lerp(p1[1], p2[1], bulgeOffset);
  const rMidPlus = Math.max(r1, r2) * 1.18;
  const rMidMinus = Math.max(r1, r2) * 1.06;

  const tracePath = () => {
    ctx.beginPath();
    ctx.moveTo(p1[0] + nx * r1, p1[1] + ny * r1);
    ctx.quadraticCurveTo(mx + nx * rMidPlus, my + ny * rMidPlus, p2[0] + nx * r2, p2[1] + ny * r2);
    ctx.arc(p2[0], p2[1], r2, sidePlus, sideMinus, true);
    ctx.quadraticCurveTo(mx - nx * rMidMinus, my - ny * rMidMinus, p1[0] - nx * r1, p1[1] - ny * r1);
    ctx.arc(p1[0], p1[1], r1, sideMinus, sidePlus, true);
    ctx.closePath();
  };

  ctx.save();
  tracePath();

  // Base 3D dark matte charcoal fill with crisp metallic Fresnel rim
  const grad = ctx.createLinearGradient(
    mx + nx * rMidPlus, my + ny * rMidPlus,
    mx - nx * rMidMinus, my - ny * rMidMinus
  );
  if (isFarSide) {
    grad.addColorStop(0, '#4b5563');
    grad.addColorStop(0.28, '#181b22');
    grad.addColorStop(0.85, '#090a0d');
    grad.addColorStop(1, '#1f2937');
  } else {
    grad.addColorStop(0, '#9ca3af');
    grad.addColorStop(0.22, '#272c35');
    grad.addColorStop(0.78, '#0c0e12');
    grad.addColorStop(1, '#374151');
  }
  ctx.fillStyle = grad;
  ctx.fill();

  // Clip inside muscle silhouette to draw translucent terracotta glow + striated fiber filaments cleanly
  ctx.save();
  tracePath();
  ctx.clip();

  if (isActive) {
    const bellyX = lerp(p1[0], p2[0], 0.45);
    const bellyY = lerp(p1[1], p2[1], 0.45);
    const glowR = Math.max(len * 0.55, rMidPlus * 2.2);
    const coral = ctx.createRadialGradient(bellyX, bellyY, glowR * 0.1, bellyX, bellyY, glowR);
    const alpha = (isFarSide ? 0.45 : 0.68) + breathGlow * 0.16;
    coral.addColorStop(0, `rgba(234, 98, 62, ${alpha})`);
    coral.addColorStop(0.55, `rgba(194, 65, 38, ${alpha * 0.55})`);
    coral.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = coral;
    ctx.fillRect(Math.min(p1[0], p2[0]) - glowR, Math.min(p1[1], p2[1]) - glowR, len + glowR * 2, len + glowR * 2);
  }

  // Ecorché longitudinal striated muscle fibers (GymVisual signature look)
  const fiberCount = 5;
  for (let i = -2; i <= 2; i++) {
    const fFrac = i / (fiberCount - 1);
    const startX = p1[0] + nx * (r1 * 0.65 * fFrac);
    const startY = p1[1] + ny * (r1 * 0.65 * fFrac);
    const midX = mx + nx * (rMidPlus * 0.72 * fFrac);
    const midY = my + ny * (rMidPlus * 0.72 * fFrac);
    const endX = p2[0] + nx * (r2 * 0.65 * fFrac);
    const endY = p2[1] + ny * (r2 * 0.65 * fFrac);

    ctx.beginPath();
    ctx.moveTo(lerp(startX, midX, 0.15), lerp(startY, midY, 0.15));
    ctx.quadraticCurveTo(midX, midY, lerp(midX, endX, 0.85), lerp(midY, endY, 0.85));
    ctx.strokeStyle = isActive
      ? 'rgba(255, 218, 195, 0.34)'
      : isFarSide
      ? 'rgba(156, 163, 175, 0.16)'
      : 'rgba(229, 231, 235, 0.28)';
    ctx.lineWidth = 0.65;
    ctx.stroke();
  }
  ctx.restore();

  // Sharp Fresnel outer contour highlight
  tracePath();
  ctx.strokeStyle = isActive
    ? 'rgba(251, 146, 60, 0.55)'
    : isFarSide
    ? 'rgba(148, 163, 184, 0.3)'
    : 'rgba(226, 232, 240, 0.58)';
  ctx.lineWidth = isFarSide ? 0.7 : 0.95;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw GymVisual-Matched Striated Ecorché Torso + Signature White Compression Shorts
 */
function drawEcorcheTorso(ctx, p, unit, isCoreActive, isBackActive, isGlutesActive, breathGlow) {
  const { hips, waist, chest, lShoulder, rShoulder, facing } = p;
  const shoulderW = Math.hypot(rShoulder[0] - lShoulder[0], rShoulder[1] - lShoulder[1]);
  const isFrontView = facing === 'front' || shoulderW > unit * 0.16;

  const sx = waist[0] - hips[0];
  const sy = waist[1] - hips[1];
  const cx = chest[0] - waist[0];
  const cy = chest[1] - waist[1];
  const ang1 = Math.atan2(sy, sx);
  const ang2 = Math.atan2(cy, cx);
  const nx1 = -Math.sin(ang1);
  const ny1 = Math.cos(ang1);
  const nx2 = -Math.sin(ang2);
  const ny2 = Math.cos(ang2);

  const hipHalf = isFrontView ? unit * 0.115 : unit * 0.088;
  const waistHalf = isFrontView ? unit * 0.092 : unit * 0.072;
  const chestHalf = isFrontView ? Math.max(shoulderW * 0.55, unit * 0.145) : unit * 0.112;

  const traceTorso = () => {
    ctx.beginPath();
    ctx.moveTo(hips[0] + nx1 * hipHalf, hips[1] + ny1 * hipHalf);
    ctx.quadraticCurveTo(waist[0] + nx1 * waistHalf, waist[1] + ny1 * waistHalf, chest[0] + nx2 * chestHalf, chest[1] + ny2 * chestHalf);
    ctx.arc(chest[0], chest[1], chestHalf, ang2 + Math.PI / 2, ang2 - Math.PI / 2, true);
    ctx.quadraticCurveTo(waist[0] - nx1 * waistHalf, waist[1] - ny1 * waistHalf, hips[0] - nx1 * hipHalf, hips[1] - ny1 * hipHalf);
    ctx.arc(hips[0], hips[1], hipHalf, ang1 - Math.PI / 2, ang1 + Math.PI / 2, true);
    ctx.closePath();
  };

  ctx.save();
  traceTorso();

  const torsoGrad = ctx.createLinearGradient(
    chest[0] + nx2 * chestHalf, chest[1] + ny2 * chestHalf,
    chest[0] - nx2 * chestHalf, chest[1] - ny2 * chestHalf
  );
  torsoGrad.addColorStop(0, '#9ca3af');
  torsoGrad.addColorStop(0.22, '#272c35');
  torsoGrad.addColorStop(0.75, '#0c0e12');
  torsoGrad.addColorStop(1, '#4b5563');
  ctx.fillStyle = torsoGrad;
  ctx.fill();

  // Clip inside torso for striated ribcage/abs/erector fibers & translucent coral activation
  ctx.save();
  traceTorso();
  ctx.clip();

  if (isCoreActive || isBackActive) {
    const targetX = isBackActive && !isCoreActive ? lerp(waist[0], chest[0], 0.5) : lerp(hips[0], waist[0], 0.6);
    const targetY = isBackActive && !isCoreActive ? lerp(waist[1], chest[1], 0.5) : lerp(hips[1], waist[1], 0.6);
    const rad = unit * 0.24;
    const coral = ctx.createRadialGradient(targetX, targetY, rad * 0.1, targetX, targetY, rad);
    const a = 0.65 + breathGlow * 0.18;
    coral.addColorStop(0, `rgba(234, 98, 62, ${a})`);
    coral.addColorStop(0.65, `rgba(194, 65, 38, ${a * 0.45})`);
    coral.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = coral;
    ctx.fillRect(targetX - rad * 1.4, targetY - rad * 1.4, rad * 2.8, rad * 2.8);
  }

  // Draw crisp abdominal segmentation + diagonal intercostal / lat striations
  for (let step = 0.22; step <= 0.85; step += 0.15) {
    const pMidX = lerp(hips[0], chest[0], step);
    const pMidY = lerp(hips[1], chest[1], step);
    const wHere = lerp(waistHalf, chestHalf, step) * 0.85;
    ctx.beginPath();
    ctx.moveTo(pMidX - nx2 * wHere, pMidY - ny2 * wHere);
    ctx.quadraticCurveTo(pMidX + (chest[0] - waist[0]) * 0.08, pMidY + (chest[1] - waist[1]) * 0.08, pMidX + nx2 * wHere, pMidY + ny2 * wHere);
    ctx.strokeStyle = isCoreActive || isBackActive ? 'rgba(255, 220, 195, 0.35)' : 'rgba(209, 213, 219, 0.24)';
    ctx.lineWidth = 0.65;
    ctx.stroke();
  }
  ctx.restore();

  traceTorso();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.58)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Signature GymVisual White/Silver Compression Shorts around Pelvis/Hips
  ctx.save();
  ctx.beginPath();
  ctx.arc(hips[0], hips[1], hipHalf * 1.05, 0, Math.PI * 2);
  ctx.clip();

  const shortsGrad = ctx.createLinearGradient(hips[0] - hipHalf, hips[1] - hipHalf, hips[0] + hipHalf, hips[1] + hipHalf);
  shortsGrad.addColorStop(0, '#f4f4f5');
  shortsGrad.addColorStop(0.55, '#d4d4d8');
  shortsGrad.addColorStop(1, '#52525b');
  ctx.fillStyle = isGlutesActive ? 'rgba(234, 179, 155, 0.85)' : shortsGrad;
  ctx.beginPath();
  ctx.ellipse(hips[0], hips[1], hipHalf * 1.02, hipHalf * 0.92, ang1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.restore();

  if (isFrontView) {
    drawEcorcheLimb(ctx, lShoulder, rShoulder, unit * 0.055, unit * 0.055, isBackActive, breathGlow, false);
  }
  ctx.restore();
}

function drawEcorcheHead(ctx, neck, head, unit, facing) {
  const dx = head[0] - neck[0];
  const dy = head[1] - neck[1];
  const ang = Math.atan2(dy, dx);
  const r = unit * 0.072;

  ctx.save();
  ctx.translate(head[0], head[1]);
  ctx.rotate(ang + Math.PI / 2);

  // Subtle anatomical cranium + chin taper (NOT plain circle!)
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.12);
  ctx.bezierCurveTo(r * 0.92, -r * 1.1, r * 0.95, r * 0.1, r * 0.62, r * 0.68);
  ctx.bezierCurveTo(r * 0.35, r * 1.0, r * 0.12, r * 1.05, 0, r * 1.05);
  ctx.bezierCurveTo(-r * 0.12, r * 1.05, -r * 0.35, r * 1.0, -r * 0.62, r * 0.68);
  ctx.bezierCurveTo(-r * 0.95, r * 0.1, -r * 0.92, -r * 1.1, 0, -r * 1.12);
  ctx.closePath();

  const hGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r * 1.2);
  hGrad.addColorStop(0, '#9ca3af');
  hGrad.addColorStop(0.4, '#272c35');
  hGrad.addColorStop(1, '#090a0d');
  ctx.fillStyle = hGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
  ctx.lineWidth = 0.95;
  ctx.stroke();

  // Faint cranial/zygomatic contour lines matching GymVisual ecorché heads
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.25)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.1);
  ctx.quadraticCurveTo(0, r * 0.15, r * 0.55, -r * 0.1);
  ctx.stroke();
  ctx.restore();
}

function drawHandOrFoot(ctx, fromPt, tipPt, r, isFoot = false, isFarSide = false) {
  const dx = tipPt[0] - fromPt[0];
  const dy = tipPt[1] - fromPt[1];
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;
  const ext = isFoot ? r * 1.9 : r * 1.35;
  const endPt = [tipPt[0] + ux * ext * 0.48, tipPt[1] + uy * ext * 0.48];

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(endPt[0], endPt[1], ext * 0.52, r * (isFoot ? 0.52 : 0.7), Math.atan2(dy, dx), 0, Math.PI * 2);
  ctx.fillStyle = isFarSide ? '#181b22' : '#272c35';
  ctx.fill();
  ctx.strokeStyle = isFarSide ? 'rgba(148,163,184,0.35)' : 'rgba(226,232,240,0.55)';
  ctx.lineWidth = 0.85;
  ctx.stroke();
  ctx.restore();
}

function computePoseViewportTransform(posePts, ballSpec, width, height, compact) {
  const allPts = [
    posePts.hips, posePts.waist, posePts.chest, posePts.neck, posePts.head,
    posePts.lShoulder, posePts.lElbow, posePts.lHand,
    posePts.rShoulder, posePts.rElbow, posePts.rHand,
    posePts.lKnee, posePts.lFoot, posePts.rKnee, posePts.rFoot,
  ];

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  allPts.forEach(([x, y]) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  if (ballSpec) {
    const [bx, by, br] = ballSpec;
    minX = Math.min(minX, bx - br);
    maxX = Math.max(maxX, bx + br);
    minY = Math.min(minY, by - br);
    maxY = Math.max(maxY, by + br);
  }

  minY = Math.min(minY, 0) - 0.12;
  maxY = maxY + 0.16;
  minX = minX - 0.16;
  maxX = maxX + 0.16;

  const spanX = Math.max(maxX - minX, 0.82);
  const spanY = Math.max(maxY - minY, 0.65);

  const safeTop = compact ? height * 0.08 : height * 0.16;
  const safeBottom = compact ? height * 0.90 : height * 0.77;
  const safeLeft = compact ? width * 0.08 : width * 0.10;
  const safeRight = compact ? width * 0.92 : width * 0.90;

  const availW = safeRight - safeLeft;
  const availH = safeBottom - safeTop;
  const unit = Math.min(availW / spanX, availH / spanY, height * 0.44);

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const cx = (safeLeft + safeRight) / 2 - midX * unit;
  const baseFloorY = (safeTop + safeBottom) / 2 + midY * unit;

  return { unit, cx, baseFloorY };
}

function resolveActiveYogaPose(spec, timeSec, compact, hideOverlayLabel = false) {
  let activePose;
  let stageLabel = '';

  if (spec.domain === 'ball') {
    activePose = BALL_POSES[spec.mode] || BALL_POSES.ball_back_extension;
    stageLabel = activePose.label;
  } else if (SEQUENCES[spec.mode]) {
    const seq = SEQUENCES[spec.mode];
    const stepDuration = 1.6;
    const totalCycle = seq.length * stepDuration;
    const pos = compact && hideOverlayLabel ? 0.4 : (timeSec % totalCycle) / stepDuration;
    const idxA = Math.floor(pos) % seq.length;
    const idxB = (idxA + 1) % seq.length;
    const rawT = pos - Math.floor(pos);
    const glideT = rawT < 0.55 ? 0 : (rawT - 0.55) / 0.45;
    const smoothT = glideT * glideT * (3 - 2 * glideT);
    const poseA = MAT_POSES[seq[idxA]] || MAT_POSES.upward_dog;
    const poseB = MAT_POSES[seq[idxB]] || MAT_POSES.downward_dog;
    activePose = interpolatePose(poseA, poseB, smoothT);
    stageLabel = `${idxA + 1}/${seq.length} · ${poseA.label}`;
  } else {
    activePose = MAT_POSES[spec.mode] || MAT_POSES.warrior_2;
    stageLabel = activePose.label;
  }

  return { activePose, stageLabel };
}

function liftPoseTo3D(activePose, microFloat = 0) {
  const facing = activePose.facing || 'side';
  const zSide = facing === 'front' ? 0.015 : facing === 'quarter' ? 0.068 : 0.112;
  const hipSplitX = facing === 'front' ? 0.088 : facing === 'quarter' ? 0.055 : 0;
  const hipSplitZ = facing === 'front' ? 0.015 : facing === 'quarter' ? 0.055 : 0.088;

  const pt = (xy, z, isUpper = false) => [
    xy[0],
    isUpper && xy[1] > 0.12 ? xy[1] + microFloat : xy[1],
    z,
  ];

  return {
    facing,
    glow: activePose.glow || [],
    hips: pt(activePose.hips, 0),
    waist: pt(activePose.waist, 0, true),
    chest: pt(activePose.chest, 0, true),
    neck: pt(activePose.neck, 0, true),
    head: pt(activePose.head, 0, true),
    lHip: [activePose.hips[0] - hipSplitX, activePose.hips[1], -hipSplitZ],
    rHip: [activePose.hips[0] + hipSplitX, activePose.hips[1], hipSplitZ],
    lShoulder: pt(activePose.lShoulder, -zSide, true),
    lElbow: pt(activePose.lElbow, -zSide, true),
    lHand: pt(activePose.lHand, -zSide, true),
    rShoulder: pt(activePose.rShoulder, zSide, true),
    rElbow: pt(activePose.rElbow, zSide, true),
    rHand: pt(activePose.rHand, zSide, true),
    lKnee: pt(activePose.lKnee, -zSide * 0.88),
    lFoot: pt(activePose.lFoot, -zSide * 0.88),
    rKnee: pt(activePose.rKnee, zSide * 0.88),
    rFoot: pt(activePose.rFoot, zSide * 0.88),
  };
}

function drawSequenceStagePill(ctx, width, height, stageLabel, pillYOverride = null) {
  ctx.save();
  ctx.fillStyle = 'rgba(5, 6, 8, 0.85)';
  const pillW = Math.min(width - 40, 270);
  const pillY = pillYOverride ?? Math.round(height * 0.78);
  ctx.beginPath();
  ctx.roundRect(width / 2 - pillW / 2, pillY, pillW, 22, 11);
  ctx.fill();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stageLabel, width / 2, pillY + 11);
  ctx.restore();
}

function drawYogaScene(ctx, width, height, spec, timeSec, compact, hideOverlayLabel = false) {
  // Deep matte obsidian pitch-black matching GymVisual GIF stage cleanly
  ctx.fillStyle = '#050608';
  ctx.fillRect(0, 0, width, height);

  const stageCenterX = width / 2;
  const stageCenterY = compact ? height * 0.5 : height * 0.47;
  const spotlight = ctx.createRadialGradient(stageCenterX, stageCenterY, 8, stageCenterX, stageCenterY, Math.max(width, height) * 0.58);
  spotlight.addColorStop(0, 'rgba(148, 163, 184, 0.06)');
  spotlight.addColorStop(1, 'rgba(5, 6, 8, 0)');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, width, height);

  const breathCycle = (Math.sin(timeSec * 1.6) + 1) / 2;
  const microFloat = Math.sin(timeSec * 1.6) * 0.011;

  const { activePose, stageLabel } = resolveActiveYogaPose(spec, timeSec, compact, hideOverlayLabel);

  const { unit, cx, baseFloorY } = computePoseViewportTransform(
    activePose,
    spec.domain === 'ball' ? activePose.ball : null,
    width,
    height,
    compact
  );

  // Subtle architectural obsidian Yoga Mat surface (matches gym floor planes cleanly)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - unit * 0.88, baseFloorY - unit * 0.025);
  ctx.lineTo(cx + unit * 0.88, baseFloorY - unit * 0.025);
  ctx.lineTo(cx + unit * 1.02, baseFloorY + unit * 0.055);
  ctx.lineTo(cx - unit * 1.02, baseFloorY + unit * 0.055);
  ctx.closePath();
  ctx.fillStyle = 'rgba(30, 41, 59, 0.28)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.restore();

  // Translucent dark-slate 65cm Stability Ball if Ball Yoga
  if (spec.domain === 'ball' && activePose.ball) {
    const [bxN, byN, brN] = activePose.ball;
    const bx = cx + bxN * unit;
    const by = baseFloorY - byN * unit;
    const br = brN * unit;

    ctx.save();
    const ballGrad = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.35, br * 0.1, bx, by, br);
    ballGrad.addColorStop(0, 'rgba(148, 163, 184, 0.35)');
    ballGrad.addColorStop(0.65, 'rgba(30, 41, 59, 0.65)');
    ballGrad.addColorStop(1, 'rgba(9, 10, 13, 0.92)');
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  const toPx = ([nx, ny], isUpperBody = false) => [
    cx + nx * unit,
    baseFloorY - (ny + (isUpperBody ? microFloat : 0)) * unit,
  ];

  const p = {
    facing: activePose.facing || 'side',
    hips: toPx(activePose.hips),
    waist: toPx(activePose.waist, true),
    chest: toPx(activePose.chest, true),
    neck: toPx(activePose.neck, true),
    head: toPx(activePose.head, true),
    lShoulder: toPx(activePose.lShoulder, true),
    lElbow: toPx(activePose.lElbow, true),
    lHand: toPx(activePose.lHand, true),
    rShoulder: toPx(activePose.rShoulder, true),
    rElbow: toPx(activePose.rElbow, true),
    rHand: toPx(activePose.rHand, true),
    lKnee: toPx(activePose.lKnee),
    lFoot: toPx(activePose.lFoot),
    rKnee: toPx(activePose.rKnee),
    rFoot: toPx(activePose.rFoot),
  };

  const glow = activePose.glow || [];
  const has = (tag) => glow.includes(tag);

  // Far side limbs
  drawEcorcheLimb(ctx, p.hips, p.lKnee, unit * 0.068, unit * 0.043, has('quads') || has('glutes') || has('hamstrings'), breathCycle, true, 0.42);
  drawEcorcheLimb(ctx, p.lKnee, p.lFoot, unit * 0.043, unit * 0.023, has('calves'), breathCycle, true, 0.35);
  drawHandOrFoot(ctx, p.lKnee, p.lFoot, unit * 0.032, true, true);

  drawEcorcheLimb(ctx, p.lShoulder, p.lElbow, unit * 0.044, unit * 0.033, has('shoulders') || has('arms'), breathCycle, true, 0.45);
  drawEcorcheLimb(ctx, p.lElbow, p.lHand, unit * 0.032, unit * 0.020, has('arms'), breathCycle, true, 0.38);
  drawHandOrFoot(ctx, p.lElbow, p.lHand, unit * 0.025, false, true);

  // Sculpted Striated Ecorché Torso + White Compression Shorts
  drawEcorcheTorso(ctx, p, unit, has('core'), has('back'), has('glutes'), breathCycle);

  // Cervical Neck & Cranium Ecorché Head
  drawEcorcheLimb(ctx, p.chest, p.neck, unit * 0.035, unit * 0.028, false, breathCycle, false);
  drawEcorcheHead(ctx, p.neck, p.head, unit, p.facing);

  // Near side limbs (brighter silver rim highlight)
  drawEcorcheLimb(ctx, p.hips, p.rKnee, unit * 0.072, unit * 0.045, has('quads') || has('glutes') || has('hamstrings'), breathCycle, false, 0.42);
  drawEcorcheLimb(ctx, p.rKnee, p.rFoot, unit * 0.045, unit * 0.024, has('calves'), breathCycle, false, 0.35);
  drawHandOrFoot(ctx, p.rKnee, p.rFoot, unit * 0.034, true, false);

  drawEcorcheLimb(ctx, p.rShoulder, p.rElbow, unit * 0.046, unit * 0.034, has('shoulders') || has('arms'), breathCycle, false, 0.45);
  drawEcorcheLimb(ctx, p.rElbow, p.rHand, unit * 0.033, unit * 0.021, has('arms'), breathCycle, false, 0.38);
  drawHandOrFoot(ctx, p.rElbow, p.rHand, unit * 0.026, false, false);

  // Subtle sequence stage label pill in modal view
  if (!compact && !hideOverlayLabel && SEQUENCES[spec.mode]) {
    ctx.save();
    ctx.fillStyle = 'rgba(5, 6, 8, 0.85)';
    const pillW = Math.min(width - 40, 270);
    const pillY = Math.min(height * 0.72, baseFloorY + unit * 0.10);
    ctx.beginPath();
    ctx.roundRect(stageCenterX - pillW / 2, pillY, pillW, 22, 11);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stageLabel, stageCenterX, pillY + 11);
    ctx.restore();
  }
}

/**
 * FACE YOGA GYMVISUAL 3D ECORCHÉ HEAD, NECK & CLAVICLE STAGE
 * Monochrome striated facial musculature with translucent warm terracotta active muscle fibers.
 */
function drawFaceYogaScene(ctx, width, height, mode, timeSec, compact) {
  ctx.fillStyle = '#050608';
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height * (compact ? 0.45 : 0.42);
  const r = Math.min(width, height) * (compact ? 0.31 : 0.23);

  const spotlight = ctx.createRadialGradient(cx, cy, 6, cx, cy, r * 2.1);
  spotlight.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
  spotlight.addColorStop(1, 'rgba(5, 6, 8, 0)');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, width, height);

  const pulse = (Math.sin(timeSec * 2.0) + 1) / 2;
  const liftMicro = Math.sin(timeSec * 2.0) * r * 0.022;

  // 1. Trapezius, Clavicles & Cervical Neck Base Silhouette (Dark Charcoal + Silver Rim)
  const traceBust = () => {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.36, cy + r * 0.68);
    ctx.quadraticCurveTo(cx - r * 0.42, cy + r * 1.12, cx - r * 1.12, cy + r * 1.38);
    ctx.lineTo(cx + r * 1.12, cy + r * 1.38);
    ctx.quadraticCurveTo(cx + r * 0.42, cy + r * 1.12, cx + r * 0.36, cy + r * 0.68);
    ctx.closePath();
  };

  ctx.save();
  traceBust();
  const bustGrad = ctx.createLinearGradient(cx - r, cy + r * 0.7, cx + r, cy + r * 1.38);
  bustGrad.addColorStop(0, '#6b7280');
  bustGrad.addColorStop(0.25, '#181b22');
  bustGrad.addColorStop(0.75, '#090a0d');
  bustGrad.addColorStop(1, '#374151');
  ctx.fillStyle = bustGrad;
  ctx.fill();

  // Clip bust for Platysma & Sternocleidomastoid fiber striations
  ctx.save();
  traceBust();
  ctx.clip();

  const isNeckActive = mode === 'face_jawline' || mode === 'face_lymphatic' || mode === 'face_mewing_chin';
  if (isNeckActive) {
    const cg = ctx.createRadialGradient(cx, cy + r * 1.0, r * 0.1, cx, cy + r * 1.05, r * 0.75);
    cg.addColorStop(0, `rgba(234, 98, 62, ${0.55 + pulse * 0.18})`);
    cg.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = cg;
    ctx.fillRect(cx - r * 1.2, cy + r * 0.6, r * 2.4, r * 0.9);
  }

  // Striated Sternocleidomastoid (SCM) & Platysma oblique neck strands
  [-1, 1].forEach((side) => {
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + side * r * (0.34 - i * 0.025), cy + r * 0.72);
      ctx.quadraticCurveTo(
        cx + side * r * (0.28 + i * 0.04),
        cy + r * 1.05,
        cx + side * r * (0.06 + i * 0.14),
        cy + r * 1.36
      );
      ctx.strokeStyle = isNeckActive ? 'rgba(255, 220, 195, 0.34)' : 'rgba(203, 213, 225, 0.24)';
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
  });
  ctx.restore();

  traceBust();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.45)';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.restore();

  // 2. Anatomical Cranium, Zygomatic Arch & Angular Jawline Silhouette
  const traceHead = () => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.98);
    ctx.bezierCurveTo(cx + r * 0.66, cy - r * 0.98, cx + r * 0.73, cy - r * 0.32, cx + r * 0.65, cy + r * 0.22);
    ctx.lineTo(cx + r * 0.56, cy + r * 0.52); // Sharp mandibular angle
    ctx.quadraticCurveTo(cx + r * 0.28, cy + r * 0.86, cx, cy + r * 0.91);
    ctx.quadraticCurveTo(cx - r * 0.28, cy + r * 0.86, cx - r * 0.56, cy + r * 0.52);
    ctx.lineTo(cx - r * 0.65, cy + r * 0.22);
    ctx.bezierCurveTo(cx - r * 0.73, cy - r * 0.32, cx - r * 0.66, cy - r * 0.98, cx, cy - r * 0.98);
    ctx.closePath();
  };

  ctx.save();
  traceHead();
  const headGrad = ctx.createLinearGradient(cx - r * 0.7, cy - r, cx + r * 0.7, cy + r);
  headGrad.addColorStop(0, '#9ca3af');
  headGrad.addColorStop(0.22, '#1e222a');
  headGrad.addColorStop(0.75, '#090b0f');
  headGrad.addColorStop(1, '#4b5563');
  ctx.fillStyle = headGrad;
  ctx.fill();

  // Clip inside Head to draw true Ecorché Facial Muscle Groups + Coral Activation + Silver Fiber Striations
  ctx.save();
  traceHead();
  ctx.clip();

  const drawMuscleZone = (x, y, rx, ry, rot, isActive, strandCount = 5, modeType = 'fan') => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    if (isActive) {
      ctx.save();
      ctx.scale(1, ry / rx);
      const cg = ctx.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
      cg.addColorStop(0, `rgba(234, 98, 62, ${0.72 + pulse * 0.18})`);
      cg.addColorStop(0.65, `rgba(194, 65, 38, ${0.42 + pulse * 0.12})`);
      cg.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Anatomical fiber hairlines inside muscle group
    ctx.strokeStyle = isActive ? 'rgba(255, 224, 198, 0.42)' : 'rgba(203, 213, 225, 0.22)';
    ctx.lineWidth = 0.6;
    if (modeType === 'ring') {
      for (let i = 0; i < 3; i++) {
        const s = 0.5 + i * 0.22;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * s, ry * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      for (let i = -Math.floor(strandCount / 2); i <= Math.floor(strandCount / 2); i++) {
        const yOff = (i / Math.max(1, strandCount / 2)) * ry * 0.72;
        ctx.beginPath();
        ctx.moveTo(-rx * 0.78, yOff * 0.85);
        ctx.quadraticCurveTo(0, yOff * 1.15, rx * 0.78, yOff * 0.85);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Frontalis (forehead vertical fibers)
  drawMuscleZone(cx, cy - r * 0.56 + (mode === 'face_forehead' ? -liftMicro * 0.7 : 0), r * 0.44, r * 0.20, Math.PI / 2 * 0.02, mode === 'face_forehead' || mode === 'face_lion_breath', 5, 'fan');
  // Orbicularis Oculi (left & right concentric rings)
  drawMuscleZone(cx - r * 0.27, cy - r * 0.16, r * 0.18, r * 0.11, 0, mode === 'face_eyes', 3, 'ring');
  drawMuscleZone(cx + r * 0.27, cy - r * 0.16, r * 0.18, r * 0.11, 0, mode === 'face_eyes', 3, 'ring');
  // Zygomaticus & Buccinator (diagonal cheekbone muscles lifting in cheek mode)
  const cheekLift = mode === 'face_cheek' ? -liftMicro : 0;
  drawMuscleZone(cx - r * 0.34, cy + r * 0.16 + cheekLift, r * 0.24, r * 0.12, -0.45, mode === 'face_cheek' || mode === 'face_lymphatic', 5, 'fan');
  drawMuscleZone(cx + r * 0.34, cy + r * 0.16 + cheekLift, r * 0.24, r * 0.12, 0.45, mode === 'face_cheek' || mode === 'face_lymphatic', 5, 'fan');
  // Masseter & Mandible Jawline
  drawMuscleZone(cx - r * 0.44, cy + r * 0.44, r * 0.18, r * 0.14, 0.65, mode === 'face_jawline' || mode === 'face_mewing_chin', 4, 'fan');
  drawMuscleZone(cx + r * 0.44, cy + r * 0.44, r * 0.18, r * 0.14, -0.65, mode === 'face_jawline' || mode === 'face_mewing_chin', 4, 'fan');
  // Submental / Mentalis Chin sling
  drawMuscleZone(cx, cy + r * 0.78, r * 0.26, r * 0.14, 0, mode === 'face_mewing_chin' || mode === 'face_jawline', 4, 'fan');
  // Orbicularis Oris (mouth ring)
  drawMuscleZone(cx, cy + r * 0.46, r * 0.22, r * 0.11, 0, mode === 'face_lips' || mode === 'face_lion_breath', 3, 'ring');

  ctx.restore();

  // Sharp Fresnel Outer Rim Contour on Head & Jaw
  traceHead();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.58)';
  ctx.lineWidth = compact ? 0.95 : 1.3;
  ctx.stroke();

  // Subtle Ecorché Facial Feature Contours (Brows, Eye Sockets, Nose, Lips)
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
  ctx.lineWidth = compact ? 0.85 : 1.15;
  const browY = mode === 'face_forehead' || mode === 'face_eyes' ? -liftMicro : 0;
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.moveTo(cx + side * r * 0.10, cy - r * 0.26 + browY);
    ctx.quadraticCurveTo(cx + side * r * 0.27, cy - r * 0.34 + browY, cx + side * r * 0.44, cy - r * 0.23 + browY);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx + side * r * 0.26, cy - r * 0.15, r * 0.11, mode === 'face_lion_breath' ? r * 0.055 : r * 0.036, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Sculpted Nose bridge + tip
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.18);
  ctx.lineTo(cx, cy + r * 0.15);
  ctx.quadraticCurveTo(cx + r * 0.09, cy + r * 0.20, cx - r * 0.07, cy + r * 0.20);
  ctx.stroke();

  // Sculpted Lips
  const lipW = mode === 'face_lips' ? r * 0.13 : mode === 'face_cheek' ? r * 0.23 : r * 0.18;
  const lipOpen = mode === 'face_lion_breath' ? r * 0.09 : mode === 'face_lips' ? r * 0.045 : r * 0.018;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.45, lipW, lipOpen, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Whisper-thin coral/silver directional fiber contraction chevrons (only in interactive modal view)
  if (!compact) {
    const glide = (timeSec * 0.55) % 1;
    const drawMicroVector = (x1, y1, x2, y2) => {
      const px = lerp(x1, x2, glide);
      const py = lerp(y1, y2, glide);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fb923c';
      ctx.fill();
    };

    if (mode === 'face_jawline') {
      drawMicroVector(cx - r * 0.08, cy + r * 0.84, cx - r * 0.56, cy + r * 0.36);
      drawMicroVector(cx + r * 0.08, cy + r * 0.84, cx + r * 0.56, cy + r * 0.36);
    } else if (mode === 'face_mewing_chin') {
      drawMicroVector(cx, cy + r * 0.92, cx, cy + r * 0.62);
    } else if (mode === 'face_cheek') {
      drawMicroVector(cx - r * 0.18, cy + r * 0.30, cx - r * 0.46, cy + r * 0.04);
      drawMicroVector(cx + r * 0.18, cy + r * 0.30, cx + r * 0.46, cy + r * 0.04);
    } else if (mode === 'face_forehead') {
      drawMicroVector(cx - r * 0.05, cy - r * 0.52, cx - r * 0.44, cy - r * 0.58);
      drawMicroVector(cx + r * 0.05, cy - r * 0.52, cx + r * 0.44, cy - r * 0.58);
    } else if (mode === 'face_eyes') {
      drawMicroVector(cx - r * 0.18, cy - r * 0.08, cx - r * 0.48, cy - r * 0.22);
      drawMicroVector(cx + r * 0.18, cy - r * 0.08, cx + r * 0.48, cy - r * 0.22);
    } else if (mode === 'face_lymphatic') {
      drawMicroVector(cx - r * 0.48, cy + r * 0.20, cx - r * 0.36, cy + r * 1.15);
      drawMicroVector(cx + r * 0.48, cy + r * 0.20, cx + r * 0.36, cy + r * 1.15);
    }
  }
  ctx.restore();
}

export function YogaAnatomicalCanvas({ exercise, compact = false, animate = false, className = '' }) {
  const canvasRef = useRef(null);
  const spec = useMemo(() => resolveYogaAnimationSpec(exercise), [exercise]);
  const shouldAnimate = !compact || animate;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    const startMs = performance.now();

    const drawFrame = (nowMs) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width || canvas.width || (compact ? 140 : 600), 64);
      const h = Math.max(rect.height || canvas.height || (compact ? 140 : 420), 64);

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      const timeSec = (nowMs - startMs) / 1000;

      // Dedicated Expressive Portrait + Articulated Hand Renderer for Face Yoga
      if (spec.domain === 'face') {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawRealisticFaceYoga(ctx, w, h, exercise, timeSec, compact, shouldAnimate);
        ctx.restore();
        return;
      }

      const breathCycle = (Math.sin(timeSec * 1.6) + 1) / 2;
      const microFloat = Math.sin(timeSec * 1.6) * 0.011;
      const studio = getEcorcheWebGLStudio();

      if (studio?.ready) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const { activePose, stageLabel } = resolveActiveYogaPose(spec, timeSec, compact, animate);
        const pose3D = liftPoseTo3D(activePose, microFloat);
        const ballSpec = spec.domain === 'ball' ? activePose.ball : null;
        const rendered3D = studio.renderBodyPoseTo2D(ctx, canvas.width, canvas.height, pose3D, ballSpec, breathCycle, compact);
        ctx.restore();

        if (rendered3D) {
          if (!compact && !animate && SEQUENCES[spec.mode]) {
            ctx.save();
            ctx.scale(dpr, dpr);
            drawSequenceStagePill(ctx, w, h, stageLabel);
            ctx.restore();
          }
          return;
        }
      }

      // Canvas 2D Ecorché fallback (runs only if WebGL is unavailable)
      ctx.save();
      ctx.scale(dpr, dpr);
      drawYogaScene(ctx, w, h, spec, timeSec, compact, animate);
      ctx.restore();
    };

    let ro;
    if (!shouldAnimate) {
      drawFrame(startMs);
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => drawFrame(startMs));
        ro.observe(canvas);
      }
    } else {
      const tick = (nowMs) => {
        drawFrame(nowMs);
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
    };
  }, [spec, exercise, compact, shouldAnimate, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      aria-label={exercise?.name || 'Anatomical Yoga & Face Yoga Animation'}
    />
  );
}
