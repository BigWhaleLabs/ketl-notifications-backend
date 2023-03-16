import { BigNumber } from 'ethers'
import { TokenModel } from '@/models/Token'
import { getPostByStruct } from '@/helpers/api'
import CID from '@/models/CID'
import env from '@/helpers/env'
import generateRandomName from '@/helpers/generateRandomName'
import obssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'
import sendGoogleNotification from '@/helpers/sendGoogleNotification'

const apnRegex = /^[a-f0-9]{64}$/

const rootFeeds: { [key: number]: string } = env.isProduction
  ? {
      1: 't/startups',
      2: 't/ketlTeam',
    }
  : {
      0: 't/devFeed',
      1: 't/startups',
      2: 't/ketlTeam',
    }

obssContract.on(
  'FeedPostAdded',
  async (
    feedId,
    postId,
    [author, metadata]: [author: string, metadata: CID]
  ) => {
    const { text } = await getPostByStruct(metadata)
    const nickname = generateRandomName(author)
    const numberFeedId = feedId.toNumber()

    const title = rootFeeds[numberFeedId]
      ? `@${nickname} posted to ${rootFeeds[numberFeedId]}`
      : undefined

    const allTokens = await TokenModel.find()

    allTokens.forEach(async ({ token }) => {
      try {
        // APN token
        if (apnRegex.test(token)) {
          await sendAppleNotification(token, title, text)
        } else {
          // FCM token
          await sendGoogleNotification(token, title, text)
        }
      } catch (err) {
        console.error(err)
      }
    })
  }
)
