import React from 'react';
import { HeroCharacter } from '../types/game';

interface LegoMinifigProps {
  hero: HeroCharacter;
  pose?: 'idle' | 'happy' | 'attack' | 'hurt';
  size?: number;
  heldWeaponId?: string;
  className?: string;
}

export const LegoWeaponIcon: React.FC<{
  weaponId: string;
  size?: number;
  locked?: boolean;
  className?: string;
}> = ({ weaponId, size = 40, locked = false, className = '' }) => {
  const opacity = locked ? 0.35 : 1;

  if (weaponId === 'grid-laser') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        className={className}
        style={{ opacity }}
        aria-hidden="true"
      >
        <rect x="6" y="18" width="24" height="12" rx="3" fill="#0055BF" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="10" y="13" width="8" height="5" rx="1" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
        <rect x="28" y="20" width="14" height="8" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="41" cy="24" r="3" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
        <rect x="12" y="30" width="7" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <rect x="10" y="21" width="12" height="3" rx="1" fill="#93C5FD" />
      </svg>
    );
  }

  if (weaponId === 'storm-axe') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        className={className}
        style={{ opacity }}
        aria-hidden="true"
      >
        <rect x="21" y="8" width="6" height="34" rx="2" fill="#78350F" stroke="#0F172A" strokeWidth="2.5" />
        <path
          d="M27 11 L41 8 C43 15 43 23 41 30 L27 25 Z"
          fill="#F59E0B"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M21 13 L10 11 C8 16 8 22 10 26 L21 23 Z"
          fill="#FDE047"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="20" y="6" width="8" height="4" rx="1" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
      </svg>
    );
  }

  if (weaponId === 'core-hammer') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        className={className}
        style={{ opacity }}
        aria-hidden="true"
      >
        <rect x="21" y="20" width="6" height="22" rx="2" fill="#475569" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="8" y="8" width="32" height="15" rx="3" fill="#D01012" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="13" y="4" width="7" height="4" rx="1" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
        <rect x="28" y="4" width="7" height="4" rx="1" fill="#FB923C" stroke="#0F172A" strokeWidth="2" />
        <rect x="14" y="13" width="20" height="5" rx="1" fill="#FDE047" />
      </svg>
    );
  }

  if (weaponId === 'solar-sabre') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        className={className}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path
          d="M22 6 L26 6 L28 28 L20 28 Z"
          fill="#4ADE80"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="23" y="9" width="2" height="16" fill="#ECFDF5" />
        <rect x="15" y="28" width="18" height="5" rx="2" fill="#F5CD2F" stroke="#0F172A" strokeWidth="2.5" />
        <rect x="20" y="33" width="8" height="10" rx="2" fill="#237841" stroke="#0F172A" strokeWidth="2.5" />
      </svg>
    );
  }

  if (weaponId === 'health-shield') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        className={className}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path
          d="M24 6 L40 12 L40 25 C40 34 32 40 24 43 C16 40 8 34 8 25 L8 12 Z"
          fill="#0D9488"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 11 L35 15 L35 25 C35 31 29.5 36 24 38.5 C18.5 36 13 31 13 25 L13 15 Z"
          fill="#5EEAD4"
          stroke="#0F172A"
          strokeWidth="2"
        />
        <rect x="21.5" y="17" width="5" height="15" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
        <rect x="16.5" y="22" width="15" height="5" rx="1" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path
        d="M16 8 C32 10 34 38 16 40"
        stroke="#7C3AED"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 8 C32 10 34 38 16 40"
        stroke="#0F172A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="16" y1="8" x2="16" y2="40" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="10" y1="24" x2="39" y2="24" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
      <polygon points="42,24 35,19 35,29" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
    </svg>
  );
};

