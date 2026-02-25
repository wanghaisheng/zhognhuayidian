export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  credentials?: string[];
}

export const authors: Record<string, Author> = {
  heisenberg: {
    id: 'heisenberg',
    name: 'Heisenberg',
    role: 'Medical Imaging Technology Expert',
    bio: 'Senior Medical Imaging Engineer with over 15 years of experience in CT and MRI system architecture. Specialized in image reconstruction algorithms and dose optimization strategies. Contributor to multiple open-source medical imaging projects.',
    avatar: 'https://chinactscanner.org/portrait-2.png',
    email: 'heisenberg@chinactscanner.org',
    social: {
      linkedin: 'https://linkedin.com/in/heisenberg',
      twitter: 'https://twitter.com/heisenberg_ct'
    },
    credentials: [
      'Master. in Biomedical Engineering',
      'DICOM Specialist (CRES)',
      'Member of IEEE Engineering in Medicine and Biology Society'
    ]
  },
  'editorial team': {
    id: 'editorial-team',
    name: 'Editorial Team',
    role: 'Editorial Team',
    bio: 'We publish practical CT/MRI procurement notes, lifecycle cost guidance, and market summaries, with a focus on contract terms, serviceability, and real-world deployment constraints.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EditorialTeam',
    email: 'contact@chinactscanner.org'
  },
  'medical equipment expert': {
    id: 'heisenberg',
    name: 'Medical Equipment Expert',
    role: 'Medical Imaging Analyst',
    bio: 'Focuses on CT market structure, product segmentation, service economics, and buyer checklists for hospital and imaging-center procurement decisions.',
    avatar: 'https://chinactscanner.org/portrait-2.png',
    email: 'contact@chinactscanner.org'
  }
};

export const getAuthor = (id: string = 'heisenberg'): Author => {
  return authors[id] || authors['heisenberg'];
};
