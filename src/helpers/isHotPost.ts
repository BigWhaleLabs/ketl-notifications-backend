import {
  minimumLikes,
  minimumNumberOfComments,
  minimumParticipants,
  minimumViews,
  relevancePeriod,
} from '@/data/hotPost'
import axios from 'axios'
import env from '@/helpers/env'
import getFeedsContract from '@/helpers/getFeedsContract'

async function getParticipants(feedId: number, postId: number) {
  const [{ participants }] = await getFeedsContract.getPostsAndParticipants(
    feedId,
    postId,
    1,
    false
  )

  return participants.length
}

async function getNumberOfComments(feedId: number, postId: number) {
  const lastCommentId = await getFeedsContract.lastCommentIds(feedId, postId)
  return lastCommentId.toNumber()
}

async function getNumberOfLikes(feedId: number, postId: number) {
  const [_, likes] = await getFeedsContract.getReactions(feedId, postId, 0)
  return likes.toNumber()
}

async function isOldPost(feedId: number, postId: number) {
  const post = await getFeedsContract.posts(feedId, postId)
  return Date.now() - post.timestamp.toNumber() * 1000 > relevancePeriod
}

const viewsEndpoint = `${env.KETL_VIEWS_BACKEND}/views`

export async function getViews(feedId: number, postId: number) {
  const searchQuery = new URLSearchParams({
    feedId: String(feedId),
    postId: String(postId),
  })

  const {
    data: { views },
  } = await axios.get(`${viewsEndpoint}?${searchQuery}`)

  return views
}

export default async function isHotPost(feedId: number, postId: number) {
  const isOld = await isOldPost(feedId, postId)
  if (isOld) return false

  const participants = await getParticipants(feedId, postId)

  if (participants < minimumParticipants) return false

  const numberOfComments = await getNumberOfComments(feedId, postId)
  if (numberOfComments < minimumNumberOfComments) return false

  const likes = await getNumberOfLikes(feedId, postId)
  if (likes < minimumLikes) return false

  const views = await getViews(feedId, postId)

  return views >= minimumViews
}
