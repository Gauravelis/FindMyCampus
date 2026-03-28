'use client';

import { icons, type LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon = ({ name, color, size, className }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Optionally return a default icon or null
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};

export default Icon;
