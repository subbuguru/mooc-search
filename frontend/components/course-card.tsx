import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

interface CourseCardProps {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

export default function CourseCard({
  title,
  description,
  link,
  tags,
}: CourseCardProps) {
  return (
    <Link
      href={link}
      target="_blank"
      className="transform transition-transform hover:scale-105"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
