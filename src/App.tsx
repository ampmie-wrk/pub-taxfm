import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// ข้อมูลกองทุนและผู้จัดการกองทุน (AMC)
const AMC_COLORS = {
  'KAsset': '#00A950', // เขียว
  'KKP': '#4E2A84', // ม่วง
  'BBLAM': '#1E3A8A', // น้ำเงินเข้ม
  'Eastspring': '#DC2626', // แดง
  'TISCO': '#0284C7', // ฟ้า
  'SCBAM': '#6B21A8', // ม่วง SCB
  'Krungsri': '#CA8A04', // เหลือง
  'Talis': '#0D9488', // เขียวอมฟ้า
  'MFC': '#991B1B', // แดงเข้ม
  'KTAM': '#38BDF8' // ฟ้าอ่อน
};

const ASSET_COLORS = {
  'ตราสารหนี้': '#3b82f6', // สีน้ำเงิน
  'ผสม': '#8b5cf6', // สีม่วง
  'ตราสารทุน': '#ef4444', // สีแดง
  'ทองคำ': '#eab308' // สีเหลืองทอง
};

const FUNDS_DATA = [
  // GK/DEF (ผู้รักษาประตู / กองหลัง)
  { id: 'f1', name: 'K-ESGBF-ThaiESG', pos: 'GK/DEF', amc: 'KAsset', type: 'ThaiESG', risk: '4', policy: 'ตราสารหนี้ ESG ไทย', emoji: '🌱', assetClass: 'ตราสารหนี้' },
  { id: 'f2', name: 'KKP INRMF', pos: 'GK/DEF', amc: 'KKP', type: 'RMF', risk: '4', policy: 'ตราสารหนี้ระยะสั้น', emoji: '💵', assetClass: 'ตราสารหนี้' },
  // กองหลัง (DEF)
  { id: 'f3', name: 'K-GDBONDRMF', pos: 'DEF', amc: 'KAsset', type: 'RMF', risk: '4', policy: 'ตราสารหนี้ทั่วโลก', emoji: '🌍', assetClass: 'ตราสารหนี้' },
  { id: 'f4', name: 'BGOLDRMF', pos: 'DEF', amc: 'BBLAM', type: 'RMF', risk: '8', policy: 'ทองคำ', emoji: '🪙', assetClass: 'ทองคำ' },
  { id: 'f5', name: 'KTAG70/30-ThaiESG', pos: 'DEF', amc: 'KTAM', type: 'ThaiESG', risk: '5', policy: 'ตราสารหนี้ 70% หุ้น 30%', emoji: '⚖️', assetClass: 'ผสม' },
  { id: 'f7', name: 'TGSMARTRMF-A', pos: 'DEF', amc: 'TISCO', type: 'RMF', risk: '4', policy: 'ตราสารหนี้ระยะกลาง', emoji: '🏦', assetClass: 'ตราสารหนี้' },
  // กองกลาง (MID)
  { id: 'f6', name: 'ES-GAINCOMERMF', pos: 'MID', amc: 'Eastspring', type: 'RMF', risk: '5', policy: 'ตราสารหนี้และสินทรัพย์ผสม', emoji: '🧩', assetClass: 'ผสม' },
  { id: 'f8', name: 'SCBRMWORLD(A)', pos: 'MID', amc: 'SCBAM', type: 'RMF', risk: '6', policy: 'หุ้นทั่วโลก', emoji: '🌐', assetClass: 'ตราสารทุน' },
  { id: 'f9', name: 'SCBRMNDQ(A)', pos: 'MID', amc: 'SCBAM', type: 'RMF', risk: '6', policy: 'หุ้นเทคโนโลยี NASDAQ', emoji: '💻', assetClass: 'ตราสารทุน' },
  { id: 'f10', name: 'KKP GNP RMF-UH', pos: 'MID', amc: 'KKP', type: 'RMF', risk: '6', policy: 'หุ้นเติบโตทั่วโลก', emoji: '📈', assetClass: 'ตราสารทุน' },
  { id: 'f11', name: 'KF-US-PLUSRMF', pos: 'MID', amc: 'Krungsri', type: 'RMF', risk: '6', policy: 'หุ้นสหรัฐฯ', emoji: '🦅', assetClass: 'ตราสารทุน' },
  { id: 'f12', name: 'B-ASIARMF', pos: 'MID', amc: 'BBLAM', type: 'RMF', risk: '6', policy: 'หุ้นเอเชีย', emoji: '🏯', assetClass: 'ตราสารทุน' },
  { id: 'f13', name: 'TDSThaiESG-A', pos: 'MID', amc: 'TISCO', type: 'ThaiESG', risk: '6', policy: 'หุ้นไทย ESG ปันผล', emoji: '🇹🇭', assetClass: 'ตราสารทุน' },
  { id: 'f14', name: 'TLAWSRMF', pos: 'MID', amc: 'Talis', type: 'RMF', risk: '6', policy: 'หุ้นทั่วโลก Low Volatility', emoji: '🛡️', assetClass: 'ตราสารทุน' },
  // กองหน้า (FWD)
  { id: 'f15', name: 'K-GTECHRMF', pos: 'FWD', amc: 'KAsset', type: 'RMF', risk: '6', policy: 'หุ้นเทคโนโลยีทั่วโลก', emoji: '📱', assetClass: 'ตราสารทุน' },
  { id: 'f16', name: 'TAIRMF-A', pos: 'FWD', amc: 'Talis', type: 'RMF', risk: '6', policy: 'หุ้น AI ทั่วโลก', emoji: '🤖', assetClass: 'ตราสารทุน' },
  { id: 'f17', name: 'SCBRMGHC', pos: 'FWD', amc: 'SCBAM', type: 'RMF', risk: '6', policy: 'หุ้น Healthcare ทั่วโลก', emoji: '🏥', assetClass: 'ตราสารทุน' },
  { id: 'f18', name: 'B-INNOTECHRMF', pos: 'FWD', amc: 'BBLAM', type: 'RMF', risk: '6', policy: 'หุ้นนวัตกรรมเทคโนโลยี', emoji: '🚀', assetClass: 'ตราสารทุน' },
  { id: 'f19', name: 'MRENEWRMF', pos: 'FWD', amc: 'MFC', type: 'RMF', risk: '6', policy: 'หุ้นพลังงานสะอาด', emoji: '🍃', assetClass: 'ตราสารทุน' },
  { id: 'f20', name: 'MEGA10AIRMF', pos: 'FWD', amc: 'Talis', type: 'RMF', risk: '6', policy: 'หุ้น AI 10 ตัวแรกของโลก', emoji: '🧠', assetClass: 'ตราสารทุน' },
];

