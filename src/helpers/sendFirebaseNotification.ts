import { MulticastMessage, getMessaging } from 'firebase-admin/messaging'
import { chunk } from 'lodash'
import { setLastTimeSent } from '@/helpers/lastTimeSent'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default async function ({
  body,
  entanglement,
  feedId,
  postId,
  title,
  tokens,
}: {
  tokens: string[]
  title?: string
  body?: string
  postId?: number
  feedId?: number
  entanglement?: boolean
}) {
  console.log(
    entanglement
      ? `Entanglement notifications. Number of tokens: ${tokens.length}`
      : `Post notifications. Number of tokens: ${tokens.length}, PostId: ${postId}, FeedId: ${feedId}`
  )
  const tokenChunks = chunk(tokens, 499)

  // Send multicast messages for each chunk
  for (const chunk of tokenChunks) {
    const message = {
      android: {
        priority: 'high',
      },
      data: {
        feedId: feedId ? String(feedId) : '',
        postId: postId ? String(postId) : '',
        type: entanglement ? 'entanglement' : 'newpost',
      },
      tokens: chunk,
    } as MulticastMessage

    if (title) {
      message.notification = {
        body,
        title,
      }
    } else {
      message.apns = {
        headers: {
          'apns-priority': '5',
          'apns-push-type': 'background',
          'apns-topic': 'xyz.ketl',
        },
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      }
    }
    console.log('Send next chunk of tokens by sendMulticast')
    const response = await messaging.sendMulticast(message)
    response.responses.forEach(async (response) => {
      if (response.success) {
        console.log(response)
        await setLastTimeSent(Date.now())
        return
      }
      if (!response.error) return
      if (response.error.code === 'messaging/registration-token-not-registered')
        return
      console.error(response.error)
    })
  }
}
