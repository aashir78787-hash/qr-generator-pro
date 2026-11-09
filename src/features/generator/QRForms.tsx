import React from 'react';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { QRType } from '../../types';

interface QRFormProps {
  type: QRType;
  data: any;
  onChange: (data: any) => void;
}

export function QRForms({ type, data, onChange }: QRFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  switch (type) {
    case 'url':
      return (
        <div className="space-y-4">
          <Input 
            label="Website URL" 
            placeholder="https://example.com" 
            value={data.url || ''} 
            onChange={(e) => handleChange('url', e.target.value)} 
          />
        </div>
      );
    case 'text':
      return (
        <div className="space-y-4">
          <Textarea 
            label="Your Text" 
            placeholder="Enter your text here..." 
            value={data.text || ''} 
            onChange={(e) => handleChange('text', e.target.value)} 
          />
        </div>
      );
    case 'email':
      return (
        <div className="space-y-4">
          <Input label="Email To" type="email" placeholder="email@example.com" value={data.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Subject" placeholder="Email Subject" value={data.subject || ''} onChange={(e) => handleChange('subject', e.target.value)} />
          <Textarea label="Message" placeholder="Your message here..." value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)} />
        </div>
      );
    case 'phone':
      return (
        <div className="space-y-4">
          <Input label="Phone Number" type="tel" placeholder="+1234567890" value={data.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
        </div>
      );
    case 'sms':
      return (
        <div className="space-y-4">
          <Input label="Phone Number" type="tel" placeholder="+1234567890" value={data.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
          <Textarea label="Message" placeholder="Text message" value={data.message || ''} onChange={(e) => handleChange('message', e.target.value)} />
        </div>
      );
    case 'vcard':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" value={data.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} />
          <Input label="Last Name" value={data.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} />
          <Input label="Phone" type="tel" value={data.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
          <Input label="Email" type="email" value={data.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Company" value={data.company || ''} onChange={(e) => handleChange('company', e.target.value)} />
          <Input label="Job Title" value={data.jobTitle || ''} onChange={(e) => handleChange('jobTitle', e.target.value)} />
          <Input label="Website" className="sm:col-span-2" value={data.website || ''} onChange={(e) => handleChange('website', e.target.value)} />
          <Textarea label="Address" className="sm:col-span-2" value={data.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
        </div>
      );
    case 'wifi':
      return (
        <div className="space-y-4">
          <Input label="Network Name (SSID)" value={data.ssid || ''} onChange={(e) => handleChange('ssid', e.target.value)} />
          <Input label="Password" type="password" value={data.password || ''} onChange={(e) => handleChange('password', e.target.value)} />
          <Select 
            label="Security" 
            options={[{label: 'WPA/WPA2', value: 'WPA'}, {label: 'WEP', value: 'WEP'}, {label: 'None', value: 'nopass'}]} 
            value={data.security || 'WPA'} 
            onChange={(e) => handleChange('security', e.target.value)} 
          />
          <Switch 
            label="Hidden Network" 
            checked={data.hidden || false} 
            onChange={(e) => handleChange('hidden', e.target.checked)} 
          />
        </div>
      );
    case 'location':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Latitude" placeholder="40.7128" value={data.latitude || ''} onChange={(e) => handleChange('latitude', e.target.value)} />
          <Input label="Longitude" placeholder="-74.0060" value={data.longitude || ''} onChange={(e) => handleChange('longitude', e.target.value)} />
        </div>
      );
    case 'event':
      return (
        <div className="space-y-4">
          <Input label="Event Title" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Start Date/Time" type="datetime-local" value={data.startDate || ''} onChange={(e) => handleChange('startDate', e.target.value)} />
            <Input label="End Date/Time" type="datetime-local" value={data.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} />
          </div>
          <Input label="Location" value={data.location || ''} onChange={(e) => handleChange('location', e.target.value)} />
          <Textarea label="Description" value={data.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
        </div>
      );
    case 'crypto':
      return (
        <div className="space-y-4">
          <Select 
            label="Cryptocurrency" 
            options={[
              {label: 'Bitcoin', value: 'bitcoin'}, 
              {label: 'Ethereum', value: 'ethereum'}, 
              {label: 'Litecoin', value: 'litecoin'},
              {label: 'USDT', value: 'tether'},
              {label: 'Solana', value: 'solana'}
            ]} 
            value={data.currency || 'bitcoin'} 
            onChange={(e) => handleChange('currency', e.target.value)} 
          />
          <Input label="Wallet Address" value={data.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
          <Input label="Amount (Optional)" type="number" step="any" value={data.amount || ''} onChange={(e) => handleChange('amount', e.target.value)} />
        </div>
      );
    case 'social':
       return (
        <div className="space-y-4">
          <Select 
            label="Platform" 
            options={[
              {label: 'Facebook', value: 'https://facebook.com/'}, 
              {label: 'Instagram', value: 'https://instagram.com/'}, 
              {label: 'Twitter / X', value: 'https://twitter.com/'},
              {label: 'LinkedIn', value: 'https://linkedin.com/in/'},
              {label: 'YouTube', value: 'https://youtube.com/'},
              {label: 'TikTok', value: 'https://tiktok.com/@'}
            ]} 
            value={data.platform || 'https://facebook.com/'} 
            onChange={(e) => {
                handleChange('platform', e.target.value);
                handleChange('url', e.target.value + (data.handle || ''));
            }} 
          />
          <Input label="Username / Handle / URL" value={data.handle || ''} onChange={(e) => {
              handleChange('handle', e.target.value);
              handleChange('url', (data.platform || 'https://facebook.com/') + e.target.value);
          }} />
          <p className="text-xs text-slate-500">Preview URL: {(data.platform || 'https://facebook.com/') + (data.handle || '')}</p>
        </div>
      );
    default:
      return null;
  }
}
