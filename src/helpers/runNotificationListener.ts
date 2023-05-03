import { BigNumber } from 'ethers'
import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import obssContract from '@/helpers/getObssContract'
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
    const feed = rootFeeds[feedId.toNumber()]
    const title = feed && `Someone posted at ${feed}`

    const allTokens = await TokenModel.find()
    const fcmTokens = allTokens.reduce((acc: string[], { token }) => {
      if (!apnRegex.test(token)) {
        acc.push(token)
      }
      return acc
    }, [])

    try {
      if (fcmTokens.length > 0) {
        await sendFirebaseNotification(
          fcmTokens,
          title,
          title ? commentsFeedId.toNumber() : undefined
        )
      }
    } catch (err) {
      console.error(err)
    }
  }
)
