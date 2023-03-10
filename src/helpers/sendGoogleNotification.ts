import { getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default function (token: string) {
  return messaging.sendToDevice(
    token,
    {
      data: {
        body: 'This is a test Kekl notification',
        title: 'Kekl Notification',
      },
    },
    {
      priority: 'high',
    }
  )
}
