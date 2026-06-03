# 모동숲 드림 주민 조합기 — 실행 계획 (P1+P2+P3 MVP + 다국어, 병렬 빌드 / +P4 배포 +P5 수익화)

## Context

설계는 이미 확정됐다. `acnh-villager-picker-plan.md`(v2)에 스키마·추천 알고리즘·프리셋·엣지케이스가 못박혀 있고, P0 산출물 `villagers.json`(391명, 성격 8종·한글이름·이미지 391/391 검증)도 동봉돼 있다. 하지만 리포는 **그린필드** — 앱 스캐폴드가 0이다.

따라서 이 계획의 가치는 "무엇을 만드냐"가 아니라 **"확정된 스펙을 어떻게 병렬로 빠르게 조립하냐"**다. 목표: P1(평가 UX) + P2(추천 엔진) + P3(시각화/프리셋)을 한 번에 가는 MVP를, **계약(타입/시그니처)을 먼저 못박고 → 서로소 디렉터리를 소유한 서브에이전트 3트랙을 worktree에서 병렬 실행 → 통합 에이전트가 App.tsx로 배선** 하는 방식으로 완성한다. 이미지는 MVP라 `villagers.json`에 사전계산된 dodo.ac URL을 **핫링크**(셀프호스팅은 P4로 보류).

스택: **Vite + React + TS + Tailwind + shadcn/ui**, 상태는 localStorage(평가맵 + 로케일). 백엔드 0.

**추가 요구(국가별 언어 맞춤)**: 한/영/일 3개국어 지원, `navigator.language` **자동감지 + 수동 전환**(localStorage 영속). 이 요구가 핵심 계약을 바꾼다 — `Personality`를 한글 리터럴에서 **안정 키(English) + 로케일별 라벨테이블**로 리팩터하고, P0 빌드 스크립트를 재실행해 `names {ko,en,ja}` 맵을 데이터에 추가한다. 추천 알고리즘은 성격을 *그룹 키*로만 쓰므로 키가 안정적이면 무영향.

---

## 1. 왜 이 구조인가 (병렬화의 핵심)

네 트랙은 **단 하나의 계약**만 공유한다:
- `src/data/types.ts` — `PersonalityKey`(영문 안정키), `Villager`(`names:{ko,en,ja}` 포함), `Tier`, `TIER_SCORE`, `PERSONALITY_KEYS[]`, `TEAM_SIZE`, `Scores`, `Locale = "ko"|"en"|"ja"`, `PresetId`
- `useRatings()` 훅 시그니처 — `{ ratings, cycle(id), scores }`
- `useLocale()` 훅 + 라벨헬퍼 시그니처 — `{ locale, setLocale, t(key) }`, `villagerName(v,locale)`, `personalityLabel(key,locale)`, `speciesLabel(species,locale)`
- `recommend(pool, scores, w)` 시그니처 + `PRESETS`(`PresetId`키) / `Weights`

이 계약을 **S0(스캐폴드) 단계에서 먼저 확정**해 파일로 박아두면, 이후 네 트랙은 서로의 구현을 몰라도 된다. 각 트랙은 **서로소 디렉터리**만 생성하므로 병렬 파일쓰기 충돌이 없다(공유 파일 = `package.json`은 S0에서 모든 의존성 선설치해 병렬 쓰기 대상에서 제거, `App.tsx`는 통합 단계 전까지 아무도 안 건드림).

→ worktree 격리 + 서로소 디렉터리 = **충돌 없는 병합**. 통합 에이전트는 네 트랙의 산출 파일을 한 트리에 모아 `App.tsx`에서 배선만 한다.

---

## 2. 프로세스 다이어그램 (의존/실행 흐름)

