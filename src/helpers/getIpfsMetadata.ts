import CID from '@/models/CID'
import env from '@/helpers/env'
import fetchWithTimeout from '@/helpers/fetchWithTimeout'
import structToCid from '@/helpers/structToCid'

const cidToData = new Map<CID, unknown>([])

const { IPFS_GATEWAY } = env

const headers = {
  'Content-Type': 'application/json',
}

async function getMetadataFromIpfs<ResponseData>(metadata: CID) {
  const cid = structToCid(metadata)

  const response = await fetchWithTimeout(`${IPFS_GATEWAY}/${cid}`, {
    headers,
    timeout: 15000,
  })

  const data = (await response.json()) as ResponseData

  cidToData.set(metadata, data)

  return data
}
