/**
 * FITARC MASCULINE 3D STUDIO ECORCHÉ FACE YOGA RENDERER
 * Renders a rugged, chiseled athletic male anatomical bust (broad traps, deltoids,
 * striated upper pectorals, thick sternocleidomastoid neck, square jawbone, recessed
 * brow & orbital shadow, chiaroscuro 3D key/rim lighting, and strong striated hands/forearms)
 * matching GymVisual's monochrome 3D muscle renders with terracotta target-muscle activation.
 */

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function resolveFaceTechnique(exercise) {
  const name = (exercise?.name || '').toLowerCase();
  const explicit = (exercise?.poseType || '').toLowerCase();

  if (name.includes('simhasana') || name.includes('lion')) return 'lion_roar';
  if (name.includes('bhramari') || name.includes('bee breath')) return 'bhramari_mudra';
  if (name.includes('sitali') || name.includes('cooling tongue')) return 'sitali_tongue';
  if (name.includes('double chin') || name.includes('mewing') || name.includes('hyoid') || name.includes('tongue roof')) {
    return 'mewing_chin_lift';
  }
  if (name.includes('kiss-the-ceiling') || name.includes('platysma kiss')) return 'kiss_ceiling';
  if (name.includes('fish lips') || name.includes('lip boundary') || name.includes('kiss hold')) return 'fish_pout';
  if (name.includes('forehead') || name.includes('frontalis') || name.includes('corrugator') || name.includes('scalp')) {
    return 'forehead_smooth';
  }
  if (name.includes('under-eye tap')) return 'eye_tap';
  if (
    name.includes('eye') ||
    name.includes('oculi') ||
    name.includes('eyelid') ||
    name.includes('squint') ||
    name.includes('eyebrow arch') ||
    name.includes('tear-trough')
  ) {
    return 'eye_c_grip';
  }
  if (name.includes('smile muscle')) return 'smile_counter';
  if (
    name.includes('cheek') ||
    name.includes('zygomatic') ||
    name.includes('buccinator') ||
    name.includes('nasolabial')
  ) {
    return 'cheek_lift_o';
  }
  if (
    name.includes('gua sha') ||
    name.includes('lymphatic') ||
    name.includes('swan neck') ||
    name.includes('neck bandha') ||
    name.includes('clavicular') ||
    name.includes('thyroid')
  ) {
    return 'neck_lymph_drain';
  }
  if (
    name.includes('masseter') ||
    name.includes('temple') ||
    name.includes('sphenoid') ||
    name.includes('nose sculpt') ||
    name.includes('nasalis') ||
    name.includes('ear lobe')
  ) {
    return 'temple_masseter_press';
  }
  if (name.includes('tapotement')) return 'tapotement_relax';
  if (name.includes('savasana') || name.includes('stillness')) return 'zen_stillness';
  if (name.includes('jawline') || name.includes('chin pinch') || name.includes('jaw drop') || name.includes('suboccipital')) {
    return 'jawline_sweep';
  }

  if (explicit === 'face_mewing_chin') return 'mewing_chin_lift';
  if (explicit === 'face_cheek') return 'cheek_lift_o';
  if (explicit === 'face_forehead') return 'forehead_smooth';
  if (explicit === 'face_eyes') return 'eye_c_grip';
  if (explicit === 'face_lips') return 'fish_pout';
  if (explicit === 'face_lion_breath') return 'lion_roar';
  if (explicit === 'face_lymphatic') return 'neck_lymph_drain';
  return 'jawline_sweep';
}

/**
 * Draw rugged, chiseled 3D striated masculine forearm & hand in GymVisual style.
 */
