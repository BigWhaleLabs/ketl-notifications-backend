import { encode } from 'bs58'
import CID from '@/models/CID'

export default function structToCid(struct: CID) {
  if (struct.size === 0) return undefined

  // cut off leading "0x"
  const hashBytes = Buffer.from(struct.digest.slice(2), 'hex')

  // prepend hashFunction and digest size
  const multihashBytes = Buffer.alloc(2 + hashBytes.length)
  multihashBytes[0] = struct.hashFunction
  multihashBytes[1] = struct.size
  multihashBytes.set(hashBytes, 2)

  return encode(multihashBytes)
}
