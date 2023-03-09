import { Notification } from '@parse/node-apn'
import apn from '@/helpers/apn'
import env from '@/helpers/env'

function createNotification(
  type: 'ReactionAdded' | 'ReactionRemoved' | 'FeedPostAdded'
) {
  const notification = new Notification()
  notification.topic = env.BUNDLE_ID
  notification.contentAvailable = true
  notification.priority = 5
  notification.payload = {
    type,
  } as { type: 'ReactionAdded' | 'ReactionRemoved' | 'FeedPostAdded' }
  return notification
}

export default async function (
  token: string,
  type: 'ReactionAdded' | 'ReactionRemoved' | 'FeedPostAdded'
) {
  try {
    const result = await apn.send(createNotification(type), token)
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
