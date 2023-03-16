import * as base58 from 'bs58'
import CID from '@/models/CID'

export default function (struct: CID) {
  if (struct.size === 0) throw new Error(`Invalid CID struct: ${struct}`)

  // cut off leading "0x"
  const hashBytes = Buffer.from(struct.digest.slice(2), 'hex')

  // prepend hashFunction and digest size
  const multihashBytes = Buffer.alloc(2 + hashBytes.length)
  multihashBytes[0] = struct.hashFunction
  multihashBytes[1] = struct.size
  multihashBytes.set(hashBytes, 2)

  return base58.encode(multihashBytes)
}
