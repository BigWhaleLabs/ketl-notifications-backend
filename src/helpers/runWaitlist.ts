import { TokenModel } from '@/models/Token'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'

const oneMinute = 60 * 1000
const oneHour = oneMinute * 60

export default function runWaitlist() {
  setInterval(async () => {
    try {
      const tokens = await TokenModel.find({ waitlist: true })
      const tokensToNotify = tokens.map(({ token }) => token).filter(Boolean)
      if (!tokensToNotify.length) return
      await sendFirebaseNotification({
        tokens: tokensToNotify,
        type: 'waitlist',
      })
    } catch (e) {
      console.error(e)
    }
  }, oneHour * 2)
}
