import { useCallback } from 'react'
import { useLocale } from '@/i18n'
import type { Locale } from '@/data/types'
import type { Pokemon } from './data/types'

const TYPE_NAMES: Record<string, Record<Locale, string>> = {
  Normal: { ko: '노말', en: 'Normal', ja: 'ノーマル' },
  Fighting: { ko: '격투', en: 'Fighting', ja: 'かくとう' },
  Flying: { ko: '비행', en: 'Flying', ja: 'ひこう' },
  Poison: { ko: '독', en: 'Poison', ja: 'どく' },
  Ground: { ko: '땅', en: 'Ground', ja: 'じめん' },
  Rock: { ko: '바위', en: 'Rock', ja: 'いわ' },
  Bug: { ko: '벌레', en: 'Bug', ja: 'むし' },
  Ghost: { ko: '고스트', en: 'Ghost', ja: 'ゴースト' },
  Steel: { ko: '강철', en: 'Steel', ja: 'はがね' },
  Fire: { ko: '불꽃', en: 'Fire', ja: 'ほのお' },
  Water: { ko: '물', en: 'Water', ja: 'みず' },
  Grass: { ko: '풀', en: 'Grass', ja: 'くさ' },
  Electric: { ko: '전기', en: 'Electric', ja: 'でんき' },
  Psychic: { ko: '에스퍼', en: 'Psychic', ja: 'エスパー' },
  Ice: { ko: '얼음', en: 'Ice', ja: 'こおり' },
  Dragon: { ko: '드래곤', en: 'Dragon', ja: 'ドラゴン' },
  Dark: { ko: '악', en: 'Dark', ja: 'あく' },
  Fairy: { ko: '페어리', en: 'Fairy', ja: 'フェアリー' },
}

const HABITAT_LABELS: Record<string, Record<Locale, string>> = {
  Bright: { ko: '밝은 곳', en: 'Bright', ja: '明るい場所' },
  Warm: { ko: '따뜻한 곳', en: 'Warm', ja: '暖かい場所' },
  Humid: { ko: '습한 곳', en: 'Humid', ja: '湿った場所' },
  Cool: { ko: '서늘한 곳', en: 'Cool', ja: '涼しい場所' },
  Dark: { ko: '어두운 곳', en: 'Dark', ja: '暗い場所' },
  Dry: { ko: '건조한 곳', en: 'Dry', ja: '乾いた場所' },
}

export function typeLabel(type: string, locale: Locale): string {
  return TYPE_NAMES[type]?.[locale] ?? type
}

export function habitatLabel(habitat: string, locale: Locale): string {
  return HABITAT_LABELS[habitat]?.[locale] ?? habitat
}

/** Specialty names are game UI terms; kept in English in every locale. */
export function specialtyLabel(specialty: string): string {
  return specialty
}

export function pokemonName(p: Pokemon, locale: Locale): string {
  if (locale === 'en') return p.nameEn
  return p.names[locale] ?? p.names.en
}

type Dict = Record<string, string>