function drawMasculineEcorcheHand(ctx, r, ax, ay, side, style = 'point', angleRad = 0, curlAmt = 0) {
  ctx.save();
  ctx.translate(ax, ay);
  if (side > 0) ctx.scale(-1, 1);
  ctx.rotate(angleRad);

  const rimStroke = 'rgba(203, 213, 225, 0.78)';
  const edgeShadow = 'rgba(15, 23, 42, 0.9)';
  const tendonLine = 'rgba(226, 232, 240, 0.36)';
  const lw = Math.max(1.0, r * 0.015);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.88)';
  ctx.shadowBlur = r * 0.10;
  ctx.shadowOffsetY = r * 0.03;

  const fingerW = r * 0.095; // Stronger masculine finger thickness
  const fingerLen = r * 0.32;

  // Athletic muscular brachioradialis forearm tapering into wrist
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, r * 0.13);
  ctx.quadraticCurveTo(-r * 0.62, r * 0.38, -r * 0.68, r * 0.90);
  ctx.lineTo(-r * 0.39, r * 0.94);
  ctx.quadraticCurveTo(-r * 0.32, r * 0.44, -r * 0.19, r * 0.21);
  ctx.closePath();

  const armGrad = ctx.createLinearGradient(-r * 0.64, r * 0.22, -r * 0.22, r * 0.72);
  armGrad.addColorStop(0, '#475569');
  armGrad.addColorStop(0.28, '#1e2430');
  armGrad.addColorStop(0.85, '#090b10');
  armGrad.addColorStop(1, '#2d3646');
  ctx.fillStyle = armGrad;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = rimStroke;
  ctx.stroke();

  // Longitudinal forearm muscle fiber striations
  for (let i = 0; i < 4; i++) {
    const off = i * r * 0.042;
    ctx.beginPath();
    ctx.moveTo(-r * 0.36 + off, r * 0.23);
    ctx.lineTo(-r * 0.54 + off * 1.35, r * 0.85);
    ctx.strokeStyle = tendonLine;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  const drawSculptedSegment = (x, y, w, h, radius, highlight = false) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, highlight ? '#526075' : '#323a4a');
    g.addColorStop(0.45, highlight ? '#252c38' : '#181d26');
    g.addColorStop(1, '#0a0c12');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = lw * 0.95;
    ctx.strokeStyle = highlight ? rimStroke : edgeShadow;
    ctx.stroke();
  };

  if (style === 'point' || style === 'two_finger') {
    const curledCount = style === 'two_finger' ? 2 : 3;
    for (let i = 0; i < curledCount; i++) {
      const fy = r * (0.095 + i * 0.078);
      const fx = -r * (0.14 - i * 0.015);
      drawSculptedSegment(fx - r * 0.10, fy - fingerW * 0.44, r * 0.19, fingerW * 0.88, fingerW * 0.34, false);
    }

    // Angular broad masculine hand metacarpal block
    drawSculptedSegment(-r * 0.43, -r * 0.05, r * 0.32, r * 0.34, r * 0.08, true);

    // Thumb anchor
    drawSculptedSegment(-r * 0.34, -r * 0.13, r * 0.20, fingerW * 0.90, fingerW * 0.36, true);

    if (style === 'two_finger') {
      drawSculptedSegment(-r * 0.23, r * 0.01, fingerLen * 0.95, fingerW * 0.92, fingerW * 0.36, true);
    }

    // Strong angular index finger
    drawSculptedSegment(-fingerLen * 0.74, -fingerW * 0.48, fingerLen, fingerW, fingerW * 0.38, true);

    // Subtle metacarpal knuckle highlight
    ctx.beginPath();
    ctx.moveTo(-r * 0.36, 0);
    ctx.lineTo(fingerLen * 0.08, 0);
    ctx.strokeStyle = tendonLine;
    ctx.lineWidth = 0.75;
    ctx.stroke();

    // Terracotta focal point contact halo
    ctx.beginPath();
    ctx.arc(fingerLen * 0.18, 0, fingerW * 0.44, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 88, 52, 0.56)';
    ctx.fill();
  } else if (style === 'flat_palm') {
    drawSculptedSegment(-r * 0.49, -r * 0.11, r * 0.29, r * 0.34, r * 0.08, true);
    drawSculptedSegment(-r * 0.33, r * 0.16, r * 0.20, fingerW * 0.85, fingerW * 0.35, false);

    for (let i = 0; i < 4; i++) {
      const fy = -r * 0.10 + i * (fingerW * 0.86);
      const reach = i === 1 || i === 2 ? r * 0.31 : r * 0.27;
      drawSculptedSegment(-r * 0.23, fy, reach, fingerW * 0.82, fingerW * 0.34, i <= 1);
    }
  } else if (style === 'c_grip') {
    drawSculptedSegment(-r * 0.43, -r * 0.08, r * 0.24, r * 0.28, r * 0.08, true);

    ctx.beginPath();
    ctx.moveTo(-r * 0.23, -r * 0.07);
    ctx.quadraticCurveTo(-r * 0.09, -r * 0.21 - curlAmt * r * 0.03, r * 0.08, -r * 0.13);
    ctx.lineCap = 'round';
    ctx.lineWidth = fingerW * 1.05;
    ctx.strokeStyle = rimStroke;
    ctx.stroke();
    ctx.lineWidth = fingerW * 0.80;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.23, r * 0.11);
    ctx.quadraticCurveTo(-r * 0.08, r * 0.22 + curlAmt * r * 0.03, r * 0.09, r * 0.14);
    ctx.lineCap = 'round';
    ctx.lineWidth = fingerW * 1.08;
    ctx.strokeStyle = rimStroke;
    ctx.stroke();
    ctx.lineWidth = fingerW * 0.82;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw striated muscle bundles matching GymVisual's fine fibrous ecorché shading.
 */
