import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { TokenModel } from '@/models/Token'
import env from '@/helpers/env'
import generateRandomName from '@/helpers/generateRandomName'
import getFeedsContract from '@/helpers/getFeedsContract'
import getIPFSContent from '@/helpers/getIPFSContent'
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

getFeedsContract.on('CommentAdded', async () => {
  const allTokens = await TokenModel.find()
  const fcmTokens = allTokens.reduce((acc: string[], { token }) => {
    if (!apnRegex.test(token)) {
      acc.push(token)
    }
    return acc
  }, [])
  try {
    await sendFirebaseNotification({
      tokens: fcmTokens,
    })
  } catch (err) {
    console.error(err)
  }
})

getFeedsContract.on(
  'PostAdded',
  async (
    feedId: BigNumber,
    postId: BigNumber,
    [author, metadata]: PostStructOutput
  ) => {
    const feed = rootFeeds[feedId.toNumber()]
    const title = feed && `@${generateRandomName(author)} posted at ${feed}`
    if (!title) return
    const body = feed && (await getIPFSContent(structToCid(metadata)))

    const allTokens = await TokenModel.find()
    const fcmTokens = allTokens.reduce((acc: string[], { token }) => {
      if (!apnRegex.test(token)) {
        acc.push(token)
      }
      return acc
    }, [])
    try {
      await sendFirebaseNotification({
        body,
        postId: postId.toNumber(),
        title,
        tokens: fcmTokens,
      })
    } catch (err) {
      console.error(err)
    }
  }
)