const ko: Dict = {
  'nav.start': '시작하기',
  'nav.acnh': '동물의 숲 버전',
  'hero.title': '포코피아 드림타운 조합기',
  'hero.subtitle':
    '포켓몬 포코피아에 부르고 싶은 10마리, 특기 커버리지까지 계산해서 추천해 드려요.',
  'hero.cta': '내 드림타운 만들기',
  'hero.note': '설치도 로그인도 없이, 브라우저에서 바로. 평가는 자동 저장돼요.',
  'steps.title': '이렇게 쓰세요',
  'steps.1.title': '1. 주민을 평가하세요',
  'steps.1.desc':
    '포코피아에 등장하는 307마리를 S·A·B·C 티어로 평가하세요. 이미 영입한 포켓몬은 집 아이콘으로 표시해 두면 추천에 고정돼요.',
  'steps.2.title': '2. 추천 방식을 고르세요',
  'steps.2.desc':
    '내 취향 우선, 특기 커버리지 우선, 타입 다양성 우선 — 세 가지 방식 중 하나로 드림타운 10마리를 추천받아요.',
  'steps.3.title': '3. 공유하세요',
  'steps.3.desc': '링크나 이미지 카드로 내 드림타운을 자랑하고, 친구의 팀도 구경해 보세요.',
  'features.title': '추천이 계산하는 것',
  'features.tier.title': '내 티어 평가',
  'features.tier.desc': 'S=4점, A=3점, B=2점, C=1점. 평가 안 한 포켓몬은 0점 — 내 취향이 점수의 출발점이에요.',
  'features.spec.title': '특기 커버리지',
  'features.spec.desc':
    'Build로 집을 짓고, Chop으로 나무를 베고, Water로 물을 주고, Burn으로 불을 붙이고 — 마을 운영에 필요한 특기가 골고루 갖춰지도록 추천해요.',
  'features.type.title': '타입 다양성',
  'features.type.desc': '같은 타입이 겹치면 감점. 18가지 타입이 다양하게 섞일수록 점수가 올라가요.',
  'features.why.title': '추천 근거 공개',
  'features.why.desc': '총점과 함께 티어 점수, 특기 커버리지, 타입 중복을 숫자로 보여줘요. 왜 이 팀인지 납득하고 고르세요.',
  'about.title': '포코피아의 특기란?',
  'about.body':
    '「포켓몬 포코피아」에서는 포켓몬마다 마을 생활에 도움이 되는 특기(Specialty)가 정해져 있습니다. 특기가 있어야 건물을 짓고, 밭을 갈고, 불을 붙이고, 물건을 만들 수 있어요. 어떤 포켓몬을 마을에 부르느냐가 곧 마을이 할 수 있는 일을 결정합니다. 이 도구는 등장 포켓몬 307마리의 특기와 타입, 이상적인 서식지 데이터를 바탕으로, 당신의 취향과 마을 운영의 균형을 함께 고려해 드림타운을 추천합니다.',
  'cross.title': '동물의 숲 드림 주민도 있어요',
  'cross.body': '모여봐요 동물의 숲 버전에서는 407명의 주민을 같은 방식으로 추천해 드려요.',
  'cross.cta': '동물의 숲 버전 가기',
  'app.title': '드림타운 조합기',
  'search.placeholder': '이름으로 검색',
  'filter.all': '전체',
  'filter.specialty': '특기',
  'filter.type': '타입',
  'filter.habitat': '서식지',
  'filter.ratedOnly': '평가만',
  'filter.recruitedOnly': '영입만',
  'card.blacklist': '제외',
  'card.recruited': '영입 완료',
  'rec.title': '추천 드림타운',
  'rec.preset': '추천 방식',
  'rec.preset.fav': '내 취향 우선',
  'rec.preset.specialty': '특기 커버 우선',
  'rec.preset.type': '타입 다양성 우선',
  'rec.size': '인원',
  'rec.empty': '아직 평가한 포켓몬이 없어요. 마음에 드는 포켓몬부터 평가해 보세요.',
  'rec.score.total': '총점',
  'rec.score.tier': '티어 점수',
  'rec.score.coverage': '특기 커버',
  'rec.score.typeDup': '타입 중복',
  'rec.covered': '갖춘 특기',
  'rec.missing': '없는 특기',
  'share.button': '내 팀 공유',
  'share.copied': '링크가 복사됐어요',
  'share.copyLink': '링크 복사',
  'share.tweet': 'X에 공유',
  'share.saveImage': '이미지 저장',
  'share.imageTagline': '307마리 중 고른 내 드림타운 10마리',
  'shared.title': '공유받은 드림타운',
  'shared.cta': '나도 만들어보기',
  'footer.disclaimer':
    '비공식 팬 메이드 도구입니다. 포켓몬 포코피아는 Nintendo·Creatures Inc.·GAME FREAK inc.의 상표입니다.',
  'lang.label': '언어',
}

