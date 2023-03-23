import { OBSSStorage__factory } from '@big-whale-labs/obss-storage-contract'
import { utils } from 'ethers'

export default function parsePostLogData({
  data,
  topics,
}: {
  data: string
  topics: string[]
}) {
  const transferEventInterface = new utils.Interface(OBSSStorage__factory.abi)
  return transferEventInterface.parseLog({ data, topics })
}