export const LegoMinifig: React.FC<LegoMinifigProps> = ({
  hero,
  pose = 'idle',
  size = 120,
  heldWeaponId,
  className = '',
}) => {
  const isHappy = pose === 'happy';
  const isAttack = pose === 'attack';
  const isHurt = pose === 'hurt';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 130"
      fill="none"
      className={className}
      aria-label={`樂高人角色：${hero.name}`}
    >
      {/* Ground shadow */}
      <ellipse cx="60" cy="122" rx="30" ry="5" fill="#0F172A" fillOpacity="0.14" />

      {/* Left & Right Brick Legs */}
      <rect x="40" y="90" width="18" height="28" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <rect x="62" y="90" width="18" height="28" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <rect x="40" y="84" width="40" height="8" rx="2" fill="#334155" stroke="#0F172A" strokeWidth="3" />
      {/* Feet highlight */}
      <rect x="43" y="109" width="12" height="5" rx="1" fill="#475569" />
      <rect x="65" y="109" width="12" height="5" rx="1" fill="#475569" />

      {/* Torso */}
      <path
        d="M36 50 L84 50 L88 84 L32 84 Z"
        fill={hero.torsoColor}
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Torso badge/emblem */}
      <rect x="47" y="57" width="26" height="18" rx="3" fill={hero.accentColor} stroke="#0F172A" strokeWidth="2" />
      <circle cx="60" cy="66" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />

      {/* Left Arm */}
      <path
        d={isHappy || isAttack ? 'M35 53 L20 38 L26 33 L38 47' : 'M35 53 L23 72 L30 76 L39 60'}
        fill={hero.torsoColor}
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Left C-Hand */}
      <circle
        cx={isHappy || isAttack ? 21 : 25}
        cy={isHappy || isAttack ? 34 : 76}
        r="6"
        fill="#F5CD2F"
        stroke="#0F172A"
        strokeWidth="2.5"
      />

      {/* Right Arm */}
      <path
        d={isAttack ? 'M85 53 L103 44 L106 51 L86 60' : isHappy ? 'M85 53 L100 38 L94 33 L82 47' : 'M85 53 L97 72 L90 76 L81 60'}
        fill={hero.torsoColor}
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Right C-Hand */}
      <circle
        cx={isAttack ? 105 : isHappy ? 99 : 95}
        cy={isAttack ? 47 : isHappy ? 34 : 76}
        r="6"
        fill="#F5CD2F"
        stroke="#0F172A"
        strokeWidth="2.5"
      />

      {/* Held Weapon */}
      {heldWeaponId && (
        <g transform={isAttack ? 'translate(88, 18) rotate(12)' : 'translate(80, 42) rotate(-18)'}>
          <LegoWeaponIcon weaponId={heldWeaponId} size={36} />
        </g>
      )}

      {/* Neck */}
      <rect x="52" y="42" width="16" height="8" fill="#EAB308" stroke="#0F172A" strokeWidth="2.5" />

      {/* Classic Cylindrical LEGO Head */}
      <rect x="41" y="18" width="38" height="28" rx="9" fill="#F5CD2F" stroke="#0F172A" strokeWidth="3" />
      {/* Top Stud */}
      <rect x="51" y="11" width="18" height="7" rx="2" fill="#F5CD2F" stroke="#0F172A" strokeWidth="2.5" />

      {/* Helmet / Hat per Hero */}
      {hero.id === 'explorer' && (
        <g>
          <path d="M36 23 C36 11 84 11 84 23 Z" fill={hero.helmetColor} stroke="#0F172A" strokeWidth="3" />
          <rect x="33" y="21" width="54" height="5" rx="2.5" fill={hero.helmetColor} stroke="#0F172A" strokeWidth="2.5" />
          <rect x="53" y="13" width="14" height="6" rx="1.5" fill="#F5CD2F" stroke="#0F172A" strokeWidth="2" />
        </g>
      )}
      {hero.id === 'scholar' && (
        <g>
          <path d="M39 22 C40 12 80 12 81 22 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="40" y="18" width="40" height="5" rx="2" fill={hero.torsoColor} stroke="#0F172A" strokeWidth="2" />
          <circle cx="60" cy="14" r="5" fill="#F5CD2F" stroke="#0F172A" strokeWidth="2" />
        </g>
      )}
      {hero.id === 'ranger' && (
        <g>
          <path d="M37 23 C38 11 82 11 83 23 Z" fill={hero.helmetColor} stroke="#0F172A" strokeWidth="3" />
          <rect x="44" y="19" width="36" height="5" rx="2" fill="#4ADE80" stroke="#0F172A" strokeWidth="2" />
        </g>
      )}

      {/* Facial Expression */}
      {isHurt ? (
        <>
          <path d="M48 29 L54 34 M54 29 L48 34" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M66 29 L72 34 M72 29 L66 34" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M53 40 Q60 36 67 40" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <circle cx="51" cy="31" r="2.6" fill="#0F172A" />
          <circle cx="69" cy="31" r="2.6" fill="#0F172A" />
          <circle cx="52" cy="30" r="0.9" fill="#FFFFFF" />
          <circle cx="70" cy="30" r="0.9" fill="#FFFFFF" />
          {isHappy ? (
            <path d="M51 36 Q60 44 69 36 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          ) : (
            <path d="M52 37 Q60 42 68 37" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
        </>
      )}
    </svg>
  );
};