const en: Dict = {
  'nav.start': 'Start',
  'nav.acnh': 'Animal Crossing version',
  'hero.title': 'Pokopia Dream Town Picker',
  'hero.subtitle':
    'Pick the 10 Pokemon you want in your Pokopia town — recommended with specialty coverage calculated in.',
  'hero.cta': 'Build my dream town',
  'hero.note': 'No install, no login, right in your browser. Your ratings save automatically.',
  'steps.title': 'How it works',
  'steps.1.title': '1. Rate the residents',
  'steps.1.desc':
    'Rate any of the 307 Pokemon in Pokopia from S to C tier. Mark Pokemon you already recruited with the home icon and they stay pinned in your recommendations.',
  'steps.2.title': '2. Choose a recommendation style',
  'steps.2.desc':
    'Your taste first, specialty coverage first, or type diversity first — get a dream town of 10 in one of three styles.',
  'steps.3.title': '3. Share it',
  'steps.3.desc': 'Show off your dream town with a link or an image card, and peek at your friends\u2019 teams.',
  'features.title': 'What the recommendation calculates',
  'features.tier.title': 'Your tier ratings',
  'features.tier.desc': 'S=4, A=3, B=2, C=1 points. Unrated Pokemon score 0 — your taste is where the score starts.',
  'features.spec.title': 'Specialty coverage',
  'features.spec.desc':
    'Build houses, Chop wood, Water crops, Burn to light fires — the picker balances the specialties your town needs to run.',
  'features.type.title': 'Type diversity',
  'features.type.desc': 'Repeated types lose points. The wider the mix across all 18 types, the higher the score.',
  'features.why.title': 'Reasons, shown',
  'features.why.desc': 'Every recommendation comes with its numbers: tier score, specialty coverage and type duplicates, so you can decide with confidence.',
  'about.title': 'What are specialties in Pokopia?',
  'about.body':
    'In Pokemon Pokopia, every Pokemon has a Specialty that helps run your town. Specialties are how buildings get built, fields get tilled, fires get lit and items get crafted — the Pokemon you invite decide what your town can do. This tool uses data for all 307 Pokemon in the game (specialties, types and ideal habitats) to recommend a dream town that balances your taste with a town that actually works.',
  'cross.title': 'There is an Animal Crossing version too',
  'cross.body': 'The Animal Crossing version recommends dream villagers from all 407 residents, the same way.',
  'cross.cta': 'Go to the Animal Crossing version',
  'app.title': 'Dream Town Picker',
  'search.placeholder': 'Search by name',
  'filter.all': 'All',
  'filter.specialty': 'Specialty',
  'filter.type': 'Type',
  'filter.habitat': 'Habitat',
  'filter.ratedOnly': 'Rated only',
  'filter.recruitedOnly': 'Recruited only',
  'card.blacklist': 'Exclude',
  'card.recruited': 'Recruited',
  'rec.title': 'Recommended dream town',
  'rec.preset': 'Style',
  'rec.preset.fav': 'My taste first',
  'rec.preset.specialty': 'Specialty coverage first',
  'rec.preset.type': 'Type diversity first',
  'rec.size': 'Team size',
  'rec.empty': 'You have not rated anyone yet. Start by rating the Pokemon you love.',
  'rec.score.total': 'Total',
  'rec.score.tier': 'Tier score',
  'rec.score.coverage': 'Specialty coverage',
  'rec.score.typeDup': 'Type duplicates',
  'rec.covered': 'Covered specialties',
  'rec.missing': 'Missing specialties',
  'share.button': 'Share my team',
  'share.copied': 'Link copied',
  'share.copyLink': 'Copy link',
  'share.tweet': 'Share on X',
  'share.saveImage': 'Save image',
  'share.imageTagline': 'My 10 dream town picks out of 307',
  'shared.title': 'A shared dream town',
  'shared.cta': 'Make your own',
  'footer.disclaimer':
    'An unofficial fan-made tool. Pokemon Pokopia is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc.',
  'lang.label': 'Language',
}

