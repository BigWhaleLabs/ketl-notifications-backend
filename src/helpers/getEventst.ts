import {
  TypedEvent,
  TypedEventFilter,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/common'
import obssContract from '@/helpers/getObssContract'

const contractCreationBlock = 32269128

export default function getEvents<TEvent extends TypedEvent>(
  filter: TypedEventFilter<TEvent>,
  startingBlock?: number,
  toBlock?: number
) {
  return obssContract.queryFilter(
    filter,
    startingBlock || contractCreationBlock,
    toBlock || 'latest'
  )
}
