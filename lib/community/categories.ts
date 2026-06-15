export const CATEGORIES = [
  'Rituals & Traditions',
  'Festivals',
  'Panchang Discussion',
  'Kashmiri Language',
  'Family History',
  'Heritage & Culture',
  'Migration Stories',
  'Community News',
  'Events',
  'Youth Corner',
  'Career & Networking',
  'Matrimonial Guidance',
  'General Discussion',
] as const;
export type Category = typeof CATEGORIES[number];

export type PostType = 'question' | 'discussion' | 'story';

export const POST_TYPES: { value: PostType; label: string; blurb: string }[] = [
  { value: 'question', label: 'Question', blurb: 'Seek guidance from the community' },
  { value: 'discussion', label: 'Discussion', blurb: 'Start an open conversation' },
  { value: 'story', label: 'Story', blurb: 'Share a memory or family history' },
];

export const TYPE_LABEL: Record<PostType, string> = {
  question: 'Question', discussion: 'Discussion', story: 'Story',
};
