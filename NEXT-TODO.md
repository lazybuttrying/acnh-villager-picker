# NEXT TODO — 모동숲 드림 주민 조합기

> 현재 상태: P1~P3 MVP + 다국어(한/영/일) + 세션2~3 UX 전부 완료·검증.
> 검증: `npm run type-check` 통과 · `npm test` **9/9** · `npm run build` 성공.
> 상태 키(localStorage): `acnh-ratings-v1` · `acnh-blacklist-v1` · `acnh-residents-v1` · `acnh-locale-v1`

---

## ✅ 완료 (세션2~3)

- [x] 스티키 평가현황 헤더 + 팝오버 (`eval/SelectionSummary.tsx`, `ui/popover.tsx`)
- [x] 종족 다중선택 (`FilterBar` 팝오버 체크리스트, `VillagerFilter.species: string[]`)
- [x] 추천 구역 '내 선택 풀' (`viz/SelectionPool.tsx`, `useRatings.remove`)
- [x] 블랙리스트(제외) — 카드 🚫, 추천 풀 제외 (`hooks/useBlacklist.ts`, `viz/BlacklistTracker.tsx`)
- [x] 모바일 추천 하단 드로어 (`ui/sheet.tsx` + 하단 고정 버튼)
- [x] 선택 초기화 (평가+거주+제외 일괄, confirm 가드, 각 스토어 `clear()`)
- [x] 항목별 S/A/B/C 티어 버튼(사이클 폐지, `useRatings.setTier`)
- [x] 팀 인원 조절 3~10 (`recommend(...,teamSize)`, 8 미만이면 커버리지 제약 자동 완화)
- [x] 현재 거주 중(이미 보유) — 카드 🏠, 추천 풀 제외, 평가/제외/거주 3-way 상호배타

---

## ☐ T1. 최종 주민풀 보고서 내보내기 ⭐ (다음 작업, 난이도 낮음)
모든 상태가 이미 있어 새 데이터 모델 불필요. `useRatings`/`useResidents`/`useBlacklist` + `recommend()` 결과만 모으면 됨.

- [ ] **A안(권장): 텍스트/마크다운/JSON 다운로드** — 외부 의존성 0, CORS 무관
  - [ ] `src/lib/exportReport.ts` 순수함수 `buildReport({ratings, residents, blacklist, result, preset, teamSize, locale}) → string`
  - [ ] 내용: 추천 N명(이름·성격·종족·점수) · 티어별 선택 풀(S/A/B/C) · 거주 중 · 제외 · 성격 커버리지 k/8 · 프리셋/인원
  - [ ] 다운로드: `Blob` + `URL.createObjectURL` (.md / .json), 파일명에 locale·날짜
  - [ ] 저장 버튼: `RecommendPanel` 헤더 or 헤더 툴바, i18n 키 `report.*`
  - [ ] 검증: 저장 클릭→파일 생성, 추천/풀/거주/제외 반영, 로케일 라벨 반영
- [ ] **B안(확장): PNG 카드 캡처** — `html2canvas`. ⚠️ dodo.ac 핫링크는 CORS로 canvas 오염 → **이미지 포함 PNG는 T3(셀프호스팅) 선행 필요**. 텍스트/도형만이면 가능

## ☐ T2. 영속/품질 폴리시 (낮음)
- [ ] `preset`·`teamSize` localStorage 영속(`acnh-prefs-v1`) — 새로고침 유지
- [ ] recharts `React.lazy` 코드분할 → 번들 경고 해소·초기 로드↓
- [ ] 스토어 단위 테스트(toggle·상호배타·clear)
- [ ] (선택) 블랙리스트/거주 목록을 헤더 팝오버에 통합

## ☐ T3. 이미지 셀프호스팅 (중간) — 공개배포/PNG/수익화 공통 선행
- [ ] `scripts/build-data.mjs` 주석 골격 활성화: 391장 → `public/villagers/<EnName>_NH.png`, `image` 상대경로 치환
- [ ] 효과: 타 CDN 의존 제거 · CORS 해제(PNG 가능) · IP 리스크 완화

## ☐ T4. P4 배포 — GitHub Pages (중간)
- [ ] `.github/workflows/deploy.yml` (upload-pages-artifact / deploy-pages), `base:'./'` 이미 적용
- [ ] 리포 Settings → Pages → Source = GitHub Actions
- [ ] 공개 전 T3 + 비공식 팬사이트 디스클레이머(현재 푸터에 임시 표기됨)

## ☐ T5. P5 AdSense 수익화 (게이트 큼)
- [ ] 선행: 커스텀 도메인 + T3 셀프호스팅 + 닌텐도 IP 디스클레이머 + 개인정보처리방침 + EU CMP
- [ ] `src/ads/AdSlot.tsx` + `VITE_ADSENSE_CLIENT`, 승인 후 슬롯 활성
- [ ] MVP 검증 이후로 분리

---

> 권장 순서: **T1 → T2 → T3 → T4 → T5**. T1은 의존성/게이트 없이 즉시 착수 가능.
