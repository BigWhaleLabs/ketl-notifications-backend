import { BigNumber } from 'ethers'
import { OBSSStorage } from '@big-whale-labs/obss-storage-contract'
import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import generateRandomName from '@/helpers/generateRandomName'
import getIPFSContent from '@/helpers/getIPFSContent'
import obssContract from '@/helpers/getObssContract'
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
    return
    const feed = rootFeeds[feedId.toNumber()]
    const title = feed && `@${generateRandomName(author)} posted at ${feed}`
    const body = feed && (await getIPFSContent(structToCid(metadata)))

    const allTokens = await TokenModel.find()
    const fcmTokens = allTokens.filter(({ token }) => !apnRegex.test(token))

    for (const { token } of fcmTokens) {
      try {
        // FCM token
        await sendFirebaseNotification({
          body,
          postId: title ? commentsFeedId.toNumber() : undefined,
          title,
          token,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
)
