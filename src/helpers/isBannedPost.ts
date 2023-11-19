import axios from 'axios'
import env from '@/helpers/env'

export async function isBannedPost(feedId: number, postId: number) {
  const { data } = await axios.get<boolean>(
    `${env.KETL_MODERATION_BACKEND}/hidden/${feedId}/${postId}/post`
  )

  return data
}

export async function isBannedComment(
  feedId: number,
  postId: number,
  commendId: number
) {
  const { data } = await axios.get<boolean>(
    `${env.KETL_MODERATION_BACKEND}/hidden/${feedId}/${postId}/${commendId}`
  )

  return data
}

export default function isBanned(
  feedId: number,
  postId: number,
  commendId?: number
) {
  if (commendId !== undefined) return isBannedComment(feedId, postId, commendId)

  return isBannedPost(feedId, postId)
}
