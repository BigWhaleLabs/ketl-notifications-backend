import { MulticastMessage, getMessaging } from 'firebase-admin/messaging'
import { TokenModel } from '@/models/Token'
import { chunk } from 'lodash'
import { storeLastTimeSent } from '@/helpers/lastTimeSent'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

interface FirebaseNotificationProps {
  tokens: string[]
  title?: string
  body?: string
  postId?: number
  feedId?: number
  type?: 'entanglement' | 'newpost'
}

export default async function ({
  body,
  feedId,
  postId,
  title,
  tokens,
  type = 'newpost',
}: FirebaseNotificationProps) {
  console.log(
    type === 'entanglement'
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
        type,
      },
      tokens: chunk.filter((token) => !!token),
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
    try {
      const response = await messaging.sendMulticast(message)
      const notificationErrorStrings =
        /(registration-token-not-registered|invalid-registration-token)/
      const tokensToDelete: string[] = []
      response.responses.forEach(async (response, index) => {
        const token = chunk[index]
        if (response.success) {
          console.log(response)
          await storeLastTimeSent(Date.now())
          return
        }
        if (!response.error) return
        const errorCode = response.error.code

        if (notificationErrorStrings.test(errorCode)) {
          console.log(errorCode)
          tokensToDelete.push(token)
          return
        }
        console.error(errorCode, response.error)
      })
      await TokenModel.updateMany(
        { token: { $in: tokensToDelete } },
        { expired: true }
      )
    } catch (e) {
      console.error(e)
    }
  }
}