function drawStriatedMuscleBand(ctx, x1, y1, x2, y2, thickness, spreadX, spreadY, isActive, wave, fiberCount = 7) {
  ctx.save();
  const mx = (x1 + x2) * 0.5;
  const my = (y1 + y2) * 0.5;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;

  if (isActive) {
    const glowR = Math.max(len * 0.72, thickness * 1.75);
    const rg = ctx.createRadialGradient(mx, my, glowR * 0.06, mx, my, glowR);
    rg.addColorStop(0, `rgba(234, 88, 52, ${0.56 + 0.22 * wave})`);
    rg.addColorStop(0.55, `rgba(194, 65, 38, ${0.28 + 0.12 * wave})`);
    rg.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(mx, my, glowR, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < fiberCount; i++) {
    const frac = fiberCount > 1 ? (i / (fiberCount - 1) - 0.5) * 2 : 0;
    const off1 = frac * thickness * 0.45;
    const off2 = frac * thickness * 0.65;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * off1, y1 + ny * off1);
    ctx.quadraticCurveTo(
      mx + nx * ((off1 + off2) * 0.55 + spreadX * frac),
      my + ny * ((off1 + off2) * 0.55 + spreadY * frac),
      x2 + nx * off2,
      y2 + ny * off2
    );
    ctx.strokeStyle = isActive
      ? `rgba(253, 186, 140, ${0.50 + 0.22 * wave})`
      : 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = isActive ? 0.95 : 0.65;
    ctx.stroke();
  }
  ctx.restore();
}

function drawBiomechanicalVector(ctx, x1, y1, x2, y2, progress) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.85)';
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.setLineDash([]);

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 5;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const px = lerp(x1, x2, progress);
  const py = lerp(y1, y2, progress);
  ctx.beginPath();
  ctx.arc(px, py, 2.7, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
  ctx.restore();
}