```
                        ┌──────────────────────────────────────────────┐
   S0  SCAFFOLD         │ Vite+React+TS · Tailwind · shadcn init        │
   (단독, 전체 차단)     │ deps 선설치(recharts 포함) · 데이터 복사       │
                        │ ▶ CONTRACT 확정: types.ts + 훅/recommend 시그 │
                        │   + shadcn ui 프리미티브(button/input/badge…) │
                        └───────────────────────┬──────────────────────┘
                                                │  (계약 read-only로 고정)
       ┌──────────────────┬──────────────────┼──────────────────┬──────────────────┐
       ▼                  ▼                  ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ A 로직코어   │  │ B 평가 UI    │  │ C 시각화     │  │ D i18n코어   │
│ (wt, P2)     │  │ (wt, P1)     │  │ (wt, P3)     │  │ (wt, i18n)   │
│              │  │              │  │              │  │              │
│ lib/recommend│  │ components/  │  │ components/  │  │ src/i18n/    │
│ lib/storage  │  │  eval/       │  │  viz/        │  │  LocaleCtx   │
│ hooks/        │  │  VillagerGrid│  │  Personality │  │  messages    │
│  useRatings  │  │  VillagerCard│  │   Radar      │  │  label tables│
│ recommend.   │  │  FilterBar   │  │  RecommendPnl│  │  Language    │
│  test(vit)   │  │  TierBadge   │  │  PresetToggle│  │   Switcher   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       └─────────────────┴─────────┬────────┴─────────────────┘
                                   ▼
                              ┌──────────────────────────────┐
                       I1     │ INTEGRATION                  │
                       (단독)  │ App.tsx 배선 · main.tsx ·     │
                              │ 레이아웃 · 트랙 산출물 병합    │
                              └──────────────┬───────────────┘
                                             ▼
                              ┌──────────────────────────────┐
                       V1     │ VERIFY                        │
                       (단독)  │ typecheck · vitest · dev 스모크│
                              │ · build (Pages base path)     │
                              └──────────────────────────────┘
```

---

## 3. 병렬 상태(parallel state) 표

| 단계 | 실행 모드 | 소유 디렉터리 (서로소) | 의존(선행) | 차단(후행) | worktree |
|---|---|---|---|---|---|
| **S0** 스캐폴드+계약+데이터재생성 | 단독 | 루트 설정 · `src/data` · `scripts` · `src/lib/utils` · `src/components/ui` | — | 전체 | 메인 트리 |
| **A** 로직코어(P2) | ‖ 병렬 | `src/lib/recommend*` · `src/lib/storage` · `src/hooks` | S0 계약 | I1 | ✅ |
| **B** 평가 UI(P1) | ‖ 병렬 | `src/components/eval/*` | S0 계약 | I1 | ✅ |
| **C** 시각화(P3) | ‖ 병렬 | `src/components/viz/*` | S0 계약 | I1 | ✅ |
| **D** i18n코어 | ‖ 병렬 | `src/i18n/*` | S0 계약 | I1 | ✅ |
| **I1** 통합 | 단독 | `src/App.tsx` · `src/main.tsx` · `src/index.css` | A·B·C·D 전부 | V1 | 메인 트리 |
| **V1** 검증 | 단독 | (읽기/실행만) | I1 | — | 메인 트리 |

> **배리어는 I1 단 하나.** A·B·C·D는 동기화 지점 없이 끝나는 대로 통합으로 흐른다. 벽시계 ≈ `max(A,B,C,D) + I1 + V1`.
> B·C는 D의 라벨헬퍼 *시그니처*(S0 스텁)에만 의존하므로 D 구현 완료 전에도 타입상 컴파일됨 — 병렬 유지.

---

## 4. S0 — 스캐폴드 & 계약 (단독, 가장 중요)

이 단계가 부실하면 병렬이 깨진다. S0에서 **반드시 다음을 파일로 확정**한다.

**4.0 계획 파일 보존(실행 첫 단계)**
- 이 상세 계획을 프로젝트 디렉터리에 복사 저장: `/Users/dyk/Desktop/project/animal-crossing/acnh-villager-picker-plan-detailed.md` (원본 `acnh-villager-picker-plan.md`와 나란히 두어 프로젝트와 함께 버전관리).

**4.1 프로젝트 부트스트랩**
- `npm create vite@latest . -- --template react-ts` (현재 디렉터리)
- Tailwind v3 + PostCSS, `shadcn-ui` init (`components.json`)
- shadcn 프리미티브 선설치: `button input badge toggle toggle-group card select tooltip separator`
- 의존성 **선설치(병렬쓰기 제거 목적)**: `recharts`, `clsx` + `tailwind-merge`(cn)
- `vite.config.ts`에 GitHub Pages용 `base: './'` (상대경로 — 리포명 무관, Pages/로컬 양쪽 안전)

