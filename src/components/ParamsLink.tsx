import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type ParamsLinkProps = {
  href: string;
  title: string;
};

export default function ParamsLink({ href, title }: ParamsLinkProps) {
  return (
    <Link
      href={href}
      className="hover:bg-gray-100 rounded-md text-lg font-medium w-full flex flex-col justify-center"
    >
      <div className="flex items-center justify-between h-full py-2">
        <span>{title}</span>
        <ChevronRight size={20} className="inline-block" />
      </div>
      <Separator />
    </Link>
  );
}
