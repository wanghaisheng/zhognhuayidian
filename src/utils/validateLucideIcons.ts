// Validate that all lucide-react icons used in the project exist
import * as LucideIcons from 'lucide-react';

// List of icons used in the project (extracted from search results)
const usedIcons = [
  // Basic icons
  'Star', 'Crown', 'TrendingUp', 'ChevronRight', 'ChevronLeft',
  
  // Navigation and interface
  'ArrowLeft', 'ArrowRight', 'Search', 'Filter', 'Menu', 'X',
  
  // Files and documents
  'FileText', 'BookOpen', 'File', 'Download', 'Upload', 'CloudUpload',
  
  // User and social
  'Users', 'User', 'MessageSquare', 'Mail', 'Phone',
  
  // Location and maps
  'MapPin', 'Globe', 'Building', 'Building2', 'Factory',
  
  // Status and feedback
  'CheckCircle', 'XCircle', 'AlertCircle', 'AlertTriangle', 'Info',
  'HelpCircle', 'Loader2',
  
  // Business and finance
  'DollarSign', 'Calculator', 'TrendingDown', 'BarChart', 'PieChart',
  
  // Medical and devices
  'Activity', 'Stethoscope', 'Brain', 'Magnet', 'Monitor', 'Zap',
  'Scan', 'Heart', 'Aperture',
  
  // Time and calendar
  'Calendar', 'Clock', 'Timer',
  
  // Tools and settings
  'Settings', 'Wrench', 'Package', 'Shield', 'Award', 'Eye',
  
  // Education and learning
  'GraduationCap', 'Lightbulb',
  
  // Others
  'Grid', 'List', 'Scale', 'Truck', 'MousePointer', 'ExternalLink'
];

export const validateLucideIcons = () => {
  console.log('🔍 Validating Lucide React icons...');
  
  const missingIcons: string[] = [];
  const existingIcons: string[] = [];
  
  usedIcons.forEach(iconName => {
    if (iconName in LucideIcons) {
      existingIcons.push(iconName);
    } else {
      missingIcons.push(iconName);
    }
  });
  
  console.log(`✅ Existing icons: ${existingIcons.length}`);
  console.log(`❌ Missing icons: ${missingIcons.length}`);
  
  if (missingIcons.length > 0) {
    console.log('❌ Missing icons list:');
    missingIcons.forEach(icon => console.log(`  - ${icon}`));
    
    // Suggested alternative icons
    const suggestions: Record<string, string> = {
      'Fire': 'TrendingUp',
      'Flame': 'TrendingUp',
      'Hot': 'TrendingUp',
      'Trending': 'TrendingUp'
    };
    
    console.log('💡 Suggested alternative icons:');
    missingIcons.forEach(icon => {
      if (suggestions[icon]) {
        console.log(`  - ${icon} → ${suggestions[icon]}`);
      }
    });
  } else {
    console.log('🎉 All icons exist!');
  }
  
  return {
    total: usedIcons.length,
    existing: existingIcons.length,
    missing: missingIcons.length,
    missingIcons,
    existingIcons
  };
};

// Auto-run validation in development environment
if (import.meta.env.DEV) {
  setTimeout(() => {
    validateLucideIcons();
  }, 2000);
}
