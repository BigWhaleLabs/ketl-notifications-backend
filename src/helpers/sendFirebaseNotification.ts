import { Message, getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default function ({
  body,
  postId,
  title,
  token,
}: {
  token: string
  title?: string
  body?: string
  postId?: number
}) {
  const message = {
    android: {
      priority: 'high',
    },
    data: {
      postId: postId ? String(postId) : '',
    },
    token,
  } as Message

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
  return messaging.send(message)
}
