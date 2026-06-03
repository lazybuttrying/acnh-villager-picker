import type { Locale, PersonalityKey, PresetId } from '@/data/types'

// 성격 라벨 테이블.
const PERSONALITY_LABELS: Record<PersonalityKey, Record<Locale, string>> = {
  Jock: { ko: '운동광', en: 'Jock', ja: 'ハキハキ' },
  Lazy: { ko: '먹보', en: 'Lazy', ja: 'のんびり' },
  Cranky: { ko: '무뚝뚝', en: 'Cranky', ja: 'コワイ' },
  Smug: { ko: '느끼함', en: 'Smug', ja: 'キザ' },
  Peppy: { ko: '단순활발', en: 'Peppy', ja: 'げんき' },
  Normal: { ko: '친절함', en: 'Normal', ja: 'ふつう' },
  Snooty: { ko: '성숙함', en: 'Snooty', ja: 'おとな' },
  Uchi: { ko: '아이돌', en: 'Sisterly', ja: 'アネキ' },
}

export function personalityLabel(key: PersonalityKey, locale: Locale): string {
  return PERSONALITY_LABELS[key]?.[locale] ?? key
}

// 종족 라벨 테이블 (villagers.json의 35종 전체).
const SPECIES_LABELS: Record<string, Record<Locale, string>> = {
  Alligator: { ko: '악어', en: 'Alligator', ja: 'ワニ' },
  Anteater: { ko: '개미핥기', en: 'Anteater', ja: 'アリクイ' },
  Bear: { ko: '곰', en: 'Bear', ja: 'クマ' },
  Bird: { ko: '새', en: 'Bird', ja: 'トリ' },
  Bull: { ko: '황소', en: 'Bull', ja: 'ウシ（雄）' },
  Cat: { ko: '고양이', en: 'Cat', ja: 'ネコ' },
  Chicken: { ko: '닭', en: 'Chicken', ja: 'ニワトリ' },
  Cow: { ko: '소', en: 'Cow', ja: 'ウシ' },
  Cub: { ko: '새끼곰', en: 'Cub', ja: 'コグマ' },
  Deer: { ko: '사슴', en: 'Deer', ja: 'シカ' },
  Dog: { ko: '개', en: 'Dog', ja: 'イヌ' },
  Duck: { ko: '오리', en: 'Duck', ja: 'アヒル' },
  Eagle: { ko: '독수리', en: 'Eagle', ja: 'ワシ' },
  Elephant: { ko: '코끼리', en: 'Elephant', ja: 'ゾウ' },
  Frog: { ko: '개구리', en: 'Frog', ja: 'カエル' },
  Goat: { ko: '염소', en: 'Goat', ja: 'ヤギ' },
  Gorilla: { ko: '고릴라', en: 'Gorilla', ja: 'ゴリラ' },
  Hamster: { ko: '햄스터', en: 'Hamster', ja: 'ハムスター' },
  Hippo: { ko: '하마', en: 'Hippo', ja: 'カバ' },
  Horse: { ko: '말', en: 'Horse', ja: 'ウマ' },
  Kangaroo: { ko: '캥거루', en: 'Kangaroo', ja: 'カンガルー' },
  Koala: { ko: '코알라', en: 'Koala', ja: 'コアラ' },
  Lion: { ko: '사자', en: 'Lion', ja: 'ライオン' },
  Monkey: { ko: '원숭이', en: 'Monkey', ja: 'サル' },
  Mouse: { ko: '쥐', en: 'Mouse', ja: 'ネズミ' },
  Octopus: { ko: '문어', en: 'Octopus', ja: 'タコ' },
  Ostrich: { ko: '타조', en: 'Ostrich', ja: 'ダチョウ' },
  Penguin: { ko: '펭귄', en: 'Penguin', ja: 'ペンギン' },
  Pig: { ko: '돼지', en: 'Pig', ja: 'ブタ' },
  Rabbit: { ko: '토끼', en: 'Rabbit', ja: 'ウサギ' },
  Rhino: { ko: '코뿔소', en: 'Rhino', ja: 'サイ' },
  Sheep: { ko: '양', en: 'Sheep', ja: 'ヒツジ' },
  Squirrel: { ko: '다람쥐', en: 'Squirrel', ja: 'リス' },
  Tiger: { ko: '호랑이', en: 'Tiger', ja: 'トラ' },
  Wolf: { ko: '늑대', en: 'Wolf', ja: 'オオカミ' },
}

export function speciesLabel(species: string, locale: Locale): string {
  // 매핑 없으면 영문 species 문자열로 폴백.
  return SPECIES_LABELS[species]?.[locale] ?? species
}

// 프리셋 라벨 헬퍼 (t('preset.*')와 병행 제공).
const PRESET_LABELS: Record<PresetId, Record<Locale, string>> = {
  fav: { ko: '찜', en: 'Favorites', ja: 'お気に入り' },
  species: { ko: '종족', en: 'Species', ja: '種族' },
  personality: { ko: '성격', en: 'Personality', ja: '性格' },
}

export function presetLabel(id: PresetId, locale: Locale): string {
  return PRESET_LABELS[id]?.[locale] ?? id
}
