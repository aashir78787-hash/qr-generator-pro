import React, { useEffect, useState } from 'react';
import { QRHistoryItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Trash2, ExternalLink, Copy, Check, AlertCircle, Clock } from 'lucide-react';
import { formatQRData } from '../../lib/qr-formatters';
import { useToast } from '../../components/ui/Toast';

export function History({ onLoad }: { onLoad: (item: QRHistoryItem) => void }) {
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('qr-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('qr-history');
    setHistory([]);
    setShowClearConfirm(false);
    showToast('History cleared', 'info');
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem('qr-history', JSON.stringify(newHistory));
    setHistory(newHistory);
    showToast('Item deleted from history', 'info');
  };

  const copyData = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          No Saved QR Codes Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Generate a QR code and tap &ldquo;Save to History&rdquo; to quickly reload and re-export your creations anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Generation History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {history.length} saved {history.length === 1 ? 'code' : 'codes'}
          </p>
        </div>

        {showClearConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium hidden sm:inline">Delete all?</span>
            <Button variant="danger" size="sm" onClick={handleClearHistory} className="text-xs">
              Confirm Clear
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)} className="text-xs">
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowClearConfirm(true)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-xs gap-1.5"
          >
            <Trash2 size={14} />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const displayData = formatQRData(item.type, item.data) || 'Empty';
          return (
            <div 
              key={item.id} 
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    {item.type}
                  </span>
                  {item.options?.image && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      With Logo
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                  {item.name || `${item.type.toUpperCase()} Code`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono mt-0.5">
                  {displayData}
                </p>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onLoad(item)} 
                  className="flex-1 sm:flex-none gap-1.5 text-xs h-9"
                >
                  <ExternalLink size={14} />
                  Open in Editor
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyData(displayData, item.id)}
                  className="h-9 px-2.5 text-xs"
                  title="Copy content"
                >
                  {copiedId === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 px-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" 
                  onClick={() => deleteItem(item.id)}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
