import React, { useState, useEffect, useRef } from 'react'

const API_BASE = "https://reasonmind-ai.onrender.com"
// ═══════════════════════════════════════════════════════
// NIFTY 50 CONSTITUENTS — Base Reference Data
// ═══════════════════════════════════════════════════════

const NIFTY_50_CONSTITUENTS = [
  { name: "Reliance Industries", ticker: "RELIANCE.NS", sector: "Energy", weight: "10.4%", basePrice: 2450.25, change: 1.45 },
  { name: "HDFC Bank", ticker: "HDFCBANK.NS", sector: "Banking", weight: "9.8%", basePrice: 1420.50, change: -0.65 },
  { name: "ICICI Bank", ticker: "ICICIBANK.NS", sector: "Banking", weight: "7.9%", basePrice: 906.40, change: 1.20 },
  { name: "Infosys", ticker: "INFY.NS", sector: "IT", weight: "5.8%", basePrice: 1540.15, change: -1.10 },
  { name: "Larsen & Toubro", ticker: "LT.NS", sector: "Engineering", weight: "4.4%", basePrice: 3420.00, change: 0.85 },
  { name: "TCS", ticker: "TCS.NS", sector: "IT", weight: "4.2%", basePrice: 3820.60, change: 1.15 },
  { name: "ITC", ticker: "ITC.NS", sector: "FMCG", weight: "3.8%", basePrice: 412.30, change: -0.30 },
  { name: "Hindustan Unilever", ticker: "HINDUNILVR.NS", sector: "FMCG", weight: "2.7%", basePrice: 2360.90, change: 0.40 },
  { name: "Axis Bank", ticker: "AXISBANK.NS", sector: "Banking", weight: "2.5%", basePrice: 980.50, change: 1.10 },
  { name: "State Bank of India", ticker: "SBIN.NS", sector: "Banking", weight: "2.4%", basePrice: 620.10, change: -1.35 },
  { name: "Bharti Airtel", ticker: "BHARTIARTL.NS", sector: "Telecom", weight: "2.3%", basePrice: 1120.75, change: 2.10 },
  { name: "Kotak Mahindra Bank", ticker: "KOTAKBANK.NS", sector: "Banking", weight: "2.2%", basePrice: 1740.20, change: -0.90 },
  { name: "Tata Motors", ticker: "TATAMOTORS.NS", sector: "Automobile", weight: "1.9%", basePrice: 920.40, change: 1.65 },
  { name: "Sun Pharma", ticker: "SUNPHARMA.NS", sector: "Pharma", weight: "1.5%", basePrice: 1510.30, change: 0.55 },
  { name: "NTPC", ticker: "NTPC.NS", sector: "Energy", weight: "1.4%", basePrice: 312.45, change: -0.75 },
  { name: "Maruti Suzuki", ticker: "MARUTI.NS", sector: "Automobile", weight: "1.3%", basePrice: 11200.00, change: 0.25 },
  { name: "HCL Technologies", ticker: "HCLTECH.NS", sector: "IT", weight: "1.2%", basePrice: 1390.80, change: -1.05 },
  { name: "Power Grid", ticker: "POWERGRID.NS", sector: "Energy", weight: "1.1%", basePrice: 265.30, change: 0.65 },
  { name: "UltraTech Cement", ticker: "ULTRACEMCO.NS", sector: "Materials", weight: "1.0%", basePrice: 9680.00, change: -0.45 },
  { name: "Titan Company", ticker: "TITAN.NS", sector: "Consumer Durables", weight: "0.9%", basePrice: 3410.50, change: 1.30 },
  { name: "Adani Enterprises", ticker: "ADANIENT.NS", sector: "Diversified", weight: "0.9%", basePrice: 3150.00, change: 0.70 },
  { name: "Adani Ports", ticker: "ADANIPORTS.NS", sector: "Infrastructure", weight: "0.8%", basePrice: 1250.00, change: -0.50 },
  { name: "Apollo Hospitals", ticker: "APOLLOHOSP.NS", sector: "Healthcare", weight: "0.8%", basePrice: 5920.00, change: 1.25 },
  { name: "Asian Paints", ticker: "ASIANPAINT.NS", sector: "Consumer Goods", weight: "0.8%", basePrice: 2840.00, change: -0.95 },
  { name: "Bajaj Auto", ticker: "BAJAJ-AUTO.NS", sector: "Automobile", weight: "0.8%", basePrice: 8250.00, change: 1.40 },
  { name: "Bajaj Finance", ticker: "BAJFINANCE.NS", sector: "Financial Services", weight: "0.8%", basePrice: 6850.00, change: -0.80 },
  { name: "Bajaj Finserv", ticker: "BAJAJFINSV.NS", sector: "Financial Services", weight: "0.7%", basePrice: 1580.00, change: -0.20 },
  { name: "Bharat Electronics", ticker: "BEL.NS", sector: "Engineering", weight: "0.7%", basePrice: 195.00, change: 2.30 },
  { name: "Cipla", ticker: "CIPLA.NS", sector: "Pharma", weight: "0.7%", basePrice: 1350.00, change: 0.60 },
  { name: "Coal India", ticker: "COALINDIA.NS", sector: "Energy", weight: "0.7%", basePrice: 410.00, change: -0.55 },
  { name: "Dr. Reddy's", ticker: "DRREDDY.NS", sector: "Pharma", weight: "0.6%", basePrice: 6120.00, change: 0.90 },
  { name: "Eicher Motors", ticker: "EICHERMOT.NS", sector: "Automobile", weight: "0.6%", basePrice: 3950.00, change: -1.05 },
  { name: "Grasim Industries", ticker: "GRASIM.NS", sector: "Materials", weight: "0.6%", basePrice: 2180.00, change: 0.35 },
  { name: "HDFC Life", ticker: "HDFCLIFE.NS", sector: "Financial Services", weight: "0.6%", basePrice: 580.00, change: -0.80 },
  { name: "Hindalco Industries", ticker: "HINDALCO.NS", sector: "Metals", weight: "0.5%", basePrice: 520.00, change: 1.10 },
  { name: "InterGlobe Aviation", ticker: "INDIGO.NS", sector: "Aviation", weight: "0.5%", basePrice: 3120.00, change: 1.85 },
  { name: "Jio Financial Services", ticker: "JIOFIN.NS", sector: "Financial Services", weight: "0.5%", basePrice: 345.00, change: -0.40 },
  { name: "JSW Steel", ticker: "JSWSTEEL.NS", sector: "Metals", weight: "0.5%", basePrice: 810.00, change: 0.50 },
  { name: "Mahindra & Mahindra", ticker: "M&M.NS", sector: "Automobile", weight: "0.5%", basePrice: 1680.00, change: 1.30 },
  { name: "Max Healthcare", ticker: "MAXHEALTH.NS", sector: "Healthcare", weight: "0.5%", basePrice: 720.00, change: -0.90 },
  { name: "Nestle India", ticker: "NESTLEIND.NS", sector: "FMCG", weight: "0.5%", basePrice: 2540.00, change: -0.15 },
  { name: "ONGC", ticker: "ONGC.NS", sector: "Energy", weight: "0.4%", basePrice: 245.00, change: 1.15 },
  { name: "SBI Life", ticker: "SBILIFE.NS", sector: "Financial Services", weight: "0.4%", basePrice: 1450.00, change: -0.75 },
  { name: "Shriram Finance", ticker: "SHRIRAMFIN.NS", sector: "Financial Services", weight: "0.4%", basePrice: 2320.00, change: 0.95 },
  { name: "Tata Consumer", ticker: "TATACONSUM.NS", sector: "FMCG", weight: "0.4%", basePrice: 1150.00, change: 0.20 },
  { name: "Tata Steel", ticker: "TATASTEEL.NS", sector: "Metals", weight: "0.4%", basePrice: 142.00, change: -1.30 },
  { name: "Tech Mahindra", ticker: "TECHM.NS", sector: "IT", weight: "0.4%", basePrice: 1250.00, change: 0.80 },
  { name: "Trent", ticker: "TRENT.NS", sector: "Retail", weight: "0.4%", basePrice: 3980.00, change: 2.45 },
  { name: "Wipro", ticker: "WIPRO.NS", sector: "IT", weight: "0.4%", basePrice: 480.00, change: -0.35 }
]

// ═══════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════

const isNSEMarketOpen = () => {
  const d = new Date()
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000)
  const istDate = new Date(utc + (3600000 * 5.5))
  const day = istDate.getDay()
  const hours = istDate.getHours()
  const minutes = istDate.getMinutes()
  const isWeekday = day >= 1 && day <= 5
  const timeInDecimal = hours + (minutes / 60)
  return isWeekday && timeInDecimal >= 9.25 && timeInDecimal <= 15.5
}

