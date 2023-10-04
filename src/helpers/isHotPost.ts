import {
  minimumLikes,
  minimumNumberOfComments,
  minimumParticipants,
  minimumViews,
  oneWeek,
} from '@/data/hotPost'
import getFeedsContract from '@/helpers/getFeedsContract'
import getViews from '@/helpers/postViews'

interface GetParticipantsProps {
  feedId: number
  postId: number
  skip?: number
  pinned?: boolean
}

async function getParticipants({
  feedId,
  pinned = false,
  postId,
  skip = 1,
}: GetParticipantsProps) {
  const [{ participants }] = await getFeedsContract.getPostsAndParticipants(
    feedId,
    postId,
    skip,
    pinned
  )

  return participants.length
}

async function getNumberOfComments(feedId: number, postId: number) {
  const lastCommentId = await getFeedsContract.lastCommentIds(feedId, postId)
  return lastCommentId.toNumber()
}

async function getNumberOfLikes(feedId: number, postId: number) {
  const [downVotes, upVotes] = await getFeedsContract.getReactions(
    feedId,
    postId,
    0
  )
  return upVotes.toNumber() + downVotes.toNumber()
}

async function isOldPost(feedId: number, postId: number) {
  const post = await getFeedsContract.posts(feedId, postId)
  return Date.now() - post.timestamp.toNumber() * 1000 > oneWeek
}

export default async function isHotPost(feedId: number, postId: number) {
  const isOld = await isOldPost(feedId, postId)
  if (isOld) return false

  const participants = await getParticipants({ feedId, postId })

  if (participants < minimumParticipants) return false

  const numberOfComments = await getNumberOfComments(feedId, postId)
  if (numberOfComments < minimumNumberOfComments) return false

  const likes = await getNumberOfLikes(feedId, postId)
  if (likes < minimumLikes) return false

  const views = await getViews(feedId, postId)

  return views >= minimumViews
}
