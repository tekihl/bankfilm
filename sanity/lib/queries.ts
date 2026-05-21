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
  *[_type == "person"] | order(coalesce(sortOrder, 9999) asc, name asc){
    _id,
    name,
    sortOrder
  }
`)

export const FILMS_QUERY = defineQuery(`
  *[_type == "film"] | order(title asc){
    _id,
    title,
    filmType,
    status,
    description,
    productionText,
    honorsOther,
    team,
    "imageUrl": image.asset->url
  }
`)

export const FILM_QUERY = defineQuery(`
  *[_type == "film" && _id == $id][0]{
    _id,
    title,
    filmType,
    status,
    description,
    productionText,
    honorsOther,
    team,
    linkTitle,
    linkUrl,
    "imageUrl": image.asset->url
  }
`)