const formatINR = (val) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ═══════════════════════════════════════════════════════
// SVG ICON COMPONENTS
// ═══════════════════════════════════════════════════════

const IconTrendUp = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconTrendDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
)
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const IconBarChart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconZap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
const IconLayers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
)
const IconInfo = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 hover:opacity-100 transition-opacity">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)



// ═══════════════════════════════════════════════════════
// RICH TEXT & DISCLAIMER FORMATTER FOR CHATBOT
// ═══════════════════════════════════════════════════════

const formatInlineStyles = (text) => {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Restore our special tags:
  html = html
    .replace(/&lt;disclaimer&gt;/g, "<disclaimer>")
    .replace(/&lt;\/disclaimer&gt;/g, "</disclaimer>");

  // Bold **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>");
  // Italics *text* or _text_
  html = html.replace(/\*([\s\S]*?)\*/g, "<em>$1</em>");
  html = html.replace(/_([\s\S]*?)_/g, "<em>$1</em>");
  
  return html;
};

const renderParagraph = (pText, key) => {
  const lines = pText.split('\n');
  const isList = lines.some(line => line.trim().startsWith('* ') || line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim()));
  
  if (isList) {
    return (
      <ul key={key} className="list-disc pl-4 space-y-1.5 my-2.5">
        {lines.map((line, lIdx) => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            const content = trimmedLine.replace(/^[\*\-]\s+/, '');
            return (
              <li key={lIdx} className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]" 
                  dangerouslySetInnerHTML={{ __html: formatInlineStyles(content) }} />
            );
          } else if (/^\d+\.\s/.test(trimmedLine)) {
            const content = trimmedLine.replace(/^\d+\.\s+/, '');
            return (
              <li key={lIdx} className="list-decimal text-[12px] leading-relaxed text-[var(--color-text-secondary)] ml-1"
                  dangerouslySetInnerHTML={{ __html: formatInlineStyles(content) }} />
            );
          } else {
            return (
              <p key={lIdx} className="text-[12px] leading-relaxed text-[var(--color-text-secondary)] my-1"
                 dangerouslySetInnerHTML={{ __html: formatInlineStyles(trimmedLine) }} />
            );
          }
        })}
      </ul>
    );
  }
  
  return (
    <p key={key} className="text-[12px] leading-relaxed text-[var(--color-text-secondary)] mb-2.5"
       dangerouslySetInnerHTML={{ __html: formatInlineStyles(pText) }} />
  );
};

const renderAssistantMessage = (rawText) => {
  if (!rawText) return null;
  
  // First, extract explicit disclaimers wrapped in <disclaimer>...</disclaimer>
  const blocks = [];
  const disclaimerRegex = /<disclaimer>([\s\S]*?)<\/disclaimer>/gi;
  let match;
  let lastIndex = 0;
  
  while ((match = disclaimerRegex.exec(rawText)) !== null) {
    const startIndex = match.index;
    if (startIndex > lastIndex) {
      blocks.push({
        type: 'content',
        text: rawText.substring(lastIndex, startIndex)
      });
    }
    blocks.push({
      type: 'disclaimer',
      text: match[1]
    });
    lastIndex = disclaimerRegex.lastIndex;
  }
  
  if (lastIndex < rawText.length) {
    blocks.push({
      type: 'content',
      text: rawText.substring(lastIndex)
    });
  }
  
  // If there are no explicit tags, check if the whole text has a paragraph starting with "Disclaimer:" or "**Disclaimer:**"
  if (blocks.length === 1 && blocks[0].type === 'content') {
    const paragraphs = rawText.split(/\n\n+/);
    const parsedBlocks = paragraphs.map(p => {
      const trimmed = p.trim();
      const isDisclaimer = trimmed.toLowerCase().startsWith('disclaimer:') || 
                           trimmed.toLowerCase().startsWith('**disclaimer:') ||
                           trimmed.toLowerCase().startsWith('* **disclaimer:') ||
                           trimmed.toLowerCase().startsWith('**disclaimer:**') ||
                           trimmed.toLowerCase().startsWith('please note that') ||
                           trimmed.toLowerCase().includes('not a fortune teller');
      return {
        type: isDisclaimer ? 'disclaimer' : 'paragraph',
        text: trimmed
      };
    }).filter(b => b.text.length > 0);
    
    return (
      <div className="space-y-2">
        {parsedBlocks.map((b, idx) => {
          if (b.type === 'disclaimer') {
            let cleanedText = b.text
              .replace(/^[\*\s]*disclaimer:[\*\s]*/i, '')
              .replace(/^\*\*disclaimer:\*\*[\s]*/i, '')
              .replace(/^\*\*disclaimer\*\*:?[\s]*/i, '');
            return (
              <div key={idx} className="bg-rose-50/70 border border-rose-100/80 rounded-xl p-3 my-2 text-rose-700 text-[11px] font-medium leading-relaxed flex items-start gap-2 border-l-4 border-l-rose-500 shadow-sm animate-fade-in">
                <span className="text-[13px] mt-0.5">⚠️</span>
                <div className="flex-grow">
                  <span className="font-bold text-rose-800 mr-1 text-[11px]">DISCLAIMER:</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(cleanedText) }} />
                </div>
              </div>
            );
          } else {
            return renderParagraph(b.text, idx);
          }
        })}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {blocks.map((b, idx) => {
        if (b.type === 'disclaimer') {
          let cleanedText = b.text
            .replace(/^[\*\s]*disclaimer:[\*\s]*/i, '')
            .replace(/^\*\*disclaimer:\*\*[\s]*/i, '')
            .replace(/^\*\*disclaimer\*\*:?[\s]*/i, '');
          return (
            <div key={idx} className="bg-rose-50/70 border border-rose-100/80 rounded-xl p-3 my-2 text-rose-700 text-[11px] font-medium leading-relaxed flex items-start gap-2 border-l-4 border-l-rose-500 shadow-sm animate-fade-in">
              <span className="text-[13px] mt-0.5">⚠️</span>
              <div className="flex-grow">
                <span className="font-bold text-rose-800 mr-1 text-[11px]">DISCLAIMER:</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(cleanedText) }} />
              </div>
            </div>
          );
        } else {
          const paragraphs = b.text.split(/\n\n+/).filter(p => p.trim().length > 0);
          return paragraphs.map((p, pIdx) => renderParagraph(p.trim(), `${idx}-${pIdx}`));
        }
      })}
    </div>
  );
};


const average = arr => arr && arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;

const CandlestickChart = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  
  if (!data || !data.length) return null
  
  const width = 450
  const height = 220
  const padding = 32
  
  const highs = data.map(d => d.high)
  const lows = data.map(d => d.low)
  const minPrice = Math.min(...lows) * 0.995
  const maxPrice = Math.max(...highs) * 1.005
  const priceRange = maxPrice - minPrice
  
  const getX = (idx) => padding + (idx * (width - 2 * padding) / (data.length - 1))
  const getY = (val) => height - padding - ((val - minPrice) * (height - 2 * padding) / priceRange)
  
  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null
  
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[180px] select-none overflow-visible">
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const price = minPrice + ratio * priceRange
          const y = getY(price)
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding - 6} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace" className="font-semibold">
                ₹{price.toFixed(0)}
              </text>
            </g>
          )
        })}
        
        {data.map((d, i) => {
          const isUp = d.close >= d.open
          const color = isUp ? '#10b981' : '#ef4444'
          
          const x = getX(i)
          const yOpen = getY(d.open)
          const yClose = getY(d.close)
          const yHigh = getY(d.high)
          const yLow = getY(d.low)
          
          const boxTop = Math.min(yOpen, yClose)
          const boxBottom = Math.max(yOpen, yClose)
          const boxHeight = Math.max(2, boxBottom - boxTop)
          const candleWidth = Math.max(3, (width - 2 * padding) / data.length * 0.65)
          
          return (
            <g key={i} className="cursor-pointer"
               onMouseEnter={() => setHoveredIdx(i)}
               onMouseLeave={() => setHoveredIdx(null)}>
              <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
              <rect x={x - candleWidth / 2} y={boxTop} width={candleWidth} height={boxHeight} fill={color} stroke={color} strokeWidth="0.5" rx="0.5" />
              <rect x={x - (width - 2 * padding) / data.length / 2} y={0} width={(width - 2 * padding) / data.length} height={height} fill="transparent" />
            </g>
          )
        })}
        
        {hoveredIdx !== null && (
          <line x1={getX(hoveredIdx)} y1={0} x2={getX(hoveredIdx)} y2={height - padding} stroke="#6366f1" strokeWidth="0.8" strokeDasharray="2 2" />
        )}
      </svg>
      
      <div className="h-8 flex items-center justify-between border-t border-slate-100 pt-1 text-[10px] text-slate-500">
        {hoveredData ? (
          <div className="flex gap-3 font-mono font-semibold animate-fade-in w-full justify-between">
            <span>Date: <span className="text-slate-800 font-bold">{hoveredData.date}</span></span>
            <span>O: <span className="text-slate-700">₹{hoveredData.open}</span></span>
            <span>H: <span className="text-emerald-600">₹{hoveredData.high}</span></span>
            <span>L: <span className="text-red-500">₹{hoveredData.low}</span></span>
            <span>C: <span className="text-slate-700">₹{hoveredData.close}</span></span>
          </div>
        ) : (
          <span className="italic font-medium text-slate-400">Hover candlesticks to view detailed price points</span>
        )}
      </div>
    </div>
  )
}

