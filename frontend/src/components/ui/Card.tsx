interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = '', ...props }: CardProps) {
  const baseClasses = 'rounded-lg border border-subtle bg-surface p-6 shadow-sm';

  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}
