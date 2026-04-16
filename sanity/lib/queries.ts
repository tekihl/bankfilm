import {defineQuery} from 'next-sanity'

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    title,
    description
  }
`)

export const PEOPLE_QUERY = defineQuery(`
  *[_type == "person"] | order(name asc){
    _id,
    name,
    description,
    email,
    links[]{
      label,
      url
    },
    "imageUrl": image.asset->url
  }
`)

export const FILMS_QUERY = defineQuery(`
  *[_type == "film"] | order(title asc){
    _id,
    title,
    filmType,
    team,
    "imageUrl": image.asset->url
  }
`)
