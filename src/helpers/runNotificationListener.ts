import { BigNumber } from 'ethers'
import { PostStructOutput } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import env from '@/helpers/env'
import getAllValidTokens from '@/helpers/getAllValidTokens'
import getFeedsContract from '@/helpers/getFeedsContract'
import getIPFSContent from '@/helpers/getIPFSContent'
import ketlAttestationContract from '@/helpers/getKetlAttestation'
import sendFirebaseNotification from '@/helpers/sendFirebaseNotification'
import structToCid from '@/helpers/structToCid'

const prodFeeds = {
  1: 't/startups',
  2: 't/ketlTeam',
}

const rootFeeds: { [key: number]: string } = env.isProduction
  ? prodFeeds
  : {
      0: 't/devFeed',
      ...prodFeeds,
    }

ketlAttestationContract.on('EntanglementRegistered', async () => {
  const tokens = await getAllValidTokens()
  try {
    await sendFirebaseNotification({
      entanglement: true,
      tokens,
    })
  } catch (err) {
    console.error(err)
  }
})

getFeedsContract.on('CommentAdded', async () => {
  const tokens = await getAllValidTokens()
  try {
    await sendFirebaseNotification({
      tokens,
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

    const tokens = await getAllValidTokens()
    try {
      await sendFirebaseNotification({
        body,
        feedId: feedId.toNumber(),
        postId: postId.toNumber(),
        title,
        tokens,
      })
    } catch (err) {
      console.error(err)
    }
  }
)
