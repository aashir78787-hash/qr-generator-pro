import React, { useRef, useState, useEffect } from 'react';
import { QROptions } from '../../types';
import { Label, Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';
import { 
  PRESET_LOGOS, 
  PresetLogo, 
  createBadgedLogo 
} from '../../lib/preset-logos';
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Palette, 
  Shapes, 
  ShieldCheck, 
  Check, 
  Info,
  Maximize2
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

interface CustomizationProps {
  options: QROptions;
  onChange: (options: QROptions) => void;
}

export function Customization({ options, onChange }: CustomizationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<'design' | 'colors' | 'logo'>('logo');
  const [rawImage, setRawImage] = useState<string>(options.imageOptions?.rawImage || options.image || '');
  const [selectedBadge, setSelectedBadge] = useState<'none' | 'white-circle' | 'white-rounded' | 'dark-circle'>(
    options.imageOptions?.badgeStyle || 'white-circle'
  );
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const { showToast } = useToast();

  const updateOption = (section: keyof QROptions, field: string, value: any) => {
    if (section === 'width' || section === 'height' || section === 'margin' || section === 'image') {
      onChange({ ...options, [section]: value });
    } else {
      onChange({
        ...options,
        [section]: {
          ...(options[section] as any),
          [field]: value,
        },
      });
    }
  };

  // Re-apply badge when rawImage or selectedBadge changes
  const applyLogoWithBadge = async (src: string, badge: 'none' | 'white-circle' | 'white-rounded' | 'dark-circle') => {
    if (!src) {
      onChange({
        ...options,
        image: undefined,
        imageOptions: {
          ...options.imageOptions,
          rawImage: '',
          badgeStyle: badge,
        },
      });
      return;
    }

    setIsProcessingLogo(true);
    try {
      const finalImage = await createBadgedLogo(src, badge);
      onChange({
        ...options,
        image: finalImage,
        // Auto set high error correction for logos so QR code remains 100% scannable
        qrOptions: {
          ...options.qrOptions,
          errorCorrectionLevel: 'H',
        },
        imageOptions: {
          ...options.imageOptions,
          rawImage: src,
          badgeStyle: badge,
          hideBackgroundDots: options.imageOptions?.hideBackgroundDots ?? true,
          imageSize: options.imageOptions?.imageSize ?? 0.32,
        },
      });
    } catch (e) {
      console.error('Badge application error:', e);
      onChange({
        ...options,
        image: src,
        imageOptions: {
          ...options.imageOptions,
          rawImage: src,
          badgeStyle: badge,
        },
      });
    } finally {
      setIsProcessingLogo(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        setRawImage(result);
        await applyLogoWithBadge(result, selectedBadge);
        showToast('Logo uploaded and applied to QR center!', 'success');
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleSelectPreset = async (preset: PresetLogo) => {
    setRawImage(preset.svgDataUri);
    // Presets with their own background look great with 'none' or 'white-circle'
    await applyLogoWithBadge(preset.svgDataUri, selectedBadge);
    showToast(`Applied ${preset.name} logo to center!`, 'success');
  };

  const handleBadgeChange = async (badge: 'none' | 'white-circle' | 'white-rounded' | 'dark-circle') => {
    setSelectedBadge(badge);
    if (rawImage) {
      await applyLogoWithBadge(rawImage, badge);
    }
  };

  const handleRemoveLogo = () => {
    setRawImage('');
    onChange({
      ...options,
      image: undefined,
      imageOptions: {
        ...options.imageOptions,
        rawImage: '',
      },
    });
    showToast('Center logo removed', 'info');
  };

  const handleGradientToggle = (checked: boolean) => {
    if (checked) {
      onChange({
        ...options,
        dotsOptions: {
          ...options.dotsOptions,
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: options.dotsOptions.color || '#4F46E5' }, 
              { offset: 1, color: '#06B6D4' }
            ]
          }
        }
      });
    } else {
      const newOptions = { ...options };
      delete newOptions.dotsOptions.gradient;
      onChange(newOptions);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs for Customization: Design, Colors, Logo */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveSection('logo')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all ${
            activeSection === 'logo'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon size={16} />
          <span>Center Logo</span>
          {options.image && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('design')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all ${
            activeSection === 'design'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Shapes size={16} />
          <span>Pattern & Dots</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('colors')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all ${
            activeSection === 'colors'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Palette size={16} />
          <span>Colors</span>
        </button>
      </div>

      {/* SECTION: CENTER LOGO */}
      {activeSection === 'logo' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Logo Status Card */}
          {options.image ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 shadow-xs shrink-0 overflow-hidden">
                  <img 
                    src={options.image} 
                    alt="Current Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Center Logo Inserted
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    High error correction enabled automatically for seamless scanning.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 flex-1 sm:flex-none text-xs"
                >
                  <Upload size={14} />
                  Change
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveLogo}
                  className="gap-1.5 flex-1 sm:flex-none text-xs"
                >
                  <Trash2 size={14} />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-800/40 cursor-pointer transition-all hover:bg-indigo-50/20"
            >
              <Upload className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                Upload Custom Logo or Icon
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                PNG, SVG, JPG, or WebP from your device / phone gallery (up to 5MB)
              </p>
              <Button size="sm" variant="secondary" className="pointer-events-none gap-1.5 text-xs">
                <Upload size={14} />
                Browse File
              </Button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          {/* Quick 1-Tap Popular Preset Icons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Tap Brand & Utility Icons
              </Label>
              <span className="text-[11px] text-slate-400">Crisp Vector SVGs</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {PRESET_LOGOS.map((preset) => {
                const isSelected = rawImage === preset.svgDataUri;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                      <img src={preset.svgDataUri} alt={preset.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-1 truncate max-w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Badge & Style Options */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Logo Background Badge
            </Label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adds a clean protective badge behind the logo so it stands out cleanly against QR dots.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'white-circle', label: 'White Circle', desc: 'Recommended' },
                { id: 'white-rounded', label: 'White Square', desc: 'Modern curve' },
                { id: 'none', label: 'Transparent', desc: 'No background' },
                { id: 'dark-circle', label: 'Dark Circle', desc: 'High contrast' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleBadgeChange(b.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    selectedBadge === b.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{b.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal mt-0.5">{b.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing & Fine-tuning Sliders */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Logo Size</Label>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                    {Math.round((options.imageOptions?.imageSize ?? 0.32) * 100)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.15" 
                  max="0.40" 
                  step="0.02" 
                  value={options.imageOptions?.imageSize ?? 0.32} 
                  onChange={(e) => updateOption('imageOptions', 'imageSize', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Small (15%)</span>
                  <span className="text-indigo-600 font-medium">Optimal (30-34%)</span>
                  <span>Max Safe (40%)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Logo Padding / Margin</Label>
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                    {options.imageOptions?.margin ?? 4}px
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="14" 
                  step="1" 
                  value={options.imageOptions?.margin ?? 4} 
                  onChange={(e) => updateOption('imageOptions', 'margin', parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>None</span>
                  <span>Standard</span>
                  <span>Extra Gap</span>
                </div>
              </div>
            </div>

            {/* Logo Settings Toggles */}
            <div className="space-y-3 pt-2">
              <Switch 
                label="Clear QR Dots Behind Logo" 
                checked={options.imageOptions?.hideBackgroundDots ?? true}
                onChange={(e) => updateOption('imageOptions', 'hideBackgroundDots', e.target.checked)}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-2 ml-14">
                Recommended: Keeps the center clean and prevents dots from peeking through your icon.
              </p>
            </div>

            {/* Remote URL Input (Alternative) */}
            <div className="pt-2">
              <Label className="text-xs">Or Enter Image URL</Label>
              <div className="flex gap-2 mt-1.5">
                <Input 
                  placeholder="https://example.com/logo.png"
                  value={rawImage.startsWith('data:') ? '' : rawImage}
                  onChange={(e) => {
                    const url = e.target.value;
                    setRawImage(url);
                    if (url) {
                      applyLogoWithBadge(url, selectedBadge);
                    } else {
                      handleRemoveLogo();
                    }
                  }}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: DESIGN & PATTERNS */}
      {activeSection === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select 
              label="Pattern Style"
              options={[
                { label: 'Rounded Dots', value: 'rounded' },
                { label: 'Circle Dots', value: 'dots' },
                { label: 'Classic Square', value: 'square' },
                { label: 'Extra Rounded', value: 'extra-rounded' },
                { label: 'Classy Diamond', value: 'classy' },
                { label: 'Classy Rounded', value: 'classy-rounded' },
              ]}
              value={options.dotsOptions.type}
              onChange={(e) => updateOption('dotsOptions', 'type', e.target.value)}
            />
            <Select 
              label="Corner Frame Style"
              options={[
                { label: 'Extra Rounded', value: 'extra-rounded' },
                { label: 'Circle Dot', value: 'dot' },
                { label: 'Classic Square', value: 'square' },
              ]}
              value={options.cornersSquareOptions.type}
              onChange={(e) => updateOption('cornersSquareOptions', 'type', e.target.value)}
            />
            <Select 
              label="Corner Center Dot"
              options={[
                { label: 'Round Dot', value: 'dot' },
                { label: 'Square', value: 'square' },
              ]}
              value={options.cornersDotOptions.type}
              onChange={(e) => updateOption('cornersDotOptions', 'type', e.target.value)}
            />
            <Select 
              label="Error Correction Level"
              options={[
                { label: 'High (30% recovery - Best for Logos)', value: 'H' },
                { label: 'Quartile (25% recovery)', value: 'Q' },
                { label: 'Medium (15% recovery)', value: 'M' },
                { label: 'Low (7% recovery)', value: 'L' },
              ]}
              value={options.qrOptions?.errorCorrectionLevel || (options.image ? 'H' : 'Q')}
              onChange={(e) => updateOption('qrOptions', 'errorCorrectionLevel', e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label>Outer Margin (Quiet Zone)</Label>
              <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                {options.margin ?? 12}px
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              step="2" 
              value={options.margin ?? 12} 
              onChange={(e) => updateOption('margin', '', parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* SECTION: COLORS & GRADIENTS */}
      {activeSection === 'colors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Switch 
            label="Enable Gradient Pattern" 
            checked={!!options.dotsOptions.gradient}
            onChange={(e) => handleGradientToggle(e.target.checked)}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!options.dotsOptions.gradient ? (
              <div>
                <Label>Pattern Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input 
                    type="color" 
                    className="w-12 h-10 p-1 cursor-pointer shrink-0" 
                    value={options.dotsOptions.color} 
                    onChange={(e) => {
                      updateOption('dotsOptions', 'color', e.target.value);
                      updateOption('cornersSquareOptions', 'color', e.target.value);
                      updateOption('cornersDotOptions', 'color', e.target.value);
                    }} 
                  />
                  <Input 
                    type="text" 
                    className="flex-1 font-mono uppercase" 
                    value={options.dotsOptions.color} 
                    onChange={(e) => {
                      updateOption('dotsOptions', 'color', e.target.value);
                      updateOption('cornersSquareOptions', 'color', e.target.value);
                      updateOption('cornersDotOptions', 'color', e.target.value);
                    }} 
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <Label>Gradient Start Color</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 cursor-pointer shrink-0" 
                      value={options.dotsOptions.gradient?.colorStops[0]?.color || '#4F46E5'} 
                      onChange={(e) => {
                        const newStops = [...(options.dotsOptions.gradient?.colorStops || [])];
                        if (newStops[0]) newStops[0].color = e.target.value;
                        updateOption('dotsOptions', 'gradient', { ...options.dotsOptions.gradient, colorStops: newStops });
                      }} 
                    />
                    <Input 
                      type="text" 
                      className="flex-1 font-mono uppercase" 
                      value={options.dotsOptions.gradient?.colorStops[0]?.color || '#4F46E5'} 
                      onChange={(e) => {
                        const newStops = [...(options.dotsOptions.gradient?.colorStops || [])];
                        if (newStops[0]) newStops[0].color = e.target.value;
                        updateOption('dotsOptions', 'gradient', { ...options.dotsOptions.gradient, colorStops: newStops });
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Gradient End Color</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input 
                      type="color" 
                      className="w-12 h-10 p-1 cursor-pointer shrink-0" 
                      value={options.dotsOptions.gradient?.colorStops[1]?.color || '#06B6D4'} 
                      onChange={(e) => {
                        const newStops = [...(options.dotsOptions.gradient?.colorStops || [])];
                        if (newStops[1]) newStops[1].color = e.target.value;
                        updateOption('dotsOptions', 'gradient', { ...options.dotsOptions.gradient, colorStops: newStops });
                      }} 
                    />
                    <Input 
                      type="text" 
                      className="flex-1 font-mono uppercase" 
                      value={options.dotsOptions.gradient?.colorStops[1]?.color || '#06B6D4'} 
                      onChange={(e) => {
                        const newStops = [...(options.dotsOptions.gradient?.colorStops || [])];
                        if (newStops[1]) newStops[1].color = e.target.value;
                        updateOption('dotsOptions', 'gradient', { ...options.dotsOptions.gradient, colorStops: newStops });
                      }} 
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <Label>Background Color</Label>
              <div className="flex gap-2 mt-1.5">
                <Input 
                  type="color" 
                  className="w-12 h-10 p-1 cursor-pointer shrink-0" 
                  value={options.backgroundOptions.color} 
                  onChange={(e) => updateOption('backgroundOptions', 'color', e.target.value)} 
                />
                <Input 
                  type="text" 
                  className="flex-1 font-mono uppercase" 
                  value={options.backgroundOptions.color} 
                  onChange={(e) => updateOption('backgroundOptions', 'color', e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Popular Color Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <Label className="text-xs font-semibold text-slate-500">Popular Color Palettes</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Classic Dark', dot: '#000000', bg: '#ffffff' },
                { name: 'Indigo Brand', dot: '#4F46E5', bg: '#ffffff' },
                { name: 'Emerald Forest', dot: '#059669', bg: '#ffffff' },
                { name: 'Royal Crimson', dot: '#DC2626', bg: '#ffffff' },
                { name: 'Midnight Invert', dot: '#ffffff', bg: '#0F172A' },
                { name: 'Slate Gray', dot: '#334155', bg: '#F8FAFC' },
              ].map((pal) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...options,
                      dotsOptions: {
                        ...options.dotsOptions,
                        color: pal.dot,
                        gradient: undefined,
                      },
                      cornersSquareOptions: {
                        ...options.cornersSquareOptions,
                        color: pal.dot,
                      },
                      cornersDotOptions: {
                        ...options.cornersDotOptions,
                        color: pal.dot,
                      },
                      backgroundOptions: {
                        color: pal.bg,
                      },
                    });
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: pal.dot }} />
                  <span>{pal.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
