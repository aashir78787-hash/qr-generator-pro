import React, { useState } from 'react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '../../components/ui/Button';
import { defaultOptions } from '../../types';
import { Upload, Download, Loader2, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export function BulkGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);

      // Pre-count rows
      Papa.parse(uploadedFile, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as string[][];
          setParsedCount(rows.length);
          showToast(`Loaded CSV with ${rows.length} rows`, 'info');
        },
      });
    }
  };

  const downloadSampleCSV = () => {
    const sample = "https://mywebsite.com/item1,item_1\nhttps://mywebsite.com/item2,item_2\nhttps://mywebsite.com/table5,table_five\n";
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sample_qr_data.csv');
    showToast('Sample CSV downloaded!', 'success');
  };

  const generateBulk = () => {
    if (!file) return;

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as string[][];
        if (rows.length === 0) {
          setError("The CSV file is empty. Please check your file content.");
          setIsGenerating(false);
          return;
        }

        try {
          const zip = new JSZip();
          
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const data = row[0]?.trim();
            const filename = row[1]?.trim() ? `${row[1].trim()}.png` : `qr_code_${i + 1}.png`;

            if (!data) continue;

            const qrCode = new QRCodeStyling({
              ...defaultOptions,
              width: 500,
              height: 500,
              data: data,
              qrOptions: {
                errorCorrectionLevel: 'H',
              },
            });

            const blob = await qrCode.getRawData('png');
            if (blob) {
              zip.file(filename, blob);
            }
            
            setProgress(Math.round(((i + 1) / rows.length) * 100));
          }

          const zipBlob = await zip.generateAsync({ type: 'blob' });
          saveAs(zipBlob, `batch_qrcodes_${Date.now()}.zip`);
          showToast(`Successfully exported ${rows.length} QR codes in a ZIP!`, 'success');
        } catch (err: any) {
          setError("Generation failed: " + (err?.message || "Unknown error"));
        } finally {
          setIsGenerating(false);
        }
      },
      error: (err) => {
        setError("Error parsing CSV: " + err.message);
        setIsGenerating(false);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Bulk QR Generator
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadSampleCSV} 
          className="text-xs gap-1.5"
        >
          <FileSpreadsheet size={14} />
          Sample CSV
        </Button>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
        Upload a CSV file to automatically batch generate dozens or hundreds of high-resolution QR codes in a single ZIP download.
      </p>
      
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 sm:p-8 text-center bg-slate-50 dark:bg-slate-800/40 mb-6 transition-colors">
        <Upload className="mx-auto h-10 w-10 text-indigo-500 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Select or Drop CSV File
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Column 1: Content/URL &bull; Column 2 (optional): Custom filename
        </p>
        
        <input 
          type="file" 
          accept=".csv,text/csv" 
          className="hidden" 
          id="csv-upload"
          onChange={handleFileUpload}
        />
        <label 
          htmlFor="csv-upload"
          className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm h-10 px-5 cursor-pointer gap-2"
        >
          <Upload size={16} />
          Choose CSV File
        </label>

        {file && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
            <Check size={16} />
            <span>Ready: <strong>{file.name}</strong> ({parsedCount ?? 0} rows found)</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isGenerating && (
        <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
            <span>Generating high-res QR codes...</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-200 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <Button 
        onClick={generateBulk} 
        disabled={!file || isGenerating}
        className="w-full gap-2 h-12 text-sm font-semibold shadow-md shadow-indigo-500/20"
      >
        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
        {isGenerating ? `Processing (${progress}%)...` : `Generate & Download ZIP (${parsedCount || 0} codes)`}
      </Button>
    </div>
  );
}
