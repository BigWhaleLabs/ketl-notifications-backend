import { PostTexts } from '@/models/Post'

const checkStringData = (data?: string) => {
  return typeof data === 'string' && data.length > 0
}

export default function (item: PostTexts): item is PostTexts {
  const validText = 'text' in item && checkStringData(item.text)

  return validText
}
