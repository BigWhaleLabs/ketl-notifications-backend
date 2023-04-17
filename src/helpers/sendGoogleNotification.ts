import { MessagingPayload, getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

function createNotification(title?: string) {
  const baseNotification = {
    data: {
      type: 'newPost',
    },
  } as MessagingPayload
  if (title) {
    baseNotification.notification = {
      sound: 'default',
      title,
    }
  }
  return baseNotification
}

export default function (token: string, title?: string) {
  return messaging.sendToDevice(token, createNotification(title), {
    priority: 'high',
  })
}
