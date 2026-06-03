// 공유 계약(contract). 모든 트랙이 import하지만 어느 트랙도 수정하지 않는다.

export type PersonalityKey = // 안정 그룹키(영문). UI 라벨은 i18n에서 변환.
  | 'Jock'
  | 'Lazy'
  | 'Cranky'
  | 'Smug'
  | 'Peppy'
  | 'Normal'
  | 'Snooty'
  | 'Uchi'

export type Locale = 'ko' | 'en' | 'ja'

export interface Villager {
  id: string
  names: Record<Locale, string> // 다국어 이름 (ja 결측 시 빌드에서 en 폴백)
  nameEn: string // 이미지/매칭용 (= names.en)
  personality: PersonalityKey
  species: string // 영문 키. 라벨은 speciesLabel로 로케일 변환.
  gender: 'Male' | 'Female'
  image: string // dodo.ac URL (빌드타임 사전계산)
}

export const TIER_SCORE = { S: 4, A: 3, B: 2, C: 1 } as const
export type Tier = keyof typeof TIER_SCORE
export type Scores = Record<string, number> // villagerId -> 점수(미평가 0)
export type Ratings = Record<string, Tier> // localStorage 영속 형태

export const TEAM_SIZE = 10

export const PERSONALITY_KEYS: PersonalityKey[] = [
  'Jock',
  'Lazy',
  'Cranky',
  'Smug',
  'Peppy',
  'Normal',
  'Snooty',
  'Uchi',
]

export type PresetId = 'fav' | 'species' | 'personality' // 라벨은 i18n
