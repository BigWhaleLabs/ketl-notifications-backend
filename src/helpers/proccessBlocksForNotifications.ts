import { BigNumber } from 'ethers'
import { FeedPostAddedEvent } from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/OBSSStorage'
import CID from '@/models/CID'
import generateRandomName from '@/helpers/generateRandomName'
import parsePostLogData from '@/helpers/parsePostLogData'
import structToCid from '@/helpers/structToCid'

export default function (posts: FeedPostAddedEvent[]) {
  return posts
    .map(({ data, topics }) => parsePostLogData({ data, topics }))
    .map(({ args }) => args as [BigNumber, BigNumber, [string, CID, BigNumber]])
    .map(([idFeed, postId, [author, metadata, commentFeedId]]) => {
      return [
        idFeed.toString(),
        postId.toString(),
        [
          author,
          structToCid(metadata),
          commentFeedId,
          generateRandomName(author),
        ],
      ]
    })
}
