import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QROptions } from '../../types';
import { Button } from '../../components/ui/Button';
import { Download, Share2, Copy, Check, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

type FileExtension = 'png' | 'jpeg' | 'webp' | 'svg';

interface PreviewProps {
  options: QROptions;
}

export function Preview({ options }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const [format, setFormat] = useState<FileExtension>('png');
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();

  const activeImage = options.image && options.image.trim().length > 0 ? options.image : undefined;
  const imageSize = options.imageOptions?.imageSize ?? 0.32;
  const isOversized = activeImage && imageSize > 0.38;

  // Render QR Code cleanly whenever any option changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean container
    containerRef.current.innerHTML = '';

    const ecLevel = options.qrOptions?.errorCorrectionLevel || (activeImage ? 'H' : 'Q');

    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      data: options.data || 'https://qrgen.pro',
      margin: options.margin ?? 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: ecLevel,
      },
      image: activeImage,
      imageOptions: {
        hideBackgroundDots: options.imageOptions?.hideBackgroundDots ?? true,
        imageSize: imageSize,
        margin: options.imageOptions?.margin ?? 4,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: options.dotsOptions.type,
        color: options.dotsOptions.color,
        gradient: options.dotsOptions.gradient,
      },
      cornersSquareOptions: {
        type: options.cornersSquareOptions.type,
        color: options.cornersSquareOptions.color,
      },
      cornersDotOptions: {
        type: options.cornersDotOptions.type,
        color: options.cornersDotOptions.color,
      },
      backgroundOptions: {
        color: options.backgroundOptions.color,
      },
    });

    qrCode.current = qr;
    qr.append(containerRef.current);
  }, [
    options.data,
    activeImage,
    imageSize,
    options.margin,
    options.dotsOptions.type,
    options.dotsOptions.color,
    JSON.stringify(options.dotsOptions.gradient),
    options.cornersSquareOptions.type,
    options.cornersSquareOptions.color,
    options.cornersDotOptions.type,
    options.cornersDotOptions.color,
    options.backgroundOptions.color,
    options.imageOptions?.margin,
    options.imageOptions?.hideBackgroundDots,
    options.qrOptions?.errorCorrectionLevel,
  ]);

  const handleDownload = async () => {
    if (!qrCode.current) return;
    setIsDownloading(true);
    try {
      // Create high-res instance for download if higher resolution requested
      if (downloadSize !== 280 && format !== 'svg') {
        const ecLevel = options.qrOptions?.errorCorrectionLevel || (activeImage ? 'H' : 'Q');
        const hiResQr = new QRCodeStyling({
          width: downloadSize,
          height: downloadSize,
          data: options.data || 'https://qrgen.pro',
          margin: Math.round((options.margin ?? 10) * (downloadSize / 280)),
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: ecLevel,
          },
          image: activeImage,
          imageOptions: {
            hideBackgroundDots: options.imageOptions?.hideBackgroundDots ?? true,
            imageSize: imageSize,
            margin: Math.round((options.imageOptions?.margin ?? 4) * (downloadSize / 280)),
            crossOrigin: 'anonymous',
          },
          dotsOptions: {
            type: options.dotsOptions.type,
            color: options.dotsOptions.color,
            gradient: options.dotsOptions.gradient,
          },
          cornersSquareOptions: {
            type: options.cornersSquareOptions.type,
            color: options.cornersSquareOptions.color,
          },
          cornersDotOptions: {
            type: options.cornersDotOptions.type,
            color: options.cornersDotOptions.color,
          },
          backgroundOptions: {
            color: options.backgroundOptions.color,
          },
        });

        await hiResQr.download({
          name: `qrcode-${Date.now()}`,
          extension: format,
        });
      } else {
        await qrCode.current.download({
          name: `qrcode-${Date.now()}`,
          extension: format,
        });
      }
      showToast(`QR Code downloaded as ${format.toUpperCase()}!`, 'success');
    } catch (e) {
      console.error('Download error:', e);
      showToast('Download failed. Try SVG format or PNG.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!qrCode.current) return;
    try {
      const blob = await qrCode.current.getRawData('png');
      if (!blob) throw new Error('Could not get image blob');
      
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob as Blob })
        ]);
        setIsCopied(true);
        showToast('QR Code image copied to clipboard!', 'success');
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        showToast('Clipboard image copying not supported on this browser', 'info');
      }
    } catch (e) {
      console.error('Copy error:', e);
      showToast('Could not copy image. Use Download instead.', 'error');
    }
  };

  const handleShare = async () => {
    if (!qrCode.current || !navigator.share) return;
    try {
      const blob = await qrCode.current.getRawData('png');
      if (!blob) return;
      const file = new File([blob as Blob], 'qrcode.png', { type: 'image/png' });
      await navigator.share({
        title: 'QR Code',
        text: 'Generated with QR Generator Pro',
        files: [file],
      });
      showToast('Shared successfully!', 'success');
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Sharing failed', e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
      {/* Header with Scannability Badge */}
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live Preview
        </span>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {isOversized ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <AlertTriangle size={12} />
              Large Logo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck size={12} />
              High Scannability
            </span>
          )}
        </div>
      </div>

      {/* QR Code Canvas Container */}
      <div className="relative group w-full flex justify-center items-center">
        <div 
          ref={containerRef} 
          className="flex justify-center items-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-inner max-w-full [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:rounded-lg [&>svg]:max-w-full [&>svg]:h-auto"
        />
        {activeImage && (
          <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs pointer-events-none">
            Logo Active
          </div>
        )}
      </div>

      {/* Format & Size Selectors */}
      <div className="flex flex-col gap-3 w-full">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
              Format
            </label>
            <select 
              className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={format}
              onChange={(e) => setFormat(e.target.value as FileExtension)}
            >
              <option value="png">PNG (Raster)</option>
              <option value="svg">SVG (Vector)</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 block">
              Resolution
            </label>
            <select 
              className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={downloadSize}
              onChange={(e) => setDownloadSize(Number(e.target.value))}
              disabled={format === 'svg'}
            >
              <option value={512}>512 × 512 (Standard)</option>
              <option value={1024}>1024 × 1024 (HD)</option>
              <option value={2048}>2048 × 2048 (Print/4K)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="w-full gap-2 h-11 text-sm font-semibold shadow-md shadow-indigo-500/20 active:scale-[0.99] transition-transform"
        >
          <Download size={18} />
          {isDownloading ? 'Preparing...' : 'Download QR Code'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyToClipboard} 
            className="w-full gap-1.5 text-xs h-9"
          >
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {isCopied ? 'Copied' : 'Copy Image'}
          </Button>

          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <Button 
              variant="outline" 
              onClick={handleShare} 
              className="w-full gap-1.5 text-xs h-9"
            >
              <Share2 size={14} />
              Share
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                const el = containerRef.current?.querySelector('canvas');
                if (el) {
                  const url = el.toDataURL();
                  const w = window.open('');
                  w?.document.write(`<img src="${url}" style="max-width:100%;height:auto;margin:20px auto;display:block;" />`);
                }
              }}
              className="w-full gap-1.5 text-xs h-9"
            >
              <Sparkles size={14} />
              View Full
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
