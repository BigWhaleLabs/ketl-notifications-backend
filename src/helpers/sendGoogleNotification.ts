import { getMessaging } from 'firebase-admin/messaging'
import firebase from '@/helpers/firebase'

const messaging = getMessaging(firebase)

export default function (token: string) {
  return messaging.sendToDevice(
    token,
    {
      data: {
        body: 'FCM Message Body',
      },
    },
    {
      priority: 'high',
    }
  )
}
