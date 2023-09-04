import { getItem, setItem } from 'node-persist'

const lastTimeSentKey = 'lastTimeSent'

export const getLastTimeSent = () => {
  return getItem(lastTimeSentKey)
}

export const setLastTimeSent = async (lastTimeSent: number) => {
  await setItem(lastTimeSentKey, lastTimeSent)
}
