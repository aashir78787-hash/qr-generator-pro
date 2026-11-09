// High-quality SVG Data URIs for built-in QR logos
// These are vector SVGs encoded as Data URIs, completely free of CORS issues

function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export interface PresetLogo {
  id: string;
  name: string;
  category: 'social' | 'contact' | 'utility';
  svgDataUri: string;
  badgeBg?: string;
  accentColor: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    accentColor: '#25D366',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#25D366"/>
        <path d="M50 20C33.4 20 20 33.4 20 50c0 5.8 1.6 11.2 4.5 15.8L21 80l14.6-3.8C40 78.7 44.8 80 50 80c16.6 0 30-13.4 30-30S66.6 20 50 20zm17.5 42.5c-.7 2.1-3.6 3.8-5.9 4.3-1.6.3-3.6.5-10.4-2.3-8.6-3.6-14.2-12.3-14.6-12.9-.4-.5-3.4-4.6-3.4-8.7 0-4.1 2.2-6.2 3-7 .8-.8 1.7-1 2.3-1 .6 0 1.2 0 1.7.1.6 0 1.3-.2 2 1.4.8 1.9 2.7 6.6 2.9 7.1.2.5.3 1.1 0 1.7-.3.7-.6 1-1.1 1.6-.5.6-1.1 1.3-1.6 1.8-.5.5-1.1 1.1-.5 2.1 1.2 2.1 2.8 4.2 4.9 6 2.7 2.4 5 3.2 6.1 3.7.8.4 1.7.3 2.3-.3.8-.9 1.8-2.3 2.7-3.5.7-.9 1.5-.8 2.3-.5.9.3 5.4 2.5 6.4 3 .9.5 1.6.7 1.8 1.1.2.3.2 2-.5 4.1z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    accentColor: '#E4405F',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFD600"/>
            <stop offset="50%" stop-color="#FF0069"/>
            <stop offset="100%" stop-color="#7638FA"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="25" fill="url(#ig-grad)"/>
        <rect x="25" y="25" width="50" height="50" rx="14" fill="none" stroke="#FFFFFF" stroke-width="7"/>
        <circle cx="50" cy="50" r="12" fill="none" stroke="#FFFFFF" stroke-width="7"/>
        <circle cx="65" cy="35" r="3.5" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    accentColor: '#FF0000',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#FF0000"/>
        <path d="M40 33l28 17-28 17V33z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'x_twitter',
    name: 'X (Twitter)',
    category: 'social',
    accentColor: '#000000',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#000000"/>
        <path d="M68 25h7.5L59 43.8 78 69H62.8L51 53.4 37.3 69H29.7l17.5-20.1L30 25h15.6l10.7 14.1L68 25zm-2.6 39.5h4.2L42.8 29.2h-4.5L65.4 64.5z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    accentColor: '#1877F2',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#1877F2"/>
        <path d="M57 52h8l1.2-10h-9.2v-6.5c0-2.8.8-4.7 4.8-4.7H67V22c-.9-.1-3.8-.4-7.3-.4-7.2 0-12.1 4.4-12.1 12.5V42H39v10h8.6V78c1.8.3 3.6.4 5.4.4 1.8 0 3.6-.1 5.4-.4V52z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    accentColor: '#0A66C2',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill="#0A66C2"/>
        <path d="M28 38h11v36H28V38zm5.5-16c3.6 0 6.5 2.9 6.5 6.5s-2.9 6.5-6.5 6.5-6.5-2.9-6.5-6.5 2.9-6.5 6.5-6.5zM46 38h10.5v5h.2c1.5-2.8 5-5.8 10.5-5.8 11.2 0 13.3 7.4 13.3 17V74H69.5V58c0-3.8-.1-8.7-5.3-8.7-5.3 0-6.1 4.2-6.1 8.5V74H46V38z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    accentColor: '#000000',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#000000"/>
        <path d="M68 40.5c-4.2-.6-7.8-2.7-10.2-5.7v23.4c0 10-8.1 18.1-18.1 18.1S21.6 68.2 21.6 58.2c0-9.8 7.8-17.8 17.5-18.1v9c-4.8.4-8.6 4.4-8.6 9.3 0 5.1 4.2 9.3 9.3 9.3 4.9 0 8.9-3.8 9.3-8.6l.1-34.1h9.1c1.2 5.5 5.2 9.9 10.6 11.2v6.2z" fill="#00F2FE"/>
        <path d="M69 39.5c-4.2-.6-7.8-2.7-10.2-5.7v23.4c0 10-8.1 18.1-18.1 18.1S22.6 67.2 22.6 57.2c0-9.8 7.8-17.8 17.5-18.1v9c-4.8.4-8.6 4.4-8.6 9.3 0 5.1 4.2 9.3 9.3 9.3 4.9 0 8.9-3.8 9.3-8.6l.1-34.1h9.1c1.2 5.5 5.2 9.9 10.6 11.2v6.2z" fill="#FE2C55"/>
        <path d="M67 39c-4.2-.6-7.8-2.7-10.2-5.7v23.4c0 10-8.1 18.1-18.1 18.1S20.6 66.7 20.6 56.7c0-9.8 7.8-17.8 17.5-18.1v9c-4.8.4-8.6 4.4-8.6 9.3 0 5.1 4.2 9.3 9.3 9.3 4.9 0 8.9-3.8 9.3-8.6l.1-34.1h9.1c1.2 5.5 5.2 9.9 10.6 11.2V39z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    category: 'utility',
    accentColor: '#4F46E5',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#4F46E5"/>
        <path d="M50 72a6 6 0 100-12 6 6 0 000 12zM36.4 53.6a19.2 19.2 0 0127.2 0 3 3 0 004.2-4.2 25.2 25.2 0 00-35.6 0 3 3 0 004.2 4.2zm-12.7-12.7a37.2 37.2 0 0152.6 0 3 3 0 004.2-4.2 43.2 43.2 0 00-61 0 3 3 0 004.2 4.2z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'link',
    name: 'Website',
    category: 'utility',
    accentColor: '#2563EB',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#2563EB"/>
        <path d="M57 43a12 12 0 00-17 0l-9 9a12 12 0 1017 17l4.5-4.5a3 3 0 10-4.2-4.2L43.8 65a6 6 0 01-8.5-8.5l9-9a6 6 0 018.5 0 3 3 0 004.2-4.5zm-14 14a12 12 0 0017 0l9-9a12 12 0 10-17-17l-4.5 4.5a3 3 0 104.2 4.2L60.2 31a6 6 0 018.5 8.5l-9 9a6 6 0 01-8.5 0 3 3 0 00-4.2 4.5z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'mail',
    name: 'Email',
    category: 'contact',
    accentColor: '#EA4335',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#EA4335"/>
        <path d="M26 34h48a4 4 0 014 4v24a4 4 0 01-4 4H26a4 4 0 01-4-4V38a4 4 0 014-4zm24 16.5L30.5 38h39L50 50.5zm-18-9v20.5h36V41.5L50 55.5 32 41.5z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'phone',
    name: 'Phone',
    category: 'contact',
    accentColor: '#10B981',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#10B981"/>
        <path d="M38.8 28.5c1.4-1.4 3.7-1.4 5.1 0l4.5 4.5c1.4 1.4 1.4 3.7 0 5.1l-2.6 2.6c1.8 3.8 4.9 6.9 8.7 8.7l2.6-2.6c1.4-1.4 3.7-1.4 5.1 0l4.5 4.5c1.4 1.4 1.4 3.7 0 5.1l-3.2 3.2c-2.3 2.3-5.9 2.8-8.8 1.4-9.6-4.7-17.3-12.4-22-22-1.4-2.9-.9-6.5 1.4-8.8l4.7-4.7z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'map_pin',
    name: 'Location',
    category: 'utility',
    accentColor: '#DC2626',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#DC2626"/>
        <path d="M50 24c-11 0-20 9-20 20 0 14 20 32 20 32s20-18 20-32c0-11-9-20-20-20zm0 27a7 7 0 110-14 7 7 0 010 14z" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'star',
    name: 'Star Rating',
    category: 'utility',
    accentColor: '#F59E0B',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#F59E0B"/>
        <polygon points="50,22 58.5,39.3 77.5,42.1 63.8,55.4 67,74.4 50,65.4 33,74.4 36.2,55.4 22.5,42.1 41.5,39.3" fill="#FFFFFF"/>
      </svg>
    `)
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'utility',
    accentColor: '#003087',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="22" fill="#003087"/>
        <path d="M38 78l8-49h16.2c6.9 0 11.8 1.5 13.9 5.2 1.8 3.2 1.4 7.6-.8 12.5-3.3 7.3-9.5 11.3-17.5 11.3h-5.2l-3.2 20H38z" fill="#0079C1"/>
        <path d="M44.5 69l4.5-27.5h13.2c5.6 0 9.6 1.2 11.3 4.2 1.5 2.6 1.1 6.2-.7 10.2-2.7 6-7.8 9.2-14.3 9.2h-4.3L50.5 78h-6z" fill="#00457C"/>
      </svg>
    `)
  }
];