const JerseyIcon = ({ color, className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14.5 3L21 6v5l-3 2v8H6v-8l-3-2V6l6.5-3h5z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 3v2a3 3 0 006 0V3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomPercentInput = ({ value, onChange, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [5, 10, 15, 20, 30, 40, 50];
  
  return (
    <div className="relative flex items-center w-full group/input" onMouseLeave={() => setIsOpen(false)}>
      <div className={`flex items-center w-full bg-white border border-gray-300 ${compact ? 'rounded-full px-1 shadow' : 'rounded shadow-sm px-2 py-1'} focus-within:ring-2 focus-within:ring-blue-500 transition-all`}>
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          className={`w-full text-center font-bold bg-transparent outline-none text-blue-700 ${compact ? 'text-xs md:text-sm py-0.5' : 'text-sm'}`}
          placeholder="%"
          min="0" max="100"
        />
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-400 hover:text-gray-600 px-1 focus:outline-none"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>

      {isOpen && (
        <div className={`absolute ${compact ? 'bottom-full mb-1 left-1/2 -translate-x-1/2 w-40' : 'top-full mt-1 left-0 w-full'} bg-white border border-slate-200 shadow-xl rounded-lg p-2 z-50 animate-in fade-in zoom-in duration-150`}>
          <div className="text-[10px] text-slate-500 font-bold mb-1 text-center">เลือกสัดส่วน หรือพิมพ์เอง</div>
          <div className="grid grid-cols-4 gap-1">
            {options.map(opt => (
              <button 
                key={opt}
                onMouseDown={(e) => { e.preventDefault(); onChange(opt); setIsOpen(false); }} 
                className="text-xs bg-slate-100 text-slate-700 hover:bg-blue-500 hover:text-white rounded py-1.5 font-medium transition-colors"
              >
                {opt}%
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '', onConfirm: null });
  const [isCapturing, setIsCapturing] = useState(false);
  const [teamName, setTeamName] = useState('BudgetBrews FC');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  
  // โหลด html2canvas เพื่อทำฟีเจอร์ Share
  useEffect(() => {
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const showAlert = (message) => setModal({ isOpen: true, type: 'alert', message, onConfirm: null });
  const showConfirm = (message, onConfirm) => setModal({ isOpen: true, type: 'confirm', message, onConfirm });
  const closeModal = () => setModal({ isOpen: false, type: '', message: '', onConfirm: null });

  const handleDragStart = (e, fund) => {
    e.dataTransfer.setData('fund', JSON.stringify(fund));
  };

  const handleDropOnPitch = (e) => {
    e.preventDefault();
    const fundData = e.dataTransfer.getData('fund');
    if (fundData) {
      addFund(JSON.parse(fundData));
    }
  };

  const handleDropOnPlayer = (e, targetPlayerId) => {
    e.preventDefault();
    e.stopPropagation(); 
    const fundData = e.dataTransfer.getData('fund');
    if (fundData) {
      addFund(JSON.parse(fundData), targetPlayerId);
    }
  };

  const addFund = (fund, targetReplaceId = null) => {
    if (selectedFunds.find(f => f.id === fund.id)) return; 
    
    const activeTeam = targetReplaceId ? selectedFunds.filter(f => f.id !== targetReplaceId) : selectedFunds;

    if (!targetReplaceId && activeTeam.length >= 7) {
      showAlert('คุณสามารถเลือกผู้เล่นได้สูงสุด 7 กองทุนเท่านั้น');
      return;
    }
    
    const currentGKs = activeTeam.filter(f => f.actualPos === 'GK').length;
    const currentDEFs = activeTeam.filter(f => f.actualPos === 'DEF').length;
    const currentMIDs = activeTeam.filter(f => f.actualPos === 'MID').length;
    const currentFWDs = activeTeam.filter(f => f.actualPos === 'FWD').length;

    let actualPos = fund.pos;
    
    if (actualPos === 'GK/DEF') {
      actualPos = currentGKs === 0 ? 'GK' : 'DEF';
    }

    if (actualPos === 'GK' && currentGKs >= 1) {
        showAlert('มีผู้รักษาประตูในสนามแล้ว'); return; 
    }
    if (actualPos === 'DEF' && currentDEFs >= 5) {
        showAlert('มีกองหลังในสนามครบ 5 คนแล้ว'); return;
    }
    if (actualPos === 'MID' && currentMIDs >= 5) {
        showAlert('มีกองกลางในสนามครบ 5 คนแล้ว'); return;
    }
    if (actualPos === 'FWD' && currentFWDs >= 3) {
        showAlert('มีกองหน้าในสนามครบ 3 คนแล้ว'); return;
    }

    const replacedFund = selectedFunds.find(f => f.id === targetReplaceId);
    const percentToKeep = replacedFund ? replacedFund.percent : 0;

    setSelectedFunds([...activeTeam, { ...fund, actualPos, percent: percentToKeep }]);
  };

  const removeFund = (id) => setSelectedFunds(selectedFunds.filter(f => f.id !== id));

  const updatePercent = (id, val) => {
    let numVal = parseFloat(val);
    if (isNaN(numVal) || numVal < 0) numVal = 0;
    if (numVal > 100) numVal = 100;
    setSelectedFunds(selectedFunds.map(f => f.id === id ? { ...f, percent: numVal } : f));
  };

  const requestResetTeam = () => {
    showConfirm('คุณต้องการล้างทีมและเริ่มต้นจัดใหม่ทั้งหมดใช่หรือไม่?', () => setSelectedFunds([]));
  };

  const generateRandomTeam = (riskLevel) => {
    const gks_defs = FUNDS_DATA.filter(f => f.pos === 'GK/DEF');
    const defs_only = FUNDS_DATA.filter(f => f.pos === 'DEF');
    const mids = FUNDS_DATA.filter(f => f.pos === 'MID');
    const fwds = FUNDS_DATA.filter(f => f.pos === 'FWD');

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const shuffled_gks_defs = shuffle(gks_defs);
    const shuffled_mids = shuffle(mids);
    const shuffled_fwds = shuffle(fwds);

    const picked = [];
    const gk = shuffled_gks_defs.pop();
    picked.push({ ...gk, actualPos: 'GK', percent: 0 });

    const available_defs = shuffle([...shuffled_gks_defs, ...defs_only]);
    
    let defCount, midCount, fwdCount, safePercents, riskPercents;

    if (riskLevel === 'LOW') {
      defCount = 4; midCount = 2; fwdCount = 0;
      safePercents = [15, 15, 15, 15, 15]; // GK+4DEF = 75%
      riskPercents = [15, 10]; // 2MID = 25%
    } else if (riskLevel === 'MID') {
      defCount = 2; midCount = 2; fwdCount = 2;
      safePercents = [15, 15, 20]; // GK+2DEF = 50%
      riskPercents = [15, 15, 10, 10]; // 2MID+2FWD = 50%
    } else {
      defCount = 1; midCount = 3; fwdCount = 2;
      safePercents = [15, 15]; // GK+1DEF = 30%
      riskPercents = [15, 15, 15, 15, 10]; // 3MID+2FWD = 70%
    }

    for(let i=0; i<defCount; i++) picked.push({ ...available_defs[i], actualPos: 'DEF', percent: 0 });
    for(let i=0; i<midCount; i++) picked.push({ ...shuffled_mids[i], actualPos: 'MID', percent: 0 });
    for(let i=0; i<fwdCount; i++) picked.push({ ...shuffled_fwds[i], actualPos: 'FWD', percent: 0 });

    let safeIndex = 0;
    let riskIndex = 0;
    
    picked.forEach(p => {
      if (p.actualPos === 'GK' || p.actualPos === 'DEF') {
        p.percent = safePercents[safeIndex++];
      } else {
        p.percent = riskPercents[riskIndex++];
      }
    });

    setSelectedFunds(picked);
  };

  const totalPercent = useMemo(() => selectedFunds.reduce((sum, f) => sum + f.percent, 0), [selectedFunds]);
  
  const riskAnalysis = useMemo(() => {
    if (totalPercent === 0 || selectedFunds.length < 3) return null;

    const safePercent = selectedFunds.filter(f => f.actualPos === 'GK' || f.actualPos === 'DEF').reduce((sum, f) => sum + f.percent, 0);
    const riskPercent = selectedFunds.filter(f => f.actualPos === 'MID' || f.actualPos === 'FWD').reduce((sum, f) => sum + f.percent, 0);

    const normalizedRiskPercent = totalPercent > 0 ? (riskPercent / totalPercent) * 100 : 0;
    const normalizedSafePercent = totalPercent > 0 ? (safePercent / totalPercent) * 100 : 0;

    if (normalizedSafePercent >= 70) {
      return { level: 'ต่ำ (Conservative)', color: 'bg-green-500', text: 'ทีมเน้นเกมรับเหนียวแน่น รักษาเงินต้นเป็นหลัก' };
    } else if (normalizedRiskPercent >= 40 && normalizedRiskPercent <= 60) {
      return { level: 'ปานกลาง (Moderate)', color: 'bg-yellow-500', text: 'ทีมสมดุล รุกและรับสอดประสานกันได้ดี' };
    } else if (normalizedRiskPercent > 60) {
      return { level: 'สูง (Aggressive)', color: 'bg-red-500', text: 'ทีมสายบุกทะลวง เน้นทำกำไร เติบโตสูง' };
    } else {
       return { level: 'ค่อนข้างต่ำ (Moderately Low)', color: 'bg-emerald-500', text: 'ทีมเน้นครองบอล ปลอดภัยไว้ก่อน' };
    }
  }, [selectedFunds, totalPercent]);

  const weightedAverageRisk = useMemo(() => {
    if (totalPercent === 0) return 0;
    const totalRiskScore = selectedFunds.reduce((sum, f) => sum + (parseFloat(f.risk) * f.percent), 0);
    return (totalRiskScore / totalPercent).toFixed(2);
  }, [selectedFunds, totalPercent]);

  const assetChartData = useMemo(() => {
    const grouped = selectedFunds.reduce((acc, fund) => {
      if (fund.percent > 0) {
        acc[fund.assetClass] = (acc[fund.assetClass] || 0) + fund.percent;
      }
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key],
      color: ASSET_COLORS[key] || '#ccc'
    }));
  }, [selectedFunds]);

  const players = {
    GK: selectedFunds.filter(f => f.actualPos === 'GK'),
    DEF: selectedFunds.filter(f => f.actualPos === 'DEF'),
    MID: selectedFunds.filter(f => f.actualPos === 'MID'),
    FWD: selectedFunds.filter(f => f.actualPos === 'FWD')
  };

  const getMidfieldStyle = (index, total) => {
    if (total === 2) return { margin: '0 20px' }; 
    if (total === 3) {
      if (index === 0) return { transform: 'translateY(-30px)' }; 
      if (index === 1) return { transform: 'translateY(10px)' };  
      if (index === 2) return { transform: 'translateY(-30px)' }; 
    }
    if (total === 4) {
      if (index === 0) return { transform: 'translateY(-25px)' }; 
      if (index === 1) return { transform: 'translateY(10px)' };  
      if (index === 2) return { transform: 'translateY(10px)' };  
      if (index === 3) return { transform: 'translateY(-25px)' }; 
    }
    if (total === 5) {
      if (index === 0) return { transform: 'translateY(-25px)' }; 
      if (index === 1) return { transform: 'translateY(15px)' };  
      if (index === 2) return { transform: 'translateY(25px)' };  
      if (index === 3) return { transform: 'translateY(15px)' };  
      if (index === 4) return { transform: 'translateY(-25px)' }; 
    }
    return {};
  };

  const renderPlayer = (p, customStyle = {}) => (
    <div 
      key={p.id} 
      className="flex flex-col items-center justify-center group relative w-20 md:w-24 transition-transform hover:scale-105 z-10 cursor-pointer" 
      style={customStyle}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={(e) => handleDropOnPlayer(e, p.id)}
      title="ลากกองทุนมาวางทับเพื่อเปลี่ยนตัวได้"
    >
      <button onClick={() => removeFund(p.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow">
        <TrashIcon className="w-3 h-3" />
      </button>
      <div className="bg-white rounded-full p-1 shadow-lg border-2 relative" style={{ borderColor: AMC_COLORS[p.amc] }}>
        <JerseyIcon color={AMC_COLORS[p.amc] || '#ccc'} className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm md:text-base drop-shadow-md pointer-events-none">{p.emoji}</span>
      </div>
      <div className="bg-white/95 backdrop-blur-sm mt-1 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold text-center leading-tight shadow border border-gray-200 line-clamp-2 w-full">
        {p.name}
      </div>
      <div className="mt-1 w-full flex justify-center opacity-90 group-hover:opacity-100 focus-within:opacity-100 z-30">
         <CustomPercentInput value={p.percent} onChange={(val) => updatePercent(p.id, val)} compact={true} />
      </div>
    </div>
  );

  const handleShare = async () => {
    if (!window.html2canvas) {
      showAlert('ระบบกำลังโหลดเครื่องมือแชร์ กรุณารอสักครู่และลองใหม่อีกครั้ง');
      return;
    }
    
    const stadium = document.getElementById('stadium-capture-area');
    if (!stadium) return;

    try {
      setIsCapturing(true);
      // Wait a moment for any UI states to settle
      await new Promise(r => setTimeout(r, 100)); 
      const canvas = await window.html2canvas(stadium, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#1E293B' // matches bg-slate-800
      });
      
      const image = canvas.toDataURL('image/jpeg', 0.9);
      
      // Attempt Native Share first (Mobile mostly)
      try {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'budgetbrews-team.jpg', { type: 'image/jpeg' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'My BudgetBrews Tax-Saving Team',
                files: [file]
            });
            setIsCapturing(false);
            return;
        }
      } catch (shareErr) {
        console.log("Native share failed or unsupported, falling back to download", shareErr);
      }

      // Fallback: Download Image
      const link = document.createElement('a');
      link.download = 'budgetbrews-team.jpg';
      link.href = image;
      link.click();
      showAlert('บันทึกรูปภาพสนามเรียบร้อยแล้ว! คุณสามารถนำรูปภาพที่บันทึกไปโพสต์ลง Facebook หรือ Social Media อื่นๆ ได้เลย 📸');
      
    } catch (err) {
      console.error(err);
      showAlert('เกิดข้อผิดพลาดในการสร้างรูปภาพ');
    } finally {
      setIsCapturing(false);
    }
  };

  const chartData = selectedFunds.filter(f => f.percent > 0).map(f => ({
    name: f.name,
    value: f.percent,
    color: AMC_COLORS[f.amc] || '#ccc'
  }));

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-2 md:p-6 text-slate-800">
      
      {/* Custom Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {modal.type === 'alert' ? '⚠️ แจ้งเตือน' : '❓ ยืนยันการดำเนินการ'}
            </h3>
            <p className="text-slate-600 mb-6">{modal.message}</p>
            <div className="flex justify-end gap-3">
              {modal.type === 'confirm' && (
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  ยกเลิก
                </button>
              )}
              <button 
                onClick={() => {
                  if (modal.onConfirm) modal.onConfirm();
                  closeModal();
                }} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            ⚽ BudgetBrews Tax-Saving Football Manager
          </h1>
          <p className="text-sm text-slate-500">จำลองการจัดพอร์ตลงทุนด้วยนักเตะกองทุน (เลือกได้ 3 - 7 กองทุน)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-600 mr-2">🎲 สุ่มจัดทีมอัตโนมัติ:</span>
          <button onClick={() => generateRandomTeam('LOW')} className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-green-300">
            🛡️ เสี่ยงต่ำ
          </button>
          <button onClick={() => generateRandomTeam('MID')} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-yellow-300">
            ⚖️ เสี่ยงกลาง
          </button>
          <button onClick={() => generateRandomTeam('HIGH')} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-red-300">
            ⚔️ เสี่ยงสูง
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6">
        
        {/* Left Column: Fund List */}
        <div className="w-full xl:w-1/3 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-200 h-[400px] xl:h-[90vh]">
          <div className="bg-slate-800 text-white p-4 shrink-0">
            <h2 className="text-lg font-bold flex items-center gap-2">
              📋 ตลาดนักเตะ (รายชื่อกองทุน)
            </h2>
            <p className="text-xs text-slate-300 mt-1">ลากมาจัดลงสนาม หรือลากทับเพื่อเปลี่ยนตัว</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {FUNDS_DATA.map(fund => {
              const isSelected = selectedFunds.some(f => f.id === fund.id);
              return (
                <div 
                  key={fund.id}
                  draggable={!isSelected}
                  onDragStart={(e) => handleDragStart(e, fund)}
                  onClick={() => !isSelected && addFund(fund)}
                  className={`flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'opacity-50 grayscale border-slate-200 bg-slate-100 cursor-not-allowed' : 'border-transparent hover:border-blue-400 bg-white shadow-sm hover:shadow-md'}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shrink-0 shadow-inner text-xs border border-black/10" style={{ backgroundColor: AMC_COLORS[fund.amc] }}>
                    {fund.amc.substring(0,4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{fund.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] mt-1">
                      <span className="text-xs">{fund.emoji}</span>
                      <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-medium">{fund.type}</span>
                      <span className="text-slate-500 truncate">{fund.policy}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      fund.pos === 'GK/DEF' ? 'bg-indigo-100 text-indigo-700' :
                      fund.pos === 'DEF' ? 'bg-blue-100 text-blue-700' :
                      fund.pos === 'MID' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {fund.pos}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">ความเสี่ยง {fund.risk}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Pitch and Summary */}
        <div className="w-full xl:w-2/3 flex flex-col gap-6">
          
          {}
          <div 
            id="stadium-capture-area"
            className="w-full bg-slate-800 rounded-3xl shadow-2xl relative p-4 md:p-6 overflow-hidden"
          >
            {/* Stands Texture Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '12px 12px' }}></div>
            
            {/* BudgetBrews Sign */}
            <div className="relative z-10 flex flex-col items-center mb-5">
               <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 md:px-8 py-2 md:py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <img src="bb-logo.jpg" alt="BudgetBrews" className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-teal-400" />
                  {isEditingTeamName ? (
                    <input 
                      type="text" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)}
                      onBlur={() => setIsEditingTeamName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTeamName(false)}
                      className="bg-white/10 text-white font-black text-lg md:text-2xl px-2 py-1 outline-none border-b-2 border-teal-400 font-sans w-48 text-center rounded transition-all"
                      autoFocus
                    />
                  ) : (
                    <span 
                      onClick={() => setIsEditingTeamName(true)}
                      className="text-lg md:text-2xl font-black text-white tracking-widest uppercase drop-shadow-md font-sans cursor-pointer hover:text-teal-200 transition-colors"
                      title="คลิกเพื่อเปลี่ยนชื่อทีม"
                    >
                      {teamName}
                    </span>
                  )}
               </div>
            </div>

            {/* Football Pitch */}
            <div 
              className="w-full bg-[#3e8e41] rounded-2xl shadow-inner relative border-[6px] md:border-[8px] border-[#2d6a2f] flex flex-col justify-between"
              style={{ 
                height: '600px',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.05) 40px, rgba(0,0,0,0.05) 80px)' 
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropOnPitch}
            >
              {/* Pitch Markings */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/60 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 md:w-48 md:h-48 border-[2px] border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="absolute top-0 left-1/2 w-1/2 md:w-2/5 h-[15%] border-x-[2px] border-b-[2px] border-white/60 -translate-x-1/2"></div>
                <div className="absolute top-0 left-1/2 w-1/4 h-[6%] border-x-[2px] border-b-[2px] border-white/60 -translate-x-1/2"></div>
                <div className="absolute top-[15%] left-1/2 w-16 h-8 border-b-[2px] border-white/60 rounded-b-full -translate-x-1/2"></div>
                
                <div className="absolute bottom-0 left-1/2 w-1/2 md:w-2/5 h-[15%] border-x-[2px] border-t-[2px] border-white/60 -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-1/4 h-[6%] border-x-[2px] border-t-[2px] border-white/60 -translate-x-1/2"></div>
                <div className="absolute bottom-[15%] left-1/2 w-16 h-8 border-t-[2px] border-white/60 rounded-t-full -translate-x-1/2"></div>
              </div>

              {selectedFunds.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none text-white/80">
                  <JerseyIcon color="rgba(255,255,255,0.4)" className="w-24 h-24 mb-4 drop-shadow-md" />
                  <p className="text-xl md:text-2xl font-bold text-center bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 shadow-lg">
                    ลากกองทุนมาวางในสนาม
                  </p>
                </div>
              )}

              <div className="relative z-10 w-full h-full flex flex-col justify-between py-6 px-4 md:px-8">
                <div className="h-[20%] w-full flex justify-center items-end gap-2 md:gap-10">
                  {players.FWD.map((p) => renderPlayer(p))}
                </div>
                <div className="h-[35%] w-full flex justify-center items-center gap-1 md:gap-4 relative">
                  {players.MID.map((p, index) => renderPlayer(p, getMidfieldStyle(index, players.MID.length)))}
                </div>
                <div className="h-[25%] w-full flex justify-center items-start gap-2 md:gap-6">
                  {players.DEF.map((p) => renderPlayer(p))}
                </div>
                <div className="h-[15%] w-full flex justify-center items-end">
                  {players.GK.map((p) => renderPlayer(p, { transform: 'translateY(10px)' }))}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                📊 สรุปแผนการลงทุน
              </h2>
              
              {selectedFunds.length > 0 && (
                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                  <div className={`px-4 py-2 rounded-lg border-2 font-bold flex flex-col items-center flex-1 md:flex-none ${totalPercent === 100 ? 'border-green-500 text-green-700 bg-green-50' : 'border-red-400 text-red-600 bg-red-50'}`}>
                    <span className="text-[10px] uppercase tracking-wider">สัดส่วนรวม</span>
                    <span className="text-xl leading-none">{totalPercent.toFixed(1)}%</span>
                  </div>
                  
                  <button 
                    onClick={handleShare} 
                    disabled={isCapturing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 flex items-center gap-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ShareIcon className="w-4 h-4" />
                    {isCapturing ? 'รอสักครู่...' : 'แชร์ทีม'}
                  </button>

                  <button onClick={requestResetTeam} className="bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-700 px-4 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap">
                    ล้างทีม
                  </button>
                </div>
              )}
            </div>

            {selectedFunds.length > 0 ? (
              <div className="space-y-6">
                
                {/* Risk and Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Risk Badge */}
                  <div className="flex flex-col justify-center gap-4">
                    {totalPercent === 100 ? (
                      <div className={`${riskAnalysis.color} text-white p-6 rounded-xl shadow-md flex items-center gap-4 h-full relative overflow-hidden`}>
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-9xl pointer-events-none">🛡️</div>
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0 z-10">
                          <span className="text-3xl">🛡️</span>
                        </div>
                        <div className="z-10">
                          <h3 className="font-bold text-xl leading-tight">สไตล์ทีม: {riskAnalysis.level}</h3>
                          <p className="text-white/90 text-sm mt-1">{riskAnalysis.text}</p>
                          <div className="mt-3 inline-block bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 backdrop-blur-sm shadow-sm">
                            <span className="text-xs font-medium text-white/90">ความเสี่ยงเฉลี่ย: </span>
                            <span className="text-sm font-black text-white">{weightedAverageRisk} / 8</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl flex items-center gap-3 font-medium h-full">
                        <span className="text-3xl">⚠️</span> 
                        <p>กรุณาระบุสัดส่วนการลงทุนให้ครบ 100% เพื่อประเมินสไตล์ของทีม (ขาดอีก {(100 - totalPercent).toFixed(1)}%)</p>
                      </div>
                    )}
                  </div>

                  {/* Pie Charts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 h-64 flex flex-col">
                      <h3 className="text-xs font-bold text-slate-600 text-center mb-2">สัดส่วนกองทุน</h3>
                      {chartData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25} paddingAngle={2} labelLine={false}>
                               {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                             </Pie>
                             <Tooltip formatter={(value) => `${value}%`} />
                           </PieChart>
                         </ResponsiveContainer>
                      ) : (
                         <div className="flex-1 flex items-center justify-center text-xs text-slate-400">ระบุสัดส่วน %</div>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 h-64 flex flex-col">
                      <h3 className="text-xs font-bold text-slate-600 text-center mb-2">ประเภทสินทรัพย์</h3>
                      {assetChartData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie data={assetChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25} paddingAngle={2} labelLine={false}>
                               {assetChartData.map((entry, index) => <Cell key={`cell-asset-${index}`} fill={entry.color} />)}
                             </Pie>
                             <Tooltip formatter={(value) => `${value}%`} />
                           </PieChart>
                         </ResponsiveContainer>
                      ) : (
                         <div className="flex-1 flex items-center justify-center text-xs text-slate-400">ระบุสัดส่วน %</div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-visible mt-4">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b-2 border-slate-200">
                        <th className="p-3 font-bold rounded-tl-lg">ตำแหน่ง</th>
                        <th className="p-3 font-bold">กองทุน (AMC)</th>
                        <th className="p-3 font-bold">ประเภท</th>
                        <th className="p-3 font-bold">นโยบาย (ความเสี่ยง)</th>
                        <th className="p-3 font-bold w-40 text-right rounded-tr-lg">สัดส่วน (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {['FWD', 'MID', 'DEF', 'GK'].map(posGroup => 
                        players[posGroup].map(f => (
                          <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <span className={`font-bold px-2 py-1 rounded text-xs ${
                                f.actualPos === 'GK' ? 'bg-yellow-100 text-yellow-700' :
                                f.actualPos === 'DEF' ? 'bg-blue-100 text-blue-700' :
                                f.actualPos === 'MID' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                              }`}>{f.actualPos}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: AMC_COLORS[f.amc] }}></div>
                                <span className="text-sm shrink-0">{f.emoji}</span>
                                <span className="font-bold">{f.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{f.type}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-slate-600">{f.policy} <span className="text-slate-400 text-[10px] ml-1 bg-slate-100 px-1.5 py-0.5 rounded">ระดับ {f.risk}</span></span>
                            </td>
                            <td className="p-3">
                               <CustomPercentInput value={f.percent} onChange={(val) => updatePercent(f.id, val)} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List */}
                <div className="md:hidden space-y-3 mt-4">
                  {selectedFunds.map(f => (
                     <div key={f.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm relative">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: AMC_COLORS[f.amc] }}></div>
                            <span className="text-sm shrink-0">{f.emoji}</span>
                            <span className="font-bold text-sm">{f.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.actualPos === 'GK' ? 'bg-yellow-100 text-yellow-700' :
                            f.actualPos === 'DEF' ? 'bg-blue-100 text-blue-700' :
                            f.actualPos === 'MID' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>{f.actualPos}</span>
                        </div>
                        <div className="text-xs text-slate-600 mb-3">
                           {f.type} • {f.policy} (ระดับ {f.risk})
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                          <span className="text-xs font-bold text-slate-500">สัดส่วนลงทุน</span>
                          <div className="w-28">
                             <CustomPercentInput value={f.percent} onChange={(val) => updatePercent(f.id, val)} />
                          </div>
                        </div>
                     </div>
                  ))}
                </div>

                {selectedFunds.length > 0 && selectedFunds.length < 3 && (
                  <p className="text-center text-red-500 text-sm font-bold animate-pulse mt-4 bg-red-50 py-2 rounded-lg">
                    * กรุณาเลือกผู้เล่นให้ครบอย่างน้อย 3 กองทุน
                  </p>
                )}

                {/* CTA / Call to Action */}
                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-4">พร้อมลงสนามจริงแล้วหรือยัง?</h3>
                  <a 
                    href="https://budgetbrews.short.gy/web-contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl text-base md:text-lg w-full md:w-auto"
                  >
                    💡 รับคำปรึกษาวางแผนภาษีฟรี! จากโค้ช BudgetBrews
                  </a>
                </div>

              </div>
            ) : (
              <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                ยังไม่มีผู้เล่นในทีม ลองลากกองทุนจากเมนูด้านซ้ายลงสู่สนาม<br/>หรือใช้ปุ่ม <b>"สุ่มทีมอัตโนมัติ"</b> ด้านบนเพื่อเริ่มต้นอย่างรวดเร็ว!
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer Warning */}
      <div className="max-w-7xl mx-auto mt-8 mb-4 text-xs text-red-600 leading-relaxed bg-red-50 p-5 md:p-6 rounded-xl border border-red-200 shadow-sm">
        <p className="font-bold mb-2 text-sm">คำเตือน:</p>
        <div className="space-y-2">
          <p>- ผู้ลงทุนต้องทำความเข้าใจลักษณะสินค้า เงื่อนไข ผลตอบแทน และความเสี่ยงก่อนตัดสินใจลงทุน รวมถึงศึกษาข้อมูลสิทธิประโยชน์ทางภาษีของกองทุน RMF และ Thai ESG ตามคู่มือการลงทุนและข้อกำหนดของกรมสรรพากร กรณีไม่ปฏิบัติตามเงื่อนไขภาษีจะไม่ได้สิทธิประโยชน์ตามที่กฎหมายกำหนด</p>
          <p>- การลงทุนในกองทุนรวมไม่ใช่การฝากเงิน กองทุนอาจมีการลงทุนกระจุกตัวในประเทศหรืออุตสาหกรรมที่เกี่ยวข้องกับ ESG ซึ่งอาจทำให้มีความเสี่ยงสูง ผู้ลงทุนควรกระจายความเสี่ยงและพิจารณาความเหมาะสมกับพอร์ตการลงทุนโดยรวมของตนเอง</p>
          <p>- ผลการดำเนินงานในอดีตมิได้ยืนยันผลการดำเนินงานในอนาคต สิทธิประโยชน์ทางภาษีขึ้นอยู่กับข้อกำหนดของกรมสรรพากรซึ่งอาจมีการเปลี่ยนแปลงได้ ผู้ลงทุนควรศึกษาหรือปรึกษาผู้เชี่ยวชาญด้านภาษีก่อนการลงทุน</p>
        </div>
      </div>

    </div>
  );
}