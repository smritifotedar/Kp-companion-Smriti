import { BookOpen, MapPin, Music, ScrollText, Building2, Archive } from 'lucide-react';

const ARCHIVE_ARTICLES = [
  {
    category: 'History',
    icon: <ScrollText size={16} />,
    color: 'text-amber-700 bg-amber-50',
    items: [
      {
        title: 'The Sapta Rishi Samvat: Kashmir\'s Unique Calendar',
        excerpt: 'An exploration of the Laukika Samvat (Sapta Rishi Samvat) used exclusively by Kashmiri Pandits, its astronomical basis, and how it differs from the Vikram Samvat.',
        tags: ['Calendar', 'Panchang', 'Astronomy'],
      },
      {
        title: 'The Exodus of 1990: Community Memory and Resilience',
        excerpt: 'A historical account of the forced displacement of Kashmiri Pandits and the community\'s efforts to preserve its cultural identity in the years that followed.',
        tags: ['History', 'Migration', 'Community'],
      },
      {
        title: 'Kashmir Shaivism: The Philosophical Heritage of KP Community',
        excerpt: 'An introduction to Trika philosophy, the spiritual backbone of Kashmiri Pandit religious thought, and its influence on rituals and festivals.',
        tags: ['Philosophy', 'Shaivism', 'Spirituality'],
      },
    ],
  },
  {
    category: 'Temples & Sacred Sites',
    icon: <Building2 size={16} />,
    color: 'text-red-700 bg-red-50',
    items: [
      {
        title: 'Hari Parbat: Home of Sharika Mata',
        excerpt: 'The sacred hill of Hari Parbat in Srinagar, home to the Sharika Devi temple — one of the most significant sites for the Kashmiri Pandit community.',
        tags: ['Temple', 'Sharika Devi', 'Srinagar'],
      },
      {
        title: 'Kheer Bhawani: The Sacred Spring Temple',
        excerpt: 'The spring temple of Kheer Bhawani at Tullamulla, where the color of the spring water is believed to be an omen for Kashmir\'s future.',
        tags: ['Temple', 'Kheer Bhawani', 'Sacred Spring'],
      },
      {
        title: 'Martand Sun Temple: The Magnificent Ruins',
        excerpt: 'The ancient Martand Sun Temple near Mattan in Anantnag district — one of the finest examples of early Hindu temple architecture.',
        tags: ['Temple', 'Architecture', 'Anantnag'],
      },
    ],
  },
  {
    category: 'Culture & Arts',
    icon: <Music size={16} />,
    color: 'text-purple-700 bg-purple-50',
    items: [
      {
        title: 'Kashmiri Wedding Songs: Vanvun and Ladi Shah',
        excerpt: 'Traditional songs sung at Kashmiri Pandit weddings — the Vanvun (women\'s songs) and Ladi Shah — their lyrics, significance, and preservation.',
        tags: ['Music', 'Wedding', 'Culture'],
      },
      {
        title: 'Wazwan: The Grand Feast of Kashmir',
        excerpt: 'The traditional Kashmiri multi-course feast — its history, significance in KP culture, the role of the Waza (master cook), and traditional recipes.',
        tags: ['Food', 'Culture', 'Tradition'],
      },
      {
        title: 'Kashmiri Pheran: The Traditional Attire',
        excerpt: 'The iconic Kashmiri Pheran — its history, regional variations, significance in festivals and weddings, and the art of Kashmiri embroidery.',
        tags: ['Clothing', 'Art', 'Heritage'],
      },
    ],
  },
  {
    category: 'Language & Literature',
    icon: <BookOpen size={16} />,
    color: 'text-blue-700 bg-blue-50',
    items: [
      {
        title: 'Kashmiri Language: Preserving the Mother Tongue',
        excerpt: 'The Kashmiri language (Koshur) — its Dardic roots, unique script, literary tradition, and the community\'s efforts to preserve it among the diaspora.',
        tags: ['Language', 'Koshur', 'Preservation'],
      },
      {
        title: 'Lal Ded: The Saint-Poetess of Kashmir',
        excerpt: 'The life and vakhs (verses) of Lal Ded (Lalla Arifa) — the 14th-century Kashmiri Shaiva poetess whose mystical verses remain central to KP spiritual life.',
        tags: ['Literature', 'Spirituality', 'Poetry'],
      },
    ],
  },
];

export default function ArchivePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">ज्ञान भंडार</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3">
          KP Knowledge Archive
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          A growing digital library of articles, histories, and cultural documentation
          preserving the living heritage of the Kashmiri Pandit community.
        </p>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <ScrollText size={20} />, label: 'Articles', value: '12+' },
          { icon: <Building2 size={20} />, label: 'Sacred Sites', value: '6' },
          { icon: <Music size={20} />, label: 'Culture Pieces', value: '8' },
          { icon: <BookOpen size={20} />, label: 'Languages', value: 'Kashmiri, Sanskrit, Hindi, English' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-earth-100 p-4 text-center shadow-premium transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-premium-lg hover:border-saffron-200">
            <div className="text-saffron-500 flex justify-center mb-1">{stat.icon}</div>
            <div className="font-display font-bold text-earth-900">{stat.value}</div>
            <div className="text-xs text-earth-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Articles by category */}
      <div className="space-y-8">
        {ARCHIVE_ARTICLES.map((section, sIdx) => (
          <section key={sIdx}>
            <h2 className="font-display text-xl font-bold text-earth-900 mb-4 flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${section.color}`}>{section.icon}</span>
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {section.items.map((article, aIdx) => (
                <div
                  key={aIdx}
                  className="kp-card card-ring bg-white rounded-2xl border border-earth-100 shadow-premium p-5 cursor-pointer flex flex-col"
                >
                  <h3 className="font-display font-semibold text-earth-900 text-sm mb-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-earth-500 text-xs leading-relaxed mb-3">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-saffron-50 text-saffron-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-saffron-500 hover:text-saffron-700 font-medium">
                    Read Article →
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contribute section */}
      <div className="mt-12 bg-gradient-to-br from-earth-800 to-earth-900 rounded-3xl p-8 text-center text-white shadow-premium-lg">
        <div className="text-4xl mb-3">📖</div>
        <h2 className="font-display text-2xl font-bold mb-3">Contribute to the Archive</h2>
        <p className="text-earth-300 max-w-xl mx-auto text-sm leading-relaxed mb-5">
          Do you have family stories, oral histories, old photographs, or knowledge about KP traditions
          that should be preserved? This archive grows with community contributions.
        </p>
        <button className="btn-primary px-7 py-3 text-sm">
          Submit Your Contribution
        </button>
        <p className="text-earth-500 text-xs mt-3">
          All submissions are reviewed by community scholars before publication.
        </p>
      </div>
    </div>
  );
}