**4.1b 데이터 재생성(다국어)** — 동봉 `villagers.json`은 한/영만 보유 → **빌드 스크립트 재실행 필요**
- `scripts/build-data.mjs`(스펙 §3 골격) 수정: 추출 시 `names: { ko: name-KRko, en: name-USen, ja: name-JPja }` 맵 생성, `personality`는 **한글 라벨 대신 영문 안정키**(`v.personality` 원본: Jock/Lazy/…/Uchi) 저장, 이미지 계산은 그대로 `name-USen` 사용.
- `node scripts/build-data.mjs` → `src/data/villagers.json` 재생성(391명, ja 결측 시 en 폴백 — 검증 필요).
- 완료기준: 391명 · 8성격키 · `names.{ko,en,ja}` 채움률 확인.

**4.2 계약 파일 — `src/data/types.ts`** (i18n 반영 개정)
```ts
export type PersonalityKey =                              // 안정 그룹키(영문)
  | "Jock" | "Lazy" | "Cranky" | "Smug"
  | "Peppy" | "Normal" | "Snooty" | "Uchi";
export type Locale = "ko" | "en" | "ja";

export interface Villager {
  id: string;
  names: Record<Locale, string>;     // 다국어 이름 (ja 결측 시 빌드때 en 폴백)
  nameEn: string;                    // 이미지/매칭용(=names.en)
  personality: PersonalityKey;
  species: string;                   // 영문 키 (라벨은 speciesLabel로 로케일 변환)
  gender: "Male" | "Female";
  image: string;
}

export const TIER_SCORE = { S: 4, A: 3, B: 2, C: 1 } as const;
export type Tier = keyof typeof TIER_SCORE;
export type Scores = Record<string, number>;          // id -> 점수(미평가 0)
export type Ratings = Record<string, Tier>;           // localStorage 영속 형태

export const TEAM_SIZE = 10;
export const PERSONALITY_KEYS: PersonalityKey[] = [
  "Jock","Lazy","Cranky","Smug","Peppy","Normal","Snooty","Uchi",
];
export type PresetId = "fav" | "species" | "personality";  // 라벨은 i18n
```

**4.3 계약 시그니처(스텁만, 구현은 트랙에서)**
- `src/lib/recommend.ts` → `recommend(pool, scores, w): { team: Villager[]; score: number; missing: PersonalityKey[] }`, `export interface Weights`, `export const PRESETS: Record<PresetId, Weights>`
- `src/hooks/useRatings.ts` → `useRatings(): { ratings: Ratings; cycle(id: string): void; scores: Scores }`
- `src/i18n/index.ts`(스텁) → `useLocale(): { locale: Locale; setLocale(l): void; t(key: string): string }`, `villagerName(v: Villager, locale: Locale): string`, `personalityLabel(k: PersonalityKey, locale: Locale): string`, `speciesLabel(species: string, locale: Locale): string`

> 스텁이 export 시그니처를 고정하므로 트랙 B/C/D는 서로의 구현 완료 전에도 타입상 컴파일된다.

---

## 5. 서브에이전트 배치(subagent deploy) — 트랙별 사양

각 트랙은 worktree에서 독립 실행. **프롬프트에 계약 파일 내용 + 소유 디렉터리 + "다른 디렉터리·App.tsx·package.json 금지"를 명시**한다. 산출은 구조화 출력(생성 파일 목록 + 요약)으로 회수.

### TRACK A — 로직코어 (P2, 스펙 §5)
소유: `src/lib/recommend.ts`, `src/lib/storage.ts`, `src/hooks/useRatings.ts`, `src/lib/recommend.test.ts`
- `recommend.ts`: 스펙 §5 골격 그대로 — `totalScore`(호감 − w·중복쌍수), `dupPairs = Σ c(c-1)/2`(종족·성격 공통), 그리디 초기화(성격별 최고 1명) → 한계이득 채움 → **2-opt 로컬서치(커버리지 8 유지)**. **성격 그룹키는 `PersonalityKey`(영문)** 사용. `PRESETS: Record<PresetId, Weights>`(fav/species/personality).
- `storage.ts`: `loadRatings(): Ratings` / `saveRatings(r)` — key `"acnh-ratings-v1"`, JSON, try/catch.
- `useRatings.ts`: storage 동기화 React 상태. `cycle(id)`: 미평가→S→A→B→C→해제. `scores` 파생(`TIER_SCORE[tier] ?? 0`).
- `recommend.test.ts`(vitest): ① 전체 풀이면 team 길이 10 & 성격 8 커버 & `missing=[]` ② **(그리디만) ≤ (그리디+로컬서치) 총점** 검증 ③ 종족다양성 프리셋이 종족 중복쌍을 줄이는지 ④ 특정 성격 찜 0개일 때 미평가 강제편입(스펙 §7-1).