const VolatilityChart = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  
  if (!data || !data.length) return null
  
  const width = 450
  const height = 220
  const padding = 32
  
  const values = data.map(d => d.value)
  const minVal = 0
  const maxVal = Math.max(...values) * 1.15
  const range = maxVal - minVal
  
  const getX = (idx) => padding + (idx * (width - 2 * padding) / (data.length - 1))
  const getY = (val) => height - padding - ((val - minVal) * (height - 2 * padding) / range)
  
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ')
  const areaPoints = `${getX(0)},${height - padding} ${points} ${getX(data.length - 1)},${height - padding}`
  
  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null
  
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[180px] select-none overflow-visible">
        <defs>
          <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const val = minVal + ratio * range
          const y = getY(val)
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding - 6} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="monospace" className="font-semibold">
                {val.toFixed(1)}%
              </text>
            </g>
          )
        })}
        
        <polygon points={areaPoints} fill="url(#volGrad)" />
        <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        
        {data.map((d, i) => {
          const x = getX(i)
          const y = getY(d.value)
          return (
            <g key={i} className="cursor-pointer"
               onMouseEnter={() => setHoveredIdx(i)}
               onMouseLeave={() => setHoveredIdx(null)}>
              <circle cx={x} cy={y} r={hoveredIdx === i ? 3.5 : 1.8} fill={hoveredIdx === i ? '#4f46e5' : '#6366f1'} stroke="white" strokeWidth="0.5" />
              <rect x={x - (width - 2 * padding) / data.length / 2} y={0} width={(width - 2 * padding) / data.length} height={height} fill="transparent" />
            </g>
          )
        })}
        
        {hoveredIdx !== null && (
          <line x1={getX(hoveredIdx)} y1={0} x2={getX(hoveredIdx)} y2={height - padding} stroke="#6366f1" strokeWidth="0.8" strokeDasharray="2 2" />
        )}
      </svg>
      
      <div className="h-8 flex items-center justify-between border-t border-slate-100 pt-1 text-[10px] text-slate-500">
        {hoveredData ? (
          <div className="flex gap-4 font-mono font-semibold animate-fade-in w-full justify-between">
            <span>Date: <span className="text-slate-800 font-bold">{hoveredData.date}</span></span>
            <span>Volatility Spread Index: <span className="text-indigo-600 font-bold">{hoveredData.value}%</span></span>
          </div>
        ) : (
          <span className="italic font-medium text-slate-400">Hover plot points to view daily high-low spread index value</span>
        )}
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════

