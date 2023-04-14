import { Message, getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default function (token: string, title?: string, postId?: number) {
  const message = {
    token,
    android: {
      priority: 'high',
    },
    data: {
      postId: postId ? String(postId) : undefined,
    },
  } as Message

  if (title) {
    message.notification = {
      title,
    }
  } else {
    message.apns = {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        'apns-push-type': 'background',
        'apns-priority': '5',
        'apns-topic': 'xyz.ketl',
      },
    }
  }
  return messaging.send(message)
}