### TRACK B — 평가 UI (P1, 스펙 §4)
소유: `src/components/eval/` (`VillagerGrid`, `VillagerCard`, `FilterBar`, `TierBadge`)
- `VillagerCard`: 이미지(`<img loading="lazy">` dodo.ac 핫링크), **이름=`villagerName(v,locale)`**, 종족=`speciesLabel`, 성격=`personalityLabel`, 현재 티어 배지. **클릭→`cycle(id)`**. (props로 `villager`, `tier`, `onCycle`)
- `FilterBar`: 이름(현 로케일+영문)·종족·성격 검색/필터 + **"평가한 것만 보기" 토글(최우선)** + 성격별 개수 배지(아이돌 24 등 얕은 풀 노출). 모든 라벨 `t(key)`.
- `VillagerGrid`: 391 카드 반응형 그리드. 필터/검색/평가만보기 적용. 가상화 불필요(391개·lazy img면 충분).
- `TierBadge`: 티어→색 매핑 배지.
- **계약 시그니처만 의존**(useRatings·useLocale·라벨헬퍼 import, 구현 비의존). 데이터는 `src/data/villagers.json` import.

### TRACK C — 시각화 (P3, 스펙 §6)
소유: `src/components/viz/` (`PersonalityRadar`, `RecommendPanel`, `PresetToggle`)
- `PersonalityRadar`: recharts `RadarChart` 8축(성격별 인원수). props `team: Villager[]`.
- `PresetToggle`: shadcn `ToggleGroup`로 3프리셋 스위칭 → 상위 `onPreset(name)`.
- `RecommendPanel`: props `team`, `score`, `missing`, `preset`, `onPreset`. 추천 10명 카드 + 점수 + `missing`/찜0개 성격 배지(스펙 §7-1·§7-2) + 레이더 + 토글 배치. **`recommend()` 호출은 App에서, panel은 표시 전담**(트랙 A 미완성과 디커플). 라벨 i18n.
- 레이더 8축 라벨·프리셋 토글 라벨은 `personalityLabel`/`t`로 로케일화.

### TRACK D — i18n 코어 (국가별 언어 맞춤)
소유: `src/i18n/` (`index.ts`, `LocaleProvider.tsx`, `messages.ts`, `labels.ts`, `LanguageSwitcher.tsx`)
- `LocaleProvider` + `useLocale()`: 초기 로케일 = localStorage(`acnh-locale-v1`) → 없으면 **`navigator.language` 자동감지**(ko→ko, ja→ja, 그 외→en), `setLocale` 시 영속.
- `messages.ts`: UI 문자열 ko/en/ja 테이블(`t(key)`) — 검색 placeholder, "평가한 것만 보기", 티어/프리셋/빈상태 등.
- `labels.ts`: `personalityLabel`(8키×3로케일, ko는 스펙의 운동광/먹보/…/아이돌), `speciesLabel`(35종×3로케일; **결측 시 영문 폴백**, MVP 허용), 프리셋 라벨.
- `villagerName(v, locale)`: `v.names[locale] ?? v.names.en`.
- `LanguageSwitcher.tsx`: shadcn `Select`로 한/영/일 전환(툴바 배치).

> 모든 트랙: "shadcn `ui/*`와 `data/types.ts`·`lib/utils`는 읽기 전용, 수정 금지" 명시.

---

## 6. I1 — 통합 (단독, 배리어)

`main.tsx`에서 `<LocaleProvider>`로 앱 래핑. `App.tsx`에서 배선:
```
const { ratings, cycle, scores } = useRatings();
const { locale } = useLocale();
const [preset, setPreset] = useState<PresetId>("fav");
const result = useMemo(() => recommend(VILLAGERS, scores, PRESETS[preset]), [scores, preset]);
// 툴바: LanguageSwitcher · FilterBar
// 레이아웃: 좌(또는 상) VillagerGrid  |  우(또는 하) RecommendPanel(result, preset)
```
- 네 트랙 worktree 산출 파일을 메인 트리로 병합(서로소라 충돌 0).
- `main.tsx`·`index.css`(Tailwind 지시문) 정리, 반응형 레이아웃, 빈상태/로딩 처리.