export const StageGuardianSvg: React.FC<{ stageId: number; hurt?: boolean; size?: number }> = ({
  stageId,
  hurt = false,
  size = 116,
}) => {
  const palette: Record<number, { body: string; accent: string; eye: string }> = {
    1: { body: '#3B82F6', accent: '#93C5FD', eye: '#FEF08A' },
    2: { body: '#64748B', accent: '#F59E0B', eye: '#FDE047' },
    3: { body: '#B91C1C', accent: '#FB923C', eye: '#FEF08A' },
    4: { body: '#4D7C0F', accent: '#BEF264', eye: '#FDE047' },
    5: { body: '#6D28D9', accent: '#FACC15', eye: '#FDE047' },
    6: { body: '#0D9488', accent: '#5EEAD4', eye: '#FEF08A' },
  };
  const c = palette[stageId] ?? palette[1];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={hurt ? 'animate-shake-hit' : 'animate-float-slow'}
      aria-hidden="true"
    >
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#0F172A" fillOpacity="0.16" />
      {/* Studs on top */}
      <rect x="36" y="14" width="14" height="7" rx="2" fill={c.accent} stroke="#0F172A" strokeWidth="2.5" />
      <rect x="70" y="14" width="14" height="7" rx="2" fill={c.accent} stroke="#0F172A" strokeWidth="2.5" />
      {/* Main Brick Golem Body */}
      <rect x="26" y="21" width="68" height="62" rx="8" fill={c.body} stroke="#0F172A" strokeWidth="3.5" />
      <rect x="34" y="29" width="52" height="24" rx="4" fill="#0F172A" />
      {/* Eyes */}
      <rect x="41" y="36" width="12" height="10" rx="2" fill={hurt ? '#EF4444' : c.eye} />
      <rect x="67" y="36" width="12" height="10" rx="2" fill={hurt ? '#EF4444' : c.eye} />
      {/* Chest Brick Studs */}
      <circle cx="44" cy="68" r="5" fill={c.accent} stroke="#0F172A" strokeWidth="2" />
      <circle cx="60" cy="68" r="5" fill={c.accent} stroke="#0F172A" strokeWidth="2" />
      <circle cx="76" cy="68" r="5" fill={c.accent} stroke="#0F172A" strokeWidth="2" />
      {/* Side Brick Arms */}
      <rect x="12" y="40" width="14" height="32" rx="4" fill={c.accent} stroke="#0F172A" strokeWidth="3" />
      <rect x="94" y="40" width="14" height="32" rx="4" fill={c.accent} stroke="#0F172A" strokeWidth="3" />
      {/* Feet */}
      <rect x="34" y="83" width="18" height="22" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
      <rect x="68" y="83" width="18" height="22" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
    </svg>
  );
};

export const BossDragonSvg: React.FC<{ hit?: boolean; defeated?: boolean; size?: number; className?: string }> = ({
  hit = false,
  defeated = false,
  size = 210,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 200"
      fill="none"
      className={`${hit ? 'animate-shake-hit' : defeated ? 'opacity-40 grayscale transition-all duration-500' : 'animate-float-slow'} ${className}`}
      aria-label="終極大怪獸：混沌污染魔龍"
    >
      <ellipse cx="110" cy="186" rx="68" ry="9" fill="#0F172A" fillOpacity="0.35" />

      {/* Jagged Brick Wings */}
      <path
        d="M58 84 L12 40 L20 76 L8 96 L48 112 Z"
        fill="#7C2D12"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M162 84 L208 40 L200 76 L212 96 L172 112 Z"
        fill="#7C2D12"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Brick Horns */}
      <polygon points="74,34 62,10 88,26" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
      <polygon points="146,34 158,10 132,26" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />

      {/* Main Armored Torso & Head */}
      <rect x="58" y="64" width="104" height="94" rx="10" fill={hit ? '#EF4444' : '#334155'} stroke="#0F172A" strokeWidth="4" />
      <rect x="66" y="26" width="88" height="52" rx="8" fill={hit ? '#F87171' : '#1E293B'} stroke="#0F172A" strokeWidth="4" />

      {/* LEGO Studs on Crown */}
      <rect x="82" y="18" width="14" height="8" rx="2" fill="#D01012" stroke="#0F172A" strokeWidth="2.5" />
      <rect x="103" y="18" width="14" height="8" rx="2" fill="#D01012" stroke="#0F172A" strokeWidth="2.5" />
      <rect x="124" y="18" width="14" height="8" rx="2" fill="#D01012" stroke="#0F172A" strokeWidth="2.5" />

      {/* Glowing Eyes */}
      <polygon points="78,42 100,48 80,56" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
      <polygon points="142,42 120,48 140,56" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />

      {/* Jagged Brick Teeth */}
      <rect x="80" y="62" width="60" height="12" rx="2" fill="#0F172A" />
      <polygon points="85,62 91,71 97,62" fill="#F8FAFC" />
      <polygon points="104,62 110,71 116,62" fill="#F8FAFC" />
      <polygon points="123,62 129,71 135,62" fill="#F8FAFC" />

      {/* Chaos Core */}
      <circle cx="110" cy="116" r="22" fill="#0F172A" stroke="#F59E0B" strokeWidth="3.5" />
      <circle cx="110" cy="116" r="12" fill="#F97316" />
      <circle cx="110" cy="116" r="5" fill="#FEF08A" />

      {/* Legs */}
      <rect x="64" y="154" width="28" height="24" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
      <rect x="128" y="154" width="28" height="24" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
    </svg>
  );
};
