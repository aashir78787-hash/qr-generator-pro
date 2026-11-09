import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';
import { Button } from '../../components/ui/Button';
import { 
  Camera, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink, 
  X, 
  RefreshCw, 
  Check, 
  Wifi, 
  Mail, 
  Phone, 
  UserPlus, 
  FileText 
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export function Scanner() {
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [copied, setCopied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isScanning]);

  const startCamera = async (mode = facingMode) => {
    setError(null);
    setResult(null);
    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (_) {}
      }

      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: mode },
        { 
          fps: 15, 
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          setResult(decodedText);
          showToast('QR Code successfully detected!', 'success');
          stopCamera();
        },
        () => {
          // Frame error, continuous scanning
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      setError(err?.message || "Could not access camera. Please check camera permissions or try uploading an image.");
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  const toggleCameraFacing = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isScanning) {
      await stopCamera();
      await startCamera(nextMode);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);
    
    try {
      const html5QrCode = new Html5Qrcode("reader");
      const decodedText = await html5QrCode.scanFile(file, true);
      setResult(decodedText);
      showToast('QR Code read from photo!', 'success');
    } catch (err: any) {
      setError("Could not read QR Code from this image. Please ensure the QR code is clear, unobstructed, and well-lit.");
    } finally {
      e.target.value = '';
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      showToast('Scan result copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUrl = (str: string) => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const getResultType = (str: string) => {
    if (isUrl(str)) return { type: 'URL Link', icon: <ExternalLink size={16} /> };
    if (str.startsWith('WIFI:')) return { type: 'Wi-Fi Network', icon: <Wifi size={16} /> };
    if (str.startsWith('mailto:') || str.includes('@')) return { type: 'Email', icon: <Mail size={16} /> };
    if (str.startsWith('tel:')) return { type: 'Phone Number', icon: <Phone size={16} /> };
    if (str.startsWith('BEGIN:VCARD')) return { type: 'Contact Card (vCard)', icon: <UserPlus size={16} /> };
    return { type: 'Text / Data', icon: <FileText size={16} /> };
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            QR Code Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Scan using your device camera or upload a saved photo.
          </p>
        </div>
        {isScanning && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleCameraFacing} 
            className="gap-1.5 text-xs"
            title="Switch between front and rear cameras"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Flip Camera</span>
          </Button>
        )}
      </div>

      {/* Main Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button 
          onClick={isScanning ? stopCamera : () => startCamera(facingMode)} 
          variant={isScanning ? 'danger' : 'primary'}
          className="gap-2 h-11 text-sm font-semibold shadow-xs"
        >
          {isScanning ? <X size={18} /> : <Camera size={18} />}
          {isScanning ? 'Stop Camera' : 'Start Camera Scanner'}
        </Button>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
            className="w-full gap-2 h-11 text-sm font-semibold"
          >
            <ImageIcon size={18} />
            Scan from Image File
          </Button>
        </div>
      </div>

      {/* Camera Preview Element */}
      <div 
        id="reader" 
        className={`w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 mx-auto transition-all ${
          isScanning ? 'mb-6 bg-black min-h-[260px]' : 'hidden'
        }`}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl mb-6 text-sm flex items-start gap-3">
          <X size={18} className="shrink-0 mt-0.5 text-red-500" />
          <div>{error}</div>
        </div>
      )}

      {/* Scan Result Card */}
      {result && (
        <div className="p-5 sm:p-6 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 rounded-full">
              {getResultType(result).icon}
              {getResultType(result).type}
            </span>
            <span className="text-xs text-slate-400">Scanned just now</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 break-all font-mono select-all">
              {result}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button 
              onClick={copyToClipboard} 
              variant="secondary" 
              className="gap-1.5 text-xs sm:text-sm h-10"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>

            {isUrl(result) && (
              <a 
                href={result} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100 dark:shadow-none h-10 px-4 text-xs sm:text-sm gap-1.5"
              >
                <ExternalLink size={16} />
                Open Website
              </a>
            )}

            <Button 
              variant="ghost" 
              onClick={() => setResult(null)} 
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 h-10"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
