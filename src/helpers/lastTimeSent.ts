import * as storage from 'node-persist'

const lastTimeSentKey = 'lastTimeSent'

export const getLastTimeSent = () => {
  return storage.getItem(lastTimeSentKey)
}

export const setLastTimeSent = async (lastTimeSent: number) => {
  await storage.setItem(lastTimeSentKey, lastTimeSent)
}
