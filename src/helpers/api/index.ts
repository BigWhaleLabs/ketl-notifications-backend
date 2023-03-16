import { PostTexts } from '@/models/Post'
import CID from '@/models/CID'
import env from '@/helpers/env'
import fetchWithTimeout from '@/helpers/fetchWithTimeout'
import structToCid from '@/helpers/structToCid'
import validatePost from '@/helpers/api/validatePost'

const { IPFS_GATEWAY } = env

const headers = {
  'Content-Type': 'application/json',
}

export async function getMetadataFromIpfs<ResponseData>(metadata: CID) {
  const cid = structToCid(metadata)

  const response = await fetchWithTimeout(`${IPFS_GATEWAY}/${cid}`, {
    headers,
    timeout: 15000,
  })

  const data = (await response.json()) as ResponseData

  return data
}

export async function getPostByStruct(metadata: CID) {
  const postData = await getMetadataFromIpfs<PostTexts>(metadata)

  if (!postData || !validatePost(postData))
    throw new Error(
      `Invalid post metadata: ${metadata} postData: ${JSON.stringify(postData)}`
    )

  return { text: postData.text }
}
