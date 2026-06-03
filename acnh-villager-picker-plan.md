# 모동숲 드림 주민 조합기 — 개발 계획서 (v2)

> 정적 데이터 기반 클라이언트 온리 앱. 백엔드 0, 외부 런타임 의존성 0.
> 핵심 가설: "진짜 제품은 추천 알고리즘이 아니라 ~400명을 빠르게 평가하는 워크플로우다."
>
> **v2 변경점**: P0(데이터 파이프라인) 실행·검증 완료. 실제 데이터를 받아보며 v1의 가정 4개가 틀린 걸 확인하고 바로잡음. 동봉된 `villagers.json`(391명)이 그 산출물.

---

## 0. 목표 기능 (확정)

1. 주민 391명 카드 표시 (검색/필터 필수)
2. 호감도 평가 (티어 스킴 하나로 통일)
3. 평가 기반으로 **8성격 전부 포함 + 종족 다양성**을 만족하는 최적 10명 추천
4. 선택/추천 결과의 성격 분포 시각화
5. 가중치 토글 (최애 우선 / 종족 다양성 / 성격 다양성) = **프리셋**

제약 상수: 섬 정원 `TEAM_SIZE = 10`, 성격 8종 → 10명이면 8성격 + 여유 2슬롯.

---

## 1. 우선순위 (Phase)

함정은 "쉬워 보이는" 앞쪽(데이터·알고리즘)에 있고, "어려워 보이는" UI는 라이브러리로 거의 공짜다. 그래서 데이터부터 못 박고 시작했다 — 실제로 P0에서 v1 가정이 줄줄이 깨졌다.

| Phase | 내용 | 상태 | 차단 관계 |
|---|---|---|---|
| **P0** | 빌드타임 데이터 파이프라인 → `villagers.json` 정적 번들 | ✅ **완료** | 전체 차단 해제됨 |
| **P1** | 데이터 모델 + 평가 UI (카드/검색/필터/"평가한 것만 보기") | ⬜ 다음 | P2 입력 제공 |
| **P2** | 추천 엔진 (그리디 초기화 + 로컬서치) | ⬜ | P1 데이터로 검증 |
| **P3** | 시각화(성격 레이더) + 가중치 토글 | ⬜ | — |
| **P4** | 폴리시: 티어 드래그 UX, 조합 공유 URL, 이미지 셀프호스팅 | ⬜ 선택 | — |

> P1+P2가 남은 MVP. P3는 하루, P4는 선택.

---

## 2. 기술 스택 결정

- **Vite + React + TypeScript** (Next.js ❌). SSR/서버 기능을 하나도 안 쓰고 전부 클라이언트(localStorage, 드래그, 정적 데이터)다. Next는 "조합 공유 URL"이나 공용 DB를 붙일 때만 정당화됨.
- **배포: GitHub Pages** (정적). 데이터는 이미 번들됐고, 이미지만 셀프 호스팅하면 외부 의존성 0.
- **UI: shadcn/ui + Tailwind**
- **상태: localStorage** (평가 데이터만, `villagerId → Tier` 맵). 이미지/데이터는 절대 localStorage에 넣지 말 것.

---

## 3. P0 — 데이터 파이프라인 ✅ 완료

### v1 가정 vs 실제 (실행해보고 확인)

| v1 기획서 가정 | 실제 | 대응 |
|---|---|---|
| acnhapi.com API 런타임/빌드 호출 | **API가 503으로 죽어있음** (upstream timeout) | raw GitHub JSON 직접 사용 |
| 엔드포인트가 주민 **배열** 반환 | 최상위가 **dict** (`file-name`이 키) | `Object.values()`로 순회 |
| Uchi 성격이 `Big Sister`/`Sisterly`로 표기 | 그냥 `Uchi` (24명) | 매핑 `Uchi→아이돌` |
| `image_uri` 필드로 이미지 해결 | **전부 죽은 acnhapi.com URL → 503** | Nookipedia(dodo.ac) 해시 경로 계산 |

추가 확인된 사실:
- 총 **391명**, 성격 8종 전부 존재, **스킵 0**.
- 391명 **전원 한국어 이름**(`name-KRko`) 있음 → 결측 폴백 불필요.
- 종족 35종.
- 성격 분포: 먹보 60 / 친절함 59 / 무뚝뚝·운동광·성숙함 각 55 / 단순활발 49 / 느끼함 34 / **아이돌 24**(최소). → 추천 시 아이돌 풀이 가장 얕다는 점 유의.