## 7. V1 — 검증 (end-to-end)

```bash
npx tsc --noEmit            # 타입 0 에러 (계약 일치 증명)
npm test                    # vitest: recommend 4개 테스트 통과
npm run dev                 # 스모크 (아래 체크)
npm run build               # Pages base './' 빌드 성공
```
**dev 스모크 체크리스트**
- [ ] 391 카드 렌더 + 이미지 표시(dodo.ac 핫링크 200)
- [ ] 검색(한/영)·종족·성격 필터 동작
- [ ] **"평가한 것만 보기"** 토글 동작
- [ ] 카드 클릭 → S→A→B→C→해제 사이클
- [ ] 새로고침 후 평가 유지(localStorage)
- [ ] 추천 10명 산출 · 성격 8 커버 · 점수 표시
- [ ] 레이더 8축 렌더 · 프리셋 토글 시 team 재계산
- [ ] 찜 0개 성격 → "찜한 {성격} 없음" 배지(스펙 §7-1)
- [ ] **언어**: 최초 진입 시 `navigator.language` 자동감지 적용 · 스위처로 한/영/일 전환 시 이름·성격·UI 문자열 즉시 반영 · 새로고침 후 선택 유지(localStorage)

---

## 8. Workflow 스크립트 스켈레톤 (실행 시)

```js
export const meta = {
  name: 'acnh-villager-picker-build',
  description: 'ACNH 드림 주민 조합기 P1+P2+P3 MVP 병렬 빌드',
  phases: [
    { title: 'Scaffold' }, { title: 'Tracks' },
    { title: 'Integrate' }, { title: 'Verify' },
  ],
};

phase('Scaffold');                       // 단독 — 계약 확정. 서브에이전트가 아니라
// (메인 루프에서 직접 부트스트랩하거나 단일 agent로 처리; 계약 파일 커밋 후 팬아웃)
await agent(SCAFFOLD_PROMPT, { label: 'scaffold' });

phase('Tracks');                         // ‖ 배리어: 네 트랙 동시
const tracks = await parallel([
  () => agent(TRACK_A_PROMPT, { label: 'logic',  phase: 'Tracks', isolation: 'worktree', schema: FILES }),
  () => agent(TRACK_B_PROMPT, { label: 'evalUI', phase: 'Tracks', isolation: 'worktree', schema: FILES }),
  () => agent(TRACK_C_PROMPT, { label: 'viz',    phase: 'Tracks', isolation: 'worktree', schema: FILES }),
  () => agent(TRACK_D_PROMPT, { label: 'i18n',   phase: 'Tracks', isolation: 'worktree', schema: FILES }),
]);

phase('Integrate');                      // 단독 — App.tsx 배선 + 병합
await agent(integratePrompt(tracks.filter(Boolean)), { label: 'integrate' });

phase('Verify');                         // 단독 — typecheck/test/build
const v = await agent(VERIFY_PROMPT, { label: 'verify', schema: VERDICT });
return v;
```
> 트랙은 서로소 디렉터리라 배리어(`parallel`)가 정당 — 통합이 세 산출을 **모두** 필요로 함. worktree는 병렬 파일쓰기 격리용.

---

## 8.5 P4 — GitHub Pages 배포 (포함)

V1(빌드 통과) 이후 단독 단계로 추가.
- `vite.config.ts` `base: './'`(이미 S0에서 설정) → 리포명 무관·상대경로라 Pages/로컬 양쪽 안전.
- **GitHub Actions** `.github/workflows/deploy.yml`: `push: main` → `npm ci && npm run build` → `actions/upload-pages-artifact`(`./dist`) → `actions/deploy-pages`. 권한 `pages: write`, `id-token: write`, `concurrency: pages`.
- 리포 설정: Settings → Pages → Source = **GitHub Actions**.
- (대안) 액션 없이 `gh-pages` 패키지 + `npm run deploy`로 `dist`를 `gh-pages` 브랜치에 푸시. Actions 방식 권장.
- **선행 조건**: 공개 배포 전 이미지 핫링크→셀프호스팅 권장(§9). MVP 검증/내부 공유면 핫링크로 우선 배포 가능.

