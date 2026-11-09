// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/Button';
import { QRForms } from './features/generator/QRForms';
import { Customization } from './features/generator/Customization';
import { Preview } from './features/generator/Preview';
import { Scanner } from './features/scanner/Scanner';
import { BulkGenerator } from './features/bulk/BulkGenerator';
import { History } from './features/history/History';
import { QRType, QROptions, defaultOptions, QRHistoryItem } from './types';
import { formatQRData } from './lib/qr-formatters';
import { ToastProvider, useToast } from './components/ui/Toast';
import { 
  Link, FileText, Mail, Phone, MessageSquare, UserPlus, 
  Wifi, MapPin, Calendar, Bitcoin, Share2, QrCode, ScanLine, 
  History as HistoryIcon, Layers, Sun, Moon, Bookmark, Eye,
  SlidersHorizontal, Edit3, Sparkles
} from 'lucide-react';

const qrTypes: { id: QRType; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'Website URL', icon: <Link size={18} /> },
  { id: 'text', label: 'Plain Text', icon: <FileText size={18} /> },
  { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi size={18} /> },
  { id: 'vcard', label: 'Digital vCard', icon: <UserPlus size={18} /> },
  { id: 'email', label: 'Email Message', icon: <Mail size={18} /> },
  { id: 'phone', label: 'Phone Call', icon: <Phone size={18} /> },
  { id: 'sms', label: 'SMS Text', icon: <MessageSquare size={18} /> },
  { id: 'social', label: 'Social Profile', icon: <Share2 size={18} /> },
  { id: 'location', label: 'Location Pin', icon: <MapPin size={18} /> },
  { id: 'event', label: 'Calendar Event', icon: <Calendar size={18} /> },
  { id: 'crypto', label: 'Crypto Address', icon: <Bitcoin size={18} /> },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan' | 'bulk' | 'history'>('generate');
  const [mobileGenStep, setMobileGenStep] = useState<'content' | 'customize' | 'preview'>('content');
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [data, setData] = useState<any>({ url: 'https://' });
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [isDark, setIsDark] = useState(false);
  const { showToast } = useToast();

  // Dark mode initialization
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync formatted data with options
  useEffect(() => {
    const formattedData = formatQRData(selectedType, data);
    setOptions(prev => ({ 
      ...prev, 
      data: formattedData || 'https://' 
    }));
  }, [selectedType, data]);

  const saveToHistory = () => {
    const historyItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      type: selectedType,
      data,
      options,
      name: `${selectedType.toUpperCase()} - ${new Date().toLocaleDateString()}`
    };
    
    const saved = localStorage.getItem('qr-history');
    let historyList: QRHistoryItem[] = [];
    if (saved) {
      try {
        historyList = JSON.parse(saved);
      } catch (e) {
        historyList = [];
      }
    }
    
    historyList.unshift(historyItem);
    localStorage.setItem('qr-history', JSON.stringify(historyList));
    showToast('QR Code saved to History!', 'success');
  };

  const loadFromHistory = (item: QRHistoryItem) => {
    setSelectedType(item.type);
    setData(item.data);
    setOptions(item.options);
    setActiveTab('generate');
    setMobileGenStep('content');
    showToast(`Loaded ${item.name || item.type} from history`, 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-sm shadow-indigo-500/30">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
                QR GEN PRO
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                Center Logo Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Custom styles &bull; Scanner &bull; Bulk CSV</p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button 
            onClick={() => setActiveTab('generate')} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'generate' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <QrCode size={15} />
            Generator
          </button>

          <button 
            onClick={() => setActiveTab('scan')} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'scan' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ScanLine size={15} />
            Scanner
          </button>

          <button 
            onClick={() => setActiveTab('bulk')} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bulk' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers size={15} />
            Bulk CSV
          </button>

          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' 
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <HistoryIcon size={15} />
            History
          </button>
        </nav>
        
        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {activeTab === 'generate' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={saveToHistory}
              className="hidden sm:inline-flex gap-1.5 text-xs h-9"
              title="Save to History"
            >
              <Bookmark size={14} />
              Save
            </Button>
          )}

          <button 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col pb-20 md:pb-6">
        {activeTab === 'generate' ? (
          <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
            {/* Desktop Left Sidebar: QR Content Types */}
            <aside className="hidden lg:block w-64 p-6 border-r border-slate-200 dark:border-slate-800 shrink-0">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
                Content Type
              </p>
              <div className="space-y-1">
                {qrTypes.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.id);
                      setData({});
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                      selectedType === t.id 
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-500/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span className={selectedType === t.id ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile / Tablet Horizontal Content Type Selector */}
            <div className="lg:hidden px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Type
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {qrTypes.find(t => t.id === selectedType)?.label}
                </span>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
                {qrTypes.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.id);
                      setData({});
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      selectedType === t.id 
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Step Segment Switcher */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold mt-3">
                <button
                  type="button"
                  onClick={() => setMobileGenStep('content')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                    mobileGenStep === 'content'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Edit3 size={14} />
                  <span>1. Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileGenStep('customize')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                    mobileGenStep === 'customize'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  <span>2. Logo & Style</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileGenStep('preview')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                    mobileGenStep === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Eye size={14} />
                  <span>3. Preview</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Work Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Desktop View shows Content + Customization side-by-side with Preview */}
              {/* Mobile View switches between Content, Customize, and Preview via mobileGenStep */}

              <div className="space-y-6">
                {/* 1. Content Form (visible on desktop OR when mobileGenStep is 'content') */}
                <div className={`${mobileGenStep !== 'content' ? 'hidden lg:block' : 'block'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        {qrTypes.find(t => t.id === selectedType)?.icon}
                      </span>
                      <span>Enter {qrTypes.find(t => t.id === selectedType)?.label} Data</span>
                    </h2>
                    <span className="text-xs text-slate-400 hidden sm:inline">Instant live sync</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <QRForms type={selectedType} data={data} onChange={setData} />
                  </div>

                  {/* Mobile Quick Action to Next Step */}
                  <div className="lg:hidden mt-4 flex gap-2">
                    <Button 
                      className="w-full gap-2 text-xs h-11"
                      onClick={() => setMobileGenStep('customize')}
                    >
                      <SlidersHorizontal size={16} />
                      Next: Add Logo & Customize
                    </Button>
                  </div>
                </div>

                {/* 2. Customization (Logo, Pattern, Colors) */}
                <div className={`${mobileGenStep !== 'customize' ? 'hidden lg:block' : 'block'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <SlidersHorizontal size={18} />
                      </span>
                      <span>Center Logo & Visual Styling</span>
                    </h2>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      High Scannability Engine
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Customization options={options} onChange={setOptions} />
                  </div>

                  {/* Mobile Quick Action to Preview Step */}
                  <div className="lg:hidden mt-4 flex gap-2">
                    <Button 
                      variant="outline"
                      className="w-1/2 gap-1.5 text-xs h-11"
                      onClick={() => setMobileGenStep('content')}
                    >
                      Back to Content
                    </Button>
                    <Button 
                      className="w-1/2 gap-1.5 text-xs h-11"
                      onClick={() => setMobileGenStep('preview')}
                    >
                      <Eye size={16} />
                      View Preview & Download
                    </Button>
                  </div>
                </div>

                {/* 3. Mobile Preview View (visible when mobileGenStep is 'preview') */}
                <div className={`lg:hidden ${mobileGenStep === 'preview' ? 'block' : 'hidden'}`}>
                  <Preview options={options} />
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-xs h-10" 
                      onClick={saveToHistory}
                    >
                      <Bookmark size={15} />
                      Save to History
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full gap-1.5 text-xs h-10 text-slate-500"
                      onClick={() => setMobileGenStep('customize')}
                    >
                      &larr; Back to Logo & Style Settings
                    </Button>
                  </div>
                </div>
              </div>
            </main>

            {/* Desktop Right Column: Sticky Live Preview */}
            <aside className="hidden lg:block w-96 p-6 border-l border-slate-200 dark:border-slate-800 shrink-0">
              <div className="sticky top-20 space-y-4">
                <Preview options={options} />
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-xs h-10" 
                  onClick={saveToHistory}
                >
                  <Bookmark size={16} />
                  Save to History
                </Button>
              </div>
            </aside>
          </div>
        ) : (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto">
            {activeTab === 'scan' && <Scanner />}
            {activeTab === 'bulk' && <BulkGenerator />}
            {activeTab === 'history' && <History onLoad={loadFromHistory} />}
          </main>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        role="navigation"
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-40"
      >
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            activeTab === 'generate'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <QrCode size={20} />
          <span className="text-[11px] mt-1">Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            activeTab === 'scan'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ScanLine size={20} />
          <span className="text-[11px] mt-1">Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            activeTab === 'bulk'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers size={20} />
          <span className="text-[11px] mt-1">Bulk CSV</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
            activeTab === 'history'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <HistoryIcon size={20} />
          <span className="text-[11px] mt-1">History</span>
        </button>
      </nav>

      {/* Desktop Footer Toolbar */}
      <footer className="hidden md:flex h-10 bg-slate-900 text-slate-400 text-xs items-center justify-between px-6 shrink-0 z-10 border-t border-slate-800">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Session: <span className="text-emerald-400 font-medium">Local Privacy Mode (No Tracking)</span>
          </span>
          <span>Automatic High Error Correction for Logos</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>Vector &amp; High-Res Export</span>
          <span>v2.5.0</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