### 데이터 소스 (확정)
- **데이터**: `https://raw.githubusercontent.com/alexislours/ACNHAPI/master/villagers.json`
  런타임 의존이 아니라 **빌드타임 1회성**이므로 acnhapi 호스트가 죽어도 무관.
- **이미지**: Nookipedia(dodo.ac) MediaWiki 경로 `/{md5[0]}/{md5[0:2]}/{영문명}_NH.png`
  - 공백은 `_`로 치환 후 MD5. **391명 전원 200 OK 검증 완료.**
  - 응답 헤더에 `access-control-allow-origin: https://nookipedia.com` 있으나 **`<img>` 표시엔 무관** (CORS는 canvas 픽셀읽기/`fetch()`만 제약, 단순 렌더는 됨).
  - ⚠️ **공개 배포 시엔 핫링크 말고 셀프 호스팅 권장** (타인 CDN이라 깨질 수 있고 예의 문제). 빌드 스크립트에 다운로드 골격 주석으로 포함.

### 산출물 데이터 스키마 (확정)
```ts
type Personality =
  | "운동광" | "먹보" | "무뚝뚝" | "느끼함"
  | "단순활발" | "친절함" | "성숙함" | "아이돌";

interface Villager {
  id: string;          // "ant00"  (안정적 고유키)
  name: string;        // "사지마"  (한국어)
  nameEn: string;      // "Cyrano"  (이미지/매칭용)
  personality: Personality;
  species: string;     // "Anteater" (영문 — 한글 매핑 필요시 별도 테이블)
  gender: "Male" | "Female";
  image: string;       // dodo.ac URL (빌드타임 사전계산)
}
```

### 빌드 스크립트 (`scripts/build-data.mjs`) — 검증 완료본
```js
// 실행: node scripts/build-data.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const SRC = "https://raw.githubusercontent.com/alexislours/ACNHAPI/master/villagers.json";

const PERSONALITY_KO = {
  Jock: "운동광", Lazy: "먹보", Cranky: "무뚝뚝", Smug: "느끼함",
  Peppy: "단순활발", Normal: "친절함", Snooty: "성숙함", Uchi: "아이돌",
};

function dodoImage(nameEn) {
  const fn = nameEn.replace(/ /g, "_") + "_NH.png";
  const h = createHash("md5").update(fn).digest("hex");
  return `https://dodo.ac/np/images/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(fn)}`;
}

