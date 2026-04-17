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
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle,
      }
    },
  },
})