/**
 * Creates a badged logo (e.g. White Circle or White Rounded Square)
 * to guarantee high contrast and clean separation from QR dots.
 */
export async function createBadgedLogo(
  rawImageSrc: string,
  badgeStyle: 'none' | 'white-circle' | 'white-rounded' | 'dark-circle' = 'white-circle'
): Promise<string> {
  if (badgeStyle === 'none') {
    return rawImageSrc;
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(rawImageSrc);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);

      // Draw Badge Background
      ctx.save();
      if (badgeStyle === 'white-circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#E2E8F0';
        ctx.stroke();
      } else if (badgeStyle === 'white-rounded') {
        const radius = 48;
        const pad = 4;
        ctx.beginPath();
        ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, radius);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#E2E8F0';
        ctx.stroke();
      } else if (badgeStyle === 'dark-circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#334155';
        ctx.stroke();
      }
      ctx.restore();

      // Draw Image in Center with safe inset
      const inset = 36;
      const targetSize = size - inset * 2;
      
      // Calculate aspect ratio
      const aspect = img.width / img.height;
      let drawW = targetSize;
      let drawH = targetSize;
      if (aspect > 1) {
        drawH = targetSize / aspect;
      } else {
        drawW = targetSize * aspect;
      }

      const drawX = (size - drawW) / 2;
      const drawY = (size - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      resolve(rawImageSrc);
    };

    img.src = rawImageSrc;
  });
}
