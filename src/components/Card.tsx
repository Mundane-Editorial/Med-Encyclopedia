import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export default function Card({ title, description, href, badge }: CardProps) {
  return (
    <Link href={href} className="card-hover block group">
      <div className="p-6">
        {badge && (
          <span className="badge-primary mb-3">
            {badge}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="px-6 pb-6">
        <span className="text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:underline inline-flex items-center gap-1">
          Learn more
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
