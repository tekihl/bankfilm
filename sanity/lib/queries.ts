import {defineQuery} from 'next-sanity'

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    title,
    description
  }
`)
