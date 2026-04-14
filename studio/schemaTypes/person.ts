import {defineField, defineType} from 'sanity'

export const personType = defineType({
  name: 'person',
  title: 'People',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
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
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'email',
    },
    prepare({title, media, subtitle}) {
      return {
        title,
        media,
        subtitle,
      }
    },
  },
})
