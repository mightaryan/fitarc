import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Compass,
  Lightbulb,
  Zap,
  Activity,
  RotateCcw,
} from 'lucide-react';

export function JointAngleShearCanvas({ exercise }) {
  const canvasRef = useRef(null);

  // Identify biomechanic category
  const biomechanicConfig = useMemo(() => {
    const muscleCat = (exercise?.muscleCategory || exercise?.muscle || '').toLowerCase();
    const name = (exercise?.name || '').toLowerCase();

    if (
      muscleCat.includes('core') ||
      muscleCat.includes('abs') ||
      name.includes('crunch') ||
      name.includes('plank') ||
      name.includes('twist') ||
      name.includes('flutter') ||
      name.includes('leg raise')
    ) {
      return {
        type: 'core',
        title: 'LIVE THORACIC FLEXION & L4-S1 LUMBAR SHEAR SIMULATOR',
        defaultAngle: 30,
        minAngle: 15,
        maxAngle: 75,
        step: 5,
        hazardThreshold: 55,
        targetMuscle: 'Rectus Abdominis & Transverse',
        safeAngleLabel: '30° Core Flexion',
        hazardAngleLabel: '70° Lumbar Strain',
        safeAlert: 'Safe Alignment: Optimal 30° Thoracic Flexion · Zero L4-S1 disc shear · 95% rectus abdominis tension',
        hazardAlert: 'Hazard Alert: 70° Lumbar/Cervical Strain · Iliopsoas over-dominance · Lumbar disc compression increases 4.2x',
        clearanceMetric: 'Lumbar L4-S1 Clearance',
        safeClearance: '8.5 mm (Safe Neutral)',
        hazardClearance: '2.1 mm (Disc Compression)',
        sliderLabel: 'Interactive Spinal / Thoracic Flexion Angle:',
        safeSlider: '20° Controlled Flex (Safe)',
        hazardSlider: '70° Lumbar Shear (Hazard)',
      };
    }

    if (
      muscleCat.includes('leg') ||
      muscleCat.includes('quad') ||
      muscleCat.includes('glute') ||
      muscleCat.includes('calf') ||
      muscleCat.includes('hamstring') ||
      name.includes('squat') ||
      name.includes('lunge') ||
      name.includes('press') && muscleCat.includes('leg')
    ) {
      return {
        type: 'legs',
        title: 'LIVE PATELLOFEMORAL & KNEE VALGUS SHEAR SIMULATOR',
        defaultAngle: 90,
        minAngle: 60,
        maxAngle: 135,
        step: 5,
        hazardThreshold: 110,
        targetMuscle: 'Quadriceps & Gluteus Maximus',
        safeAngleLabel: '90° Parallel Track',
        hazardAngleLabel: '130° Valgus Collapse',
        safeAlert: 'Safe Alignment: 90° Knee Tracking Over 2nd Toe · Zero patellar shear · 94% quad & glute drive',
        hazardAlert: 'Hazard Alert: Inward Knee Valgus Shear · Lateral meniscus compression · Patellofemoral strain 84%',
        clearanceMetric: 'Patellofemoral Clearance',
        safeClearance: '7.2 mm (Safe Alignment)',
        hazardClearance: '1.8 mm (Valgus Pinching)',
        sliderLabel: 'Interactive Knee Joint / Valgus Angle:',
        safeSlider: '90° Parallel Track (Safe)',
        hazardSlider: '130° Valgus Shear (Hazard)',
      };
    }

    if (
      muscleCat.includes('back') ||
      muscleCat.includes('lat') ||
      muscleCat.includes('spine') ||
      name.includes('deadlift') ||
      name.includes('row') ||
      name.includes('hyperextension')
    ) {
      return {
        type: 'back',
        title: 'LIVE HIP HINGE & L5-S1 DISC COMPRESSION SIMULATOR',
        defaultAngle: 45,
        minAngle: 30,
        maxAngle: 90,
        step: 5,
        hazardThreshold: 65,
        targetMuscle: 'Latissimus Dorsi & Spinal Erectors',
        safeAngleLabel: '45° Neutral Rigid Hinge',
        hazardAngleLabel: '85° Spinal Kyphosis',
        safeAlert: 'Safe Alignment: 45° Neutral Spine Lock · Zero disc protrusion risk · 96% posterior chain recruitment',
        hazardAlert: 'Hazard Alert: Spinal Kyphosis Rounding · L5-S1 shear strain 89% · Dangerous spinal ligament stretch',
        clearanceMetric: 'Intervertebral Disc Space',
        safeClearance: '9.1 mm (Safe Neutral)',
        hazardClearance: '1.5 mm (Critical Herniation Risk)',
        sliderLabel: 'Interactive Hip Hinge / Lumbar Curvature:',
        safeSlider: '45° Rigid Lock (Safe)',
        hazardSlider: '85° Kyphotic Round (Hazard)',
      };
    }

    // Default: Chest & Shoulders / Pressing / Push
    return {
      type: 'chest',
      title: 'LIVE JOINT ANGLE & SUBACROMIAL SHEAR SIMULATOR',
      defaultAngle: 45,
      minAngle: 30,
      maxAngle: 90,
      step: 5,
      hazardThreshold: 65,
      targetMuscle: 'Pectoralis Major & Deltoids',
      safeAngleLabel: '45° Scapular Tuck',
      hazardAngleLabel: '90° Flared Shoulder Risk',
      safeAlert: 'Safe Alignment: Optimal 45° Scapular Plane · Zero joint impingement · 94% mechanical tension on target pectorals',
      hazardAlert: 'Hazard Alert: Dangerous 90° Joint Flare · Subacromial space compresses to 2.1mm · Supraspinatus tendon pinching',
      clearanceMetric: 'Subacromial Clearance',
      safeClearance: '6.4 mm (Safe)',
      hazardClearance: '2.1 mm (Pinching Hazard)',
      sliderLabel: 'Interactive Elbow / Joint Angle Slider:',
      safeSlider: '30° Tuck (Safe)',
      hazardSlider: '90° Flare (Hazard)',
    };
  }, [exercise]);

  const [jointAngle, setJointAngle] = useState(biomechanicConfig.defaultAngle);
  const timeRef = useRef(0);

  useEffect(() => {
    setJointAngle(biomechanicConfig.defaultAngle);
  }, [biomechanicConfig]);

  const isHazard = jointAngle > biomechanicConfig.hazardThreshold;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 720);
    const height = (canvas.height = 420);

    const render = () => {
      timeRef.current += 0.025;
      const t = timeRef.current;
      const cycle = (Math.sin(t) + 1) / 2;

      // Clear Canvas: Deep obsidian
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, width, height);

      // Tech Grid
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ========================================================
      // 1. RENDER BASED ON BIOMECHANIC TYPE
      // ========================================================
      if (biomechanicConfig.type === 'core') {
        // CORE / CRUNCH MODEL
        const floorY = height * 0.72;
        const pelvisX = width * 0.35;
        const pelvisY = floorY - 30;

        // Exercise Mat
        ctx.fillStyle = '#141824';
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(width * 0.1, floorY, width * 0.7, 18, 6);
        ctx.fill();
        ctx.stroke();

        // Pelvis Node
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(pelvisX, pelvisY, 22, 0, Math.PI * 2);
        ctx.fill();

        // Legs (Bent knees on floor)
        const kneeX = pelvisX + 110;
        const kneeY = floorY - 95;
        const footX = kneeX + 45;
        const footY = floorY;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pelvisX, pelvisY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        // Thoracic Flexion Arc (Calculated from jointAngle)
        const flexRatio = (jointAngle - 15) / 60; // 0 to 1
        const crunchStroke = Math.sin(t) * 15 * (1 - flexRatio * 0.4);

        // Shoulder / Upper Torso position
        const torsoLength = 110;
        const angleRad = (jointAngle * Math.PI) / 180;
        const shoulderX = pelvisX - Math.cos(angleRad) * torsoLength + crunchStroke * 0.5;
        const shoulderY = pelvisY - Math.sin(angleRad) * torsoLength - crunchStroke;

        // Head
        const headX = shoulderX - 25;
        const headY = shoulderY - 20;
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(headX, headY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Spine Curvature Vector
        ctx.strokeStyle = isHazard ? '#f43f5e' : '#94a3b8';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(pelvisX, pelvisY);
        if (isHazard) {
          // Dangerous hyperextension / sharp shear kink
          ctx.quadraticCurveTo(pelvisX - 20, pelvisY + 20, shoulderX, shoulderY);
        } else {
          // Safe anatomical C-curve
          ctx.quadraticCurveTo(pelvisX - 45, pelvisY - 40, shoulderX, shoulderY);
        }
        ctx.stroke();

        // Glowing Core Rectus Abdominis Muscle Band
        const coreGrad = ctx.createLinearGradient(pelvisX, pelvisY, shoulderX, shoulderY);
        coreGrad.addColorStop(0, '#f59e0b');
        coreGrad.addColorStop(0.5, isHazard ? '#ef4444' : '#fbbf24');
        coreGrad.addColorStop(1, '#d97706');

        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = 8;
        ctx.shadowColor = isHazard ? 'transparent' : 'rgba(251, 191, 36, 0.7)';
        ctx.shadowBlur = isHazard ? 0 : 20;
        ctx.beginPath();
        ctx.moveTo(pelvisX - 10, pelvisY - 15);
        ctx.lineTo(shoulderX + 5, shoulderY + 10);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Angle Arc
        ctx.strokeStyle = isHazard ? '#f43f5e' : '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(pelvisX, pelvisY, 45, Math.PI, Math.PI + angleRad, false);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = isHazard ? '#f43f5e' : '#10b981';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`${jointAngle}°`, pelvisX - 70, pelvisY - 30);
      } else if (biomechanicConfig.type === 'legs') {
        // LEGS / SQUAT KNEE VALGUS MODEL
        const hipX = width * 0.38;
        const hipY = height * 0.32;
        const footX = width * 0.38;
        const footY = height * 0.85;

        // Ground Floor
        ctx.fillStyle = '#141824';
        ctx.fillRect(width * 0.15, footY, width * 0.6, 12);

        // Pelvis
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(hipX, hipY, 24, 0, Math.PI * 2);
        ctx.fill();

        // Knee Position dynamically calculated from jointAngle
        // When jointAngle = 90° (optimal parallel track), knee aligns over foot
        // When jointAngle > 110° (valgus hazard), knee collapses inward!
        const valgusCollapse = Math.max(0, jointAngle - 90) * 1.6;
        const kneeX = hipX + 80 - valgusCollapse;
        const kneeY = (hipY + footY) * 0.52 + Math.sin(t) * 4;

        // Femur (Thigh bone)
        ctx.strokeStyle = isHazard ? '#f43f5e' : '#94a3b8';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        // Tibia (Shin bone)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        // Foot
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(footX - 15, footY - 8, 55, 16);

        // Quad Muscle Belly Glow
        const quadGrad = ctx.createLinearGradient(hipX, hipY, kneeX, kneeY);
        quadGrad.addColorStop(0, '#f59e0b');
        quadGrad.addColorStop(1, '#fbbf24');
        ctx.strokeStyle = isHazard ? '#64748b' : quadGrad;
        ctx.lineWidth = 8;
        ctx.shadowColor = isHazard ? 'transparent' : 'rgba(251, 191, 36, 0.6)';
        ctx.shadowBlur = isHazard ? 0 : 20;
        ctx.beginPath();
        ctx.moveTo(hipX + 5, hipY + 10);
        ctx.lineTo(kneeX - 5, kneeY - 10);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Knee Node
        ctx.fillStyle = isHazard ? '#ef4444' : '#10b981';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Valgus Warning Vector if hazard
        if (isHazard) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(kneeX, kneeY);
          ctx.lineTo(kneeX + 45, kneeY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('INWARD VALGUS SHEAR', kneeX + 50, kneeY + 4);
        }
      } else if (biomechanicConfig.type === 'back') {
        // BACK / HIP HINGE POSTURE MODEL
        const floorY = height * 0.85;
        const footX = width * 0.38;
        const hipX = width * 0.42;
        const hipY = height * 0.52;

        // Legs
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(footX, floorY);
        ctx.lineTo(hipX - 10, (floorY + hipY) * 0.5);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        // Spine Vector based on jointAngle
        const spineLength = 125;
        const angleRad = (jointAngle * Math.PI) / 180;
        const shoulderX = hipX - Math.cos(angleRad) * spineLength;
        const shoulderY = hipY - Math.sin(angleRad) * spineLength;

        // Spine Line
        ctx.strokeStyle = isHazard ? '#f43f5e' : '#10b981';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        if (isHazard) {
          // Kyphotic spinal curve (hunch)
          ctx.quadraticCurveTo(hipX - 45, hipY - 80, shoulderX, shoulderY);
        } else {
          // Neutral locked spine
          ctx.lineTo(shoulderX, shoulderY);
        }
        ctx.stroke();

        // Head
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(shoulderX - 15, shoulderY - 15, 18, 0, Math.PI * 2);
        ctx.fill();

        // Latissimus Dorsi Pull Vector
        ctx.strokeStyle = isHazard ? '#64748b' : '#fbbf24';
        ctx.lineWidth = 6;
        ctx.shadowColor = isHazard ? 'transparent' : 'rgba(251, 191, 36, 0.7)';
        ctx.shadowBlur = isHazard ? 0 : 20;
        ctx.beginPath();
        ctx.moveTo(shoulderX + 5, shoulderY + 5);
        ctx.lineTo(hipX - 5, hipY - 10);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // CHEST & PRESSING BENCH SCAPULAR TUCK MODEL
        const originX = width * 0.42;
        const originY = height * 0.52;

        // Bench representation
        ctx.fillStyle = '#141824';
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(originX - 160, originY + 30, 260, 28, 8);
        ctx.fill();
        ctx.stroke();

        // Bench leg
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(originX - 140, originY + 58, 14, 90);
        ctx.fillRect(originX + 60, originY + 58, 14, 90);

        // Head & Torso
        const headX = originX - 100;
        const headY = originY - 15;
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(headX, headY, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(originX - 40, originY + 10, 48, 70, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // Shoulder Joint
        const shoulderX = originX - 45;
        const shoulderY = originY - 20;

        // Hand trajectory
        const pressStroke = (1 - cycle) * 90;
        const handX = originX + 40 + pressStroke * 0.7;
        const handY = originY - 60 - pressStroke * 0.4;

        // Elbow position from jointAngle
        const flareRatio = (jointAngle - 30) / 60;
        const elbowBaseX = (shoulderX + handX) * 0.5;
        const elbowBaseY = (shoulderY + handY) * 0.5 + 25;
        const elbowFlaredY = elbowBaseY - 65 * flareRatio;
        const elbowFlaredX = elbowBaseX - 25 * flareRatio;
        const elbowX = elbowFlaredX + Math.sin(t) * 4;
        const elbowY = elbowFlaredY + Math.cos(t) * 4;

        // Arm bones
        ctx.strokeStyle = isHazard ? '#f43f5e' : '#94a3b8';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Weight
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(handX - 8, handY - 18, 16, 36);

        // Pectoral Muscle Glow
        const pecGrad = ctx.createRadialGradient(shoulderX + 15, shoulderY + 5, 2, shoulderX + 15, shoulderY + 5, 55);
        pecGrad.addColorStop(0, '#fbbf24');
        pecGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = pecGrad;
        ctx.shadowColor = isHazard ? 'transparent' : 'rgba(251, 191, 36, 0.6)';
        ctx.shadowBlur = isHazard ? 0 : 25;
        ctx.beginPath();
        ctx.arc(shoulderX + 20, shoulderY + 5, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ========================================================
      // 2. HUD TELEMETRY BOX (TOP RIGHT)
      // ========================================================
      const shearPercent = isHazard
        ? Math.min(96, 50 + (jointAngle - biomechanicConfig.hazardThreshold) * 1.8)
        : Math.max(10, 14 + (jointAngle - biomechanicConfig.minAngle) * 0.5);

      const targetTension = isHazard
        ? Math.max(26, 85 - (jointAngle - biomechanicConfig.hazardThreshold) * 2.2)
        : Math.min(97, 80 + (jointAngle - biomechanicConfig.minAngle) * 0.4);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
      ctx.strokeStyle = isHazard ? 'rgba(244, 63, 94, 0.6)' : 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width - 245, 20, 225, 115, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHazard ? '#fda4af' : '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(
        isHazard ? '⚠️ JOINT SHEAR: HAZARDOUS' : '✓ BIOMECHANICAL ALIGNMENT: OPTIMAL',
        width - 232,
        42
      );

      // Shear meter bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(width - 232, 52, 195, 8);
      ctx.fillStyle = isHazard ? '#f43f5e' : '#10b981';
      ctx.fillRect(width - 232, 52, (shearPercent / 100) * 195, 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`Joint Shear Strain: ${Math.round(shearPercent)}%`, width - 232, 75);
      ctx.fillText(
        `${biomechanicConfig.targetMuscle.slice(0, 16)} Tension: ${Math.round(targetTension)}%`,
        width - 232,
        92
      );
      ctx.fillText(
        `${biomechanicConfig.clearanceMetric.slice(0, 14)}: ${
          isHazard ? biomechanicConfig.hazardClearance : biomechanicConfig.safeClearance
        }`,
        width - 232,
        109
      );
    };

    let animationId;
    const loop = () => {
      render();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationId);
  }, [jointAngle, isHazard, biomechanicConfig]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            {biomechanicConfig.title}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight mt-0.5">
            Biomechanical Alignment & Joint Safety
          </h3>
        </div>

        {/* Quick Presets Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setJointAngle(biomechanicConfig.defaultAngle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              !isHazard
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{biomechanicConfig.safeAngleLabel}</span>
          </button>

          <button
            onClick={() => setJointAngle(biomechanicConfig.maxAngle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isHazard
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>{biomechanicConfig.hazardAngleLabel}</span>
          </button>
        </div>
      </div>

      {/* The Live Interactive Canvas Stage */}
      <div className="relative rounded-3xl bg-obsidian-950 border border-amber-500/25 overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-w-full rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          />

          {/* Floating Live Alert Badge */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div
              className={`p-3 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 flex items-center justify-between gap-3 ${
                isHazard
                  ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                  : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isHazard ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {isHazard ? `Hazard Alert: ${jointAngle}° Joint Shear` : `Safe Alignment: ${jointAngle}° Track`}
                  </span>
                  <span className="text-[11px] opacity-85 block">
                    {isHazard ? biomechanicConfig.hazardAlert : biomechanicConfig.safeAlert}
                  </span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 font-mono text-sm font-extrabold shrink-0 text-amber-300">
                {jointAngle}° Track
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Slider Bar */}
        <div className="p-4 sm:p-5 bg-obsidian-900/95 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              {biomechanicConfig.sliderLabel}
            </span>
            <span className="font-mono text-amber-300 font-bold text-sm">{jointAngle}°</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-400 font-mono font-semibold shrink-0">
              {biomechanicConfig.safeSlider}
            </span>
            <input
              type="range"
              min={biomechanicConfig.minAngle}
              max={biomechanicConfig.maxAngle}
              step={biomechanicConfig.step}
              value={jointAngle}
              onChange={(e) => setJointAngle(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-rose-400 font-mono font-semibold shrink-0">
              {biomechanicConfig.hazardSlider}
            </span>
          </div>
        </div>
      </div>

      {/* Common Pitfalls & Injury Hazards */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Common Form Pitfalls & Injury Hazards
          </h4>
          <div className="space-y-2">
            {(exercise?.commonMistakes || [
              'Using excessive momentum instead of controlled muscular contraction.',
              'Allowing the core or neutral spinal posture to collapse under fatigue.',
            ]).map((mistake, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs sm:text-sm"
              >
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{mistake}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        {exercise?.proTip && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                Elite Biomechanics Pro Tip
              </strong>
              <p className="text-xs sm:text-sm leading-relaxed">{exercise.proTip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
