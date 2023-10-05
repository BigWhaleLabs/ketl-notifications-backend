import axios from 'axios'
import env from '@/helpers/env'

const viewsEndpoint = `${env.KETL_VIEWS_BACKEND}/views`

export default async function getViews(feedId: number, postId: number) {
  const searchQuery = new URLSearchParams({
    feedId: String(feedId),
    postId: String(postId),
  })

  const {
    data: { views },
  } = await axios.get(`${viewsEndpoint}?${searchQuery}`)

  return views
}
