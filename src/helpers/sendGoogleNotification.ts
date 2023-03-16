import { MessagingPayload, getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

function createNotification(title?: string, body?: string) {
  const baseNotification = {
    data: {
      type: 'newPost',
    },
  } as MessagingPayload
  if (title) {
    baseNotification.notification = {
      title,
      body,
      sound: 'default',
    }
  }
  return baseNotification
}

export default function (token: string, title?: string, body?: string) {
  return messaging.sendToDevice(token, createNotification(title, body), {
    priority: 'high',
  })
}
