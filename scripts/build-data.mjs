// 빌드타임 1회성 데이터 파이프라인. 실행: node scripts/build-data.mjs
// 산출: src/data/villagers.json  (Villager[] — src/data/types.ts 스키마)
//
// v3 변경점: 다국어(한/영/일) 이름 맵 + 성격을 영문 안정키로 저장.
//   - personality: 한글 라벨이 아니라 원본 영문키(Jock/Lazy/.../Uchi) → i18n 라벨테이블에서 변환
//   - names: { ko, en, ja }  (ja 결측 시 en 폴백)
import { writeFileSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'

const execFileP = promisify(execFile)

// 원본 PNG는 ~800KB(최대 3.6MB) 풀해상도. UI는 작은 썸네일이라 과함.
// 카드 표시용 최대 변 256px로 리샘플(macOS sips). 391장 ~318MB → ~23MB.
const THUMB_MAX_PX = 256

const SRC = 'https://raw.githubusercontent.com/alexislours/ACNHAPI/master/villagers.json'

// 8성격 영문 안정키 (그 외 = 특수/콜라보 → 제외)
const PERSONALITY_KEYS = new Set(['Jock', 'Lazy', 'Cranky', 'Smug', 'Peppy', 'Normal', 'Snooty', 'Uchi'])

function imageFile(nameEn) {
  return nameEn.replace(/ /g, '_') + '_NH.png'
}

function dodoImage(nameEn) {
  const fn = imageFile(nameEn)
  const h = createHash('md5').update(fn).digest('hex')
  return `https://dodo.ac/np/images/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(fn)}`
}

// 셀프호스팅 이미지 다운로드: dodo.ac → public/villagers/<EnName>_NH.png
// 동시성 제한 + 실패 시 1회 재시도. 반환: 실패한 nameEn 목록
async function downloadImages(villagers, { concurrency = 12 } = {}) {
  mkdirSync('public/villagers', { recursive: true })
  const failed = []
  const fetchOne = async (en) => {
    const url = dodoImage(en)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const r = await fetch(url)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const dest = `public/villagers/${imageFile(en)}`
        await writeFile(dest, Buffer.from(await r.arrayBuffer()))
        await execFileP('sips', ['-Z', String(THUMB_MAX_PX), dest]) // 썸네일 리샘플(macOS)
        return
      } catch (e) {
        if (attempt === 1) failed.push(en)
      }
    }
  }
  for (let i = 0; i < villagers.length; i += concurrency) {
    await Promise.all(villagers.slice(i, i + concurrency).map((o) => fetchOne(o.nameEn)))
    process.stdout.write(`\r이미지 다운로드 ${Math.min(i + concurrency, villagers.length)}/${villagers.length}`)
  }
  process.stdout.write('\n')
  return failed
}

async function main() {
  const res = await fetch(SRC)
  if (!res.ok) throw new Error(`fetch 실패: ${res.status}`)
  const raw = await res.json() // dict: { "ant00": {...}, ... }

  const out = []
  let jaMissing = 0
  for (const v of Object.values(raw)) {
    if (!PERSONALITY_KEYS.has(v.personality)) continue // 8성격 외 제외(실제 0건)
    const en = v.name['name-USen']
    const ko = v.name['name-KRko'] ?? en
    const ja = v.name['name-JPja'] ?? en
    if (!v.name['name-JPja']) jaMissing++
    out.push({
      id: v['file-name'],
      names: { ko, en, ja },
      nameEn: en,
      personality: v.personality,
      species: v.species,
      gender: v.gender,
      // 셀프호스팅 상대경로 (vite base:'./' 하에서 정상 해석). 원본은 dodoImage(en).
      image: `villagers/${imageFile(en)}`,
    })
  }

  // 정렬: 성격키 → 한글이름
  const order = ['Jock', 'Lazy', 'Cranky', 'Smug', 'Peppy', 'Normal', 'Snooty', 'Uchi']
  out.sort((a, b) => {
    const p = order.indexOf(a.personality) - order.indexOf(b.personality)
    return p !== 0 ? p : a.names.ko.localeCompare(b.names.ko, 'ko')
  })

  const personalities = new Set(out.map((o) => o.personality))
  if (personalities.size !== 8) console.warn('⚠ 성격 8종 미충족 — 매핑 누락 의심')
  console.log(`주민 ${out.length}명 생성 · 성격 ${personalities.size}종 · ja 결측(en 폴백) ${jaMissing}명`)

  mkdirSync('src/data', { recursive: true })
  writeFileSync('src/data/villagers.json', JSON.stringify(out, null, 2), 'utf-8')

  // --- (T3) 이미지 셀프호스팅 — dodo.ac 391장 → public/villagers/, 핫링크 제거 ---
  const failed = await downloadImages(out)
  if (failed.length) {
    console.warn(`⚠ 이미지 ${failed.length}장 실패: ${failed.join(', ')}`)
  } else {
    console.log(`이미지 ${out.length}장 셀프호스팅 완료 → public/villagers/`)
  }
}

main()
