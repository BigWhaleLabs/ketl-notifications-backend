import { Config, uniqueNamesGenerator } from 'unique-names-generator'
import { animalDictionary, colorDictionary } from '@/helpers/nameDictionary'

export default function (address: string) {
  const customConfig: Config = {
    dictionaries: [animalDictionary, colorDictionary],
    length: 2,
    style: 'capital',
    separator: '',
    seed: address,
  }
  return uniqueNamesGenerator(customConfig)
}
