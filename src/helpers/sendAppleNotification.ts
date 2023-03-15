import { Notification } from '@parse/node-apn'
import apn from '@/helpers/apn'
import env from '@/helpers/env'

function createNotification(notificationTitle?: string) {
  const notification = new Notification()
  notification.topic = env.BUNDLE_ID
  notification.contentAvailable = true
  notification.priority = 5
  notification.pushType = 'background'
  if (notificationTitle) {
    notification.priority = 10
    notification.aps.alert = notificationTitle
    notification.pushType = 'alert'
  }
  return notification
}

export default async function (token: string, notificationTitle?: string) {
  try {
    const result = await apn.send(createNotification(notificationTitle), token)
    if (result.failed.length) {
      throw new Error(
        'Failed to send notification through APN, response was: ' +
          JSON.stringify(result.failed)
      )
    }
  } catch (e) {
    console.error(e)
  }
}