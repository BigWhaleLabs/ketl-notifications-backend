import { BigNumber } from 'ethers'
import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'

const prodFeeds = {
  1: 't/startups',
  2: 't/ketlTeam',
}

const apnRegex = /^[a-f0-9]{64}$/

const rootFeeds: { [key: number]: string } = env.isProduction
  ? prodFeeds
  : {
      0: 't/devFeed',
      ...prodFeeds,
    }

obssContract.on(
  'FeedPostAdded',
  async (feedId: BigNumber, postID: BigNumber, [, , commentsFeedId]) => {
    console.log(feedId.toNumber(), postID.toNumber(), commentsFeedId.toNumber())
    const feed = rootFeeds[feedId.toNumber()]
    const title = feed && `Someone posted at ${feed}`

    const allTokens = await TokenModel.find()

    for (const { token } of allTokens) {
      try {
        // APN token
        if (apnRegex.test(token)) {
          await sendAppleNotification(token, title)
        } else {
          // FCM token
          await sendFirebaseNotification(
            token,
            title,
            title ? commentsFeedId.toNumber() : undefined
          )
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
)
