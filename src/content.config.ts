import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /** Optional cover image, resolved and optimized by astro:assets. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Path under public/ for a post-specific link preview image. */
      ogImage: z.string().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    tech: z.array(z.string()).default([]),
    url: z.url().optional(),
    repo: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const cv = defineCollection({
  loader: glob({ base: './src/content/cv', pattern: '*.json' }),
  schema: z.object({
    summary: z.string(),
    experience: z
      .array(
        z.object({
          role: z.string(),
          company: z.string(),
          location: z.string().optional(),
          start: z.string(),
          end: z.string().optional(),
          highlights: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    education: z
      .array(
        z.object({
          degree: z.string(),
          school: z.string(),
          start: z.string(),
          end: z.string().optional(),
        }),
      )
      .default([]),
    skills: z
      .array(
        z.object({
          group: z.string(),
          items: z.array(z.string()),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog, projects, cv };
