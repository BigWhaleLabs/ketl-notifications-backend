import axios from 'axios'
import env from '@/helpers/env'
import getFeedsContract from '@/helpers/getFeedsContract'

async function getParticipantsAndNumberOfComments(
  feedId: number,
  postId: number
) {
  const [{ participants, post }] =
    await getFeedsContract.getPostsAndParticipants(feedId, postId, 1, false)

  return {
    numberOfComments: post.numberOfComments.toNumber(),
    participants: participants.length,
  }
}

async function getNumberOfComments(feedId: number, postId: number) {
  const number = await getFeedsContract.lastCommentIds(feedId, postId)
  console.log('number', number)
  return number.toNumber()
}

async function getNumberOfLikes(feedId: number, postId: number) {
  const [_, likes] = await getFeedsContract.getReactions(feedId, postId, 0)
  return likes.toNumber()
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
  const { participants } = await getParticipantsAndNumberOfComments(
    feedId,
    postId
  )
  const numberOfComments = await getNumberOfComments(feedId, postId)
  const likes = await getNumberOfLikes(feedId, postId)
  const views = await getViews(feedId, postId)

  return views >= 25 && numberOfComments > 7 && likes >= 10 && participants >= 3
}
