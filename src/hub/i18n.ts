import { useCallback } from 'react'
import { useLocale } from '@/i18n'
import type { Locale } from '@/data/types'

type Dict = Record<string, string>

const ko: Dict = {
  'tagline': '내 마을에 부르고 싶은 얼굴들, 조합은 계산에 맡기세요',
  'intro':
    'villagertier.com은 마을 꾸미기 게임의 주민 조합 도구 모음입니다. 좋아하는 주민을 티어로 평가하면, 성격·특기 같은 균형까지 계산해서 드림 조합을 추천해 드려요. 설치도 로그인도 없이 브라우저에서 바로 쓸 수 있습니다.',
  'acnh.title': '동물의 숲 드림 주민 조합기',
  'acnh.desc':
    '「모여봐요 동물의 숲」 주민 407명을 평가하면 8가지 성격 밸런스와 종족 다양성을 고려해 드림 주민 10명을 추천합니다.',
  'acnh.cta': '주민 조합기 열기',
  'acnh.meta': '주민 407명 · 성격 밸런스',
  'pokopia.title': '포코피아 드림타운 조합기',
  'pokopia.desc':
    '「포켓몬 포코피아」 포켓몬 307마리를 평가하면 특기 커버리지와 타입 다양성을 고려해 집 단위(1~4마리)로 드림타운을 추천합니다.',
  'pokopia.cta': '드림타운 조합기 열기',
  'pokopia.meta': '포켓몬 307마리 · 특기 커버리지',
  'about.title': '이런 분께 추천해요',
  'about.body':
    '섬이나 마을에 누구를 부를지 늘 고민하는 분, 인기 순위 말고 내 취향 기준으로 고르고 싶은 분, 성격이나 특기가 한쪽으로 쏠리지 않게 균형을 맞추고 싶은 분. 두 도구 모두 추천 점수의 근거를 숫자로 보여줘서, 왜 이 조합인지 납득하고 고를 수 있습니다.',
  'footer':
    '비공식 팬 메이드 도구 모음입니다. 동물의 숲은 Nintendo의, 포켓몬 포코피아는 Nintendo·Creatures Inc.·GAME FREAK inc.의 상표입니다.',
}

const en: Dict = {
  'tagline': 'The faces you want in your town — leave the math to us',
  'intro':
    'villagertier.com is a small collection of villager-picking tools for town-building games. Rate the residents you like, and each tool recommends a dream lineup that balances your taste with personalities, specialties and diversity. No install, no login, right in your browser.',
  'acnh.title': 'ACNH Dream Villager Picker',
  'acnh.desc':
    'Rate any of the 407 villagers in Animal Crossing: New Horizons and get a dream team of 10, balanced across all 8 personalities and species diversity.',
  'acnh.cta': 'Open the villager picker',
  'acnh.meta': '407 villagers · personality balance',
  'pokopia.title': 'Pokopia Dream Town Picker',
  'pokopia.desc':
    'Rate any of the 307 Pokemon in Pokemon Pokopia and get a dream town grouped by house (1-4 each), with specialty coverage and type diversity calculated in.',
  'pokopia.cta': 'Open the dream town picker',
  'pokopia.meta': '307 Pokemon · specialty coverage',
  'about.title': 'Who this is for',
  'about.body':
    'Anyone who agonizes over who to invite to their island or town, anyone who wants picks based on their own taste rather than a popularity chart, and anyone who wants personalities or specialties balanced instead of lopsided. Both tools show the numbers behind every recommendation, so you can decide with confidence.',
  'footer':
    'An unofficial fan-made collection. Animal Crossing is a trademark of Nintendo. Pokemon Pokopia is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc.',
}

const ja: Dict = {
  'tagline': '街に呼びたい顔ぶれ、組み合わせの計算はおまかせ',
  'intro':
    'villagertier.comは、街づくりゲームの住民組み合わせツール集です。好きな住民をティアで評価すると、性格や特技のバランスまで計算してドリームな組み合わせをおすすめします。インストールもログインも不要、ブラウザですぐ使えます。',
  'acnh.title': 'あつ森 ドリーム住民診断',
  'acnh.desc':
    '『あつまれ どうぶつの森』の住民407人を評価すると、8つの性格バランスと種族の多様性を考えてドリーム住民10人をおすすめします。',
  'acnh.cta': '住民診断を開く',
  'acnh.meta': '住民407人 · 性格バランス',
  'pokopia.title': 'ポコピア ドリームタウン診断',
  'pokopia.desc':
    '『ポケモンポコピア』のポケモン307匹を評価すると、特技のカバー範囲とタイプの多様性を考えて、家ごと（1〜4匹）のドリームタウンをおすすめします。',
  'pokopia.cta': 'ドリームタウン診断を開く',
  'pokopia.meta': 'ポケモン307匹 · 特技カバー',
  'about.title': 'こんな方におすすめ',
  'about.body':
    '島や街に誰を呼ぶかいつも悩む方、人気順ではなく自分の好みで選びたい方、性格や特技が偏らないようバランスを取りたい方。どちらのツールもおすすめの根拠を数字で表示するので、納得して選べます。',
  'footer':
    '非公式のファンメイドツール集です。どうぶつの森はNintendoの、ポケモンポコピアはNintendo・Creatures Inc.・GAME FREAK inc.の商標です。',
}

const MESSAGES: Record<Locale, Dict> = { ko, en, ja }

export function useHub(): { locale: Locale; t: (key: string) => string } {
  const { locale } = useLocale()
  const t = useCallback(
    (key: string): string => MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key,
    [locale],
  )
  return { locale, t }
}
