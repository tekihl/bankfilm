import {defineField, defineType} from 'sanity'

export const filmType = defineType({
  name: 'film',
  title: 'Films',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'filmType',
      title: 'Type',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      of: [
        defineField({
          name: 'member',
          title: 'Member',
          type: 'reference',
          to: [{type: 'person'}],
        }),
      ],
    }),
    defineField({
      name: 'linkTitle',
      title: 'Link title',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'filmType',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