function App() {
  // ── State ──
  const [searchTerm, setSearchTerm] = useState('')
  const [marketOpen, setMarketOpen] = useState(isNSEMarketOpen())
  const [simulationMode, setSimulationMode] = useState(false)
  const [niftyIndex, setNiftyIndex] = useState({ price: 22040.70, change: 0.45 })
  const [stockPrices, setStockPrices] = useState(NIFTY_50_CONSTITUENTS)
  const [activeTab, setActiveTab] = useState('explorer')
  const chatEndRef = useRef(null)

  // DCF
  const [initialFCF, setInitialFCF] = useState(1500)
  const [growthRate, setGrowthRate] = useState(8.5)
  const [discountRate, setDiscountRate] = useState(10.5)
  const [terminalGrowth, setTerminalGrowth] = useState(3.0)
  const [currentPrice, setCurrentPrice] = useState(25000)
  const [dcfMode, setDcfMode] = useState('manual') // 'manual' or 'prefill'
  const [selectedDcfTicker, setSelectedDcfTicker] = useState('')
  const [dcfLoading, setDcfLoading] = useState(false)
  const [prefilledCompany, setPrefilledCompany] = useState(null)

  // Chatbot
  const [chatMode, setChatMode] = useState('compare')
  const [compStock1, setCompStock1] = useState('RELIANCE.NS')
  const [compStock2, setCompStock2] = useState('TCS.NS')
  const [compResult, setCompResult] = useState(null)
  const [predStock, setPredStock] = useState('RELIANCE.NS')
  const [predTime, setPredTime] = useState(1)
  const [predVol, setPredVol] = useState(25)
  const [predResult, setPredResult] = useState(null)
  const [generalQuery, setGeneralQuery] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hello! I\'m the ReasonMind Financial Assistant. Ask me about any Nifty 50 company, P/E ratios, ROE, WACC, DCF models, or Monte Carlo simulations.' }
  ])

  // Historical Charts & Modal state
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [historicalData, setHistoricalData] = useState(null)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState(null)

  const handleCompanyClick = async (stock) => {
    setSelectedCompany(stock)
    setChartLoading(true)
    setChartError(null)
    setHistoricalData(null)
    
    try {
      const res = await fetch(`https://reasonmind-ai.onrender.com/api/historical/${stock.ticker}`)
      const data = await res.json()
      if (data.status === 'success') {
        const candlesSorted = [...data.candlesticks].sort((a, b) => new Date(a.date) - new Date(b.date))
        const volsSorted = [...data.volatility].sort((a, b) => new Date(a.date) - new Date(b.date))
        setHistoricalData({
          candlesticks: candlesSorted,
          volatility: volsSorted
        })
      } else {
        throw new Error(data.error || "Failed to fetch historical data")
      }
    } catch (err) {
      console.warn("Backend historical API unavailable, generating mock history fallback:", err)
      
      // Robust realistic math-based mock walk generator fallback
      const candles = []
      const vols = []
      let price = stock.basePrice
      
      // Determine daily volatility range based on sector
      let baseVol = 1.8 // FMCG/IT
      if (stock.sector === 'Banking' || stock.sector === 'Engineering') {
        baseVol = 2.4
      } else if (stock.sector === 'Energy') {
        baseVol = 2.0
      }
      
      const numDays = 22 // Roughly 1 trading month of daily bars
      const today = new Date()
      
      for (let i = numDays; i >= 0; i--) {
        const d = new Date()
        d.setDate(today.getDate() - i * 1.4) // spread dates reasonably
        if (d.getDay() === 0 || d.getDay() === 6) continue // skip weekends loosely
        
        const dateStr = d.toISOString().split('T')[0]
        
        // Random walk step
        const changePct = (Math.random() - 0.49) * baseVol // slight positive drift
        const open = price * (1 - changePct / 100)
        const close = price
        
        const high = Math.max(open, close) * (1 + Math.random() * (baseVol / 2) / 100)
        const low = Math.min(open, close) * (1 - Math.random() * (baseVol / 2) / 100)
        
        candles.push({
          date: dateStr,
          open: +open.toFixed(2),
          high: +high.toFixed(2),
          low: +low.toFixed(2),
          close: +close.toFixed(2),
          volume: Math.floor(100000 + Math.random() * 900000)
        })
        
        const spread = ((high - low) / low) * 100
        vols.push({
          date: dateStr,
          value: +spread.toFixed(2)
        })
        
        price = open // step backwards
      }
      
      // Sort in chronological order (oldest first, latest last)
      const candlesSorted = [...candles].sort((a, b) => new Date(a.date) - new Date(b.date))
      const volsSorted = [...vols].sort((a, b) => new Date(a.date) - new Date(b.date))
      
      setHistoricalData({
        candlesticks: candlesSorted,
        volatility: volsSorted
      })
    } finally {
      setChartLoading(false)
    }
  }

  // ── Live Fetch ──
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const res = await fetch('https://reasonmind-ai.onrender.com/api/stocks')
        const data = await res.json()
        if (data.status === 'success') {
          if (data.prices) {
            setStockPrices(prev => prev.map(stock => {
              const live = data.prices[stock.ticker]
              return live ? { ...stock, basePrice: live.price, change: live.change } : stock
            }))
          }
          if (data.nifty_index?.price) setNiftyIndex(data.nifty_index)
        }
      } catch (err) { console.error("API bridge unavailable:", err) }
    }
    fetchLivePrices()
    const interval = setInterval(fetchLivePrices, 30000)
    return () => clearInterval(interval)
  }, [])

  // ── Simulation Tick ──
  useEffect(() => {
    if (!simulationMode && !marketOpen) return
    const interval = setInterval(() => {
      setStockPrices(prev => prev.map(stock => {
        const fl = (Math.random() - 0.5) * 0.003
        return { ...stock, basePrice: Number((stock.basePrice * (1 + fl)).toFixed(2)), change: Number((stock.change + fl * 100).toFixed(2)) }
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [simulationMode, marketOpen])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory])

  // ── DCF Math ──
  const g = growthRate / 100, disc = discountRate / 100, tg = terminalGrowth / 100
  const projectedFCFs = [], pvFCFs = []
  let fcf = initialFCF
  for (let yr = 1; yr <= 5; yr++) { fcf *= (1 + g); projectedFCFs.push(fcf); pvFCFs.push(fcf / Math.pow(1 + disc, yr)) }
  const waccMinusTg = disc - tg > 0 ? disc - tg : 0.02
  const terminalValue = (projectedFCFs[4] * (1 + tg)) / waccMinusTg
  const pvTerminalValue = terminalValue / Math.pow(1 + disc, 5)
  const intrinsicValue = pvFCFs.reduce((s, v) => s + v, 0) + pvTerminalValue
  const valuationGap = ((intrinsicValue - currentPrice) / currentPrice) * 100

  const selectedStockObj = stockPrices.find(s => s.ticker === selectedDcfTicker)
  const sharePrice = selectedStockObj ? selectedStockObj.basePrice : 1000
  const intrinsicSharePrice = sharePrice * (intrinsicValue / currentPrice)

  // ── Index Scores ──
  let totalVS = 0, totalRS = 0, totalW = 0
  stockPrices.forEach(stock => {
    const w = parseFloat(stock.weight.replace('%', ''))
    if (!isNaN(w)) {
      const pe = Math.max(stock.basePrice / 100, 1)
      const peScore = Math.max(0, Math.min(100, (28 / pe) * 50))
      const roe = stock.change > 0 ? 28 : 16, growth = stock.change > 0 ? 12 : 7
      totalVS += ((peScore * 0.4) + (roe * 2 * 0.3) + (growth * 4 * 0.3)) * w
      totalRS += (45 + (stock.change < 0 ? Math.abs(stock.change) * 12 : 0)) * w
      totalW += w
    }
  })
  const indexVS = totalW > 0 ? totalVS / totalW : 64.2
  const indexRS = totalW > 0 ? totalRS / totalW : 42.5

  // ── Handlers ──
  const handleDcfCompanySelect = async (ticker) => {
    if (!ticker) return
    setSelectedDcfTicker(ticker)
    setDcfLoading(true)
    try {
      const res = await fetch(`https://reasonmind-ai.onrender.com/api/dcf-company/${ticker}`)
      const data = await res.json()
      if (data.status === 'success') {
        setInitialFCF(data.initial_fcf_cr)
        setGrowthRate(data.growth_rate)
        setDiscountRate(data.wacc)
        setTerminalGrowth(data.terminal_growth)
        setCurrentPrice(data.market_cap_cr)
        setPrefilledCompany(data.company_name)
      } else {
        console.error("DCF API error:", data.error)
      }
    } catch (err) {
      console.error("Failed to fetch DCF data:", err)
    } finally {
      setDcfLoading(false)
    }
  }

  const handleCompare = () => {
    const s1 = stockPrices.find(s => s.ticker === compStock1)
    const s2 = stockPrices.find(s => s.ticker === compStock2)
    if (!s1 || !s2) return

    // Dynamic fundamentals selector for institutional comparative analysis
    const getStockFundamentals = (ticker, sector, price, change) => {
      const defaults = {
        'RELIANCE.NS': { pe: 28.5, roe: 14.2, debtEquity: 0.35, growth: 12.0 },
        'TCS.NS': { pe: 32.1, roe: 39.5, debtEquity: 0.05, growth: 8.5 },
        'INFY.NS': { pe: 29.8, roe: 31.2, debtEquity: 0.08, growth: 7.2 },
        'HDFCBANK.NS': { pe: 20.2, roe: 17.5, debtEquity: 0.85, growth: 22.0 },
        'ICICIBANK.NS': { pe: 18.5, roe: 16.8, debtEquity: 0.82, growth: 18.0 },
        'ITC.NS': { pe: 25.4, roe: 29.1, debtEquity: 0.01, growth: 6.5 },
        'HINDUNILVR.NS': { pe: 55.6, roe: 20.5, debtEquity: 0.04, growth: 5.0 },
        'SUNPHARMA.NS': { pe: 35.5, roe: 15.8, debtEquity: 0.12, growth: 10.5 },
        'LT.NS': { pe: 38.2, roe: 12.8, debtEquity: 1.20, growth: 15.2 },
      }
      if (defaults[ticker]) return defaults[ticker];
      
      const sectorDefaults = {
        'IT': { pe: 30.0, roe: 28.0, debtEquity: 0.10, growth: 9.0 },
        'Banking': { pe: 18.0, roe: 16.0, debtEquity: 0.80, growth: 15.0 },
        'FMCG': { pe: 45.0, roe: 25.0, debtEquity: 0.05, growth: 7.0 },
        'Energy': { pe: 20.0, roe: 12.0, debtEquity: 0.40, growth: 10.0 },
        'Pharma': { pe: 32.0, roe: 15.0, debtEquity: 0.15, growth: 11.0 },
        'Engineering': { pe: 35.0, roe: 12.0, debtEquity: 0.70, growth: 12.0 },
        'Automobile': { pe: 25.0, roe: 18.0, debtEquity: 0.30, growth: 14.0 }
      }
      const sec = sectorDefaults[sector] || { pe: 24.0, roe: 15.0, debtEquity: 0.30, growth: 10.0 };
      const hash = ticker.charCodeAt(0) + (ticker.charCodeAt(1) || 0);
      const peVar = ((hash % 10) - 5) * 0.5;
      const roeVar = ((hash % 8) - 4) * 0.4;
      return {
        pe: Math.max(8, Number((sec.pe + peVar).toFixed(1))),
        roe: Math.max(5, Number((sec.roe + roeVar).toFixed(1))),
        debtEquity: Number(sec.debtEquity.toFixed(2)),
        growth: Math.max(1, Number((sec.growth + (change || 0) * 0.5).toFixed(1)))
      }
    }

    const f1 = getStockFundamentals(compStock1, s1.sector, s1.basePrice, s1.change)
    const f2 = getStockFundamentals(compStock2, s2.sector, s2.basePrice, s2.change)

    // Calculate institutional scores using weighted normalized parameters out of 100: PE (30%), ROE (30%), Debt (20%), Growth (20%)
    const getScore = (metrics) => {
      const peScore = Math.max(0, Math.min(100, ((50 - metrics.pe) / 40) * 100));
      const roeScore = Math.max(0, Math.min(100, ((metrics.roe - 5) / 25) * 100));
      const deScore = Math.max(0, Math.min(100, ((2.0 - metrics.debtEquity) / 2.0) * 100));
      const growthScore = Math.max(0, Math.min(100, ((metrics.growth - 3) / 22) * 100));
      
      return Math.round(
        peScore * 0.30 + 
        roeScore * 0.30 + 
        deScore * 0.20 + 
        growthScore * 0.20
      );
    };

    const r1 = getScore(f1);
    const r2 = getScore(f2);

    const better = r1 > r2 ? s1.name : s2.name
    const winnerTicker = r1 > r2 ? s1.ticker : s2.ticker
    const reason = r1 > r2
      ? `${s1.name} (Score: ${r1}/100) ranks higher than ${s2.name} (Score: ${r2}/100) due to superior overall fundamentals, return on equity (${f1.roe}%), and balanced leverage.`
      : `${s2.name} (Score: ${r2}/100) ranks higher than ${s1.name} (Score: ${r1}/100) due to superior overall fundamentals, return on equity (${f2.roe}%), and balanced leverage.`

    setCompResult({ 
      stock1: s1, 
      stock2: s2, 
      betterOption: better, 
      winnerTicker,
      reason, 
      metrics: { 
        s1_score: r1, 
        s2_score: r2,
        s1: f1,
        s2: f2
      } 
    })
  }

  useEffect(() => {
    handleCompare()
  }, [compStock1, compStock2, stockPrices])

  const handlePredict = () => {
    const stock = stockPrices.find(s => s.ticker === predStock)
    if (!stock) return
    const sims = 1000, mu = 0.12, sigma = predVol / 100, t = predTime, p0 = stock.basePrice
    const drift = mu - 0.5 * sigma * sigma
    let prices = []
    for (let i = 0; i < sims; i++) {
      const u1 = Math.random(), u2 = Math.random()
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
      prices.push(p0 * Math.exp(drift * t + sigma * Math.sqrt(t) * z))
    }
    prices.sort((a, b) => a - b)
    const mean = prices.reduce((s, v) => s + v, 0) / sims
    setPredResult({
      name: stock.name, ticker: stock.ticker, current: p0,
      mean: +mean.toFixed(2), worst: +prices[Math.floor(sims * 0.05)].toFixed(2),
      best: +prices[Math.floor(sims * 0.95)].toFixed(2),
      change: +(((mean - p0) / p0) * 100).toFixed(2), runs: sims
    })
  }

  const handleGeneralSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!generalQuery.trim()) return
    
    const userQuery = generalQuery
    setChatHistory(prev => [...prev, { role: 'user', text: userQuery }])
    setGeneralQuery('')
    
    // Insert temporary loader state
    setChatHistory(prev => [...prev, { role: 'assistant', text: 'Analyzing financial data... ⚡' }])
    
    try {
      const historyFormatted = chatHistory.map(c => ({ role: c.role, text: c.text }))
      const res = await fetch('https://reasonmind-ai.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          history: historyFormatted
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        // Swap typing placeholder with final LLM response
        setChatHistory(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', text: data.reply }
          return next
        })
      } else {
        setChatHistory(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', text: `Engine Error: ${data.error || 'Unknown error'}` }
          return next
        })
      }
    } catch (err) {
      console.error("Failed to connect to AI chat backend:", err)
      setChatHistory(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', text: 'Failed to connect to AI Chat Engine. Please verify the Flask Backend is running.' }
        return next
      })
    }
  }

  // ── Derived Data ──
  const filtered = stockPrices.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sectorMap = {}
  stockPrices.forEach(s => {
    if (!sectorMap[s.sector]) sectorMap[s.sector] = { count: 0, totalWeight: 0 }
    sectorMap[s.sector].count++
    sectorMap[s.sector].totalWeight += parseFloat(s.weight.replace('%', '')) || 0
  })
  const topSectors = Object.entries(sectorMap).sort((a, b) => b[1].totalWeight - a[1].totalWeight).slice(0, 6)
  const gainers = [...stockPrices].sort((a, b) => b.change - a.change).slice(0, 5)
  const losers = [...stockPrices].sort((a, b) => a.change - b.change).slice(0, 5)

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)] font-sans antialiased">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 glass-card-static" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="max-w-[1360px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <IconZap />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] leading-none">ReasonMind AI</h1>
              <p className="text-[9px] text-[var(--color-text-tertiary)] font-medium tracking-widest uppercase mt-0.5">Financial Intelligence</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-[var(--color-surface-2)] rounded-xl p-0.5 border border-[var(--color-border-subtle)]">
            {[
              { id: 'explorer', label: 'Explorer', icon: <IconLayers /> },
              { id: 'dcf', label: 'DCF Valuator', icon: <IconBarChart /> },
              { id: 'chatbot', label: 'AI Assistant', icon: <IconZap /> },
            ].map(tab => (
              <button key={tab.id} id={`nav-${tab.id}`} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-[7px] rounded-[10px] text-[11px] font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-[var(--color-accent)] shadow-sm'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] px-3 py-1.5 rounded-xl">
              <span className="text-[9px] text-[var(--color-text-tertiary)] font-semibold uppercase tracking-wider">Nifty 50</span>
              <span className="text-[13px] font-bold font-mono text-[var(--color-text-primary)]">{formatINR(niftyIndex.price)}</span>
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${niftyIndex.change >= 0 ? 'badge-positive' : 'badge-negative'}`}>
                {niftyIndex.change >= 0 ? <IconTrendUp /> : <IconTrendDown />}
                {niftyIndex.change >= 0 ? '+' : ''}{niftyIndex.change}%
              </span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
              marketOpen ? 'badge-positive' : simulationMode ? 'badge-warning' : 'badge-negative'
            }`}>
              <span className={`w-[6px] h-[6px] rounded-full ${marketOpen ? 'bg-emerald-500 animate-pulse-dot' : simulationMode ? 'bg-amber-500 animate-pulse-dot' : 'bg-red-400'}`} />
              {marketOpen ? 'Live' : simulationMode ? 'Sim' : 'Closed'}
            </div>
          </div>
        </div>
      </header>

      {/* ─── MOBILE NAV ─── */}
      <div className="md:hidden sticky top-[56px] z-40 px-4 py-2 bg-[var(--color-surface-0)] border-b border-[var(--color-border-subtle)]">
        <nav className="flex bg-[var(--color-surface-2)] rounded-xl p-0.5 border border-[var(--color-border-subtle)]">
          {[{ id: 'explorer', label: 'Explorer' }, { id: 'dcf', label: 'DCF' }, { id: 'chatbot', label: 'AI Chat' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-[10px] text-[11px] font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-tertiary)]'
              }`}>{tab.label}</button>
          ))}
        </nav>
      </div>

      {/* ─── MAIN ─── */}
      <main className="max-w-[1360px] mx-auto px-6 py-7 space-y-7">

        {/* ══ GAINERS / LOSERS ══ */}
        <section className="animate-fade-in-up delay-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><IconTrendUp size={13} /> Top Gainers</h3>
              <div className="space-y-1">
                {gainers.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold text-[var(--color-text-muted)] w-4 text-right">{i + 1}</span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">{s.name}</span>
                      <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">{s.ticker.split('.')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold font-mono text-[var(--color-text-primary)]">₹{formatINR(s.basePrice)}</span>
                      <span className="badge-positive px-1.5 py-0.5 rounded text-[10px] font-bold">+{s.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><IconTrendDown size={13} /> Top Losers</h3>
              <div className="space-y-1">
                {losers.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold text-[var(--color-text-muted)] w-4 text-right">{i + 1}</span>
                      <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">{s.name}</span>
                      <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">{s.ticker.split('.')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold font-mono text-[var(--color-text-primary)]">₹{formatINR(s.basePrice)}</span>
                      <span className="badge-negative px-1.5 py-0.5 rounded text-[10px] font-bold">{s.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ TAB: EXPLORER ════════════════ */}
        {activeTab === 'explorer' && (
          <section className="animate-fade-in-up delay-2 space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">Nifty 50 Constituent Explorer</h2>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                    {marketOpen ? 'Live market feed — prices update in real time.' : 'Market closed — showing last closing prices.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!marketOpen && (
                    <button id="btn-simulation-toggle" onClick={() => setSimulationMode(!simulationMode)}
                      className={`px-3.5 py-[7px] rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                        simulationMode ? 'badge-warning' : 'border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                      }`}>
                      <IconActivity />{simulationMode ? 'Stop Simulation' : 'Demo Mode'}
                    </button>
                  )}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"><IconSearch /></span>
                    <input id="search-explorer" type="text" placeholder="Search name, ticker, sector..."
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-9 pr-4 py-[7px] bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {!marketOpen && (
              <div className={`glass-card rounded-xl px-5 py-3 text-[11px] flex items-center justify-between ${simulationMode ? 'border-amber-300/30' : ''}`}>
                <div>
                  <span className={`font-bold ${simulationMode ? 'text-amber-600' : 'text-red-500'}`}>NSE Market Closed</span>
                  <span className="text-[var(--color-text-tertiary)] ml-2">Mon–Fri, 9:15 AM – 3:30 PM IST</span>
                </div>
                {simulationMode && <span className="badge-warning px-2 py-0.5 rounded text-[9px] font-bold animate-pulse">SIM ACTIVE</span>}
              </div>
            )}

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Top Sectors by Index Weight</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {topSectors.map(([sector, data], i) => (
                  <div key={i} className="metric-inner text-center">
                    <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium truncate">{sector}</p>
                    <p className="text-base font-bold font-mono text-[var(--color-text-primary)] mt-0.5">{data.totalWeight.toFixed(1)}%</p>
                    <p className="text-[9px] text-[var(--color-text-muted)]">{data.count} stocks</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider w-10">#</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Company</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Ticker</th>
                      <th className="px-5 py-3.5 text-left text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Sector</th>
                      <th className="px-5 py-3.5 text-right text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Weight</th>
                      <th className="px-5 py-3.5 text-right text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Price</th>
                      <th className="px-5 py-3.5 text-right text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map((c, idx) => {
                      const up = c.change >= 0
                      return (
                        <tr key={idx} onClick={() => handleCompanyClick(c)} className="table-row-hover border-b border-[var(--color-border-subtle)] last:border-0 cursor-pointer hover:bg-slate-50/70 active:bg-slate-100/85 transition-all">
                          <td className="px-5 py-3 text-[var(--color-text-muted)] font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-5 py-3 font-semibold text-[var(--color-text-primary)]">{c.name}</td>
                          <td className="px-5 py-3"><code className="badge-accent px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">{c.ticker}</code></td>
                          <td className="px-5 py-3 text-[var(--color-text-secondary)]">{c.sector}</td>
                          <td className="px-5 py-3 text-right text-[var(--color-text-tertiary)] font-mono text-[12px]">{c.weight}</td>
                          <td className={`px-5 py-3 text-right font-bold font-mono ${up ? 'text-emerald-600' : 'text-red-500'}`}>₹{formatINR(c.basePrice)}</td>
                          <td className="px-5 py-3 text-right">
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${up ? 'badge-positive' : 'badge-negative'}`}>
                              {up ? <IconTrendUp /> : <IconTrendDown />}{up ? '+' : ''}{c.change}%
                            </span>
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr><td colSpan={7} className="px-5 py-10 text-center text-[var(--color-text-muted)] font-medium">No matching constituents.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════ TAB: DCF ════════════════ */}
        {activeTab === 'dcf' && (
          <section className="animate-fade-in-up delay-2 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Parameters */}
              <div className="glass-card glow-border rounded-2xl p-6 space-y-5 lg:col-span-1 relative overflow-hidden">
                {dcfLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10 animate-fade-in">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-[var(--color-accent)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-[10px] font-bold text-[var(--color-text-secondary)]">Analyzing statements...</span>
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="text-base font-bold text-[var(--color-text-primary)] tracking-tight">DCF Parameters</h2>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Adjust inputs for real-time valuation</p>
                  
                  {prefilledCompany && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[9px] font-semibold text-indigo-600 mt-2">
                      <span className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse"></span>
                      Auto-prefilled: {prefilledCompany}
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Mode Selector */}
                  <div className="flex bg-[var(--color-surface-2)] p-1 rounded-xl border border-[var(--color-border-subtle)]">
                    <button 
                      type="button"
                      onClick={() => { setDcfMode('manual'); setPrefilledCompany(null); }}
                      className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${dcfMode === 'manual' ? 'bg-white text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'}`}
                    >
                      Manual Sandbox
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setDcfMode('prefill'); if (selectedDcfTicker) handleDcfCompanySelect(selectedDcfTicker); }}
                      className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg transition-all ${dcfMode === 'prefill' ? 'bg-white text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'}`}
                    >
                      Nifty 50 Pre-fill
                    </button>
                  </div>

                  {/* Company Dropdown Select */}
                  {dcfMode === 'prefill' && (
                    <div className="space-y-1.5 animate-fade-in-up">
                      <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">Select Nifty 50 Company</label>
                      <select 
                        value={selectedDcfTicker} 
                        onChange={(e) => handleDcfCompanySelect(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl text-[12px] text-[var(--color-text-primary)] font-medium focus:outline-none focus:border-[var(--color-border-accent)] transition-all"
                      >
                        <option value="">-- Choose Company --</option>
                        {stockPrices.map((s) => (
                          <option key={s.ticker} value={s.ticker}>{s.name} ({s.ticker.replace('.NS', '')})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {[
                    { label: 'Initial FCF', unit: `₹${initialFCF} Cr`, min: 100, max: 100000, step: 500, value: initialFCF, setter: setInitialFCF, desc: "The starting free cash flow. This is the cash generated after operating expenses and capital expenditures, serving as the base for future growth projections." },
                    { label: '5-Year Growth', unit: `${growthRate}%`, min: 1, max: 25, step: 0.5, value: growthRate, setter: setGrowthRate, desc: "The expected annual growth rate of Free Cash Flow for the next 5 years. Reflects the company's near-term expansion potential." },
                    { label: 'WACC (Discount)', unit: `${discountRate}%`, min: 5, max: 20, step: 0.5, value: discountRate, setter: setDiscountRate, desc: "Weighted Average Cost of Capital. The discount rate used to convert future cash flows into present value, representing the minimum required rate of return." },
                    { label: 'Terminal Growth', unit: `${terminalGrowth}%`, min: 1, max: 5, step: 0.1, value: terminalGrowth, setter: setTerminalGrowth, desc: "The constant rate at which cash flows grow indefinitely after Year 5. Usually capped close to long-term GDP growth (1.5% - 3.5%)." },
                  ].map((s, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
                          {s.label}
                          <div className="relative group inline-block">
                            <span className="text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors cursor-help inline-flex items-center">
                              <IconInfo />
                            </span>
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block group-focus-within:block w-64 p-3 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-xl shadow-xl z-50 leading-relaxed normal-case font-normal text-left">
                              <p className="font-bold text-[11px] mb-1 text-indigo-600">{s.label}</p>
                              {s.desc}
                              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-white"></div>
                              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-slate-200 -z-10 mt-[1px]"></div>
                            </div>
                          </div>
                        </span>
                        <span className="font-bold font-mono text-[var(--color-accent)]">{s.unit}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.setter(Number(e.target.value))}
                        disabled={dcfMode === 'prefill'}
                        className="disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                  ))}
                  <div className="space-y-1.5 pt-3 border-t border-[var(--color-border-subtle)]">
                    <label className="text-[11px] font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
                      Market Cap (₹ Cr)
                      <div className="relative group inline-block">
                        <span className="text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors cursor-help inline-flex items-center">
                          <IconInfo />
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block group-focus-within:block w-64 p-3 bg-white border border-slate-200 text-slate-600 text-[10px] rounded-xl shadow-xl z-50 leading-relaxed normal-case font-normal text-left">
                          <p className="font-bold text-[11px] mb-1 text-indigo-600">Market Cap (₹ Cr)</p>
                          Market Capitalization in Crores (₹ 10 million). The total valuation of the company's equity, compared directly with the Intrinsic Value to determine if it is under/overvalued.
                          <div className="absolute top-full left-1.5 border-4 border-transparent border-t-white"></div>
                          <div className="absolute top-full left-1.5 border-4 border-transparent border-t-slate-200 -z-10 mt-[1px]"></div>
                        </div>
                      </div>
                    </label>
                    <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))}
                      disabled={dcfMode === 'prefill'}
                      className="w-full px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl text-[13px] text-[var(--color-text-primary)] font-mono font-bold disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-2 space-y-5">
                <div className="glass-card glow-border rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">Valuation Output</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Intrinsic Value', value: `₹${intrinsicValue.toFixed(0)}`, sub: 'Crores' },
                      { label: 'Terminal Value PV', value: `₹${pvTerminalValue.toFixed(0)}`, sub: 'Crores' },
                      { label: 'Current Price', value: `₹${currentPrice.toLocaleString()}`, sub: 'Market Cap' },
                    ].map((m, i) => (
                      <div key={i} className="metric-inner">
                        <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium uppercase">{m.label}</p>
                        <p className="text-lg font-extrabold font-mono text-[var(--color-text-primary)] mt-1">{m.value}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)]">{m.sub}</p>
                      </div>
                    ))}
                    <div className={`rounded-xl p-4 border ${
                      valuationGap > 10 ? 'bg-emerald-50 border-emerald-200' : valuationGap < -10 ? 'bg-red-50 border-red-200' : 'metric-inner'
                    }`}>
                      <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium uppercase">Gap</p>
                      <p className={`text-lg font-extrabold font-mono mt-1 ${valuationGap > 10 ? 'text-emerald-600' : valuationGap < -10 ? 'text-red-600' : 'text-[var(--color-text-secondary)]'}`}>
                        {valuationGap > 0 ? '+' : ''}{valuationGap.toFixed(1)}%
                      </p>
                      <p className={`text-[9px] font-semibold ${valuationGap > 10 ? 'text-emerald-600' : valuationGap < -10 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                        {valuationGap > 10 ? "Buy Signal" : valuationGap < -10 ? "Avoid" : "Hold"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">5-Year Cash Flow Projections</h3>
                  <div className="grid grid-cols-5 gap-2.5">
                    {projectedFCFs.map((v, i) => (
                      <div key={i} className="metric-inner text-center hover:border-[var(--color-border-accent)] transition-all">
                        <p className="text-[9px] text-[var(--color-text-muted)] font-bold uppercase">Year {i + 1}</p>
                        <p className="text-[15px] font-extrabold font-mono text-[var(--color-text-primary)] mt-1">₹{v.toFixed(0)}</p>
                        <p className="text-[9px] text-[var(--color-text-muted)] font-mono mt-0.5">PV: ₹{pvFCFs[i].toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-Share Stock Price Projections */}
                <div className="glass-card rounded-2xl p-6 border border-indigo-100 bg-indigo-50/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Predicted Price Targets & 5-Year Trajectory</h3>
                      <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Predicting future target share prices based on capital growth and WACC cost models</p>
                    </div>
                    {prefilledCompany && (
                      <span className="badge-accent px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                        {selectedDcfTicker.replace('.NS', '')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 pb-4 border-b border-[var(--color-border-subtle)]">
                    <div className="metric-inner bg-white/60">
                      <p className="text-[9px] text-[var(--color-text-tertiary)] font-semibold uppercase tracking-wider">Current Share Price</p>
                      <p className="text-base font-extrabold font-mono text-[var(--color-text-primary)] mt-1">
                        ₹{sharePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[8px] text-[var(--color-text-muted)] mt-0.5 font-medium">Live Market Price</p>
                    </div>
                    
                    <div className="metric-inner bg-white/60">
                      <p className="text-[9px] text-[var(--color-text-tertiary)] font-semibold uppercase tracking-wider">Predicted Target Price</p>
                      <p className="text-base font-extrabold font-mono text-indigo-600 mt-1">
                        ₹{intrinsicSharePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[8px] text-indigo-500 font-bold mt-0.5">DCF Target Fair Value</p>
                    </div>

                    <div className={`rounded-xl p-3.5 border ${
                      valuationGap > 10 ? 'bg-emerald-100/50 border-emerald-200' : valuationGap < -10 ? 'bg-red-100/50 border-red-200' : 'metric-inner bg-white/60'
                    }`}>
                      <p className="text-[9px] text-[var(--color-text-tertiary)] font-semibold uppercase tracking-wider">Margin of Safety</p>
                      <p className={`text-base font-extrabold font-mono mt-1 ${valuationGap > 10 ? 'text-emerald-600' : valuationGap < -10 ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                        {valuationGap > 0 ? '+' : ''}{valuationGap.toFixed(1)}%
                      </p>
                      <p className={`text-[8px] font-extrabold ${valuationGap > 10 ? 'text-emerald-600' : valuationGap < -10 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
                        {valuationGap > 10 ? "Undervalued (Discount)" : valuationGap < -10 ? "Overvalued (Premium)" : "Fairly Valued"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2.5">Predicted Stock Price Targets (Next 5 Years)</h4>
                    <div className="grid grid-cols-5 gap-2.5">
                      {[1, 2, 3, 4, 5].map((yr) => {
                        const projectedPrice = intrinsicSharePrice * Math.pow(1 + g, yr);
                        return (
                          <div key={yr} className="metric-inner bg-white/50 text-center hover:border-indigo-200 transition-all">
                            <p className="text-[8px] text-[var(--color-text-muted)] font-bold uppercase">Year {yr}</p>
                            <p className="text-[13px] font-extrabold font-mono text-[var(--color-text-primary)] mt-1">
                              ₹{projectedPrice.toFixed(0)}
                            </p>
                            <p className="text-[7.5px] text-indigo-500 font-semibold mt-0.5">
                              +{((projectedPrice - sharePrice) / sharePrice * 100).toFixed(0)}% ROI
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`glass-card rounded-2xl p-6 text-center ${
                  valuationGap > 10 ? 'border-emerald-200' : valuationGap < -10 ? 'border-red-200' : ''
                }`}>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] font-bold uppercase tracking-wider mb-2">Investment Stance</p>
                  <p className={`text-xl font-extrabold ${valuationGap > 10 ? 'text-emerald-600' : valuationGap < -10 ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                    {valuationGap > 10 ? "📈 Undervalued — Strong Buy" : valuationGap < -10 ? "📉 Overvalued — Risk Avoidance" : "⚖️ Fair Value — Hold"}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5">Based on {growthRate}% growth, {discountRate}% WACC, {terminalGrowth}% terminal growth</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════ TAB: CHATBOT ════════════════ */}
        {activeTab === 'chatbot' && (
          <section className="animate-fade-in-up delay-2">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Main Chat */}
              <div className="glass-card glow-border rounded-2xl p-6 lg:col-span-3 flex flex-col" style={{ minHeight: '500px' }}>
                <div className="flex items-center bg-[var(--color-surface-2)] rounded-xl p-0.5 border border-[var(--color-border-subtle)] mb-5">
                  {[{ id: 'compare', label: 'Compare' }, { id: 'predictor', label: 'Predictor' }, { id: 'general', label: 'General AI' }].map(tab => (
                    <button key={tab.id} onClick={() => setChatMode(tab.id)}
                      className={`flex-1 py-2 rounded-[10px] text-[11px] font-semibold transition-all ${
                        chatMode === tab.id ? 'bg-white text-[var(--color-accent)] shadow-sm' : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                      }`}>{tab.label}</button>
                  ))}
                </div>

                {/* Compare */}
                {chatMode === 'compare' && (
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[{ label: 'Stock A', val: compStock1, set: setCompStock1, opts: stockPrices },
                          { label: 'Stock B', val: compStock2, set: setCompStock2, opts: stockPrices.filter(s => s.ticker !== compStock1) }
                        ].map((sel, i) => (
                          <div key={i} className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{sel.label}</label>
                            <select value={sel.val} onChange={(e) => sel.set(e.target.value)}
                              className="w-full text-[12px] p-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl font-semibold text-[var(--color-text-primary)] appearance-none">
                              {sel.opts.map((s, idx) => <option key={idx} value={s.ticker}>{s.name}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      {compResult && (
                        <div className="animate-fade-in bg-white border border-[var(--color-border-subtle)] rounded-xl p-4 space-y-4 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="badge-accent px-2 py-0.5 rounded text-[10px] font-bold">🏆 Recommendation</span>
                            <span className="text-[12px] font-bold text-[var(--color-text-primary)]">{compResult.betterOption} is the stronger pick</span>
                          </div>
                          
                          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface-2)] p-2.5 rounded-xl border border-[var(--color-border-subtle)]">{compResult.reason}</p>
                          
                          <div className="overflow-x-auto pt-1">
                            <table className="w-full text-left border-collapse text-[11px]">
                              <thead>
                                <tr className="border-b border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold">
                                  <th className="py-2">Metric</th>
                                  <th className={`py-2 text-center ${compResult.winnerTicker === compResult.stock1.ticker ? 'text-indigo-600 font-extrabold' : ''}`}>
                                    {compResult.stock1.name} {compResult.winnerTicker === compResult.stock1.ticker ? '🏆' : ''}
                                  </th>
                                  <th className={`py-2 text-center ${compResult.winnerTicker === compResult.stock2.ticker ? 'text-indigo-600 font-extrabold' : ''}`}>
                                    {compResult.stock2.name} {compResult.winnerTicker === compResult.stock2.ticker ? '🏆' : ''}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { label: 'P/E Ratio', val1: `${compResult.metrics.s1.pe}x`, val2: `${compResult.metrics.s2.pe}x`, better: compResult.metrics.s1.pe < compResult.metrics.s2.pe ? 1 : 2 },
                                  { label: 'Return on Equity (ROE)', val1: `${compResult.metrics.s1.roe}%`, val2: `${compResult.metrics.s2.roe}%`, better: compResult.metrics.s1.roe > compResult.metrics.s2.roe ? 1 : 2 },
                                  { label: 'Debt-to-Equity', val1: compResult.metrics.s1.debtEquity, val2: compResult.metrics.s2.debtEquity, better: compResult.metrics.s1.debtEquity < compResult.metrics.s2.debtEquity ? 1 : 2 },
                                  { label: 'Expected growth', val1: `${compResult.metrics.s1.growth}%`, val2: `${compResult.metrics.s2.growth}%`, better: compResult.metrics.s1.growth > compResult.metrics.s2.growth ? 1 : 2 },
                                  { label: 'Daily Momentum', val1: `${compResult.stock1.change >= 0 ? '+' : ''}${compResult.stock1.change}%`, val2: `${compResult.stock2.change >= 0 ? '+' : ''}${compResult.stock2.change}%`, better: compResult.stock1.change > compResult.stock2.change ? 1 : 2 },
                                ].map((row, idx) => (
                                  <tr key={idx} className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-slate-50/50">
                                    <td className="py-2.5 font-medium text-[var(--color-text-secondary)]">{row.label}</td>
                                    <td className={`py-2.5 text-center font-mono font-bold ${row.better === 1 ? 'text-emerald-600' : 'text-[var(--color-text-primary)]'}`}>
                                      {row.val1} {row.better === 1 ? '▲' : ''}
                                    </td>
                                    <td className={`py-2.5 text-center font-mono font-bold ${row.better === 2 ? 'text-emerald-600' : 'text-[var(--color-text-primary)]'}`}>
                                      {row.val2} {row.better === 2 ? '▲' : ''}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-indigo-50/30 font-bold border-t-2 border-indigo-100">
                                  <td className="py-3 px-2 text-indigo-600">ReasonMind Score</td>
                                  <td className={`py-3 text-center font-mono text-xs ${compResult.winnerTicker === compResult.stock1.ticker ? 'text-indigo-600 font-extrabold text-[13px]' : 'text-[var(--color-text-secondary)]'}`}>
                                    {compResult.metrics.s1_score} / 100
                                  </td>
                                  <td className={`py-3 text-center font-mono text-xs ${compResult.winnerTicker === compResult.stock2.ticker ? 'text-indigo-600 font-extrabold text-[13px]' : 'text-[var(--color-text-secondary)]'}`}>
                                    {compResult.metrics.s2_score} / 100
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Predictor */}
                {chatMode === 'predictor' && (
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Stock</label>
                          <select value={predStock} onChange={(e) => setPredStock(e.target.value)}
                            className="w-full text-[12px] p-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl font-semibold text-[var(--color-text-primary)] appearance-none">
                            {stockPrices.map((s, idx) => <option key={idx} value={s.ticker}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Horizon (Yrs)</label>
                          <input type="number" min="1" max="5" value={predTime} onChange={(e) => setPredTime(Number(e.target.value))}
                            className="w-full text-[12px] p-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl font-semibold font-mono text-[var(--color-text-primary)]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Vol {predVol}%</label>
                          <div className="pt-2.5"><input type="range" min="10" max="60" step="5" value={predVol} onChange={(e) => setPredVol(Number(e.target.value))} /></div>
                        </div>
                      </div>
                      {predResult && (
                        <div className="animate-fade-in bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-bold text-[var(--color-text-primary)]">{predResult.name} — Monte Carlo</p>
                            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{predResult.runs} sims</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Worst (5th)', val: predResult.worst, cls: 'bg-red-50 border-red-200 text-red-600', lblCls: 'text-red-400' },
                              { label: 'Mean', val: predResult.mean, cls: 'bg-indigo-50 border-indigo-200 text-indigo-600', lblCls: 'text-indigo-400' },
                              { label: 'Best (95th)', val: predResult.best, cls: 'bg-emerald-50 border-emerald-200 text-emerald-600', lblCls: 'text-emerald-400' },
                            ].map((r, i) => (
                              <div key={i} className={`rounded-xl p-4 text-center border ${r.cls}`}>
                                <p className={`text-[9px] font-bold uppercase tracking-wider ${r.lblCls}`}>{r.label}</p>
                                <p className="text-base font-extrabold font-mono mt-1">₹{r.val.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-center mt-2">
                            <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] px-3.5 py-1.5 rounded-xl border border-[var(--color-border-subtle)] font-mono">
                              Current Price: <span className="text-[var(--color-text-primary)] font-bold">₹{predResult.current.toLocaleString()}</span> → Expected Target: <span className={predResult.change >= 0 ? 'text-emerald-600 font-extrabold' : 'text-red-500 font-extrabold'}>{predResult.change >= 0 ? '+' : ''}{predResult.change}%</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button id="btn-predict" onClick={handlePredict} className="btn-primary mt-4 w-full py-2.5 text-[12px]">Run Monte Carlo Simulation</button>
                  </div>
                )}

                {/* General */}
                {chatMode === 'general' && (
                  <div className="flex-grow flex flex-col" style={{ minHeight: '380px' }}>
                    <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 mb-4">
                      {chatHistory.map((c, idx) => (
                        <div key={idx} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                          <div className={`max-w-[80%] px-4 py-2.5 text-[12px] leading-relaxed ${c.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
                            {c.role === 'user' ? c.text : renderAssistantMessage(c.text)}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleGeneralSubmit} className="flex gap-2 pt-3 border-t border-[var(--color-border-subtle)]">
                      <input id="chat-input" type="text" placeholder="Ask about PE, ROE, WACC, DCF, or any Nifty company..."
                        value={generalQuery} onChange={(e) => setGeneralQuery(e.target.value)}
                        className="flex-grow px-4 py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-xl text-[12px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]" />
                      <button type="submit" className="btn-primary px-4 py-2.5"><IconSend /></button>
                    </form>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card rounded-2xl p-5 space-y-3">
                  <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">Quick Topics</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["P/E Ratio", "ROE", "WACC", "DCF", "Monte Carlo", "Nifty 50", "Compare"].map((t, i) => (
                      <button key={i} onClick={() => { setChatMode('general'); setGeneralQuery(t) }}
                        className="px-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-lg text-[10px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-border-accent)] transition-all">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-5 space-y-3">
                  <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">System Status</h3>
                  {[
                    { label: "Flask API", port: "5000", ok: true },
                    { label: "React Dashboard", port: "5173", ok: true },
                    { label: "NSE Feed", port: "—", ok: marketOpen },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--color-text-secondary)]">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[var(--color-text-muted)] text-[10px]">{s.port}</span>
                        <span className={`w-[6px] h-[6px] rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        <span className={`font-semibold ${s.ok ? 'text-emerald-600' : 'text-red-500'}`}>{s.ok ? 'Active' : 'Closed'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ─── COMPANY DETAILS MODAL WITH CANDLESTICK & VOLATILITY CHARTS ─── */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-sm">
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900 leading-none">{selectedCompany.name}</h2>
                    <span className="badge-accent px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">{selectedCompany.ticker.split('.')[0]}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{selectedCompany.sector} Constituent · Nifty 50 Weight: {selectedCompany.weight}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-base font-extrabold font-mono text-slate-900 leading-none">₹{formatINR(selectedCompany.basePrice)}</p>
                  <span className={`inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${selectedCompany.change >= 0 ? 'badge-positive' : 'badge-negative'}`}>
                    {selectedCompany.change >= 0 ? '+' : ''}{selectedCompany.change}%
                  </span>
                </div>
                
                <button onClick={() => setSelectedCompany(null)} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-grow">
              {chartLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-[12px] font-bold text-slate-500">Retrieving historical stock data...</span>
                </div>
              ) : historicalData ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "30D Avg Close", value: `₹${formatINR(average(historicalData.candlesticks.map(c => c.close)))}`, sub: "Historical average" },
                      { label: "30D High Peak", value: `₹${formatINR(Math.max(...historicalData.candlesticks.map(c => c.high)))}`, sub: "Max trading high" },
                      { label: "30D Low Valley", value: `₹${formatINR(Math.min(...historicalData.candlesticks.map(c => c.low)))}`, sub: "Min trading low" },
                      { label: "Avg Volatility Spread", value: `${average(historicalData.volatility.map(v => v.value)).toFixed(2)}%`, sub: "Daily average variance", premium: true },
                    ].map((st, i) => (
                      <div key={i} className={`rounded-2xl p-4 border border-slate-100 bg-slate-50/40 ${st.premium ? 'bg-indigo-50/20 border-indigo-100/60' : ''}`}>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{st.label}</p>
                        <p className={`text-base font-extrabold font-mono mt-1 ${st.premium ? 'text-indigo-600' : 'text-slate-800'}`}>{st.value}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-medium">{st.sub}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid Layout for Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Candlestick Chart */}
                    <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">30-Day Candlestick Chart</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Daily Open, High, Low, and Close prices</p>
                      </div>
                      <div className="h-64 relative">
                        <CandlestickChart data={historicalData.candlesticks} />
                      </div>
                    </div>
                    
                    {/* Volatility Chart */}
                    <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Daily Volatility Graph</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">High-Low daily spread index (%)</p>
                      </div>
                      <div className="h-64 relative">
                        <VolatilityChart data={historicalData.volatility} />
                      </div>
                    </div>
                    
                  </div>
                  
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <p className="font-semibold text-sm">Failed to load chart data.</p>
                  <button onClick={() => handleCompanyClick(selectedCompany)} className="mt-3 btn-primary px-4 py-2 text-[11px]">Retry</button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--color-border-subtle)] mt-6 bg-white">
        <div className="max-w-[1360px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[var(--color-text-muted)] gap-3">
          <p>© 2026 ReasonMind AI — Financial Intelligence Platform</p>
          <div className="flex items-center gap-3 text-[var(--color-text-tertiary)]">
            <span className="font-semibold">yfinance Live</span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="font-semibold">DCF · DDM · Monte Carlo</span>
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="font-semibold">Self-Correcting Agent</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
