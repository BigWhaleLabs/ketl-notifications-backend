import { DocumentType } from '@typegoose/typegoose'

export default function docsToObject<T>(docs: DocumentType<T>[]) {
  return docs.map((doc) => doc.toObject({ virtuals: true }))
}
