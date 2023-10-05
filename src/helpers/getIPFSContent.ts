import axios from 'axios'
import env from '@/helpers/env'

export default async function (cid?: string) {
  if (!cid) return
  const ipfsBaseUrl = env.IPFS_GATEWAY
  const ipfsUrlString = `${ipfsBaseUrl}/${cid}`
  const { data } = await axios.get<{ text?: string; extraText?: string }>(
    ipfsUrlString
  )
  return data
}