---

## 8.6 P5 — Google AdSense 수익화 (포함, 단 선행 게이트 있음)

코드 통합 자체는 작지만, **승인·정책 게이트가 실제 병목**이다. 순서를 지켜야 한다.

**선행 게이트(코드보다 먼저 해결해야 함)**
1. **도메인**: AdSense는 본인 소유 사이트를 요구. `*.github.io` 서브도메인은 승인 거절 사례 多 → **커스텀 도메인 권장**(GitHub Pages에 커스텀 도메인 연결 + `CNAME`).
2. **지식재산권 리스크(중요)**: 주민 이미지/이름은 **닌텐도 IP**다. 타사 CDN(dodo.ac) **핫링크 + 수익화** 조합은 위험이 큼 → 수익화 전 **이미지 셀프호스팅 + "비공식 팬사이트, Nintendo 비제휴" 디스클레이머** 필수. (AdSense 정책·저작권 양쪽)
3. **콘텐츠/정책**: 개인정보처리방침 페이지, 충분한 오리지널 콘텐츠 요건 충족.

**동의(CMP) — i18n로 글로벌 트래픽 가능하므로 필수**
- EEA/UK 사용자에게 **Google 인증 CMP**(예: Funding Choices/Google CMP)로 광고 동의 수집 의무. 한/영/일 중 EU 트래픽 유입 가능성 고려.

**코드 통합(게이트 통과 후, 별도 트랙)** — 소유 `src/ads/`
- `index.html`에 AdSense 로더 `<script async ...adsbygoogle.js?client=ca-pub-XXXX>`.
- `AdSlot.tsx`: `<ins class="adsbygoogle">` 래퍼 + `useEffect`에서 `(adsbygoogle=window.adsbygoogle||[]).push({})`. **고정 높이로 CLS 방지**, lazy 로드.
- 배치: 그리드 상/하단 또는 추천 패널 옆 1~2 슬롯(UX 해치지 않게, "콘텐츠처럼 보이는 광고" 금지 — 정책 위반).
- env로 `VITE_ADSENSE_CLIENT` 주입(미설정 시 슬롯 비표시 → 로컬/미승인 환경 안전).

> **권고 순서**: P1~P3 MVP → P4 배포(+커스텀 도메인) → **이미지 셀프호스팅** → 개인정보처리방침/디스클레이머 → AdSense 신청 → 승인 후 `AdSlot` 활성. 즉 수익화는 가장 마지막, 그리고 **셀프호스팅이 사실상 필수 선행**이다.

---

## 9. 리스크 / 결정 메모

- **종족 패널티 유지**(스펙 §5): 그리디로 못 푸는 커플링 → 2-opt 필수. 포기하면 그리디로 충분하지만 v2가 다양성을 핵심기능으로 확정 → 유지.
- **아이돌 풀 24명**(스펙 §7-4): 종족다양성 프리셋에서 종족 중복 강제될 수 있음 — 버그 아님, RecommendPanel 설명 배지로 노출.
- **이미지 핫링크**: 타 CDN 의존 — MVP 허용, **공개 배포 전 셀프호스팅(P4)** 필요. `<img>` 렌더는 CORS 무관(스펙 §3).
- **GitHub Pages 배포**: §8.5에서 P4 단계로 포함(GitHub Actions 방식 권장). 공개 전 이미지 셀프호스팅 권장.
- **Personality 키 리팩터**(i18n): 스펙은 `Personality`를 한글 리터럴로 정의했으나, 다국어 위해 **영문 안정키 + 라벨테이블**로 변경. 추천 알고리즘은 그룹키로만 쓰므로 로직 무영향, 단 `villagers.json` 재생성 필요(§4.1b).
- **species 라벨**(35종×3로케일): MVP는 영문 폴백 허용, ko/ja 라벨은 점진 채움.
- **AdSense 게이트**(§8.6): 코드는 작지만 **커스텀 도메인 + 이미지 셀프호스팅 + 닌텐도 IP 디스클레이머 + EU CMP**가 선행. 수익화는 MVP 검증 이후로 분리 권장.
- Plan agent 재설계 생략: 스펙 v2가 스키마·알고리즘·엣지케이스까지 확정해 재설계 가치 낮음. 본 계획은 **조립/병렬화**에 집중.