export function drawRealisticFaceYoga(ctx, width, height, exercise, timeSec, compact, animate = !compact) {
  const tech = resolveFaceTechnique(exercise);

  const shouldMove = !compact || animate;
  const tPhase = shouldMove ? (Math.sin(timeSec * 2.1) + 1) * 0.5 : 0.65;
  const smoothWave = easeInOut(tPhase);
  const sweepProg = shouldMove ? (timeSec * 0.65) % 1 : 0.55;

  // 1. Deep Obsidian Studio Backdrop (100% consistent with GymVisual cards)
  ctx.fillStyle = '#050608';
  ctx.fillRect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * (compact ? 0.47 : 0.44);
  const r = compact
    ? Math.min(width * 0.25, height * 0.30)
    : Math.min(width * 0.165, height * 0.21);

  const spotlight = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.1, r * 0.15, cx, cy, r * 2.5);
  spotlight.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
  spotlight.addColorStop(0.55, 'rgba(234, 88, 12, 0.025)');
  spotlight.addColorStop(1, 'rgba(5, 6, 8, 0)');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, width, height);

  let headTiltY = 0;
  let headTiltRot = 0;
  if (tech === 'mewing_chin_lift' || tech === 'kiss_ceiling') {
    headTiltY = -r * 0.09 * smoothWave;
  } else if (tech === 'neck_lymph_drain') {
    headTiltRot = -0.09 * smoothWave;
  }

  const silverRim = 'rgba(203, 213, 225, 0.72)';
  const subtleBone = 'rgba(226, 232, 240, 0.26)';
  const outlineW = Math.max(0.9, r * 0.014);

  // 2. BARE MUSCULAR MASCULINE UPPER CHEST, DELTOIDS & TRAPEZIUS (Shirtless GymVisual Ecorché — ZERO white sweater!)
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.48, cy + r * 1.54);
  ctx.quadraticCurveTo(cx - r * 1.40, cy + r * 1.12, cx - r * 0.96, cy + r * 1.02); // Broad Deltoid Shoulder
  ctx.quadraticCurveTo(cx - r * 0.56, cy + r * 0.92, cx - r * 0.36, cy + r * 0.80); // Thick Trapezius Slope
  ctx.lineTo(cx + r * 0.36, cy + r * 0.80);
  ctx.quadraticCurveTo(cx + r * 0.56, cy + r * 0.92, cx + r * 0.96, cy + r * 1.02);
  ctx.quadraticCurveTo(cx + r * 1.40, cy + r * 1.12, cx + r * 1.48, cy + r * 1.54);
  ctx.closePath();

  // Dramatic 3D top-left studio chiaroscuro shading across traps & upper chest
  const chestGrad = ctx.createLinearGradient(cx - r * 1.2, cy + r * 0.8, cx + r * 1.2, cy + r * 1.54);
  chestGrad.addColorStop(0, '#475569');
  chestGrad.addColorStop(0.26, '#1f2633');
  chestGrad.addColorStop(0.68, '#0b0e14');
  chestGrad.addColorStop(1, '#1e2430');
  ctx.fillStyle = chestGrad;
  ctx.fill();
  ctx.strokeStyle = silverRim;
  ctx.lineWidth = outlineW;
  ctx.stroke();

  // Upper Pectoralis Major & Anterior Deltoid Muscle Fiber Striations (exact GymVisual look!)
  [-1, 1].forEach((s) => {
    // Striated Upper Pec Clavicular Head fanning into shoulder deltoid
    drawStriatedMuscleBand(
      ctx,
      cx + s * r * 0.06,
      cy + r * 1.28,
      cx + s * r * 0.96,
      cy + r * 1.16,
      r * 0.32,
      0,
      r * 0.05,
      false,
      smoothWave,
      8
    );
    // Clavicle Bone Ridge & Deltoid separation groove
    ctx.beginPath();
    ctx.moveTo(cx + s * r * 0.06, cy + r * 1.04);
    ctx.quadraticCurveTo(cx + s * r * 0.44, cy + r * 0.95, cx + s * r * 0.88, cy + r * 1.05);
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.36)';
    ctx.lineWidth = Math.max(1.2, r * 0.018);
    ctx.lineCap = 'round';
    ctx.stroke();
  });

  // 3. THICK MASCULINE CERVICAL NECK & STERNOCLEIDOMASTOID (SCM) COLUMNS
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.36, cy + r * 0.48); // Broad masculine neck width!
  ctx.quadraticCurveTo(cx - r * 0.36, cy + r * 0.86, cx - r * 0.46, cy + r * 1.00);
  ctx.quadraticCurveTo(cx, cy + r * 1.14, cx + r * 0.46, cy + r * 1.00);
  ctx.quadraticCurveTo(cx + r * 0.36, cy + r * 0.86, cx + r * 0.36, cy + r * 0.48);
  ctx.closePath();

  const neckGrad = ctx.createLinearGradient(cx - r * 0.42, cy + r * 0.50, cx + r * 0.42, cy + r * 1.08);
  neckGrad.addColorStop(0, '#465266');
  neckGrad.addColorStop(0.32, '#1d232e');
  neckGrad.addColorStop(0.76, '#090c11');
  neckGrad.addColorStop(1, '#2a3242');
  ctx.fillStyle = neckGrad;
  ctx.fill();
  ctx.strokeStyle = silverRim;
  ctx.lineWidth = outlineW;
  ctx.stroke();

  // Sternal Hollow & Adam's Apple Laryngeal Contour
  ctx.beginPath();
  ctx.arc(cx, cy + r * 1.06, r * 0.065, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(5, 6, 8, 0.65)';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.78, r * 0.06, r * 0.045, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(203, 213, 225, 0.14)';
  ctx.fill();

  const isNeckGlow =
    tech === 'neck_lymph_drain' ||
    tech === 'mewing_chin_lift' ||
    tech === 'kiss_ceiling' ||
    tech === 'jawline_sweep';

  [-1, 1].forEach((s) => {
    drawStriatedMuscleBand(
      ctx,
      cx + s * r * 0.34,
      cy + r * 0.56,
      cx + s * r * 0.06,
      cy + r * 1.04,
      r * 0.16,
      0,
      0,
      isNeckGlow,
      smoothWave,
      6
    );
  });

  // 4. CHISELED MASCULINE CRANIUM, SQUARE MANDIBULAR JAWLINE & SCULPTED LIGHTING
  ctx.save();
  ctx.translate(cx, cy + headTiltY);
  ctx.rotate(headTiltRot);

  // Subtle recessed athletic ears (close to cranial mastoid, NOT sticking out playfully!)
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.ellipse(s * r * 0.66, r * 0.08, r * 0.065, r * 0.16, s * -0.05, 0, Math.PI * 2);
    ctx.fillStyle = s < 0 ? '#2b3342' : '#10141c';
    ctx.fill();
    ctx.strokeStyle = silverRim;
    ctx.lineWidth = outlineW * 0.8;
    ctx.stroke();
  });

  // Sculpted Square Masculine Jaw + Flat Chiseled Chin + Angular Zygomatic Temples
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.94); // Cranial vertex
  ctx.bezierCurveTo(r * 0.64, -r * 0.94, r * 0.70, -r * 0.28, r * 0.64, r * 0.14); // Angular temple -> Cheekbone edge
  ctx.lineTo(r * 0.60, r * 0.54); // Strong WIDE masculine gonial jaw corner
  ctx.quadraticCurveTo(r * 0.44, r * 0.79, r * 0.22, r * 0.88); // Taper toward square chin corner
  ctx.lineTo(-r * 0.22, r * 0.88); // Crisp SQUARED CHIN Mentum bottom!
  ctx.quadraticCurveTo(-r * 0.44, r * 0.79, -r * 0.60, r * 0.54); // Strong LEFT gonial jaw corner
  ctx.lineTo(-r * 0.64, r * 0.14);
  ctx.bezierCurveTo(-r * 0.70, -r * 0.28, -r * 0.64, -r * 0.94, 0, -r * 0.94);
  ctx.closePath();

  // 3D directional studio key light from Top-Left -> Deep chiaroscuro right temple/jaw shadow + Fresnel rim!
  const skullGrad = ctx.createLinearGradient(-r * 0.65, -r * 0.65, r * 0.65, r * 0.75);
  skullGrad.addColorStop(0, '#495569');
  skullGrad.addColorStop(0.28, '#212733');
  skullGrad.addColorStop(0.68, '#0c0f15');
  skullGrad.addColorStop(1, '#1e2532');
  ctx.fillStyle = skullGrad;
  ctx.fill();
  ctx.strokeStyle = silverRim;
  ctx.lineWidth = outlineW * 1.1;
  ctx.stroke();

  // Sharp Buccal Cheek Hollow Shadows (Hallmark rugged masculine facial sculpting!)
  [-1, 1].forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(s * r * 0.56, r * 0.22);
    ctx.quadraticCurveTo(s * r * 0.36, r * 0.34, s * r * 0.24, r * 0.56);
    ctx.quadraticCurveTo(s * r * 0.46, r * 0.54, s * r * 0.58, r * 0.44);
    ctx.closePath();
    ctx.fillStyle = 'rgba(5, 6, 8, 0.46)';
    ctx.fill();
  });

  // Skeletal Cheekbone, Brow & Mandibular Jawbone Highlights
  ctx.save();
  ctx.strokeStyle = subtleBone;
  ctx.lineWidth = Math.max(0.95, r * 0.013);
  ctx.lineCap = 'round';
  [-1, 1].forEach((s) => {
    // High Angular Zygomatic Ridge
    ctx.beginPath();
    ctx.moveTo(s * r * 0.14, r * 0.14);
    ctx.quadraticCurveTo(s * r * 0.42, r * 0.11, s * r * 0.61, r * 0.02);
    ctx.stroke();

    // Sharp Mandible Angle Bone Edge
    ctx.beginPath();
    ctx.moveTo(s * r * 0.58, r * 0.52);
    ctx.quadraticCurveTo(s * r * 0.34, r * 0.80, s * r * 0.16, r * 0.86);
    ctx.stroke();
  });
  ctx.restore();

  // 5. MUSCULAR ECORCHÉ STRIATION GROUPS ACROSS FACE
  const isForehead = tech === 'forehead_smooth';
  [-1, 1].forEach((s) => {
    drawStriatedMuscleBand(ctx, s * r * 0.10, -r * 0.74, s * r * 0.30, -r * 0.30, r * 0.26, s * r * 0.05, 0, isForehead, smoothWave, 6);
  });

  const isEyes = tech === 'eye_c_grip' || tech === 'eye_tap';
  [-1, 1].forEach((s) => {
    if (isEyes) {
      const og = ctx.createRadialGradient(s * r * 0.28, -r * 0.09, r * 0.03, s * r * 0.28, -r * 0.09, r * 0.23);
      og.addColorStop(0, `rgba(234, 88, 52, ${0.52 + 0.20 * smoothWave})`);
      og.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.ellipse(s * r * 0.28, -r * 0.09, r * 0.23, r * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const isCheeks = tech === 'cheek_lift_o' || tech === 'smile_counter' || tech === 'tapotement_relax';
  [-1, 1].forEach((s) => {
    drawStriatedMuscleBand(ctx, s * r * 0.18, r * 0.42, s * r * 0.54, r * 0.08, r * 0.16, 0, -r * 0.04, isCheeks, smoothWave, 6);
  });

  const isJaw = tech === 'jawline_sweep' || tech === 'temple_masseter_press';
  [-1, 1].forEach((s) => {
    drawStriatedMuscleBand(ctx, s * r * 0.56, r * 0.16, s * r * 0.48, r * 0.58, r * 0.20, s * r * 0.04, 0, isJaw, smoothWave, 6);
  });

  if (tech === 'mewing_chin_lift' || tech === 'kiss_ceiling') {
    drawStriatedMuscleBand(ctx, 0, r * 0.62, 0, r * 0.92, r * 0.36, 0, 0, true, smoothWave, 6);
  }

  const isOral = tech === 'fish_pout' || tech === 'lion_roar' || tech === 'sitali_tongue' || tech === 'kiss_ceiling';
  if (isOral) {
    const mg = ctx.createRadialGradient(0, r * 0.46, r * 0.03, 0, r * 0.46, r * 0.26);
    mg.addColorStop(0, `rgba(234, 88, 52, ${0.52 + 0.18 * smoothWave})`);
    mg.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.46, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. RUGGED MASCULINE SUPRAORBITAL BROW RIDGE & DEEP RECESSED ORBITAL SOCKETS (NO bright comic googly eyes!)
  const browLift = tech === 'lion_roar' ? -r * 0.045 * smoothWave : tech === 'eye_c_grip' ? -r * 0.025 * smoothWave : 0;
  const isClosedEyes = tech === 'bhramari_mudra' || tech === 'zen_stillness';
  const squintScale =
    tech === 'eye_c_grip' ? 1.0 - 0.50 * smoothWave : tech === 'lion_roar' ? 1.25 : isClosedEyes ? 0.1 : 1.0;

  [-1, 1].forEach((s) => {
    const ex = s * r * 0.28;
    const ey = -r * 0.10;

    // Deep Masculine Orbital Cavity Shadow under Strong Low Brow Bone
    const orbitG = ctx.createRadialGradient(ex, ey, r * 0.02, ex, ey, r * 0.22);
    orbitG.addColorStop(0, 'rgba(5, 6, 8, 0.88)');
    orbitG.addColorStop(0.65, 'rgba(9, 12, 18, 0.55)');
    orbitG.addColorStop(1, 'rgba(9, 12, 18, 0)');
    ctx.fillStyle = orbitG;
    ctx.beginPath();
    ctx.ellipse(ex, ey, r * 0.22, r * 0.12, s * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Straight-Angled Supraorbital Brow Ridge & Silver Key Edge
    ctx.beginPath();
    ctx.moveTo(s * r * 0.08, -r * 0.18 + browLift * 0.4);
    ctx.lineTo(s * r * 0.30, -r * 0.23 + browLift);
    ctx.lineTo(s * r * 0.51, -r * 0.17 + browLift * 0.5);
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
    ctx.lineWidth = Math.max(2.0, r * 0.032);
    ctx.lineCap = 'round';
    ctx.stroke();

    // Anatomically Recessed Almond Eye Slits (Matte Dark Sclera + Sculpted Lid Rim — zero cartoon white circles!)
    const ew = r * 0.135;
    const eh = r * 0.048 * squintScale;
    if (isClosedEyes || squintScale < 0.25) {
      ctx.beginPath();
      ctx.moveTo(ex - ew, ey);
      ctx.quadraticCurveTo(ex, ey + r * 0.03, ex + ew, ey);
      ctx.strokeStyle = silverRim;
      ctx.lineWidth = Math.max(1.2, r * 0.02);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew, eh, s * -0.05, 0, Math.PI * 2);
      ctx.fillStyle = '#334155'; // Subdued anatomical slate, NOT flat white sticker!
      ctx.fill();
      ctx.clip();

      const gazeY = tech === 'lion_roar' || tech === 'mewing_chin_lift' ? -eh * 0.2 : 0;
      ctx.beginPath();
      ctx.arc(ex, ey + gazeY, r * 0.048, 0, Math.PI * 2);
      ctx.fillStyle = '#07090e';
      ctx.fill();

      // Razor thin studio specular glint on dark cornea
      ctx.beginPath();
      ctx.arc(ex - r * 0.015, ey + gazeY - r * 0.015, r * 0.011, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
      ctx.fill();
      ctx.restore();

      // Subtle muscular upper eyelid crease + orbicularis rim
      ctx.beginPath();
      ctx.ellipse(ex, ey, ew, eh, s * -0.05, Math.PI * 1.05, Math.PI * 1.95);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.lineWidth = Math.max(1.1, r * 0.018);
      ctx.stroke();
    }
  });

  // 7. STRONG CHISELED NASAL BRIDGE (Left Lit Facet + Right Chiaroscuro Shadow)
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.17);
  ctx.lineTo(r * 0.07, r * 0.19);
  ctx.lineTo(0, r * 0.24);
  ctx.lineTo(-r * 0.055, r * 0.20);
  ctx.closePath();
  const noseGrad = ctx.createLinearGradient(-r * 0.05, 0, r * 0.06, 0);
  noseGrad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
  noseGrad.addColorStop(0.55, 'rgba(30, 41, 59, 0.15)');
  noseGrad.addColorStop(1, 'rgba(5, 6, 8, 0.72)');
  ctx.fillStyle = noseGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-r * 0.01, -r * 0.16);
  ctx.lineTo(-r * 0.02, r * 0.19);
  ctx.quadraticCurveTo(-r * 0.055, r * 0.24, -r * 0.085, r * 0.19);
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.62)';
  ctx.lineWidth = Math.max(1.2, r * 0.018);
  ctx.lineCap = 'round';
  ctx.stroke();

  // 8. CHISELED MASCULINE MOUTH / DYNAMIC JAW EXPRESSION ("O", Roar+Tongue, Pout, Stern Jaw Line)
  const my = r * 0.46;
  if (tech === 'cheek_lift_o') {
    const oH = lerp(r * 0.072, r * 0.125, smoothWave);
    const oW = lerp(r * 0.078, r * 0.095, smoothWave);
    ctx.beginPath();
    ctx.ellipse(0, my, oW + r * 0.028, oH + r * 0.028, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.68)';
    ctx.lineWidth = outlineW;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, my, oW, oH, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#050608';
    ctx.fill();
  } else if (tech === 'lion_roar' || tech === 'sitali_tongue') {
    const roarAmt = 0.45 + 0.55 * smoothWave;
    const mW = tech === 'sitali_tongue' ? r * 0.12 : r * 0.18;
    const mH = tech === 'sitali_tongue' ? r * 0.08 : r * 0.12 * roarAmt;

    ctx.beginPath();
    ctx.ellipse(0, my, mW, mH, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#050608';
    ctx.fill();
    ctx.strokeStyle = 'rgba(234, 88, 52, 0.85)';
    ctx.lineWidth = Math.max(1.6, r * 0.025);
    ctx.stroke();

    const tLen = tech === 'sitali_tongue' ? r * 0.16 : r * (0.10 + 0.12 * smoothWave);
    ctx.beginPath();
    ctx.moveTo(-mW * 0.50, my + mH * 0.2);
    ctx.quadraticCurveTo(0, my + mH + tLen * 1.35, mW * 0.50, my + mH * 0.2);
    ctx.closePath();
    ctx.fillStyle = '#d9573b';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 224, 210, 0.65)';
    ctx.lineWidth = outlineW * 0.8;
    ctx.stroke();
  } else if (tech === 'fish_pout' || tech === 'kiss_ceiling') {
    const pScale = 0.85 + 0.20 * smoothWave;
    ctx.beginPath();
    ctx.ellipse(0, my - r * 0.02, r * 0.09 * pScale, r * 0.032, 0, 0, Math.PI * 2);
    ctx.ellipse(0, my + r * 0.02, r * 0.09 * pScale, r * 0.036, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.strokeStyle = silverRim;
    ctx.lineWidth = outlineW * 0.75;
    ctx.stroke();
  } else {
    // Sleek chiseled straight-set masculine lips & lower lip mentolabial shadow
    const mw = tech === 'smile_counter' ? r * 0.21 : r * 0.17;
    const curve = tech === 'smile_counter' ? r * (0.045 + 0.03 * smoothWave) : r * 0.022;
    ctx.beginPath();
    ctx.moveTo(-mw, my);
    ctx.quadraticCurveTo(0, my + curve, mw, my);
    ctx.strokeStyle = '#050608';
    ctx.lineWidth = Math.max(2.0, r * 0.034);
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-mw * 0.55, my + r * 0.045 + curve * 0.4);
    ctx.quadraticCurveTo(0, my + r * 0.065 + curve * 0.5, mw * 0.55, my + r * 0.045 + curve * 0.4);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = Math.max(1.2, r * 0.018);
    ctx.stroke();
  }

  // 9. MASCULINE 3D STRIATED HANDS & FOREARMS + BIOMECHANICAL VECTORS
  const slideOffset = lerp(-r * 0.08, r * 0.09, smoothWave);
  const liftOffset = lerp(0, -r * 0.075, smoothWave);

  if (tech === 'cheek_lift_o') {
    const gx = r * 0.38 + slideOffset * 0.35;
    const gy = r * 0.22 + liftOffset * 0.55;
    drawMasculineEcorcheHand(ctx, r, -gx, gy, -1, 'point', -0.15);
    drawMasculineEcorcheHand(ctx, r, gx, gy, 1, 'point', -0.15);
    drawBiomechanicalVector(ctx, -r * 0.26, r * 0.32, -r * 0.54, r * 0.10, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.26, r * 0.32, r * 0.54, r * 0.10, sweepProg);
  } else if (tech === 'smile_counter') {
    const gx = r * 0.29 + slideOffset * 0.22;
    const gy = r * 0.40 + liftOffset * 0.80;
    drawMasculineEcorcheHand(ctx, r, -gx, gy, -1, 'point', -1.25);
    drawMasculineEcorcheHand(ctx, r, gx, gy, 1, 'point', -1.25);
    drawBiomechanicalVector(ctx, -r * 0.25, r * 0.52, -r * 0.36, r * 0.28, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.25, r * 0.52, r * 0.36, r * 0.28, sweepProg);
  } else if (tech === 'forehead_smooth') {
    const fx = r * 0.14 + Math.abs(slideOffset) * 1.05;
    const fy = -r * 0.50;
    drawMasculineEcorcheHand(ctx, r, -fx, fy, -1, 'flat_palm', 0.04);
    drawMasculineEcorcheHand(ctx, r, fx, fy, 1, 'flat_palm', 0.04);
    drawBiomechanicalVector(ctx, -r * 0.08, -r * 0.52, -r * 0.56, -r * 0.48, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.08, -r * 0.52, r * 0.56, -r * 0.48, sweepProg);
  } else if (tech === 'eye_c_grip') {
    const ex = r * 0.34;
    const ey = -r * 0.08;
    drawMasculineEcorcheHand(ctx, r, -ex, ey, -1, 'c_grip', 0, smoothWave);
    drawMasculineEcorcheHand(ctx, r, ex, ey, 1, 'c_grip', 0, smoothWave);
    drawBiomechanicalVector(ctx, -r * 0.30, -r * 0.22, -r * 0.32, -r * 0.36, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.30, -r * 0.22, r * 0.32, -r * 0.36, sweepProg);
  } else if (tech === 'eye_tap') {
    const tapL = Math.sin(timeSec * 8) * r * 0.025;
    const tapR = Math.cos(timeSec * 8) * r * 0.025;
    drawMasculineEcorcheHand(ctx, r, -r * 0.33, r * 0.13 + (compact && !animate ? 0 : tapL), -1, 'two_finger', -0.65);
    drawMasculineEcorcheHand(ctx, r, r * 0.33, r * 0.13 + (compact && !animate ? 0 : tapR), 1, 'two_finger', -0.65);
    drawBiomechanicalVector(ctx, -r * 0.22, r * 0.07, -r * 0.52, r * 0.01, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.22, r * 0.07, r * 0.52, r * 0.01, sweepProg);
  } else if (tech === 'jawline_sweep') {
    const prog = compact && !animate ? 0.55 : smoothWave;
    const jx = lerp(r * 0.16, r * 0.56, prog);
    const jy = lerp(r * 0.78, r * 0.44, prog);
    drawMasculineEcorcheHand(ctx, r, -jx, jy, -1, 'two_finger', -0.65);
    drawMasculineEcorcheHand(ctx, r, jx, jy, 1, 'two_finger', -0.65);
    drawBiomechanicalVector(ctx, -r * 0.12, r * 0.82, -r * 0.60, r * 0.40, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.12, r * 0.82, r * 0.60, r * 0.40, sweepProg);
  } else if (tech === 'mewing_chin_lift' || tech === 'kiss_ceiling') {
    drawMasculineEcorcheHand(ctx, r, -r * 0.16, r * 0.84 + liftOffset * 0.45, -1, 'two_finger', -1.05);
    drawMasculineEcorcheHand(ctx, r, r * 0.16, r * 0.84 + liftOffset * 0.45, 1, 'two_finger', -1.05);
    drawBiomechanicalVector(ctx, 0, r * 1.02, 0, r * 0.70, sweepProg);
  } else if (tech === 'fish_pout') {
    drawMasculineEcorcheHand(ctx, r, -r * 0.48, r * 0.30 + slideOffset * 0.2, -1, 'point', -0.2);
    drawMasculineEcorcheHand(ctx, r, r * 0.48, r * 0.30 + slideOffset * 0.2, 1, 'point', -0.2);
    drawBiomechanicalVector(ctx, -r * 0.36, r * 0.38, -r * 0.14, r * 0.44, sweepProg);
    drawBiomechanicalVector(ctx, r * 0.36, r * 0.38, r * 0.14, r * 0.44, sweepProg);
  } else if (tech === 'temple_masseter_press') {
    const circX = Math.cos(timeSec * 3.5) * r * 0.04;
    const circY = Math.sin(timeSec * 3.5) * r * 0.04;
    const offX = compact && !animate ? 0 : circX;
    const offY = compact && !animate ? 0 : circY;
    drawMasculineEcorcheHand(ctx, r, -r * 0.58 + offX, -r * 0.05 + offY, -1, 'two_finger', -0.35);
    drawMasculineEcorcheHand(ctx, r, r * 0.58 - offX, -r * 0.05 + offY, 1, 'two_finger', -0.35);
  } else if (tech === 'bhramari_mudra') {
    drawMasculineEcorcheHand(ctx, r, -r * 0.55, -r * 0.05, -1, 'flat_palm', -0.22);
    drawMasculineEcorcheHand(ctx, r, r * 0.55, -r * 0.05, 1, 'flat_palm', -0.22);
  } else if (tech === 'tapotement_relax') {
    const pL = compact && !animate ? 0 : Math.sin(timeSec * 10) * r * 0.03;
    drawMasculineEcorcheHand(ctx, r, -r * 0.44, r * 0.26 + pL, -1, 'two_finger', -0.35);
    drawMasculineEcorcheHand(ctx, r, r * 0.44, r * 0.26 - pL, 1, 'two_finger', -0.35);
  }

  ctx.restore();

  if (tech === 'neck_lymph_drain') {
    const drainT = compact && !animate ? 0.55 : smoothWave;
    const ny = lerp(cy + r * 0.50, cy + r * 0.94, drainT);
    const nx = lerp(r * 0.40, r * 0.31, drainT);
    drawMasculineEcorcheHand(ctx, r, cx - nx, ny, -1, 'flat_palm', 0.55);
    drawMasculineEcorcheHand(ctx, r, cx + nx, ny, 1, 'flat_palm', 0.55);
    drawBiomechanicalVector(ctx, cx - r * 0.38, cy + r * 0.45, cx - r * 0.24, cy + r * 1.0, sweepProg);
    drawBiomechanicalVector(ctx, cx + r * 0.38, cy + r * 0.45, cx + r * 0.24, cy + r * 1.0, sweepProg);
  }
}
