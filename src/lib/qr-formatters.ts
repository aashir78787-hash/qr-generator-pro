import { QRType } from "../types";

export function formatQRData(type: QRType, data: any): string {
    switch (type) {
        case 'url':
            return data.url || 'https://';
        case 'text':
            return data.text || '';
        case 'email':
            return `mailto:${data.email || ''}?subject=${encodeURIComponent(data.subject || '')}&body=${encodeURIComponent(data.message || '')}`;
        case 'phone':
            return `tel:${data.phone || ''}`;
        case 'sms':
            return `smsto:${data.phone || ''}:${data.message || ''}`;
        case 'vcard':
            return `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName || ''};${data.firstName || ''}\nFN:${data.firstName || ''} ${data.lastName || ''}\nORG:${data.company || ''}\nTITLE:${data.jobTitle || ''}\nTEL:${data.phone || ''}\nEMAIL:${data.email || ''}\nURL:${data.website || ''}\nADR:;;${data.address || ''};;;;\nEND:VCARD`;
        case 'wifi':
            return `WIFI:T:${data.security || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};;`;
        case 'location':
            return `geo:${data.latitude || '0'},${data.longitude || '0'}`;
        case 'event':
            const formatDT = (dt: string) => dt ? new Date(dt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
            return `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:${data.title || ''}\nDTSTART:${formatDT(data.startDate)}\nDTEND:${formatDT(data.endDate)}\nLOCATION:${data.location || ''}\nDESCRIPTION:${data.description || ''}\nEND:VEVENT\nEND:VCALENDAR`;
        case 'crypto':
            return `${data.currency || 'bitcoin'}:${data.address || ''}${data.amount ? `?amount=${data.amount}` : ''}`;
        case 'social':
             return data.url || 'https://';
        default:
            return '';
    }
}
