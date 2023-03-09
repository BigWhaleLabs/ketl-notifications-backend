import { Notification } from '@parse/node-apn'
import apn from '@/helpers/apn'
import env from '@/helpers/env'

const notification = new Notification()

notification.topic = env.BUNDLE_ID
notification.contentAvailable = true
notification.priority = 5

export default async function (token: string) {
  try {
    const result = await apn.send(notification, token)
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
