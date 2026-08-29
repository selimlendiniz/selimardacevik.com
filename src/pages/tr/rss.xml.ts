import type { APIRoute } from 'astro';
import { buildFeed } from '~/lib/rss';

export const GET: APIRoute = (context) => buildFeed('tr', context);
