import axios from 'axios'
import env from '@/helpers/env'

function isContentNotHidden(e: unknown) {
  return axios.isAxiosError(e) && e.response?.status === 404
}

export async function isBannedPost(feedId: number, postId: number) {
  try {
    const { data } = await axios.get<boolean>(
      `${env.KETL_MODERATION_BACKEND}/hidden/${feedId}/${postId}/post`
    )

    return data
  } catch (e) {
    if (isContentNotHidden(e)) return false
    console.error(e)
  }
}

export async function isBannedComment(
  feedId: number,
  postId: number,
  commendId: number
) {
  try {
    const { data } = await axios.get<boolean>(
      `${env.KETL_MODERATION_BACKEND}/hidden/${feedId}/${postId}/${commendId}`
    )

    return data
  } catch (e) {
    if (isContentNotHidden(e)) return false
    console.error(e)
  }
}

export default function isBanned(
  feedId: number,
  postId: number,
  commendId?: number
) {
  if (commendId !== undefined) return isBannedComment(feedId, postId, commendId)

  return isBannedPost(feedId, postId)
}
