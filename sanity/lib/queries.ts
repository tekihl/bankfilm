import {defineQuery} from 'next-sanity'

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    title,
    description,
    address,
    email
  }
`)

export const PEOPLE_QUERY = defineQuery(`
  *[_type == "person"] | order(name asc){
    _id,
    name
  }
`)

export const FILMS_QUERY = defineQuery(`
  *[_type == "film"] | order(title asc){
    _id,
    title,
    filmType,
    description,
    status,
    team,
    "imageUrl": image.asset->url
  }
`)
