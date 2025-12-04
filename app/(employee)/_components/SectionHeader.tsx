/**
 * Section Header (Server Component)
 * 
 * PERFORMANCE OPTIMIZATION: Static text rendered on the server
 * This component renders section titles without any client-side JavaScript.
 * 
 * Used for static labels like "Attendance Log", "Recent Activities", etc.
 */

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export default function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  return (
    <p className={`text-base font-semibold text-neutral-700 leading-bold-base ${className}`}>
      {title}
    </p>
  );
}
