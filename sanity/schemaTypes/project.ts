import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client / Partner',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Completed', value: 'completed'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first on the projects dashboard.',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Optional for now. Cards show a blank image area when unset.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as {_type?: string; asset?: unknown}

              if (parent?.asset && !value) {
                return 'Alt text is required when an image is set.'
              }

              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1).unique(),
    }),
    defineField({
      name: 'semester',
      title: 'Semester',
      type: 'string',
      description: 'Use a season and year, for example “Fall 2025” or “Spring 2026”.',
      validation: (rule) =>
        rule.regex(/^(Spring|Summer|Fall|Winter) \d{4}$/, {
          name: 'semester',
          invert: false,
        }),
    }),
    defineField({
      name: 'tags',
      title: 'Other Tags',
      type: 'array',
      description:
        'Add project types, domains, or capabilities for the “Other” projects-page filter. Add technologies to Tech Stack instead.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'outcome',
      title: 'Outcome',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'detailSections',
      title: 'Detail Sections',
      type: 'array',
      description:
        'Optional extra sections for the individual project page.',
      of: [
        defineArrayMember({
          name: 'detailSection',
          title: 'Detail Section',
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 5,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'body',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Repository URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'deploymentUrl',
      title: 'Deployment URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'featuredImage',
    },
  },
})
