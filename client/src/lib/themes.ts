export type ColorTheme = 'classic-blue' | 'wedding-rose' | 'elegant-purple' | 'modern-green' | 'luxury-gold';

export const colorThemes = {
  'classic-blue': {
    name: 'Classic Blue',
    primary: 'hsl(217, 91%, 60%)',
    primaryDark: 'hsl(217, 91%, 45%)',
    primaryLight: 'hsl(217, 91%, 75%)',
    secondary: 'hsl(242, 87%, 63%)',
    accent: 'hsl(43, 96%, 56%)',
    background: 'hsl(210, 40%, 98%)',
    surface: 'hsl(0, 0%, 100%)',
  },
  'wedding-rose': {
    name: 'Wedding Rose',
    primary: 'hsl(339, 90%, 51%)',
    primaryDark: 'hsl(339, 90%, 36%)',
    primaryLight: 'hsl(339, 90%, 66%)',
    secondary: 'hsl(319, 85%, 56%)',
    accent: 'hsl(43, 96%, 56%)',
    background: 'hsl(355, 100%, 97%)',
    surface: 'hsl(0, 0%, 100%)',
  },
  'elegant-purple': {
    name: 'Elegant Purple',
    primary: 'hsl(262, 83%, 58%)',
    primaryDark: 'hsl(262, 83%, 43%)',
    primaryLight: 'hsl(262, 83%, 73%)',
    secondary: 'hsl(271, 81%, 56%)',
    accent: 'hsl(43, 96%, 56%)',
    background: 'hsl(260, 100%, 99%)',
    surface: 'hsl(0, 0%, 100%)',
  },
  'modern-green': {
    name: 'Modern Green',
    primary: 'hsl(158, 64%, 52%)',
    primaryDark: 'hsl(158, 64%, 37%)',
    primaryLight: 'hsl(158, 64%, 67%)',
    secondary: 'hsl(174, 62%, 47%)',
    accent: 'hsl(43, 96%, 56%)',
    background: 'hsl(157, 100%, 98%)',
    surface: 'hsl(0, 0%, 100%)',
  },
  'luxury-gold': {
    name: 'Luxury Gold',
    primary: 'hsl(43, 96%, 56%)',
    primaryDark: 'hsl(43, 96%, 41%)',
    primaryLight: 'hsl(43, 96%, 71%)',
    secondary: 'hsl(25, 95%, 53%)',
    accent: 'hsl(262, 83%, 58%)',
    background: 'hsl(48, 100%, 96%)',
    surface: 'hsl(0, 0%, 100%)',
  }
};

export const applyTheme = (theme: ColorTheme) => {
  const root = document.documentElement;
  
  // Remove all theme classes
  root.classList.remove('theme-classic-blue', 'theme-wedding-rose', 'theme-elegant-purple', 'theme-modern-green', 'theme-luxury-gold');
  
  // Add new theme class
  root.classList.add(`theme-${theme}`);
  
  // Force repaint to ensure CSS variables are applied
  requestAnimationFrame(() => {
    root.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => {
      root.style.transform = '';
    });
  });
};