async function main() {
  const res = await fetch(SRC);
  if (!res.ok) throw new Error(`fetch 실패: ${res.status}`);
  const raw = await res.json(); // dict: { "ant00": {...}, ... }

  const out = [];
  for (const v of Object.values(raw)) {
    const personality = PERSONALITY_KO[v.personality];
    if (!personality) continue; // 8성격 외 제외 (실제로 0건)
    out.push({
      id: v["file-name"],
      name: v.name["name-KRko"],
      nameEn: v.name["name-USen"],
      personality,
      species: v.species,
      gender: v.gender,
      image: dodoImage(v.name["name-USen"]),
    });
  }

  if (new Set(out.map((o) => o.personality)).size !== 8)
    console.warn("성격 8종 미충족 — 매핑 누락 의심");
  console.log(`주민 ${out.length}명 생성`);

  mkdirSync("src/data", { recursive: true });
  writeFileSync("src/data/villagers.json", JSON.stringify(out, null, 2), "utf-8");
}
main();
```

> 동봉된 `villagers.json`은 이 스크립트의 산출물(391명, 84KB). 데이터가 안 변하면 스크립트 재실행 불필요 — 그대로 `src/data/`에 두고 import 하면 됨.

**P0 완료 기준**: ✅ 391명, ✅ 성격 8종, ✅ 한글 이름, ✅ 이미지 391/391 OK.

---

## 4. P1 — 데이터 모델 + 평가 UX ⬜

### 평가 스킴 (단일화)
체크박스(0/1)와 티어를 동시에 두지 말 것. 정보량 많은 **티어 → 점수**로 통일:
```ts
const TIER_SCORE = { S: 4, A: 3, B: 2, C: 1 } as const; // 미평가 = 0
type Tier = keyof typeof TIER_SCORE;
// localStorage: { [villagerId]: Tier }
```

### UX 우선순위 (사용성을 좌우하는 핵심)
드래그 폴리시보다 **탐색**이 먼저다 (대부분 30~50명만 신경 씀).
- 이름(한/영)/종족/성격 **검색·필터**
- **"평가한 것만 보기"** 토글 ← 제일 중요
- 카드 클릭 → 티어 사이클(S→A→B→C→해제)
- 티어 드래그보드는 P4로 미룸
- 아이돌(24명) 등 풀 얕은 성격은 필터에서 개수 배지로 노출하면 평가 동선이 좋아짐

---

## 5. P2 — 추천 알고리즘 ⬜

### 왜 단순 그리디는 틀리나
"성격별 1명씩 + 남은 2칸 점수순"은 **패널티가 없을 때만** 최적이다(분리 가능). 종족 중복 패널티를 넣으면 선택끼리 커플링되어 그리디가 깨진다:
- 최고 운동광(호감 10, 고양이) + 최고 단순활발(호감 10, 고양이) → 종족 중복
- 차순위 단순활발(호감 9, 강아지)로 바꾸면 λ>1일 때 총점이 더 높음
- 성격별 독립 그리디는 이걸 못 봄

→ **그리디 초기화 + 2-opt 로컬서치**. 391×10이라 한 패스 ~3900회 평가, 몇 패스 돌려도 1ms 미만. 거의 항상 전역 최적. (증명적 최적이 필요하면 `glpk.js` 작은 ILP 가능하나 오버킬.)

> 결정 포인트: 종족 다양성을 포기하면 문제가 다시 분리 가능 → 그리디로 충분. 종족 패널티가 정말 필요한지부터 정하고 복잡도를 맞출 것.

### 점수 함수
- 호감도: Σ tier
- 중복 패널티는 **충돌 쌍 수** `dup = Σ c·(c-1)/2` 로 통일(종족·성격 공통).
  - 주의: 8성격 10명이면 `Σmax(0,c-1)`로는 "여유 2칸이 서로 다른 성격"과 "한 성격 3마리"를 구분 못 함(둘 다 2). 쌍 수는 전자=2 / 후자=3 → 분산을 올바르게 선호.
- 토글 = 가중치 프리셋:
```ts
type Weights = { fav: number; species: number; personality: number };
const PRESETS: Record<string, Weights> = {
  최애우선:   { fav: 1.0, species: 0.2, personality: 0.2 },
  종족다양성: { fav: 0.6, species: 1.5, personality: 0.3 },
  성격다양성: { fav: 0.6, species: 0.3, personality: 1.5 },
};
```

### 구현 골격 (`src/lib/recommend.ts`)
```ts
import type { Villager, Personality } from "../data/types";

const TEAM_SIZE = 10;
const PERSONALITIES: Personality[] = [
  "운동광","먹보","무뚝뚝","느끼함","단순활발","친절함","성숙함","아이돌",
];

export interface Weights { fav: number; species: number; personality: number }
export type Scores = Record<string, number>; // villagerId -> tier 점수(미평가 0)

const dupPairs = (counts: Map<string, number>) =>
  [...counts.values()].reduce((s, c) => s + (c * (c - 1)) / 2, 0);

function groupCounts(set: Villager[], key: (v: Villager) => string) {
  const m = new Map<string, number>();
  for (const v of set) m.set(key(v), (m.get(key(v)) ?? 0) + 1);
  return m;
}

export function totalScore(set: Villager[], scores: Scores, w: Weights): number {
  const fav = set.reduce((s, v) => s + (scores[v.id] ?? 0), 0);
  const speciesPen = dupPairs(groupCounts(set, (v) => v.species));
  const personalityPen = dupPairs(groupCounts(set, (v) => v.personality));
  return w.fav * fav - w.species * speciesPen - w.personality * personalityPen;
}

const coverageOK = (set: Villager[]) =>
  new Set(set.map((v) => v.personality)).size === 8;

