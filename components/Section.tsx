import React from 'react';

type SectionProps = {
  id?: string;
  variant?: 'landing' | 'page';
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
};

export default function Section({ id, variant = 'page', className = '', children, ...rest }: SectionProps) {
  const padding = variant === 'landing' ? 'py-8 sm:py-12 lg:py-16' : 'py-16 sm:py-20 lg:py-28';
  return (
    <section id={id} className={`relative ${padding} ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}
