import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    // Fallback icon if the name doesn't match any Lucide icon
    return <LucideIcons.Layout {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
