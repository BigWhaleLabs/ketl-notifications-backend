import { BigNumber } from 'ethers'
import { OBSSStorage } from '@big-whale-labs/obss-storage-contract'
import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import generateRandomName from '@/helpers/generateRandomName'
import getIPFSContent from '@/helpers/getIPFSContent'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

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
  async (
    feedId: BigNumber,
    postID: BigNumber,
    [author, metadata, commentsFeedId]: OBSSStorage.PostStructOutput
  ) => {
    const feed = rootFeeds[feedId.toNumber()]
    const title = feed && `@${generateRandomName(author)} posted at ${feed}`
    const message = feed && (await getIPFSContent(structToCid(metadata)))

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
            message,
            title ? commentsFeedId.toNumber() : undefined
          )
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
)