export function recommend(
  pool: Villager[], scores: Scores, w: Weights
): { team: Villager[]; score: number; missing: Personality[] } {
  // 1) 그리디 초기화: 성격별 최고 호감도 1명씩
  const byP = new Map<Personality, Villager[]>();
  for (const p of PERSONALITIES) byP.set(p, []);
  for (const v of pool) byP.get(v.personality)?.push(v);

  const selected: Villager[] = [];
  const missing: Personality[] = [];
  for (const p of PERSONALITIES) {
    const cands = (byP.get(p) ?? []).slice()
      .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
    if (cands.length === 0) { missing.push(p); continue; }
    selected.push(cands[0]); // 미평가뿐이어도 커버리지 위해 선택
  }

  // 2) 남은 슬롯: 한계 이득 최대로
  const ids = new Set(selected.map((v) => v.id));
  while (selected.length < TEAM_SIZE) {
    let best: Villager | null = null, bestGain = -Infinity;
    const cur = totalScore(selected, scores, w);
    for (const v of pool) {
      if (ids.has(v.id)) continue;
      const gain = totalScore([...selected, v], scores, w) - cur;
      if (gain > bestGain) { bestGain = gain; best = v; }
    }
    if (!best) break;
    selected.push(best); ids.add(best.id);
  }

  // 3) 2-opt 로컬서치: 커버리지 유지하며 총점 개선
  let improved = true, guard = 0;
  while (improved && guard++ < 50) {
    improved = false;
    const cur = totalScore(selected, scores, w);
    outer: for (let i = 0; i < selected.length; i++) {
      for (const c of pool) {
        if (ids.has(c.id)) continue;
        const next = selected.slice(); next[i] = c;
        if (!coverageOK(next)) continue;
        if (totalScore(next, scores, w) > cur + 1e-9) {
          ids.delete(selected[i].id); ids.add(c.id);
          selected[i] = c; improved = true; break outer;
        }
      }
    }
  }

  return { team: selected, score: totalScore(selected, scores, w), missing };
}
```

---

## 6. P3 — 시각화 & 토글 ⬜
- 성격 분포는 **레이더 차트**(8축, recharts `RadarChart`)로 밸런스를 한눈에.
- 토글 3개 = `PRESETS` 스위칭 → `recommend()` 재실행. 추후 슬라이더 미세조정으로 확장.

---

## 7. 엣지케이스 / 제약 정책

1. **특정 성격에 찜 0개**: 커버리지 위해 미평가 주민이 강제 편입됨 → UI에 "찜한 {성격} 없음" 배지.
   - 실데이터상 결측 이름은 없으므로 이 경우는 "사용자가 평가를 안 한" 상황으로만 발생.
2. **`missing` 비어있어야 정상**: 391명에 8성격 다 있으니 `missing`은 데이터 손상 시에만 채워짐 → 경고용.
3. **커버리지 vs 최애 충돌**: 현재 정책은 *커버리지 우선*(8성격 하드 제약). 최애 우선으로 바꾸려면 커버리지를 소프트 패널티로 내릴지 토글 노출.
4. **아이돌 풀 얕음(24명)**: 종족 다양성 프리셋에서 아이돌 후보가 적어 종족 중복이 강제될 수 있음 → 패널티만으로 못 피하는 케이스라 결과 설명 시 감안.
5. **특수/콜라보 주민**: 8성격 외라 빌드 시 제외됨(실제 0건이지만 향후 데이터 갱신 대비 로직 유지).

---

## 8. 마일스톤 체크리스트

- [x] **P0**: `villagers.json` 생성(391명) — 성격 8종·한글이름·이미지 391/391 검증 완료
- [ ] P1: 카드 그리드 + 검색/필터 + "평가한 것만 보기" + 티어 평가 + localStorage 영속
- [ ] P2: `recommend()` 구현 + (그리디만) vs (+로컬서치) 총점 비교 검증
- [ ] P2: 엣지케이스(찜 0개 성격) 폴백/배지
- [ ] P3: 성격 레이더 + 토글 프리셋 연동
- [ ] P4(선택): 티어 드래그보드, 조합 공유 URL, 이미지 셀프호스팅

---

## 부록 — 동봉 파일
- `villagers.json` : P0 산출물. `src/data/villagers.json`에 두고 그대로 import.
  - 형태: `Villager[]` (위 §3 스키마), 391개, UTF-8.
  - 정렬: 성격→한글이름 순. UI에서 재정렬 자유.