const ja: Dict = {
  'nav.start': 'はじめる',
  'nav.acnh': 'あつ森バージョン',
  'hero.title': 'ポコピア ドリームタウン診断',
  'hero.subtitle':
    'ポケモンポコピアに呼びたい10匹を、特技のカバー範囲まで計算しておすすめします。',
  'hero.cta': 'ドリームタウンを作る',
  'hero.note': 'インストールもログインも不要、ブラウザですぐ。評価は自動保存されます。',
  'steps.title': '使い方',
  'steps.1.title': '1. 住民を評価する',
  'steps.1.desc':
    'ポコピアに登場する307匹をS・A・B・Cティアで評価。すでに仲間にしたポケモンは家のアイコンで固定できます。',
  'steps.2.title': '2. おすすめ方式を選ぶ',
  'steps.2.desc':
    '好み優先、特技カバー優先、タイプ多様性優先 — 3つの方式からドリームタウン10匹をおすすめ。',
  'steps.3.title': '3. 共有する',
  'steps.3.desc': 'リンクや画像カードでドリームタウンを自慢。友達のチームも見てみましょう。',
  'features.title': 'おすすめが計算するもの',
  'features.tier.title': 'あなたのティア評価',
  'features.tier.desc': 'S=4点、A=3点、B=2点、C=1点。無評価は0点 — スコアの出発点はあなたの好みです。',
  'features.spec.title': '特技カバー範囲',
  'features.spec.desc':
    'Buildで家を建て、Chopで木を切り、Waterで水をやり、Burnで火をつける — 街の運営に必要な特技をバランスよく。',
  'features.type.title': 'タイプの多様性',
  'features.type.desc': '同じタイプが重なると減点。全18タイプが多様に混ざるほど高スコア。',
  'features.why.title': 'おすすめの理由を公開',
  'features.why.desc': '合計点と一緒にティア点数、特技カバー、タイプ重複を数字で表示。納得して選べます。',
  'about.title': 'ポコピアの「特技」とは？',
  'about.body':
    '『ポケモンポコピア』では、ポケモンごとに街の暮らしを助ける特技（Specialty）が決まっています。特技があってこそ建物が建ち、畑が耕せ、火がつき、アイテムが作れます。どのポケモンを街に呼ぶかが、その街にできることを決めるのです。このツールは登場ポケモン307匹の特技・タイプ・理想の生息地データをもとに、あなたの好みと街運営のバランスを両立するドリームタウンをおすすめします。',
  'cross.title': 'あつ森バージョンもあります',
  'cross.body': 'あつまれ どうぶつの森バージョンでは、全407人の住民を同じ方式でおすすめします。',
  'cross.cta': 'あつ森バージョンへ',
  'app.title': 'ドリームタウン診断',
  'search.placeholder': '名前で検索',
  'filter.all': 'すべて',
  'filter.specialty': '特技',
  'filter.type': 'タイプ',
  'filter.habitat': '生息地',
  'filter.ratedOnly': '評価のみ',
  'filter.recruitedOnly': '仲間のみ',
  'card.blacklist': '除外',
  'card.recruited': '仲間済み',
  'rec.title': 'おすすめドリームタウン',
  'rec.preset': 'おすすめ方式',
  'rec.preset.fav': '好み優先',
  'rec.preset.specialty': '特技カバー優先',
  'rec.preset.type': 'タイプ多様性優先',
  'rec.size': '人数',
  'rec.empty': 'まだ評価したポケモンがいません。好きなポケモンから評価してみてください。',
  'rec.score.total': '合計',
  'rec.score.tier': 'ティア点数',
  'rec.score.coverage': '特技カバー',
  'rec.score.typeDup': 'タイプ重複',
  'rec.covered': '揃った特技',
  'rec.missing': '足りない特技',
  'share.button': 'チームを共有',
  'share.copied': 'リンクをコピーしました',
  'share.copyLink': 'リンクをコピー',
  'share.tweet': 'Xで共有',
  'share.saveImage': '画像を保存',
  'share.imageTagline': '307匹から選んだドリームタウン10匹',
  'shared.title': '共有されたドリームタウン',
  'shared.cta': '自分も作ってみる',
  'footer.disclaimer':
    '非公式のファンメイドツールです。ポケモンポコピアはNintendo・Creatures Inc.・GAME FREAK inc.の商標です。',
  'lang.label': '言語',
}

const MESSAGES: Record<Locale, Dict> = { ko, en, ja }

export function usePk(): { locale: Locale; t: (key: string) => string } {
  const { locale } = useLocale()
  const t = useCallback(
    (key: string): string => MESSAGES[locale]?.[key] ?? MESSAGES.en[key] ?? key,
    [locale],
  )
  return { locale, t }
}
