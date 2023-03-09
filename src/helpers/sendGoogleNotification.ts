import { getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default function (token: string) {
  return messaging.sendToDevice(token, {
    notification: {
      body: 'This is a test Kekl notification',
      title: 'Kekl Notification',
    },
  })
}
