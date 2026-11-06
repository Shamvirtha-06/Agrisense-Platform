import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { LocationData } from '../types';
import { TAMIL_NADU_HUBS } from '../utils/cropDatabase';
import { MapPin, Navigation, Check, Loader2 } from 'lucide-react';

interface LocationSelectorProps {
  currentLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationChange,
}) => {
  const { t, language } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage(t('gpsFailed'));
      setTimeout(() => setGpsMessage(null), 3000);
      return;
    }

    setIsLocating(true);
    setGpsMessage(t('gpsLocating'));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        
        // Find nearest hub or create custom location
        let closestHub = TAMIL_NADU_HUBS[0];
        let minDistance = Infinity;

        TAMIL_NADU_HUBS.forEach((hub) => {
          const d = Math.hypot(hub.latitude - latitude, hub.longitude - longitude);
          if (d < minDistance) {
            minDistance = d;
            closestHub = hub;
          }
        });

        const detectedLocation: LocationData = {
          id: 'custom_gps',
          nameEn: `GPS: Near ${closestHub.districtEn}`,
          nameTa: `GPS: ${closestHub.districtTa} அருகே`,
          districtEn: closestHub.districtEn,
          districtTa: closestHub.districtTa,
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          isAutoDetected: true,
        };

        onLocationChange(detectedLocation);
        setGpsMessage(t('gpsSuccess'));
        setTimeout(() => setGpsMessage(null), 3500);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setGpsMessage(t('gpsFailed'));
        setTimeout(() => setGpsMessage(null), 3500);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title and Active District */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t('locationTitle')}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-900">
                {language === 'ta' ? currentLocation.nameTa : currentLocation.nameEn}
              </span>
              {currentLocation.isAutoDetected && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" /> GPS Auto
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {t('latitude')}: <span className="font-semibold text-slate-700">{currentLocation.latitude}°N</span> | {t('longitude')}: <span className="font-semibold text-slate-700">{currentLocation.longitude}°E</span>
            </div>
          </div>
        </div>

        {/* Hub Selection Buttons & GPS Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* GPS Button */}
          <button
            onClick={handleAutoDetectGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-sm transition-all border border-emerald-600"
            title={t('autoDetectGps')}
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{isLocating ? t('gpsLocating') : t('autoDetectGps')}</span>
          </button>

          {/* Quick Hub Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TAMIL_NADU_HUBS.map((hub) => {
              const isSelected = currentLocation.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => onLocationChange(hub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {language === 'ta' ? hub.districtTa : hub.districtEn}
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {gpsMessage && (
        <div className="mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5" />
          <span>{gpsMessage}</span>
        </div>
      )}
    </div>
  );
};
