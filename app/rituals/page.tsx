'use client';

import { useState } from 'react';
import { KP_RITUALS } from '@/lib/kp-rituals';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Annual Ritual', 'Marriage Ceremony', 'Samskara', 'Ancestral Ritual', 'Vedic Ritual'];

export default function RitualsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? KP_RITUALS
    : KP_RITUALS.filter(r => r.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">कर्मकांड ज्ञान</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          Kashmiri Pandit Ritual Library
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          A comprehensive digital encyclopedia of Kashmiri Pandit rituals, samskaras, and ceremonies.
          Each entry explains the purpose, procedure, and deep spiritual significance.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-ui font-medium transition-all duration-300 ease-premium ${
              selectedCategory === cat
                ? 'bg-saffron-600 text-white shadow-premium scale-105'
                : 'bg-white border border-earth-200 text-earth-600 hover:border-saffron-300 hover:-translate-y-0.5 hover:shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rituals grid */}
      <div className="space-y-4">
        {filtered.map((ritual) => {
          const isExpanded = expandedId === ritual.id;
          return (
            <div
              key={ritual.id}
              className={`bg-white rounded-3xl border shadow-premium overflow-hidden transition-all duration-300 ease-premium ${
                isExpanded ? 'border-saffron-300 sacred-glow' : 'border-earth-100 hover:border-saffron-200 hover:-translate-y-1 hover:shadow-premium-lg'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : ritual.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{ritual.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-bold text-earth-900 text-lg">{ritual.name}</h2>
                      <span className="font-devanagari text-saffron-600">{ritual.kashmiri}</span>
                      <span className="festival-badge bg-earth-50 text-earth-600 text-xs">{ritual.category}</span>
                    </div>
                    <p className="text-sm text-earth-500 mt-0.5">{ritual.description}</p>
                  </div>
                </div>
                <div className="text-saffron-400 flex-shrink-0">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 border-t border-saffron-100 pt-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Purpose */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2">🎯 Purpose</h3>
                      <p className="text-earth-600 text-sm leading-relaxed">{ritual.purpose}</p>
                    </div>

                    {/* Religious Significance */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2">🕉️ Religious Significance</h3>
                      <p className="text-earth-600 text-sm leading-relaxed">{ritual.religiousSignificance}</p>
                    </div>

                    {/* Historical Background */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2">📜 Historical Background</h3>
                      <p className="text-earth-600 text-sm leading-relaxed">{ritual.historicalBackground}</p>
                    </div>

                    {/* Required Materials */}
                    <div>
                      <h3 className="font-display font-semibold text-earth-800 mb-2">🧺 Required Materials</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {ritual.materials.map((item, i) => (
                          <span key={i} className="px-2.5 py-1 bg-saffron-50 border border-saffron-100 rounded-lg text-xs text-saffron-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step by step */}
                  <div>
                    <h3 className="font-display font-semibold text-earth-800 mb-3">📋 Step-by-Step Process</h3>
                    <div className="space-y-2">
                      {ritual.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-earth-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Variations & Misconceptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="font-display font-semibold text-blue-800 mb-2 text-sm">🗺️ Regional Variations</h3>
                      <p className="text-blue-700 text-sm">{ritual.regionalVariations}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <h3 className="font-display font-semibold text-amber-800 mb-2 text-sm">💡 Common Misconceptions</h3>
                      <p className="text-amber-700 text-sm">{ritual.commonMisconceptions}</p>
                    </div>
                  </div>

                  <div className="text-xs text-earth-400 border-t border-earth-100 pt-3">
                    📌 Always consult a qualified Kashmiri Pandit priest before performing these rituals for specific guidance tailored to your family tradition.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
