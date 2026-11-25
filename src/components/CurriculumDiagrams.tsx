import React from 'react';
import { VisualDiagramId } from '../types/game';

interface CurriculumDiagramProps {
  diagramId: VisualDiagramId;
  focus?: string;
}

export const CurriculumDiagram: React.FC<CurriculumDiagramProps> = ({ diagramId }) => {
  switch (diagramId) {
    case 'hk-grid-map':
      return (
        <svg viewBox="0 0 420 280" className="w-full h-auto max-h-[250px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="香港社區格網地圖">
          {/* Grid background */}
          <rect x="40" y="30" width="320" height="220" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          {/* Columns A B C D */}
          {['A', 'B', 'C', 'D'].map((col, idx) => (
            <g key={col}>
              <line x1={40 + idx * 80} y1="30" x2={40 + idx * 80} y2="250" stroke="#CBD5E1" strokeWidth="1.5" />
              <text x={80 + idx * 80} y="22" textAnchor="middle" className="text-[14px] font-bold fill-slate-800">{col}</text>
            </g>
          ))}
          {/* Rows 4 3 2 1 (matching 4A workbook p.2 style) */}
          {['4', '3', '2', '1'].map((row, idx) => (
            <g key={row}>
              <line x1="40" y1={30 + idx * 55} x2="360" y2={30 + idx * 55} stroke="#CBD5E1" strokeWidth="1.5" />
              <text x="24" y={62 + idx * 55} textAnchor="middle" className="text-[14px] font-bold fill-slate-800">{row}</text>
            </g>
          ))}
          {/* Compass North */}
          <g transform="translate(388, 56)">
            <text x="0" y="-20" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">北</text>
            <line x1="0" y1="-14" x2="0" y2="16" stroke="#0F172A" strokeWidth="2" />
            <polygon points="0,-16 -5,-7 5,-7" fill="#D01012" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#0F172A" strokeWidth="1.5" />
          </g>
          {/* Green Park & Roads */}
          <rect x="288" y="36" width="64" height="42" rx="6" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.5" />
          <text x="320" y="61" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">大會堂</text>

          <rect x="48" y="92" width="64" height="40" rx="6" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
          <text x="80" y="116" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">藝穗會</text>

          <rect x="128" y="200" width="64" height="42" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
          <text x="160" y="225" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">美新大廈</text>

          <rect x="288" y="146" width="64" height="40" rx="6" fill="#FECACA" stroke="#DC2626" strokeWidth="1.5" />
          <text x="320" y="170" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">郵局</text>

          {/* Legend Strip at bottom */}
          <g transform="translate(40, 258)">
            <rect x="0" y="0" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <text x="8" y="12" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">H</text>
            <text x="22" y="12" className="text-[11px] fill-slate-700">醫院</text>

            <rect x="70" y="0" width="16" height="16" rx="3" fill="#0F172A" />
            <text x="78" y="12" textAnchor="middle" className="text-[11px] font-bold fill-white">P</text>
            <text x="92" y="12" className="text-[11px] fill-slate-700">停車場</text>

            <circle cx="152" cy="8" r="8" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="145" y1="8" x2="159" y2="8" stroke="#0F172A" strokeWidth="1.5" />
            <text x="166" y="12" className="text-[11px] fill-slate-700">酒店</text>
          </g>
        </svg>
      );

    case 'hk-relief-map':
      return (
        <svg viewBox="0 0 420 260" className="w-full h-auto max-h-[250px] rounded-lg border border-slate-200 bg-sky-50" role="img" aria-label="香港新市鎮與地勢圖">
          {/* Simplified HK New Territories / Kowloon / HK Island / Lantau */}
          <path d="M70,70 Q150,35 260,40 L330,65 L310,120 L250,145 L180,150 L95,135 Z" fill="#D9F99D" stroke="#365314" strokeWidth="2" />
          {/* Kowloon */}
          <path d="M180,150 L235,146 L230,175 L185,172 Z" fill="#FEF08A" stroke="#713F12" strokeWidth="2" />
          {/* HK Island */}
          <path d="M185,192 Q225,186 260,198 Q250,220 205,218 Q182,212 185,192 Z" fill="#FED7AA" stroke="#7C2D12" strokeWidth="2" />
          {/* Lantau */}
          <path d="M55,178 Q105,155 145,178 Q135,212 80,218 Q50,205 55,178 Z" fill="#BBF7D0" stroke="#14532D" strokeWidth="2" />

          {/* Markers A=Tuen Mun, B=Tai Po, C=Sha Tin, D=Tung Chung */}
          {[
            { label: 'A', x: 108, y: 112, note: '新界西' },
            { label: 'B', x: 245, y: 78, note: '新界東北' },
            { label: 'C', x: 235, y: 122, note: '新界東' },
            { label: 'D', x: 96, y: 174, note: '大嶼山北' },
          ].map((m) => (
            <g key={m.label}>
              <circle cx={m.x} cy={m.y} r="13" fill="#D01012" stroke="#FFFFFF" strokeWidth="2" />
              <text x={m.x} y={m.y + 4.5} textAnchor="middle" className="text-[13px] font-bold fill-white">{m.label}</text>
            </g>
          ))}
          <text x="210" y="245" textAnchor="middle" className="text-[12px] font-semibold fill-slate-700">大嶼山 · 九龍 · 香港島 · 新界（北 ↑）</text>
        </svg>
      );

    case 'weather-warnings':
      return (
        <svg viewBox="0 0 420 220" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="香港天文台天氣警告圖示">
          {/* 1. No 8 NW */}
          <g transform="translate(20, 24)">
            <rect width="86" height="145" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="43" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-600">(1)</text>
            <polygon points="43,48 31,64 55,64" fill="#0F172A" />
            <text x="43" y="96" textAnchor="middle" className="text-[24px] font-black fill-slate-900">8</text>
            <text x="43" y="122" textAnchor="middle" className="text-[13px] font-bold fill-slate-800">NW 西北</text>
          </g>
          {/* 2. Red Fire Danger */}
          <g transform="translate(118, 24)">
            <rect width="86" height="145" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="43" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-600">(2)</text>
            <path d="M43 44 C56 62 58 84 43 96 C28 84 30 62 43 44 Z" fill="#DC2626" />
            <path d="M43 64 C49 74 49 84 43 91 C37 84 37 74 43 64 Z" fill="#FDE047" />
            <text x="43" y="124" textAnchor="middle" className="text-[16px] font-black fill-red-700">紅 Red</text>
          </g>
          {/* 3. Red Rainstorm */}
          <g transform="translate(216, 24)">
            <rect width="86" height="145" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="43" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-600">(3)</text>
            <path d="M26 76 C22 76 20 66 28 64 C30 53 46 51 52 60 C62 59 68 74 58 76 Z" fill="#334155" />
            {[32, 43, 54].map((rx) => (
              <line key={rx} x1={rx} y1="84" x2={rx - 4} y2="96" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            ))}
            <text x="43" y="124" textAnchor="middle" className="text-[16px] font-black fill-red-700">紅 Red</text>
          </g>
          {/* 4. Flooding in Northern NT */}
          <g transform="translate(314, 24)">
            <rect width="86" height="145" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="43" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-600">(4)</text>
            <polygon points="43,48 24,66 62,66" fill="#1D4ED8" />
            <rect x="30" y="66" width="26" height="20" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
            <text x="43" y="81" textAnchor="middle" className="text-[14px] font-black fill-blue-900">北</text>
            <path d="M22 94 Q32 88 43 94 T64 94" stroke="#2563EB" strokeWidth="3" fill="none" />
            <path d="M22 104 Q32 98 43 104 T64 104" stroke="#2563EB" strokeWidth="3" fill="none" />
          </g>
          <text x="210" y="198" textAnchor="middle" className="text-[12px] font-semibold fill-slate-600">香港天文台常見天氣警告圖示</text>
        </svg>
      );

    case 'weather-season-table':
      return (
        <svg viewBox="0 0 420 220" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="香港四季天氣數據統計表">
          <rect x="14" y="14" width="392" height="34" rx="6" fill="#0F172A" />
          <text x="210" y="36" textAnchor="middle" className="text-[13px] font-bold fill-white">香港四季平均氣象數據比較表</text>
          {/* Header Row */}
          <rect x="14" y="54" width="392" height="28" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <text x="58" y="73" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">季節</text>
          <text x="150" y="73" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">平均氣溫</text>
          <text x="254" y="73" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">相對濕度</text>
          <text x="356" y="73" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">平均雨量</text>
          {[
            { s: '春季 (3-5月)', t: '23°C', h: '80%', r: '120 mm', bg: '#F0FDF4' },
            { s: '夏季 (6-8月)', t: '32°C', h: '78%', r: '400 mm', bg: '#FEF2F2' },
            { s: '秋季 (9-11月)', t: '23°C', h: '72%', r: '75 mm', bg: '#FFFBEB' },
            { s: '冬季 (12-2月)', t: '15°C', h: '70%', r: '45 mm', bg: '#EFF6FF' },
          ].map((row, idx) => {
            const y = 82 + idx * 31;
            return (
              <g key={row.s}>
                <rect x="14" y={y} width="392" height="31" fill={row.bg} stroke="#CBD5E1" strokeWidth="1" />
                <text x="58" y={y + 20} textAnchor="middle" className="text-[11px] font-bold fill-slate-900">{row.s}</text>
                <text x="150" y={y + 20} textAnchor="middle" className="text-[12px] font-bold fill-slate-800">{row.t}</text>
                <text x="254" y={y + 20} textAnchor="middle" className="text-[12px] font-bold fill-slate-800">{row.h}</text>
                <text x="356" y={y + 20} textAnchor="middle" className="text-[12px] font-bold fill-slate-800">{row.r}</text>
              </g>
            );
          })}
        </svg>
      );

    case 'world-continents':
      return (
        <svg viewBox="0 0 420 240" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-sky-100" role="img" aria-label="世界七大洲與四大洋地圖">
          {/* North America */}
          <path d="M40,42 L115,36 L128,74 L94,108 L64,96 Z" fill="#86EFAC" stroke="#14532D" strokeWidth="1.5" />
          {/* South America */}
          <path d="M98,116 L136,124 L120,192 L96,174 Z" fill="#86EFAC" stroke="#14532D" strokeWidth="1.5" />
          {/* Europe */}
          <path d="M188,36 L236,36 L232,68 L186,66 Z" fill="#FDE047" stroke="#713F12" strokeWidth="1.5" />
          {/* Africa */}
          <path d="M184,78 L236,80 L248,124 L214,174 L182,126 Z" fill="#FDBA74" stroke="#7C2D12" strokeWidth="1.5" />
          {/* Asia */}
          <path d="M236,34 L362,40 L356,112 L292,120 L244,96 Z" fill="#FCA5A5" stroke="#7F1D1D" strokeWidth="1.5" />
          {/* Oceania */}
          <path d="M312,142 L362,144 L356,184 L314,180 Z" fill="#C4B5FD" stroke="#4C1D95" strokeWidth="1.5" />
          {/* Antarctica */}
          <path d="M50,214 L370,214 L360,232 L60,232 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />

          {/* Markers */}
          {[
            { l: 'A', x: 86, y: 72 },
            { l: 'B', x: 156, y: 108 },
            { l: 'C', x: 274, y: 152 },
            { l: 'D', x: 300, y: 76 },
            { l: 'E', x: 338, y: 164 },
          ].map((m) => (
            <g key={m.l}>
              <circle cx={m.x} cy={m.y} r="13" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
              <text x={m.x} y={m.y + 4.5} textAnchor="middle" className="text-[13px] font-bold fill-white">{m.l}</text>
            </g>
          ))}
        </svg>
      );

    case 'traditional-dwellings':
      return (
        <svg viewBox="0 0 420 220" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="中國與世界特色房屋">
          {/* A: Stilt House */}
          <g transform="translate(14, 24)">
            <rect width="90" height="164" rx="8" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
            <text x="45" y="22" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">A. 吊腳樓</text>
            <polygon points="45,42 16,68 74,68" fill="#92400E" stroke="#0F172A" strokeWidth="2" />
            <rect x="22" y="68" width="46" height="34" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
            <line x1="28" y1="102" x2="28" y2="132" stroke="#78350F" strokeWidth="4" />
            <line x1="62" y1="102" x2="62" y2="132" stroke="#78350F" strokeWidth="4" />
            <path d="M12 134 Q30 128 46 134 T78 134" stroke="#0284C7" strokeWidth="2.5" fill="none" />
          </g>
          {/* B: Fujian Tulou */}
          <g transform="translate(114, 24)">
            <rect width="90" height="164" rx="8" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
            <text x="45" y="22" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">B. 土樓</text>
            <ellipse cx="45" cy="76" rx="32" ry="16" fill="#78350F" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="45" cy="76" rx="16" ry="8" fill="#FEF3C7" stroke="#0F172A" strokeWidth="1.5" />
            <path d="M13 76 L13 118 A32 16 0 0 0 77 118 L77 76" fill="#D97706" stroke="#0F172A" strokeWidth="2" />
            <rect x="40" y="110" width="10" height="16" fill="#451A03" />
          </g>
          {/* C: Siheyuan */}
          <g transform="translate(214, 24)">
            <rect width="90" height="164" rx="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
            <text x="45" y="22" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">C. 四合院</text>
            <rect x="18" y="54" width="54" height="18" fill="#DC2626" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="16" y="74" width="16" height="44" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="58" y="74" width="16" height="44" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="20" y="116" width="50" height="14" fill="#475569" stroke="#0F172A" strokeWidth="1.5" />
          </g>
          {/* D: Yurt */}
          <g transform="translate(314, 24)">
            <rect width="90" height="164" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="45" y="22" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">D. 蒙古包</text>
            <path d="M18 92 C22 60 68 60 72 92 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <rect x="18" y="92" width="54" height="34" fill="#F1F5F9" stroke="#0F172A" strokeWidth="2" />
            <rect x="38" y="102" width="14" height="24" fill="#B45309" stroke="#0F172A" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'earth-layers':
      return (
        <svg viewBox="0 0 380 230" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-slate-900" role="img" aria-label="地球內部結構剖面圖">
          <circle cx="170" cy="115" r="95" fill="#92400E" stroke="#F8FAFC" strokeWidth="3" />
          <circle cx="170" cy="115" r="76" fill="#EA580C" />
          <circle cx="170" cy="115" r="34" fill="#FACC15" stroke="#FEF08A" strokeWidth="3" />
          <line x1="255" y1="70" x2="310" y2="54" stroke="#FFFFFF" strokeWidth="2" />
          <text x="318" y="59" className="text-[14px] font-bold fill-white">A（最外層）</text>
          <line x1="226" y1="115" x2="310" y2="115" stroke="#FFFFFF" strokeWidth="2" />
          <text x="318" y="120" className="text-[14px] font-bold fill-orange-300">B（中間層）</text>
          <line x1="190" y1="138" x2="310" y2="174" stroke="#FFFFFF" strokeWidth="2" />
          <text x="318" y="179" className="text-[14px] font-bold fill-yellow-300">C（最中心）</text>
        </svg>
      );

    case 'earthquake-safety':
      return (
        <svg viewBox="0 0 420 210" className="w-full h-auto max-h-[230px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="地震時室內應對行為四選圖">
          {[
            { id: 'A', title: '躲在堅固桌下', sub: '雙手護頭頸', bg: '#F0FDF4', border: '#86EFAC', icon: 'desk' },
            { id: 'B', title: '靠在玻璃窗旁', sub: '探頭向外張望', bg: '#FEF2F2', border: '#FCA5A5', icon: 'window' },
            { id: 'C', title: '乘搭升降機', sub: '快速下樓逃生', bg: '#FEF2F2', border: '#FCA5A5', icon: 'lift' },
            { id: 'D', title: '慌張衝向窄門', sub: '爭先推撞出口', bg: '#FEF2F2', border: '#FCA5A5', icon: 'door' },
          ].map((item, idx) => {
            const x = 12 + idx * 100;
            return (
              <g key={item.id} transform={`translate(${x}, 18)`}>
                <rect width="94" height="172" rx="8" fill={item.bg} stroke={item.border} strokeWidth="1.5" />
                <circle cx="47" cy="24" r="12" fill="#0F172A" />
                <text x="47" y="28" textAnchor="middle" className="text-[13px] font-bold fill-white">{item.id}</text>
                {item.icon === 'desk' && (
                  <g>
                    <rect x="16" y="64" width="62" height="8" rx="2" fill="#92400E" />
                    <line x1="22" y1="72" x2="22" y2="112" stroke="#78350F" strokeWidth="4" />
                    <line x1="72" y1="72" x2="72" y2="112" stroke="#78350F" strokeWidth="4" />
                    <circle cx="47" cy="90" r="8" fill="#F5CD2F" stroke="#0F172A" strokeWidth="1.5" />
                    <path d="M36 108 Q47 96 58 108" stroke="#0055BF" strokeWidth="6" strokeLinecap="round" fill="none" />
                  </g>
                )}
                {item.icon === 'window' && (
                  <g>
                    <rect x="22" y="50" width="50" height="54" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
                    <line x1="47" y1="50" x2="47" y2="104" stroke="#0284C7" strokeWidth="2" />
                    <line x1="22" y1="77" x2="72" y2="77" stroke="#0284C7" strokeWidth="2" />
                    <path d="M34 62 L58 92" stroke="#EF4444" strokeWidth="2.5" />
                  </g>
                )}
                {item.icon === 'lift' && (
                  <g>
                    <rect x="24" y="52" width="46" height="58" rx="3" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
                    <line x1="47" y1="52" x2="47" y2="110" stroke="#475569" strokeWidth="2" />
                    <polygon points="39,46 44,40 49,46" fill="#D01012" />
                    <polygon points="50,40 55,46 60,40" fill="#D01012" />
                  </g>
                )}
                {item.icon === 'door' && (
                  <g>
                    <rect x="28" y="52" width="38" height="58" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
                    <circle cx="58" cy="82" r="3" fill="#78350F" />
                    <path d="M18 96 L42 96" stroke="#D01012" strokeWidth="3" />
                    <polygon points="44,96 36,91 36,101" fill="#D01012" />
                  </g>
                )}
                <text x="47" y="136" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">{item.title}</text>
                <text x="47" y="154" textAnchor="middle" className="text-[10px] font-medium fill-slate-600">{item.sub}</text>
              </g>
            );
          })}
        </svg>
      );

    case 'water-habits':
      return (
        <svg viewBox="0 0 420 200" className="w-full h-auto max-h-[220px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="日常用水習慣情景圖">
          <g transform="translate(16, 20)">
            <rect width="120" height="160" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">圖 1 · 刷牙</text>
            <rect x="44" y="48" width="32" height="12" rx="3" fill="#64748B" />
            <path d="M58 60 L58 118 M62 60 L62 118" stroke="#38BDF8" strokeWidth="4" />
            <text x="60" y="142" textAnchor="middle" className="text-[11px] font-medium fill-red-700">一直長開水龍頭</text>
          </g>
          <g transform="translate(150, 20)">
            <rect width="120" height="160" rx="8" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">圖 2 · 淋浴</text>
            <circle cx="60" cy="54" r="14" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
            <line x1="52" y1="74" x2="48" y2="96" stroke="#0EA5E9" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="60" y1="74" x2="60" y2="96" stroke="#0EA5E9" strokeWidth="2.5" strokeDasharray="4 4" />
            <line x1="68" y1="74" x2="72" y2="96" stroke="#0EA5E9" strokeWidth="2.5" strokeDasharray="4 4" />
            <text x="60" y="142" textAnchor="middle" className="text-[11px] font-medium fill-emerald-700">淋浴代替浸浴</text>
          </g>
          <g transform="translate(284, 20)">
            <rect width="120" height="160" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">圖 3 · 洗車</text>
            <rect x="26" y="74" width="68" height="28" rx="6" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
            <circle cx="40" cy="104" r="8" fill="#1E293B" />
            <circle cx="80" cy="104" r="8" fill="#1E293B" />
            <path d="M14 54 Q40 48 64 72" stroke="#0284C7" strokeWidth="4" fill="none" />
            <text x="60" y="142" textAnchor="middle" className="text-[11px] font-medium fill-red-700">水管直噴不停沖洗</text>
          </g>
        </svg>
      );

    case 'hk-water-bill':
      return (
        <svg viewBox="0 0 420 220" className="w-full h-auto max-h-[240px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="香港水務署住宅雙月分級水費單圖示">
          <rect x="16" y="14" width="388" height="32" rx="6" fill="#0055BF" />
          <text x="210" y="35" textAnchor="middle" className="text-[13px] font-bold fill-white">水務署 · 住宅雙月分級水費及排污費計算表</text>
          {[
            { tier: '第一級（首 12 立方米）', rate: '免費 ($0)', color: '#DCFCE7', text: '#166534' },
            { tier: '第二級（其後 31 立方米）', rate: '每立方米 $4.16', color: '#EFF6FF', text: '#1E40AF' },
            { tier: '第三級（其後 19 立方米）', rate: '每立方米 $6.45', color: '#FEF9C3', text: '#854D0E' },
            { tier: '第四級（超出 62 立方米部分）', rate: '每立方米 $9.05', color: '#FEE2E2', text: '#991B1B' },
          ].map((r, i) => {
            const y = 54 + i * 32;
            return (
              <g key={r.tier}>
                <rect x="16" y={y} width="388" height="28" rx="4" fill={r.color} stroke="#CBD5E1" strokeWidth="1" />
                <text x="28" y={y + 19} className="text-[12px] font-bold fill-slate-900">{r.tier}</text>
                <text x="392" y={y + 19} textAnchor="end" className="text-[12px] font-black" fill={r.text}>{r.rate}</text>
              </g>
            );
          })}
          <rect x="16" y="184" width="388" height="24" rx="4" fill="#F1F5F9" />
          <text x="210" y="200" textAnchor="middle" className="text-[11px] font-bold fill-slate-700">
            水費單同時按用水量徵收「排污費」 · 用水越多每級收費越貴！
          </text>
        </svg>
      );

    case 'chinese-calligraphy':
      return (
        <svg viewBox="0 0 420 180" className="w-full h-auto max-h-[210px] rounded-lg border border-slate-200 bg-amber-50" role="img" aria-label="漢字「馬」的三種書體">
          <g transform="translate(20, 22)">
            <rect width="116" height="136" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <text x="58" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-700">A</text>
            {/* Pictographic Horse */}
            <path d="M36,52 L74,52 M40,52 L40,94 M40,68 L72,68 M40,82 L76,82 M72,68 L76,104 C76,112 68,112 64,108 M36,108 L38,116 M48,108 L50,116 M60,108 L62,116" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
          <g transform="translate(152, 22)">
            <rect width="116" height="136" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <text x="58" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-700">B</text>
            <text x="58" y="102" textAnchor="middle" className="text-[64px] font-serif font-black fill-slate-900" style={{ transform: 'scaleX(1.18)', transformOrigin: '58px 80px' }}>馬</text>
          </g>
          <g transform="translate(284, 22)">
            <rect width="116" height="136" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <text x="58" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-700">C</text>
            <text x="58" y="104" textAnchor="middle" className="text-[64px] font-sans font-bold fill-slate-900">馬</text>
          </g>
        </svg>
      );

    case 'chinese-instruments':
      return (
        <svg viewBox="0 0 420 190" className="w-full h-auto max-h-[210px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="中外樂器對比圖">
          {/* A: Guzheng */}
          <g transform="translate(16, 20)">
            <rect width="120" height="150" rx="8" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">A. 古箏</text>
            <polygon points="20,76 102,68 102,90 20,94" fill="#92400E" stroke="#0F172A" strokeWidth="2" />
            <line x1="30" y1="94" x2="26" y2="120" stroke="#78350F" strokeWidth="4" />
            <line x1="90" y1="90" x2="94" y2="120" stroke="#78350F" strokeWidth="4" />
            <line x1="24" y1="78" x2="98" y2="73" stroke="#FEF08A" strokeWidth="1.5" />
            <line x1="24" y1="84" x2="98" y2="80" stroke="#FEF08A" strokeWidth="1.5" />
          </g>
          {/* B: Flute */}
          <g transform="translate(150, 20)">
            <rect width="120" height="150" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">B. 長笛</text>
            <line x1="22" y1="108" x2="98" y2="54" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="52" cy="87" r="3" fill="#0F172A" />
            <circle cx="66" cy="77" r="3" fill="#0F172A" />
            <circle cx="80" cy="67" r="3" fill="#0F172A" />
          </g>
          {/* C: Violin */}
          <g transform="translate(284, 20)">
            <rect width="120" height="150" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[13px] font-bold fill-slate-900">C. 小提琴</text>
            <ellipse cx="60" cy="96" rx="18" ry="26" fill="#B45309" stroke="#0F172A" strokeWidth="2" />
            <rect x="57" y="42" width="6" height="34" fill="#451A03" />
          </g>
        </svg>
      );

    case 'hk-heritage':
      return (
        <svg viewBox="0 0 420 190" className="w-full h-auto max-h-[210px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="香港歷史建築保育圖">
          <g transform="translate(16, 20)">
            <rect width="120" height="150" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">(1) 赤柱美利樓</text>
            <rect x="24" y="48" width="72" height="66" fill="#E2E8F0" stroke="#334155" strokeWidth="2" />
            {[36, 52, 68, 84].map((cx) => (
              <line key={cx} x1={cx} y1="48" x2={cx} y2="114" stroke="#475569" strokeWidth="3" />
            ))}
            <text x="60" y="136" textAnchor="middle" className="text-[10px] fill-slate-600">原位於中環 · 維多利亞式</text>
          </g>
          <g transform="translate(150, 20)">
            <rect width="120" height="150" rx="8" fill="#FEFCE8" stroke="#FDE047" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">(2) 深水埗雷生春</text>
            <rect x="30" y="46" width="60" height="68" rx="6" fill="#FEF9C3" stroke="#854D0E" strokeWidth="2" />
            <line x1="30" y1="68" x2="90" y2="68" stroke="#854D0E" strokeWidth="2" />
            <line x1="30" y1="90" x2="90" y2="90" stroke="#854D0E" strokeWidth="2" />
            <text x="60" y="136" textAnchor="middle" className="text-[10px] fill-slate-600">現為中醫藥保健中心</text>
          </g>
          <g transform="translate(284, 20)">
            <rect width="120" height="150" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="60" y="24" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">(3) 銅鑼灣天后廟</text>
            <path d="M22,74 Q60,54 98,74 L92,84 L28,84 Z" fill="#166534" stroke="#0F172A" strokeWidth="2" />
            <rect x="30" y="84" width="60" height="32" fill="#DC2626" stroke="#0F172A" strokeWidth="2" />
            <text x="60" y="136" textAnchor="middle" className="text-[10px] fill-slate-600">保持原有宗教建築風貌</text>
          </g>
        </svg>
      );

    case 'world-landmarks':
    default:
      return (
        <svg viewBox="0 0 420 200" className="w-full h-auto max-h-[220px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="世界宗教建築與著名景點">
          {/* A: Mosque */}
          <g transform="translate(14, 20)">
            <rect width="116" height="160" rx="8" fill="#F0FDFA" stroke="#5EEAD4" strokeWidth="1.5" />
            <text x="58" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">A. 圓頂宣禮塔</text>
            <path d="M34 90 C34 62 82 62 82 90 Z" fill="#0F766E" stroke="#0F172A" strokeWidth="2" />
            <rect x="28" y="90" width="60" height="36" fill="#CCFBF1" stroke="#0F172A" strokeWidth="2" />
            <rect x="18" y="54" width="8" height="72" fill="#99F6E4" stroke="#0F172A" strokeWidth="1.5" />
            <rect x="90" y="54" width="8" height="72" fill="#99F6E4" stroke="#0F172A" strokeWidth="1.5" />
          </g>
          {/* B: Church */}
          <g transform="translate(144, 20)">
            <rect width="116" height="160" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="58" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">B. 尖塔十字架</text>
            <polygon points="58,42 42,78 74,78" fill="#1D4ED8" stroke="#0F172A" strokeWidth="2" />
            <line x1="58" y1="30" x2="58" y2="44" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="52" y1="36" x2="64" y2="36" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="34" y="78" width="48" height="48" fill="#DBEAFE" stroke="#0F172A" strokeWidth="2" />
          </g>
          {/* Landmarks Trio */}
          <g transform="translate(274, 20)">
            <rect width="132" height="160" rx="8" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.5" />
            <text x="66" y="22" textAnchor="middle" className="text-[12px] font-bold fill-slate-900">世界三大景點</text>
            {/* Fuji */}
            <polygon points="32,76 12,110 52,110" fill="#2563EB" />
            <polygon points="32,76 24,90 40,90" fill="#FFFFFF" />
            <text x="32" y="126" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">富士山</text>
            {/* Eiffel */}
            <polygon points="72,56 60,110 84,110" fill="#78350F" />
            <text x="72" y="126" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">艾菲爾鐵塔</text>
            {/* Pyramid */}
            <polygon points="108,82 88,110 126,110" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <text x="108" y="126" textAnchor="middle" className="text-[10px] font-bold fill-slate-800">金字塔</text>
          </g>
        </svg>
      );

    case 'health-habits':
      return (
        <svg viewBox="0 0 420 210" className="w-full h-auto max-h-[230px] rounded-lg border border-slate-200 bg-white" role="img" aria-label="健康生活與社區衛生情境圖">
          <g transform="translate(12, 18)">
            <rect width="94" height="172" rx="8" fill="#F0FDFA" stroke="#5EEAD4" strokeWidth="1.5" />
            <text x="47" y="22" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">(1) BMI 指數</text>
            <rect x="16" y="38" width="62" height="58" rx="6" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
            <text x="47" y="58" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">體重(kg)</text>
            <line x1="24" y1="66" x2="70" y2="66" stroke="#0F172A" strokeWidth="2" />
            <text x="47" y="82" textAnchor="middle" className="text-[10px] font-bold fill-slate-700">身高(m)²</text>
            <text x="47" y="122" textAnchor="middle" className="text-[10px] font-bold fill-teal-800">評估體重是否</text>
            <text x="47" y="138" textAnchor="middle" className="text-[10px] font-bold fill-teal-800">過重或過輕</text>
          </g>
          <g transform="translate(112, 18)">
            <rect width="94" height="172" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
            <text x="47" y="22" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">(2) 花盆積水</text>
            <polygon points="28,74 66,74 60,104 34,104" fill="#B45309" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="47" cy="108" rx="28" ry="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="47" cy="54" r="3" fill="#0F172A" />
            <line x1="40" y1="50" x2="54" y2="58" stroke="#0F172A" strokeWidth="1.5" />
            <text x="47" y="136" textAnchor="middle" className="text-[10px] font-bold fill-red-700">容易滋生蚊蟲</text>
            <text x="47" y="152" textAnchor="middle" className="text-[10px] font-medium fill-slate-600">須每週清倒積水</text>
          </g>
          <g transform="translate(212, 18)">
            <rect width="94" height="172" rx="8" fill="#FFFBEB" stroke="#FCD34D" strokeWidth="1.5" />
            <text x="47" y="22" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">(3) 無蓋垃圾桶</text>
            <rect x="28" y="64" width="38" height="44" rx="3" fill="#64748B" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="38" cy="58" r="6" fill="#F97316" />
            <circle cx="54" cy="56" r="5" fill="#84CC16" />
            <text x="47" y="136" textAnchor="middle" className="text-[10px] font-bold fill-amber-900">引來老鼠覓食</text>
            <text x="47" y="152" textAnchor="middle" className="text-[10px] font-medium fill-slate-600">應蓋好並妥善棄置</text>
          </g>
          <g transform="translate(312, 18)">
            <rect width="96" height="172" rx="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
            <text x="48" y="22" textAnchor="middle" className="text-[11px] font-bold fill-slate-900">(4) 診所詢問</text>
            <rect x="22" y="44" width="52" height="58" rx="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
            <rect x="44" y="54" width="8" height="22" fill="#D01012" />
            <rect x="37" y="61" width="22" height="8" fill="#D01012" />
            <text x="48" y="92" textAnchor="middle" className="text-[9px] font-bold fill-blue-900">藥物用途？</text>
            <text x="48" y="136" textAnchor="middle" className="text-[10px] font-bold fill-blue-800">病人知情權</text>
            <text x="48" y="152" textAnchor="middle" className="text-[10px] font-medium fill-slate-600">了解療程與副作用</text>
          </g>
        </svg>
      );
  }
};
