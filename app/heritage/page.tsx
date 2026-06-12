'use client';

import { useState, useEffect } from 'react';
import { KP_GOTRAS, KP_KULDEVTAS } from '@/lib/kp-panchang';
import { Save, Users, MapPin, Star } from 'lucide-react';

interface FamilyHeritage {
  familyName: string;
  gotra: string;
  kuldevta: string;
  nativeVillage: string;
  nativeTehsil: string;
  nativeDistrict: string;
  familyTraditions: string;
  annualObservances: string;
  additionalNotes: string;
}

const EMPTY: FamilyHeritage = {
  familyName: '',
  gotra: '',
  kuldevta: '',
  nativeVillage: '',
  nativeTehsil: '',
  nativeDistrict: '',
  familyTraditions: '',
  annualObservances: '',
  additionalNotes: '',
};

export default function HeritagePage() {
  const [form, setForm] = useState<FamilyHeritage>(EMPTY);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('kp_family_heritage');
    if (stored) {
      try { setForm(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleChange = (field: keyof FamilyHeritage, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('kp_family_heritage', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    if (confirm('Clear all family heritage data? This cannot be undone.')) {
      setForm(EMPTY);
      localStorage.removeItem('kp_family_heritage');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">कुल परंपरा</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Family Heritage Records
        </h1>
        <p className="text-earth-600 max-w-xl mx-auto">
          Preserve your family's Gotra, Kuldevta, native village, and unique traditions
          so future generations can stay connected to their roots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <section className="bg-white rounded-3xl border border-earth-100 shadow-premium p-6 transition-all duration-300 ease-premium hover:shadow-premium-lg">
            <h2 className="font-display font-bold text-earth-900 text-lg mb-4 flex items-center gap-2">
              <Users size={18} className="text-saffron-500" /> Family Identity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Family Name / Surname</label>
                <input
                  type="text"
                  value={form.familyName}
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  placeholder="e.g., Koul, Dhar, Bhat, Pandit..."
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Gotra</label>
                <select
                  value={form.gotra}
                  onChange={(e) => handleChange('gotra', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm bg-white"
                >
                  <option value="">Select Gotra...</option>
                  {KP_GOTRAS.map(g => <option key={g} value={g}>{g}</option>)}
                  <option value="other">Other (specify in notes)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-earth-700 mb-1">Kuldevta / Kuldevi (Family Deity)</label>
                <select
                  value={form.kuldevta}
                  onChange={(e) => handleChange('kuldevta', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm bg-white"
                >
                  <option value="">Select Kuldevta...</option>
                  {KP_KULDEVTAS.map(k => (
                    <option key={k.name} value={k.name}>{k.name} — {k.location}</option>
                  ))}
                  <option value="other">Other (specify in notes)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Native Place */}
          <section className="bg-white rounded-3xl border border-earth-100 shadow-premium p-6 transition-all duration-300 ease-premium hover:shadow-premium-lg">
            <h2 className="font-display font-bold text-earth-900 text-lg mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-saffron-500" /> Native Place in Kashmir
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Village (Gaon)</label>
                <input
                  type="text"
                  value={form.nativeVillage}
                  onChange={(e) => handleChange('nativeVillage', e.target.value)}
                  placeholder="e.g., Sopore, Handwara..."
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Tehsil</label>
                <input
                  type="text"
                  value={form.nativeTehsil}
                  onChange={(e) => handleChange('nativeTehsil', e.target.value)}
                  placeholder="e.g., Baramulla..."
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">District</label>
                <input
                  type="text"
                  value={form.nativeDistrict}
                  onChange={(e) => handleChange('nativeDistrict', e.target.value)}
                  placeholder="e.g., Srinagar, Anantnag..."
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Traditions */}
          <section className="bg-white rounded-3xl border border-earth-100 shadow-premium p-6 transition-all duration-300 ease-premium hover:shadow-premium-lg">
            <h2 className="font-display font-bold text-earth-900 text-lg mb-4 flex items-center gap-2">
              <Star size={18} className="text-saffron-500" /> Family Traditions & Practices
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Family-Specific Traditions
                </label>
                <textarea
                  value={form.familyTraditions}
                  onChange={(e) => handleChange('familyTraditions', e.target.value)}
                  placeholder="Describe any unique traditions your family follows — special rituals, prayers, customs passed down through generations..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Important Annual Observances
                </label>
                <textarea
                  value={form.annualObservances}
                  onChange={(e) => handleChange('annualObservances', e.target.value)}
                  placeholder="e.g., Annual Devgon date, specific Ashtami observances, pilgrimage traditions..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={form.additionalNotes}
                  onChange={(e) => handleChange('additionalNotes', e.target.value)}
                  placeholder="Any other heritage information — family history, migration story, notable ancestors..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm resize-none"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 py-3 font-semibold rounded-xl shadow-premium transition-all duration-300 ease-premium hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white hover:from-saffron-600 hover:to-saffron-700 hover:shadow-glow-saffron'
              }`}
            >
              <Save size={18} />
              {saved ? 'Saved! ✓' : 'Save Heritage Records'}
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-3 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-saffron-50 to-amber-50 rounded-2xl border border-saffron-200 p-5 shadow-premium sacred-glow">
            <h3 className="font-display font-bold text-earth-900 mb-3">🙏 Why This Matters</h3>
            <div className="space-y-3 text-sm text-earth-600 leading-relaxed">
              <p>
                With Kashmiri Pandit families dispersed across India and the world since 1990,
                preserving family heritage has become more critical than ever.
              </p>
              <p>
                Your <strong>Gotra</strong> identifies your Vedic lineage and is essential for rituals,
                marriage compatibility, and ancestral worship.
              </p>
              <p>
                Your <strong>Kuldevta/Kuldevi</strong> is your family's protecting deity — knowing and
                worshipping them is a sacred responsibility.
              </p>
              <p>
                Your <strong>native village</strong> in Kashmir is part of your identity, even if you've
                never visited it.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-earth-100 p-5 shadow-premium transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-premium-lg">
            <h3 className="font-display font-bold text-earth-900 mb-3">📌 Storage Note</h3>
            <p className="text-sm text-earth-600 leading-relaxed">
              Your family heritage data is saved locally in your browser. For permanent preservation,
              we recommend also recording this in a family document and sharing with relatives.
            </p>
            <p className="text-xs text-earth-400 mt-2">
              Future versions will support secure cloud storage with family sharing.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-earth-100 p-5 shadow-premium transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:shadow-premium-lg">
            <h3 className="font-display font-bold text-earth-900 mb-3">🏛️ Common KP Gotras</h3>
            <div className="flex flex-wrap gap-1.5">
              {KP_GOTRAS.slice(0, 10).map(g => (
                <span key={g} className="px-2 py-0.5 bg-earth-50 text-earth-600 rounded text-xs">{g}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
