import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles, Activity } from 'lucide-react';

export function MachineVisualPlayer({ exercise, isMini = false }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('Concentric (Push)');
  const [repCount, setRepCount] = useState(1);
  const animationFrameId = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = isMini ? 320 : 540);
    let height = (canvas.height = isMini ? 200 : 320);

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.025 * speed;
      }
      const t = timeRef.current;

      // Cycle between 0 and 1 using smooth sinusoidal curve
      const cycle = (Math.sin(t) + 1) / 2; // 0 is contracted/extended, 1 is relaxed/stretched
      
      // Update phase name
      if (Math.cos(t) > 0.4) {
        setCurrentPhase('Concentric (Effort)');
      } else if (Math.cos(t) < -0.4) {
        setCurrentPhase('Eccentric (Controlled Stretch)');
      } else {
        setCurrentPhase('Peak Contraction (1s Squeeze)');
      }

      // Clear with dark metallic obsidian background
      ctx.fillStyle = '#0d0f15';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines (gym lab aesthetic)
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw exercise specific kinematics
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // Glow helper
      const setGoldGlow = (blur = 18, color = 'rgba(245, 158, 11, 0.85)') => {
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
      };
      const clearGlow = () => {
        ctx.shadowBlur = 0;
      };

      // Depending on exercise animation type:
      if (exercise.animationType === 'chest_press' || exercise.animationType === 'pec_deck') {
        // Bench/Seat
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        // Seat base & angled back
        ctx.beginPath();
        ctx.moveTo(centerX - 80, centerY + 65);
        ctx.lineTo(centerX - 10, centerY + 65);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 60, centerY + 65);
        ctx.lineTo(centerX - 75, centerY - 50);
        ctx.stroke();

        // Machine weight stack
        ctx.fillStyle = '#1c2130';
        ctx.fillRect(centerX + 85, centerY - 65, 30, 110);
        // Plates
        ctx.strokeStyle = '#333c52';
        ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
          ctx.strokeRect(centerX + 85, centerY - 60 + i * 14, 30, 12);
        }
        // Moving selector pin plate in gold
        const plateY = centerY - 60 + Math.sin(t) * 8;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(centerX + 86, plateY, 28, 10);

        // Mannequin Torso
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY + 30);
        ctx.lineTo(centerX - 40, centerY - 20);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(centerX - 42, centerY - 40, 12, 0, Math.PI * 2);
        ctx.fill();

        // Active Chest Muscle (Glowing Gold)
        setGoldGlow(20, 'rgba(245, 158, 11, 0.9)');
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(centerX - 35, centerY - 15);
        ctx.lineTo(centerX - 15, centerY - 5);
        ctx.stroke();
        clearGlow();

        // Arm motion (Chest press push)
        const pushExt = (1 - cycle) * 55; // 0 to 55px push
        const shoulderX = centerX - 35;
        const shoulderY = centerY - 18;
        const handX = centerX + 10 + pushExt;
        const handY = centerY - 10;
        const elbowX = (shoulderX + handX) / 2 + (15 * cycle);
        const elbowY = (shoulderY + handY) / 2 + (20 * cycle);

        // Upper arm & forearm
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Machine handle & lever
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX + 70, centerY + 40);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Joint nodes
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(handX, handY, 5, 0, Math.PI * 2);
        ctx.fill();

      } else if (exercise.animationType === 'lat_pulldown') {
        // High Pulley overhead beam
        ctx.strokeStyle = '#333c52';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX - 80, centerY - 110);
        ctx.lineTo(centerX + 80, centerY - 110);
        ctx.stroke();

        // Seat & thigh pad
        ctx.fillStyle = '#1e2536';
        ctx.fillRect(centerX - 30, centerY + 50, 60, 12);
        ctx.fillRect(centerX - 20, centerY + 15, 40, 10); // thigh roller

        // Cable & moving bar
        const pullY = centerY - 90 + (1 - cycle) * 60; // bar pulls down to chest
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 110);
        ctx.lineTo(centerX, pullY);
        ctx.stroke();

        // Lat Pulldown Bar
        setGoldGlow(12, 'rgba(245, 158, 11, 0.6)');
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 65, pullY + 8);
        ctx.lineTo(centerX - 40, pullY);
        ctx.lineTo(centerX + 40, pullY);
        ctx.lineTo(centerX + 65, pullY + 8);
        ctx.stroke();
        clearGlow();

        // Athlete Torso (sitting with slight backward lean)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + 48);
        ctx.lineTo(centerX - 15, centerY - 10);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(centerX - 12, centerY - 30, 12, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Latissimus Dorsi Muscle on the back!
        setGoldGlow(22, '#f59e0b');
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX - 18, centerY - 12);
        ctx.lineTo(centerX - 24, centerY + 25);
        ctx.stroke();
        clearGlow();

        // Arms pulling bar
        const shoulderX = centerX - 12;
        const shoulderY = centerY - 12;
        const handLeftX = centerX - 45;
        const handLeftY = pullY;
        const elbowX = shoulderX - 25 * (1 - cycle);
        const elbowY = shoulderY + 25 * (1 - cycle);

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handLeftX, handLeftY);
        ctx.stroke();

      } else if (exercise.animationType === 'leg_press') {
        // Incline track 45 deg
        ctx.strokeStyle = '#2d3345';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX - 110, centerY + 80);
        ctx.lineTo(centerX + 100, centerY - 90);
        ctx.stroke();

        // Seat base & back
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(centerX - 90, centerY + 70);
        ctx.lineTo(centerX - 40, centerY + 65);
        ctx.lineTo(centerX - 75, centerY + 10);
        ctx.stroke();

        // Sled movement
        const sledTravel = (1 - cycle) * 65; // pushes up along track
        const sledX = centerX - 10 + sledTravel * 0.707;
        const sledY = centerY - 10 - sledTravel * 0.707;

        // Sled footplate & weight peg
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(sledX - 10, sledY - 20, 20, 45);
        setGoldGlow(12, 'rgba(245, 158, 11, 0.7)');
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(sledX + 5, sledY - 10, 25, 25);
        clearGlow();

        // Lifter Torso
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(centerX - 45, centerY + 60);
        ctx.lineTo(centerX - 70, centerY + 15);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(centerX - 80, centerY + 5, 12, 0, Math.PI * 2);
        ctx.fill();

        // Active Quadriceps (Thigh) - Glowing Gold!
        const hipX = centerX - 45;
        const hipY = centerY + 58;
        const footX = sledX;
        const footY = sledY;
        const kneeX = (hipX + footX) / 2 - 25 * cycle;
        const kneeY = (hipY + footY) / 2 - 35 * cycle;

        setGoldGlow(20, '#fbbf24');
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();
        clearGlow();

        // Lower leg (shins)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

      } else {
        // Universal Biomechanics Motion (Cardio, Rowing, Free Weights, Calisthenics)
        // Runner / Movement Mannequin
        const stride = Math.sin(t * 1.5);
        const leg1Angle = stride * 0.7;
        const leg2Angle = -stride * 0.7;

        // Ground / Treadmill belt
        ctx.strokeStyle = '#272d3f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 90, centerY + 70);
        ctx.lineTo(centerX + 90, centerY + 70);
        ctx.stroke();

        // Treadmill belt dashes moving
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        const beltOffset = (t * 40) % 30;
        for (let bx = centerX - 80 + beltOffset; bx < centerX + 80; bx += 30) {
          ctx.beginPath();
          ctx.moveTo(bx, centerY + 70);
          ctx.lineTo(bx + 12, centerY + 70);
          ctx.stroke();
        }

        // Torso
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + 5, centerY - 25);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 40, 11, 0, Math.PI * 2);
        ctx.fill();

        // Active Leg / Core Muscles (Golden Glow)
        setGoldGlow(16, '#f59e0b');
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + Math.sin(leg1Angle) * 35, centerY + 20 + Math.cos(leg1Angle) * 35);
        ctx.stroke();
        clearGlow();

        // Other leg
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX + Math.sin(leg2Angle) * 35, centerY + 20 + Math.cos(leg2Angle) * 35);
        ctx.stroke();

        // Pumping Arms
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY - 15);
        ctx.lineTo(centerX + 5 - Math.sin(leg1Angle) * 25, centerY - 5 + Math.cos(leg1Angle) * 15);
        ctx.stroke();
      }

      ctx.restore();

      // Draw On-Screen Form Tracking Telemetry
      if (!isMini) {
        // Top-left: Biomechanics state
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText('BIOMECHANICS HUD', 16, 24);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Outfit, sans-serif';
        ctx.fillText(`PHASE: ${currentPhase.toUpperCase()}`, 16, 40);

        // Top-right: Muscle activation
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px Outfit, sans-serif';
        const primaryTarget = exercise.primaryMuscles?.[0]?.name || 'Target Muscle';
        ctx.fillText(`PRIMARY: ${primaryTarget}`, width - 180, 24);

        // Tension bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(width - 180, 32, 160, 6);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(width - 180, 32, 160 * cycle, 6);
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPlaying, speed, exercise, isMini]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-[#090a0f] shadow-2xl group">
      {/* Visual Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto block"
        style={{ aspectRatio: isMini ? '16/10' : '16/9.5' }}
      />

      {/* Floating telemetry pills */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 backdrop-blur-md">
          <Activity className="w-3 h-3 text-amber-400 animate-pulse" />
          Kinematic Form Guide
        </span>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 border border-white/10 text-slate-300 backdrop-blur-md">
          {currentPhase}
        </span>
      </div>

      {/* Target muscles highlighted in gold */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {exercise.primaryMuscles?.slice(0, 2).map((m, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/75 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-sm"
            >
              ⚡ {m.name} ({m.percentage}%)
            </span>
          ))}
        </div>

        {/* Video Player Controls */}
        {!isMini && (
          <div className="flex items-center gap-1.5 pointer-events-auto bg-black/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/10 transition"
              title={isPlaying ? 'Pause Guide' : 'Play Guide'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                timeRef.current = 0;
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-white/10 transition"
              title="Restart rep cycle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 0.6 : 1))}
              className="px-2 py-1 rounded-md text-[10px] font-bold text-amber-400 hover:bg-white/10 transition"
            >
              {speed}x
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
