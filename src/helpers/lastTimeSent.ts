import { getItem, setItem } from 'node-persist'

const lastTimeSentKey = 'lastTimeSent'

export const getLastTimeSentFromStorage = () => {
  return getItem(lastTimeSentKey)
}

export const storeLastTimeSent = (lastTimeSent: number) =>
  setItem(lastTimeSentKey, lastTimeSent)
