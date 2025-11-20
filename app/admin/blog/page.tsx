import { loadLocale } from '@/lib/locales/loader';
import BlogPostsClient from './BlogPostsClient';

export default function BlogPostsPage() {
  // Load locale data server-side
  const locale = loadLocale('admin-blog');

  return <BlogPostsClient locale={locale} />;
}
