import type { Locale } from '@/data/types'

// UI 문자열 테이블. t(key)로 조회한다. 보간 없음 — 단순 라벨로 유지.
export const messages: Record<Locale, Record<string, string>> = {
  ko: {
    'app.title': '동물의 숲 주민 추천기',
    'search.placeholder': '주민 검색…',
    'filter.ratedOnly': '평가한 주민만',
    'filter.residentOnly': '거주중',
    'filter.allSpecies': '모든 종족',
    'filter.allPersonalities': '모든 성격',
    'filter.species': '종족',
    'filter.clear': '초기화',
    'recommend.title': '추천',
    'recommend.score': '점수',
    'recommend.pool': '내 선택 풀',
    'recommend.blacklist': '제외 목록',
    'recommend.residents': '현재 거주 중',
    'recommend.teamSize': '팀 인원',
    'recommend.includeResidents': '거주 중 포함',
    'card.blacklist': '추천에서 제외',
    'card.resident': '현재 거주 중으로 표시',
    'recommend.noFav': '찜 없음',
    'recommend.noFavTitle': '찜한 주민이 없는 성격',
    'recommend.noFavHint': '추천 시 이 성격은 미평가 주민으로 채워져요.',
    'recommend.scoreTableTitle': '프리셋별 점수',
    'recommend.coverageShort': '커버',
    'recommend.missing': '데이터 없음',
    'preset.fav': '찜',
    'preset.species': '종족',
    'preset.personality': '성격',
    'tier.unrated': '미평가',
    'lang.label': '언어',
    'selection.title': '평가 현황',
    'selection.rated': '평가함',
    'selection.coverage': '성격 커버리지',
    'selection.byTier': '티어별',
    'selection.byPersonality': '성격별',
    'selection.empty': '아직 평가한 주민이 없어요',
    'selection.reset': '선택 초기화',
    'selection.resetConfirm': '평가와 제외 목록을 모두 초기화할까요?',
    'ptable.title': '성격별 배치표',
    'ptable.sPool': 'S풀',
    'ptable.residents': '거주 중',
    'ptable.empty': '없음',
    'report.export': '내보내기',
    'report.markdown': '마크다운 (.md)',
    'report.json': 'JSON (.json)',
    'report.title': '드림 주민 보고서',
    'report.generatedAt': '생성일',
    'report.preset': '프리셋',
    'report.teamSize': '팀 인원',
    'report.score': '총점',
    'report.coverage': '성격 커버리지',
    'report.recommended': '추천 팀',
    'report.pool': '선택 풀 (티어별)',
    'report.residents': '현재 거주 중',
    'report.excluded': '제외 목록',
    'report.none': '없음',
    'share.button': '공유하기',
    'share.copyLink': '링크 복사',
    'share.copied': '링크를 복사했어요',
    'share.xPost': 'X에 공유',
    'share.saveImage': '이미지로 저장',
    'share.teamTitle': '드림팀 공유',
    'share.viewHint': '친구가 공유한 드림 주민 팀이에요',
    'share.invalid': '공유 링크가 올바르지 않아요',
    'share.ctaTitle': '너의 드림팀도 만들어봐',
    'share.ctaHint': '391명 중 10명 — S~C 티어 평가로 추천해줘요',
    'share.cta': '나도 만들어보기',
    'share.xText': '내 모동숲 드림팀! 🏝️',
    'share.imageTitle': '내 드림팀',
    'share.imageTagline': '391명 중 고른 내 드림 주민 10명',
    'about.hint': '사이트 소개 보기',
    'landing.back': '주민 고르러 가기',
    'landing.tagline': '내 취향으로 꾸미는 꿈의 섬 주민 10명',
    'landing.intro':
      '391명의 동물의 숲 주민을 S·A·B·C 티어로 평가하면, 성격 다양성까지 고려해 가장 잘 어울리는 드림 주민 팀을 추천해 드려요. 설치도 로그인도 필요 없이 브라우저에서 바로.',
    'landing.start': '바로 시작하기',
    'landing.about.title': '이 사이트에 대하여',
    'landing.about.body1':
      '동물의 숲 주민 추천기는 「모여봐요 동물의 숲」의 391명 주민 중에서 나만의 드림 팀을 고르는 것을 돕는 팬 메이드 웹 도구입니다. 391명 중에서 10명을 고르는 일은 생각보다 어렵습니다. 좋아하는 주민만 모으면 성격이 한쪽으로 쏠려 섬의 대화가 단조로워지기 쉽고, 일일이 조합을 따져보자니 경우의 수가 너무 많습니다. 이 사이트는 그런 고민을 덜어주기 위해 만들었습니다.',
    'landing.about.body2':
      '사용법은 간단합니다. 주민을 S부터 C까지 티어로 평가하면, 평가 점수와 성격·종족의 다양성을 함께 고려해 가장 잘 어울리는 팀을 추천해 드립니다. 로그인이나 설치가 필요 없으며, 평가 기록은 브라우저에만 저장됩니다.',
    'landing.about.body3':
      '이 사이트는 Nintendo와 무관한 비공식 팬 프로젝트이며, 동물의 숲 시리즈의 모든 권리는 Nintendo에 있습니다.',
    'landing.featuresTitle': '주요 기능',
    'landing.feat.rate.title': '주민 평가',
    'landing.feat.rate.desc':
      '391명 전체를 검색·필터하며 S/A/B/C 티어로 빠르게 평가. 평가는 브라우저에 자동 저장돼요.',
    'landing.feat.recommend.title': '스마트 추천',
    'landing.feat.recommend.desc':
      '찜한 호감도와 8가지 성격 다양성을 함께 따져 최적의 팀을 골라줍니다. 팀 인원도 3~10명으로 조절.',
    'landing.feat.manage.title': '거주·제외 관리',
    'landing.feat.manage.desc':
      '이미 같이 사는 주민은 거주중으로, 원치 않는 주민은 제외로 표시해 추천에 정확히 반영해요.',
    'landing.feat.i18n.title': '다국어 지원',
    'landing.feat.i18n.desc':
      '한국어·영어·일본어를 지원하며 주민 이름·성격·종족까지 현지 표기로 보여줍니다.',
    'landing.feat.export.title': '보고서 내보내기',
    'landing.feat.export.desc':
      '추천 결과와 선택 목록을 마크다운 또는 JSON 파일로 저장해 어디서든 다시 활용하세요.',
    'landing.howTitle': '이렇게 사용해요',
    'landing.step.1': '마음에 드는 주민을 S·A·B·C로 평가하세요.',
    'landing.step.2': '이미 사는 주민과 싫은 주민을 표시해 추천을 다듬으세요.',
    'landing.step.3': '추천된 드림 주민 팀을 확인하고 보고서로 내보내세요.',
    'landing.score.title': '점수는 어떻게 정해지나요?',
    'landing.score.intro': '복잡한 계산은 앱이 알아서 해요. 핵심만 보면:',
    'landing.score.tier.title': '티어가 곧 점수',
    'landing.score.tier.desc': 'S=4 · A=3 · B=2 · C=1점, 평가하지 않은 주민은 0점이에요.',
    'landing.score.diversity.title': '겹치면 감점, 다양하면 가점',
    'landing.score.diversity.desc':
      '같은 종족·같은 성격이 팀에 겹칠수록 점수가 깎여요. 그래서 다양하게 구성될수록 총점이 높아집니다.',
    'landing.score.preset.title': '프리셋으로 우선순위 조절',
    'landing.score.preset.desc': '‘찜·종족·성격’ 중 무엇을 더 중시할지 고르면 점수 가중치가 바뀝니다.',
    'landing.score.formula': '팀 점수 = 내 호감도 합 − 종족 겹침 − 성격 겹침',
    'landing.disclaimer':
      '비공식 팬 제작 사이트입니다. Animal Crossing 및 관련 명칭·이미지는 Nintendo의 자산이며, 본 사이트는 Nintendo와 제휴하지 않았습니다.',
    'ads.label': '광고',
    'footer.privacy': '개인정보처리방침',
    'footer.disclaimer':
      '비공식 팬 제작 · Animal Crossing 및 관련 명칭/이미지는 Nintendo의 자산입니다. (Nintendo 비제휴)',
    'privacy.title': '개인정보처리방침',
    'privacy.updated': '최종 수정일',
    'privacy.back': '돌아가기',
    'privacy.intro':
      '본 사이트(모동숲 드림 주민 조합기)는 별도의 서버나 회원가입 없이 브라우저에서 동작하는 정적 웹사이트입니다. 아래는 데이터 사용과 광고에 관한 안내입니다.',
    'privacy.localStorage.title': '브라우저 저장소(localStorage)',
    'privacy.localStorage.body':
      '주민 평가, 거주·제외 목록, 언어 설정은 오직 사용자의 브라우저(localStorage)에만 저장되며 외부 서버로 전송되지 않습니다. 브라우저 데이터를 삭제하면 함께 지워집니다.',
    'privacy.ads.title': '광고 (Google AdSense)',
    'privacy.ads.body':
      '본 사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google 및 제3자 광고 사업자는 쿠키 등을 사용해 사용자의 이전 방문 기록을 바탕으로 맞춤 광고를 제공할 수 있습니다.',
    'privacy.cookies.title': '쿠키',
    'privacy.cookies.body':
      '광고 게재 과정에서 Google이 쿠키를 사용할 수 있습니다. 사용자는 브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다.',
    'privacy.consent.title': 'EU/EEA 사용자 동의',
    'privacy.consent.body':
      '유럽 경제 지역(EEA)·영국 등에서 접속하는 경우, Google 인증 동의 관리 메시지를 통해 맞춤 광고 및 쿠키 사용에 대한 동의 여부를 선택할 수 있습니다.',
    'privacy.optout.title': '맞춤 광고 설정·해제',
    'privacy.optout.body':
      '맞춤 광고는 아래 Google 광고 설정에서 끄거나 관리할 수 있으며, 광고 관련 정책은 다음에서 확인할 수 있습니다.',
    'privacy.contact.title': '문의',
    'privacy.contact.body':
      '개인정보 관련 문의는 GitHub 저장소(github.com/lazybuttrying/acnh-villager-picker)의 이슈를 통해 연락해 주세요.',
    'footer.about': '소개',
    'footer.contact': '문의하기',
    'contact.title': '문의하기',
    'contact.intro':
      '이 사이트는 동물의 숲 팬이 개인적으로 만든 비공식 도구입니다. 버그 제보, 기능 제안, 데이터 오류, 개인정보·콘텐츠 관련 문의는 아래 채널로 연락해 주세요.',
    'contact.github.title': 'GitHub',
    'contact.github.body': '버그·제안·문의는 공개 저장소의 이슈로 남겨 주시면 가장 빠르게 확인합니다:',
    'contact.response.title': '응답 안내',
    'contact.response.body':
      '개인이 운영하는 무료 프로젝트라 답변이 늦거나 어려울 수 있는 점 양해 부탁드립니다. 가능한 한 확인하고 반영하겠습니다.',
    'footer.guide': '이용 가이드',
    'footer.faq': '자주 묻는 질문',
    'footer.methodology': '점수 산정 방식',
    'footer.changelog': '업데이트 기록',
    'changelog.title': '업데이트 기록',
    'changelog.intro': '사이트의 주요 변경 사항을 최신순으로 정리했습니다.',
    'changelog.e1.date': '2026-10-17',
    'changelog.e1.title': '콘텐츠 페이지 추가 및 도메인 통합',
    'changelog.e1.body':
      '주민 성격 가이드·자주 묻는 질문·점수 산정 방식 페이지와 사이트 소개 섹션을 추가했습니다. www 서브도메인을 대표 도메인으로 통합했습니다.',
    'changelog.e2.date': '2026-06-10',
    'changelog.e2.title': '신뢰 페이지와 검색 설정',
    'changelog.e2.body':
      '문의하기 페이지, 푸터 내비게이션, robots.txt와 사이트맵을 추가하고 AdSense 사이트 인증을 마쳤습니다.',
    'changelog.e3.date': '2026-06-04',
    'changelog.e3.title': '개인정보처리방침 공개',
    'changelog.e3.body':
      '데이터 저장 방식과 광고·쿠키 정책을 안내하는 개인정보처리방침 페이지를 공개했습니다.',
    'changelog.e4.date': '2026-06',
    'changelog.e4.title': '사이트 공개',
    'changelog.e4.body':
      '391명 주민 티어 평가와 드림 팀 추천 기능을 담은 첫 버전을 공개했습니다. 한국어·영어·일본어를 지원합니다.',
    'guide.title': '주민 성격 가이드',
    'guide.intro':
      '동물의 숲 주민 391명에게는 저마다 8가지 성격 중 하나가 정해져 있습니다. 성격은 주민의 말투와 대화 주제, 취미 생활, 섬에서의 하루를 어떻게 보내는지를 결정해요. 같은 성격의 주민만 모으면 대화가 금방 겹쳐서 지루해지고, 8가지 성격이 고루 섞이면 매일 새로운 대화를 들을 수 있습니다. 이 페이지에서는 성격별 특징과 대표 주민, 35가지 종족, 티어 평가 활용법, 균형 잡힌 팀을 짜는 요령을 정리했습니다.',
    'guide.personalities.title': '8가지 성격',
    'guide.personalities.intro':
      '391명의 주민은 아래 8가지 성격 중 하나를 가집니다. 성격 이름 옆에는 실제로 많은 사랑을 받는 대표 주민을 함께 표시했어요.',
    'guide.p.jock.body':
      '운동과 단련 이야기가 입에 붙은 열혈 스포츠맨 타입입니다. 아침 일찍 일어나 조깅을 하고, 만나는 주민마다 운동을 권하곤 해요. 대화가 밝고 활기차서 섬의 분위기 메이커가 되지만, 화제가 운동 쪽으로만 쏠리기 쉬우니 1~2명 정도가 적당합니다. 팀에 넣으면 섬 전체가 생기발랄해지는 느낌을 받을 수 있어요.',
    'guide.p.lazy.body':
      '먹는 것과 낮잠을 사랑하는 느긋한 타입입니다. 음식 이야기와 엉뚱한 상상을 즐기고, 누구와도 잘 어울리는 편이에요. 대화가 따뜻하고 유머러스해서 섬의 힐링 담당이 되곤 합니다. 다만 같은 먹보 주민이 너무 많으면 대화 패턴이 겹치기 쉬우니, 다른 성격과 섞어 두는 것이 좋아요.',
    'guide.p.cranky.body':
      '겉보기엔 퉁명스럽지만 속은 정 많은 어른 타입입니다. 처음에는 말이 짧고 쌀쌀맞게 느껴지지만, 친해질수록 다정한 면모를 보여줘요. 섬에 묵직한 존재감을 더해주고, 여유로운 대화를 들을 수 있습니다. 개성 강한 팀을 원한다면 한 명쯤 넣어 보세요.',
    'guide.p.smug.body':
      '자신감 넘치고 세련된 멋쟁이 타입입니다. 카페와 패션, 음악 이야기를 좋아하고 말투가 젠틀해요. 섬의 분위기를 한층 세련되게 만들어 주지만, 가끔은 잘난 척이 심하다는 느낌을 받을 수도 있습니다. 개성적인 외모의 주민이 많아 팀의 비주얼 담당으로 인기가 높아요.',
    'guide.p.peppy.body':
      '언제나 에너지가 넘치는 밝은 타입입니다. 유행과 아이돌, 꿈 이야기에 관심이 많고 누구에게나 먼저 말을 걸어요. 섬을 화사하게 만들어 주는 무드 메이커지만, 텐션이 너무 높아 가끔은 시끄럽게 느껴질 수도 있습니다. 활기찬 섬을 원한다면 빠질 수 없는 성격이에요.',
    'guide.p.normal.body':
      '상냥하고 배려심 깊은 타입입니다. 다른 주민의 고민을 들어주고 따뜻한 말 한마디를 건네는, 섬의 어머니 같은 존재예요. 누구와도 트러블 없이 어울리고 대화도 편안해서, 어떤 팀 조합에도 무리 없이 들어갑니다. 안정적인 섬 분위기를 원한다면 꼭 포함하세요.',
    'guide.p.snooty.body':
      '우아하고 세련된 타입입니다. 패션과 뷰티, 고급스러운 취미에 관심이 많고 말투는 다소 도도하게 느껴질 수 있어요. 하지만 친해지면 의외로 정이 많은 모습을 보여줍니다. 섬에 품격을 더해주고, 세련된 대화를 즐기고 싶다면 추천하는 성격입니다.',
    'guide.p.uchi.body':
      '털털하고 의리 있는 언니 타입입니다. 동생처럼 플레이어를 챙겨주고 고민 상담도 잘 들어줘요. 말투는 조금 거칠지만 속정이 깊어 금방 정이 듭니다. 섬에 든든한 맏언니가 한 명 있으면 전체 분위기가 안정되는 느낌을 받을 수 있어요.',
    'guide.species.title': '35가지 종족',
    'guide.species.body':
      '주민은 고양이, 개, 늑대, 토끼, 사슴 같은 35가지 종족으로 나뉩니다. 종족마다 외형의 개성이 뚜렷해서, 팀의 비주얼은 종족 구성에 크게 좌우돼요. 고양이와 늑대, 토끼는 인기가 많아 S티어를 받는 주민이 몰려 있고, 문어와 악어, 캥거루처럼 마릿수가 적은 종족은 희소성 때문에 팀에 포인트가 됩니다. 추천 알고리즘은 같은 종족이 겹치면 감점을 주기 때문에, 종족을 다양하게 섞을수록 점수가 올라갑니다. 좋아하는 종족이 있다면 종족 프리셋을 켜고 추천받아 보세요.',
    'guide.tiers.title': '티어 평가 활용법',
    'guide.tiers.body':
      '이 사이트의 평가는 S(4점)·A(3점)·B(2점)·C(1점) 네 단계입니다. S는 "꼭 같이 살고 싶은 주민", A는 "좋아하는 주민", B는 "괜찮은 주민", C는 "별로지만 평가해 둠" 정도로 생각하면 편해요. 평가하지 않은 주민은 0점으로 취급됩니다. 팁을 몇 가지 드리자면: 첫째, S는 10~20명 정도로 아껴 주세요. S가 너무 많으면 추천이 변별력을 잃습니다. 둘째, 싫어하는 주민은 C 대신 제외(🚫) 기능을 쓰세요. C는 여전히 후보에 남지만 제외는 풀에서 완전히 빠집니다. 셋째, 이미 같이 사는 주민은 거주중(🏠)으로 표시하면 추천 풀에서 빠지고, 원하면 팀에 고정 포함시킬 수도 있습니다.',
    'guide.balance.title': '균형 잡힌 팀 짜기',
    'guide.balance.body':
      '드림 팀의 이상적인 모습은 "내가 좋아하는 주민 + 성격·종족의 다양성"입니다. 8가지 성격이 모두 들어가면 매일 다른 대화를 들을 수 있고, 종족이 겹치지 않으면 보는 재미도 살아나요. 추천 패널의 성격 커버리지(k/8) 표시를 확인해 보세요. 8/8이면 전 성격 커버, 그 아래면 어떤 성격이 빠졌는지 알 수 있습니다. 팀 인원은 3~10명으로 조절할 수 있는데, 8명 미만이면 전 성격 커버가 물리적으로 불가능하므로 알고리즘이 커버리지 강제 대신 다양성 유도로 전환합니다. 프리셋도 활용하세요: 찜은 내 호감도 우선, 종족은 종족 다양성 우선, 성격은 성격 다양성 우선으로 가중치가 바뀝니다.',
    'faq.title': '자주 묻는 질문',
    'faq.intro':
      '모동숲 드림 주민 조합기에 대해 자주 받는 질문을 모았습니다. 원하는 답을 찾지 못했다면 문의하기 페이지의 GitHub 이슈로 연락해 주세요.',
    'faq.q1.q': '이 사이트는 뭔가요?',
    'faq.q1.a':
      '동물의 숲: 새로운 지평(모동숲)의 주민 391명을 S·A·B·C 티어로 평가하면, 내 호감도와 성격·종족 다양성을 함께 고려해 드림 주민 팀을 추천해 주는 비공식 팬 도구입니다. 설치나 회원가입 없이 브라우저에서 바로 사용할 수 있어요.',
    'faq.q2.q': '닌텐도 공식 사이트인가요?',
    'faq.q2.a':
      '아닙니다. 팬이 개인적으로 만든 비공식 사이트이며, Nintendo 및 Animal Crossing과 아무런 제휴 관계가 없습니다. 주민 이름과 이미지에 대한 권리는 Nintendo에 있습니다.',
    'faq.q3.q': '회원가입이나 로그인이 필요한가요?',
    'faq.q3.a':
      '필요 없습니다. 모든 평가는 사용자의 브라우저(localStorage)에만 저장되고, 어떤 서버로도 전송되지 않아요. 저장 키는 acnh-ratings-v1(평가), acnh-blacklist-v1(제외), acnh-residents-v1(거주중), acnh-locale-v1(언어)입니다. 브라우저 데이터를 삭제하면 함께 지워지니 유의하세요.',
    'faq.q4.q': '추천은 어떻게 이루어지나요?',
    'faq.q4.a':
      '각 주민의 티어 점수(S=4, A=3, B=2, C=1, 미평가=0)를 합하고, 같은 종족·같은 성격이 겹칠수록 감점을 줍니다. 탐욕 선택과 2-opt 개선을 반복해 총점이 가장 높은 팀을 찾고, 인원이 8명 이상이면 8가지 성격을 모두 포함하도록 강제합니다. 자세한 계산 방식은 점수 산정 방식 페이지에 정리되어 있습니다.',
    'faq.q5.q': '티어는 어떻게 매기면 좋나요?',
    'faq.q5.a':
      'S는 꼭 같이 살고 싶은 주민 10~20명 정도로 아껴 쓰는 것이 좋습니다. S가 너무 많으면 추천의 변별력이 떨어져요. 싫어하는 주민은 C 대신 제외(🚫) 기능을 쓰면 후보 풀에서 완전히 빠집니다. 이미 같이 사는 주민은 거주중(🏠)으로 표시하세요.',
    'faq.q6.q': '팀 인원과 프리셋은 뭔가요?',
    'faq.q6.a':
      '팀 인원은 3~10명으로 조절할 수 있습니다. 프리셋은 추천의 우선순위를 바꾸는 가중치 세트예요. 찜은 내 호감도를 가장 중시하고, 종족은 종족 다양성을, 성격은 성격 다양성을 더 중시합니다.',
    'faq.q7.q': '어떤 언어를 지원하나요?',
    'faq.q7.a':
      '한국어·영어·일본어 3개 언어를 지원합니다. 주민 이름, 성격, 종족 표기까지 각 언어에 맞게 바뀌며, 헤더의 언어 전환 버튼으로 언제든 바꿀 수 있어요.',
    'faq.q8.q': '모바일에서도 쓸 수 있나요?',
    'faq.q8.a':
      '네. 모바일에서는 추천 패널이 하단 드로어로 열리고, 나머지 기능은 데스크톱과 동일하게 동작합니다.',
    'faq.q9.q': '광고와 개인정보는 어떻게 되나요?',
    'faq.q9.a':
      '사이트는 Google AdSense 광고를 게재할 수 있으며, 관련 안내는 개인정보처리방침 페이지에 정리되어 있습니다. 평가 데이터는 외부로 전송되지 않으니 안심하고 사용하세요.',
    'methodology.title': '점수 산정 방식',
    'methodology.intro':
      '이 페이지에서는 드림 주민 팀을 추천하는 점수 계산 방식을 있는 그대로 공개합니다. 앱이 내부적으로 수행하는 계산과 동일한 내용이며, 숨겨진 가중치나 예외 규칙은 없습니다.',
    'methodology.formula.title': '팀 점수 공식',
    'methodology.formula.body':
      '팀의 총점은 다음 식으로 계산됩니다. 팀 점수 = w.찜 × (팀원 호감도 합) − w.종족 × (종족 중복 쌍 수) − w.성격 × (성격 중복 쌍 수). 호감도는 티어를 점수로 바꾼 값(S=4, A=3, B=2, C=1, 미평가=0)을 사용합니다. 중복 쌍 수는 같은 종족(또는 성격)이 c명 있을 때 c×(c−1)/2로 계산됩니다. 예를 들어 같은 종족이 3명이면 3쌍, 같은 성격이 2명이면 1쌍이 감점 대상이 됩니다. w.찜, w.종족, w.성격은 아래에서 설명하는 프리셋에 따라 달라지는 가중치입니다.',
    'methodology.tiers.title': '티어와 호감도 점수',
    'methodology.tiers.body':
      '사용자가 매긴 S/A/B/C 티어는 각각 4/3/2/1점으로 변환됩니다. 평가하지 않은 주민은 0점입니다. 팀 점수에서 호감도 합이 차지하는 비중은 프리셋의 w.찜 가중치(0.6~1.0)를 곱해 조정됩니다. 즉 S 1명(4점)은 C 4명(4점)과 같은 호감도 합을 만들지만, 중복 감점이 없다는 점에서 S 위주의 팀이 유리합니다. 미평가 주민은 0점이므로, 평가하지 않은 성격의 자리를 채울 때는 팀 전체의 감점을 최소화하는 주민이 선택됩니다.',
    'methodology.penalty.title': '중복 감점',
    'methodology.penalty.body':
      '같은 종족이나 같은 성격이 팀에 겹치면 다양성이 떨어진다고 보고 감점을 줍니다. 감점량은 중복된 쌍의 수에 가중치를 곱한 값입니다. 같은 종족 2명은 1쌍, 3명은 3쌍, 4명은 6쌍으로 늘어나기 때문에, 특정 종족에 편중된 팀은 감점이 기하급수적으로 커집니다. 성격도 마찬가지입니다. 이 감점 덕분에 단순히 S티어만 모아 놓은 팀보다, 호감도가 조금 낮더라도 다양한 성격·종족으로 구성된 팀이 더 높은 점수를 받을 수 있습니다.',
    'methodology.presets.title': '프리셋 가중치',
    'methodology.presets.body':
      '프리셋은 세 가중치의 조합입니다. 찜 프리셋은 (찜 1.0, 종족 0.2, 성격 0.2)으로 내 호감도를 가장 중시합니다. 종족 프리셋은 (찜 0.6, 종족 1.5, 성격 0.3)으로 종족이 겹치지 않는 팀을 우선하고, 성격 프리셋은 (찜 0.6, 종족 0.3, 성격 1.5)으로 성격 다양성을 우선합니다. 세 프리셋의 추천 결과는 추천 패널에 나란히 표시되며, 각각 독립적으로 최적 팀을 계산합니다.',
    'methodology.coverage.title': '성격 커버리지',
    'methodology.coverage.body':
      '팀 인원이 8명 이상이면, 추천은 8가지 성격을 모두 포함하도록 강제됩니다. 후보 풀에 해당 성격의 주민이 한 명이라도 있다면 반드시 팀에 들어가고, 풀에 아예 없는 성격은 missing으로 보고됩니다. 커버리지는 추천 패널에 k/8 형태로 표시됩니다. 인원이 8명 미만이면 전 성격 커버가 물리적으로 불가능하므로, 강제 규칙은 풀리고 중복 감점(소프트 패널티)만으로 다양성을 유도합니다.',
    'methodology.algorithm.title': '탐색 알고리즘',
    'methodology.algorithm.body':
      '최적 팀을 찾는 과정은 세 단계입니다. 첫째, 커버리지가 강제되는 경우 아직 포함되지 않은 성격마다 풀에서 호감도가 가장 높은 주민을 1명씩 먼저 채웁니다. 둘째, 남은 자리는 팀에 넣었을 때 총점 증가분(한계 이득)이 가장 큰 주민을 하나씩 추가하는 탐욕 선택으로 채웁니다. 셋째, 2-opt 개선을 최대 50회 반복합니다. 팀원 한 명을 풀의 다른 주민과 교체했을 때 커버리지가 유지되고 총점이 올라가면 교체를 확정합니다. 개선이 더 이상 없으면 종료되고, 그때의 팀과 총점이 최종 추천 결과가 됩니다.',
    'methodology.teamsize.title': '팀 인원',
    'methodology.teamsize.body':
      '팀 인원은 3명에서 10명까지 조절할 수 있으며 기본값은 10명입니다. 8명 이상에서는 위에서 설명한 성격 커버리지 강제가 적용되고, 7명 이하에서는 강제 없이 다양성 유도만 동작합니다. 인원이 적을수록 호감도 높은 주민 위주로 팀이 구성되는 경향이 있고, 인원이 많을수록 다양성 확보를 위해 호감도가 다소 낮은 주민도 포함될 수 있습니다.',
    'methodology.data.title': '제외·거주중·고정 포함',
    'methodology.data.body':
      '제외(🚫)로 표시한 주민은 후보 풀에서 완전히 제거되어 어떤 추천에도 등장하지 않습니다. 거주중(🏠)으로 표시한 주민도 기본적으로 풀에서 빠지지만, "거주중 포함" 옵션을 켜면 팀에 고정 포함(pinned)됩니다. 고정 포함된 주민은 추천 과정에서 절대 교체되거나 제외되지 않으며, 점수 계산에는 포함됩니다. 평가·제외·거주중 상태는 서로 배타적이라 한 주민이 두 상태에 동시에 속하지 않습니다.',
  },
  en: {
    'app.title': 'Animal Crossing Villager Picker',
    'search.placeholder': 'Search villagers…',
    'filter.ratedOnly': 'Rated only',
    'filter.residentOnly': 'Residents only',
    'filter.allSpecies': 'All species',
    'filter.allPersonalities': 'All personalities',
    'filter.species': 'Species',
    'filter.clear': 'Clear',
    'recommend.title': 'Recommended',
    'recommend.score': 'Score',
    'recommend.pool': 'Your pool',
    'recommend.blacklist': 'Excluded',
    'recommend.residents': 'Current residents',
    'recommend.teamSize': 'Team size',
    'recommend.includeResidents': 'Include residents',
    'card.blacklist': 'Exclude from recommendations',
    'card.resident': 'Mark as current resident',
    'recommend.noFav': 'no picks',
    'recommend.noFavTitle': 'Personalities with no picks',
    'recommend.noFavHint': 'Recommendations fill these with unrated villagers.',
    'recommend.scoreTableTitle': 'Scores by preset',
    'recommend.coverageShort': 'Cover',
    'recommend.missing': 'no data',
    'preset.fav': 'Favorites',
    'preset.species': 'Species',
    'preset.personality': 'Personality',
    'tier.unrated': 'Unrated',
    'lang.label': 'Language',
    'selection.title': 'Your ratings',
    'selection.rated': 'rated',
    'selection.coverage': 'Personality coverage',
    'selection.byTier': 'By tier',
    'selection.byPersonality': 'By personality',
    'selection.empty': "You haven't rated anyone yet",
    'selection.reset': 'Reset all',
    'selection.resetConfirm': 'Clear all ratings and the blacklist?',
    'ptable.title': 'By personality',
    'ptable.sPool': 'S pool',
    'ptable.residents': 'Residents',
    'ptable.empty': 'none',
    'report.export': 'Export',
    'report.markdown': 'Markdown (.md)',
    'report.json': 'JSON (.json)',
    'report.title': 'Dream Villager Report',
    'report.generatedAt': 'Generated',
    'report.preset': 'Preset',
    'report.teamSize': 'Team size',
    'report.score': 'Total score',
    'report.coverage': 'Personality coverage',
    'report.recommended': 'Recommended team',
    'report.pool': 'Your pool (by tier)',
    'report.residents': 'Current residents',
    'report.excluded': 'Excluded',
    'report.none': 'None',
    'share.button': 'Share',
    'share.copyLink': 'Copy link',
    'share.copied': 'Link copied',
    'share.xPost': 'Share on X',
    'share.saveImage': 'Save as image',
    'share.teamTitle': 'Shared Dream Team',
    'share.viewHint': "A friend shared their dream villager team",
    'share.invalid': 'This share link is invalid',
    'share.ctaTitle': 'Build your own dream team',
    'share.ctaHint': '10 out of 391 — recommended from your S–C tier ratings',
    'share.cta': 'Make mine too',
    'share.xText': 'My Animal Crossing dream team! 🏝️',
    'share.imageTitle': 'My Dream Team',
    'share.imageTagline': 'My 10 dream villagers out of 391',
    'about.hint': 'About this site',
    'landing.back': 'Start picking villagers',
    'landing.tagline': 'Build your dream island lineup of 10 villagers',
    'landing.intro':
      'Rate any of the 391 Animal Crossing villagers from S to C tier, and we recommend the best dream team for you — balancing your favorites with personality diversity. No install, no login, right in your browser.',
    'landing.start': 'Get started',
    'landing.about.title': 'About this site',
    'landing.about.body1':
      'The Animal Crossing Villager Picker is a fan-made web tool that helps you choose your dream team from all 391 Animal Crossing: New Horizons villagers. Picking 10 out of 391 is harder than it sounds: stacking only your favorites skews personalities and makes island dialogue repetitive, while weighing every combination by hand is hopeless. This site exists to take that burden off your shoulders.',
    'landing.about.body2':
      'It is simple to use. Rate villagers from S to C tier, and the tool recommends the best-fitting team by balancing your ratings with species and personality diversity. No login or install is needed, and your ratings are stored only in your browser.',
    'landing.about.body3':
      'This is an unofficial fan project, not affiliated with Nintendo. All Animal Crossing rights belong to Nintendo.',
    'landing.featuresTitle': 'Features',
    'landing.feat.rate.title': 'Rate villagers',
    'landing.feat.rate.desc':
      'Search and filter all 391 villagers and rate them S/A/B/C in seconds. Your ratings are saved in your browser automatically.',
    'landing.feat.recommend.title': 'Smart recommendations',
    'landing.feat.recommend.desc':
      'We weigh your favorites against the diversity of all 8 personalities to pick the ideal team. Adjust team size from 3 to 10.',
    'landing.feat.manage.title': 'Residents & exclusions',
    'landing.feat.manage.desc':
      'Mark villagers you already live with, or exclude ones you don’t want, and the recommendations reflect it precisely.',
    'landing.feat.i18n.title': 'Multilingual',
    'landing.feat.i18n.desc':
      'Available in Korean, English and Japanese — villager names, personalities and species are all localized.',
    'landing.feat.export.title': 'Export reports',
    'landing.feat.export.desc':
      'Save your recommendation and selections as a Markdown or JSON file to reuse anywhere.',
    'landing.howTitle': 'How it works',
    'landing.step.1': 'Rate the villagers you like from S to C.',
    'landing.step.2': 'Mark current residents and exclusions to refine the picks.',
    'landing.step.3': 'Review your recommended dream team and export a report.',
    'landing.score.title': 'How is the score calculated?',
    'landing.score.intro': 'The app does the math — here is the gist:',
    'landing.score.tier.title': 'Tiers become points',
    'landing.score.tier.desc': 'S=4, A=3, B=2, C=1 — anyone you have not rated counts as 0.',
    'landing.score.diversity.title': 'Variety scores higher',
    'landing.score.diversity.desc':
      'The more your team repeats a species or personality, the more points are deducted — so a diverse team scores higher.',
    'landing.score.preset.title': 'Presets shift the priority',
    'landing.score.preset.desc':
      'Choose whether favorites, species, or personality matters most, and the weighting changes.',
    'landing.score.formula': 'Team score = sum of your ratings − species overlap − personality overlap',
    'landing.disclaimer':
      'This is an unofficial fan-made site. Animal Crossing and related names and images are property of Nintendo. This site is not affiliated with Nintendo.',
    'ads.label': 'Advertisement',
    'footer.privacy': 'Privacy Policy',
    'footer.disclaimer':
      'Unofficial fan-made · Animal Crossing names/images are property of Nintendo. (Not affiliated with Nintendo)',
    'privacy.title': 'Privacy Policy',
    'privacy.updated': 'Last updated',
    'privacy.back': 'Back',
    'privacy.intro':
      'This site (ACNH Villager Picker) is a static web app that runs entirely in your browser with no server or sign-up. Below is how your data and advertising are handled.',
    'privacy.localStorage.title': 'Browser storage (localStorage)',
    'privacy.localStorage.body':
      'Your villager ratings, resident/exclusion lists, and language preference are stored only in your browser (localStorage) and are never sent to any server. Clearing your browser data removes them.',
    'privacy.ads.title': 'Advertising (Google AdSense)',
    'privacy.ads.body':
      'This site may display ads through Google AdSense. Google and third-party vendors may use cookies to serve ads based on your prior visits to this and other websites.',
    'privacy.cookies.title': 'Cookies',
    'privacy.cookies.body':
      'Google may use cookies when serving ads. You can block or delete cookies in your browser settings.',
    'privacy.consent.title': 'Consent for EU/EEA users',
    'privacy.consent.body':
      'If you visit from the European Economic Area (EEA), the UK, or similar regions, a Google-certified consent message lets you choose whether to allow personalized ads and cookies.',
    'privacy.optout.title': 'Manage or opt out of personalized ads',
    'privacy.optout.body':
      'You can turn off or manage personalized ads in Google Ad Settings, and review the related advertising policies here:',
    'privacy.contact.title': 'Contact',
    'privacy.contact.body':
      'For privacy inquiries, please reach out via issues on the GitHub repository (github.com/lazybuttrying/acnh-villager-picker).',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'contact.title': 'Contact',
    'contact.intro':
      'This site is an unofficial, personally-made fan tool for Animal Crossing. For bug reports, feature suggestions, data corrections, or privacy/content inquiries, please reach out through the channel below.',
    'contact.github.title': 'GitHub',
    'contact.github.body': 'The fastest way to reach us is by opening an issue on the public repository:',
    'contact.response.title': 'Response note',
    'contact.response.body':
      "This is a free project run by one person, so replies may be delayed or limited — thanks for your understanding. We'll review and address what we can.",
    'footer.guide': 'Guide',
    'footer.faq': 'FAQ',
    'footer.methodology': 'Methodology',
    'footer.changelog': 'Changelog',
    'changelog.title': 'Changelog',
    'changelog.intro': 'Major changes to the site, newest first.',
    'changelog.e1.date': '2026-10-17',
    'changelog.e1.title': 'Content pages and domain unification',
    'changelog.e1.body':
      'Added the villager personality guide, FAQ, and scoring methodology pages plus a site intro section. Unified the www subdomain into the canonical domain.',
    'changelog.e2.date': '2026-06-10',
    'changelog.e2.title': 'Trust pages and search setup',
    'changelog.e2.body':
      'Added the contact page, footer navigation, robots.txt and sitemap, and completed AdSense site verification.',
    'changelog.e3.date': '2026-06-04',
    'changelog.e3.title': 'Privacy policy published',
    'changelog.e3.body':
      'Published the privacy policy page describing data storage, ads, and cookies.',
    'changelog.e4.date': '2026-06',
    'changelog.e4.title': 'Site launch',
    'changelog.e4.body':
      'Launched with 391-villager tier ratings and dream team recommendations, in Korean, English, and Japanese.',
    'guide.title': 'Villager Personality Guide',
    'guide.intro':
      'Each of the 391 Animal Crossing villagers has one of 8 personalities. Personality decides how a villager talks, what they chat about, their hobbies, and how they spend the day on your island. Fill your island with a single personality and conversations get repetitive fast; mix all 8 and you will hear something new every day. This page covers each personality with representative villagers, the 35 species, how to use tier ratings, and tips for building a balanced team.',
    'guide.personalities.title': 'The 8 personalities',
    'guide.personalities.intro':
      'Every one of the 391 villagers belongs to one of the 8 personalities below. Next to each personality we list representative villagers that players love.',
    'guide.p.jock.body':
      'The sporty fitness enthusiast who lives for exercise. Jocks wake up early for a jog and recommend workouts to everyone they meet. Their cheerful energy makes them great island mood-makers, but their conversations revolve heavily around sports, so one or two is usually the sweet spot. Adding a jock makes the whole island feel lively.',
    'guide.p.lazy.body':
      'The laid-back type who loves food and naps. Lazy villagers enjoy talking about snacks and daydreaming up silly ideas, and they get along with almost everyone. Their warm, humorous dialogue makes them the island healers — but too many lazies in one team makes conversations overlap, so mix them with other personalities.',
    'guide.p.cranky.body':
      'Gruff on the outside, warm on the inside — the grown-up of the island. Cranky villagers can seem curt at first, but they reveal a kinder side as you befriend them. They add a grounded presence and relaxed, mature conversations. Include one if you want a team with character.',
    'guide.p.smug.body':
      'The confident, stylish charmer. Smug villagers love cafes, fashion, and music, and speak politely. They make the island feel more sophisticated, though they can occasionally come off as smug (as the name suggests). Many have striking looks, so they are popular as the visual centerpiece of a team.',
    'guide.p.peppy.body':
      'Always full of energy and sunshine. Peppy villagers are into trends, idols, and big dreams, and they greet everyone first. They brighten up the island as natural mood-makers, though their high tension can feel a bit loud at times. Essential for a lively island.',
    'guide.p.normal.body':
      'The kind, considerate type — like a mother figure for the island. Normal villagers listen to others’ worries and offer warm words, getting along with everyone without drama. Their conversations are comfortable, and they fit into any team composition. Include them for a calm, stable island.',
    'guide.p.snooty.body':
      'The elegant, refined type. Snooty villagers are into fashion, beauty, and classy hobbies, and can sound a little haughty at first. Befriend them and you will discover surprising warmth underneath. They add class to the island — recommended if you enjoy sophisticated conversations.',
    'guide.p.uchi.body':
      'The dependable big-sister type. Uchi villagers look after you like a younger sibling and are great at listening to your worries. Their speech is a little rough around the edges, but they are deeply caring and grow on you fast. One big sister on the island makes everything feel more stable.',
    'guide.species.title': 'The 35 species',
    'guide.species.body':
      'Villagers come in 35 species, from cats, dogs, and wolves to rabbits and deer. Each species has a distinct look, so your team’s visual identity depends heavily on species mix. Popular species like cats, wolves, and rabbits hold many S-tier villagers, while rare ones like octopuses, alligators, and kangaroos add scarcity value to a team. The recommendation algorithm deducts points when species repeat, so diversifying species raises your score. If you have a favorite species, turn on the species preset and get recommendations.',
    'guide.tiers.title': 'How to use tier ratings',
    'guide.tiers.body':
      'Ratings on this site use four tiers: S (4 pts), A (3 pts), B (2 pts), C (1 pt). Think of S as “must live with me”, A as “love them”, B as “like them”, and C as “rated but not a fan”. Unrated villagers count as 0. A few tips: first, keep S to about 10–20 villagers — too many S ratings and recommendations lose their edge. Second, for villagers you dislike, use the exclude (🚫) feature instead of C — C villagers stay in the pool, while excluded ones leave it entirely. Third, mark villagers already living with you as residents (🏠) to remove them from the pool, or pin them into the team if you want them included.',
    'guide.balance.title': 'Building a balanced team',
    'guide.balance.body':
      'The ideal dream team is “villagers I love + personality and species diversity”. Covering all 8 personalities means fresh conversations every day, and avoiding species repeats keeps the visuals interesting. Check the personality coverage (k/8) readout in the recommendation panel — 8/8 means full coverage, and anything below shows which personalities are missing. Team size adjusts from 3 to 10; below 8 members full coverage is physically impossible, so the algorithm switches from forced coverage to diversity encouragement. Use presets too: Favorites prioritizes your ratings, Species prioritizes species diversity, and Personality prioritizes personality diversity.',
    'faq.title': 'Frequently Asked Questions',
    'faq.intro':
      'Answers to common questions about the ACNH Villager Picker. If you cannot find what you need, reach out via a GitHub issue on the Contact page.',
    'faq.q1.q': 'What is this site?',
    'faq.q1.a':
      'An unofficial fan tool for Animal Crossing: New Horizons. Rate the 391 villagers from S to C tier, and it recommends a dream team that balances your favorites with personality and species diversity. No install or sign-up — it runs right in your browser.',
    'faq.q2.q': 'Is this an official Nintendo site?',
    'faq.q2.a':
      'No. It is an unofficial site made by a fan, with no affiliation to Nintendo or Animal Crossing. All villager names and images belong to Nintendo.',
    'faq.q3.q': 'Do I need an account or login?',
    'faq.q3.a':
      'No. All ratings are stored only in your browser (localStorage) and never sent to any server. The storage keys are acnh-ratings-v1 (ratings), acnh-blacklist-v1 (exclusions), acnh-residents-v1 (residents), and acnh-locale-v1 (language). Clearing your browser data removes them, so keep that in mind.',
    'faq.q4.q': 'How do recommendations work?',
    'faq.q4.a':
      'Each villager’s tier score (S=4, A=3, B=2, C=1, unrated=0) is summed, then points are deducted for repeated species and personalities. A greedy fill plus 2-opt improvement finds the highest-scoring team, and with 8 or more members the algorithm forces all 8 personalities to be covered. The full math is documented on the Methodology page.',
    'faq.q5.q': 'How should I rate tiers?',
    'faq.q5.a':
      'Keep S for the 10–20 villagers you must live with — too many S ratings dulls the recommendations. For villagers you dislike, use the exclude (🚫) feature instead of C: C villagers stay in the pool, excluded ones leave it entirely. Mark villagers already living with you as residents (🏠).',
    'faq.q6.q': 'What are team size and presets?',
    'faq.q6.a':
      'Team size adjusts from 3 to 10. Presets are weight sets that shift recommendation priorities: Favorites weighs your ratings most, Species favors species diversity, and Personality favors personality diversity.',
    'faq.q7.q': 'Which languages are supported?',
    'faq.q7.a':
      'Korean, English, and Japanese. Villager names, personalities, and species labels all localize, and you can switch anytime with the language button in the header.',
    'faq.q8.q': 'Can I use it on mobile?',
    'faq.q8.a':
      'Yes. On mobile the recommendation panel opens as a bottom drawer; everything else works the same as on desktop.',
    'faq.q9.q': 'What about ads and privacy?',
    'faq.q9.a':
      'The site may display Google AdSense ads — see the Privacy Policy page for details. Your rating data is never sent anywhere, so use it with confidence.',
    'methodology.title': 'How Scores Work',
    'methodology.intro':
      'This page documents exactly how dream-team recommendations are scored — the same calculation the app performs internally. There are no hidden weights or exception rules.',
    'methodology.formula.title': 'Team score formula',
    'methodology.formula.body':
      'A team’s total score is computed as: team score = w.fav × (sum of member ratings) − w.species × (species duplicate pairs) − w.personality × (personality duplicate pairs). Ratings convert tiers to points (S=4, A=3, B=2, C=1, unrated=0). Duplicate pairs count c×(c−1)/2 for c members sharing a species (or personality): 3 members of one species means 3 pairs, 2 of one personality means 1 pair. The weights w.fav, w.species, and w.personality come from the preset described below.',
    'methodology.tiers.title': 'Tiers and rating points',
    'methodology.tiers.body':
      'Your S/A/B/C ratings convert to 4/3/2/1 points; unrated villagers count as 0. The ratings sum is scaled by the preset’s w.fav weight (0.6–1.0). One S villager (4 pts) equals four C villagers (4 pts) in rating sum, but an S-heavy team wins out because it incurs no duplication penalty. When a personality has no rated villagers, the algorithm fills its slot with whichever candidate minimizes total penalties.',
    'methodology.penalty.title': 'Duplication penalties',
    'methodology.penalty.body':
      'Repeating a species or personality in the team is treated as lost diversity and penalized. The penalty is the number of duplicate pairs times the weight. Two members of one species is 1 pair, three is 3 pairs, four is 6 pairs — so a team stacked with one species is penalized super-linearly. The same applies to personalities. Thanks to this penalty, a diverse team of slightly lower-rated villagers can outscore a team of pure S-tiers.',
    'methodology.presets.title': 'Preset weights',
    'methodology.presets.body':
      'A preset is a combination of the three weights. Favorites uses (fav 1.0, species 0.2, personality 0.2) and values your ratings most. Species uses (fav 0.6, species 1.5, personality 0.3) and prioritizes species-unique teams. Personality uses (fav 0.6, species 0.3, personality 1.5) and prioritizes personality diversity. The recommendation panel shows all three preset results side by side, each computed as an independent optimal team.',
    'methodology.coverage.title': 'Personality coverage',
    'methodology.coverage.body':
      'With a team size of 8 or more, recommendations are forced to include all 8 personalities. If the candidate pool contains at least one villager of a personality, one is guaranteed a spot; personalities entirely absent from the pool are reported as missing. Coverage is shown in the panel as k/8. Below 8 members full coverage is physically impossible, so the hard rule is lifted and only the soft duplication penalty encourages diversity.',
    'methodology.algorithm.title': 'Search algorithm',
    'methodology.algorithm.body':
      'Finding the optimal team takes three steps. First, when coverage is enforced, the highest-rated villager of each not-yet-covered personality is seeded into the team. Second, remaining slots are filled greedily: each step adds the villager with the largest marginal gain in total score. Third, 2-opt improvement runs up to 50 passes — swapping one team member for a pool candidate is kept when coverage still holds and the total score rises. The loop stops when nothing improves, and that team and score become the final recommendation.',
    'methodology.teamsize.title': 'Team size',
    'methodology.teamsize.body':
      'Team size adjusts from 3 to 10, defaulting to 10. At 8 and above, the personality coverage rule applies; at 7 and below, only diversity encouragement runs. Smaller teams skew toward your highest-rated villagers, while larger teams may include slightly lower-rated ones to secure diversity.',
    'methodology.data.title': 'Exclusions, residents, and pinning',
    'methodology.data.body':
      'Villagers marked excluded (🚫) leave the candidate pool entirely and never appear in recommendations. Villagers marked as residents (🏠) also leave the pool by default, but enabling “include residents” pins them into the team. Pinned villagers are never swapped or removed during recommendation, though they count toward the score. Rating, exclusion, and resident states are mutually exclusive — one villager cannot be in two states at once.',
  },
  ja: {
    'app.title': 'どうぶつの森 住民ピッカー',
    'search.placeholder': '住民を検索…',
    'filter.ratedOnly': '評価済みのみ',
    'filter.residentOnly': '同居中のみ',
    'filter.allSpecies': 'すべての種族',
    'filter.allPersonalities': 'すべての性格',
    'filter.species': '種族',
    'filter.clear': 'クリア',
    'recommend.title': 'おすすめ',
    'recommend.score': 'スコア',
    'recommend.pool': '選択プール',
    'recommend.blacklist': '除外リスト',
    'recommend.residents': '同居中',
    'recommend.teamSize': '人数',
    'recommend.includeResidents': '同居中を含む',
    'card.blacklist': 'おすすめから除外',
    'card.resident': '同居中にする',
    'recommend.noFav': 'お気に入りなし',
    'recommend.noFavTitle': 'お気に入りがいない性格',
    'recommend.noFavHint': 'おすすめでは未評価の住民で補われます。',
    'recommend.scoreTableTitle': 'プリセット別スコア',
    'recommend.coverageShort': 'カバー',
    'recommend.missing': 'データなし',
    'preset.fav': 'お気に入り',
    'preset.species': '種族',
    'preset.personality': '性格',
    'tier.unrated': '未評価',
    'lang.label': '言語',
    'selection.title': '評価状況',
    'selection.rated': '評価済み',
    'selection.coverage': '性格カバー',
    'selection.byTier': 'ティア別',
    'selection.byPersonality': '性格別',
    'selection.empty': 'まだ誰も評価していません',
    'selection.reset': 'リセット',
    'selection.resetConfirm': '評価と除外リストをすべてリセットしますか？',
    'ptable.title': '性格別の配置',
    'ptable.sPool': 'Sプール',
    'ptable.residents': '同居中',
    'ptable.empty': 'なし',
    'report.export': 'エクスポート',
    'report.markdown': 'マークダウン (.md)',
    'report.json': 'JSON (.json)',
    'report.title': 'ドリーム住民レポート',
    'report.generatedAt': '作成日',
    'report.preset': 'プリセット',
    'report.teamSize': '人数',
    'report.score': '合計スコア',
    'report.coverage': '性格カバー',
    'report.recommended': 'おすすめチーム',
    'report.pool': '選択プール (ティア別)',
    'report.residents': '同居中',
    'report.excluded': '除外リスト',
    'report.none': 'なし',
    'share.button': '共有',
    'share.copyLink': 'リンクをコピー',
    'share.copied': 'リンクをコピーしました',
    'share.xPost': 'Xで共有',
    'share.saveImage': '画像で保存',
    'share.teamTitle': 'ドリームチーム共有',
    'share.viewHint': '友達が共有したドリーム住民チーム',
    'share.invalid': '共有リンクが無効です',
    'share.ctaTitle': 'あなたのドリームチームも作ってみよう',
    'share.ctaHint': '391人の中から10人 — S〜Cティア評価でおすすめ',
    'share.cta': '自分も作ってみる',
    'share.xText': 'あつ森ドリームチーム！🏝️',
    'share.imageTitle': 'マイドリームチーム',
    'share.imageTagline': '391人から選んだドリーム住民10人',
    'about.hint': 'サイト紹介を見る',
    'landing.back': '住民を選びに行く',
    'landing.tagline': '好みで選ぶ、夢の島の住民10人',
    'landing.intro':
      '391人のどうぶつの森の住民をS・A・B・Cで評価すると、性格の多様性まで考慮して最適なドリーム住民チームをおすすめします。インストールもログインも不要、ブラウザですぐに。',
    'landing.start': 'はじめる',
    'landing.about.title': 'このサイトについて',
    'landing.about.body1':
      '「どうぶつの森 住民ピッカー」は、「あつまれ どうぶつの森」の全391人の住民から、自分だけのドリームチームを選ぶためのファンメイドWebツールです。391人から10人を選ぶのは想像以上に大変です。お気に入りだけを集めると性格が偏って島の会話が単調になりがちですし、組み合わせを一つひとつ検討するのは現実的ではありません。このサイトはそんな悩みを解消するために作られました。',
    'landing.about.body2':
      '使い方はシンプルです。住民をSからCのティアで評価すると、評価点と種族・性格の多様性を考慮して、最も相性の良いチームを提案します。ログインやインストールは不要で、評価データはブラウザにのみ保存されます。',
    'landing.about.body3':
      'このサイトは任天堂とは関係のない非公式ファンプロジェクトです。どうぶつの森シリーズの権利はすべて任天堂に帰属します。',
    'landing.featuresTitle': '主な機能',
    'landing.feat.rate.title': '住民を評価',
    'landing.feat.rate.desc':
      '391人すべてを検索・フィルターしながらS/A/B/Cで素早く評価。評価はブラウザに自動保存されます。',
    'landing.feat.recommend.title': 'スマートおすすめ',
    'landing.feat.recommend.desc':
      'お気に入り度と8種類の性格の多様性を両立して最適なチームを選定。人数は3〜10人で調整できます。',
    'landing.feat.manage.title': '同居・除外の管理',
    'landing.feat.manage.desc':
      'すでに同居している住民や、避けたい住民を指定すると、おすすめに正確に反映されます。',
    'landing.feat.i18n.title': '多言語対応',
    'landing.feat.i18n.desc':
      '韓国語・英語・日本語に対応。住民の名前・性格・種族まで現地表記で表示します。',
    'landing.feat.export.title': 'レポート出力',
    'landing.feat.export.desc':
      'おすすめ結果と選択リストをMarkdownまたはJSONで保存し、どこでも再利用できます。',
    'landing.howTitle': '使い方',
    'landing.step.1': '気に入った住民をS・A・B・Cで評価します。',
    'landing.step.2': '同居中の住民と除外したい住民を指定しておすすめを調整します。',
    'landing.step.3': 'おすすめのドリーム住民チームを確認してレポートを出力します。',
    'landing.score.title': 'スコアはどう決まる？',
    'landing.score.intro': '複雑な計算はアプリにおまかせ。要点だけ：',
    'landing.score.tier.title': 'ティアがそのままスコアに',
    'landing.score.tier.desc': 'S=4・A=3・B=2・C=1点。未評価の住民は0点です。',
    'landing.score.diversity.title': '重なると減点、多様だと加点',
    'landing.score.diversity.desc':
      '同じ種族・同じ性格がチームで重なるほど減点されます。だから多様に組むほど合計スコアが高くなります。',
    'landing.score.preset.title': 'プリセットで優先度を調整',
    'landing.score.preset.desc':
      '「お気に入り・種族・性格」のどれを重視するかを選ぶと、重み付けが変わります。',
    'landing.score.formula': 'チームスコア = 評価の合計 − 種族の重なり − 性格の重なり',
    'landing.disclaimer':
      '非公式のファンサイトです。どうぶつの森および関連する名称・画像はNintendoの資産であり、本サイトはNintendoと提携していません。',
    'ads.label': '広告',
    'footer.privacy': 'プライバシーポリシー',
    'footer.disclaimer':
      '非公式ファン制作 · どうぶつの森および関連する名称・画像はNintendoの資産です。(Nintendo非提携)',
    'privacy.title': 'プライバシーポリシー',
    'privacy.updated': '最終更新日',
    'privacy.back': '戻る',
    'privacy.intro':
      '本サイト（あつ森 ドリーム住民ピッカー）は、サーバーや会員登録なしにブラウザ上で動作する静的Webサイトです。以下はデータの取り扱いと広告に関する案内です。',
    'privacy.localStorage.title': 'ブラウザストレージ（localStorage）',
    'privacy.localStorage.body':
      '住民の評価、同居・除外リスト、言語設定はユーザーのブラウザ（localStorage）にのみ保存され、外部サーバーへ送信されることはありません。ブラウザのデータを削除すると一緒に消去されます。',
    'privacy.ads.title': '広告（Google AdSense）',
    'privacy.ads.body':
      '本サイトはGoogle AdSenseを通じて広告を表示する場合があります。Googleおよび第三者の広告事業者は、Cookieなどを使用して過去のアクセス情報に基づくパーソナライズ広告を配信することがあります。',
    'privacy.cookies.title': 'Cookie',
    'privacy.cookies.body':
      '広告配信の際にGoogleがCookieを使用する場合があります。ユーザーはブラウザの設定でCookieをブロックまたは削除できます。',
    'privacy.consent.title': 'EU/EEAユーザーの同意',
    'privacy.consent.body':
      '欧州経済領域（EEA）・英国などからアクセスする場合、Google認定の同意管理メッセージを通じて、パーソナライズ広告およびCookieの使用に同意するかどうかを選択できます。',
    'privacy.optout.title': 'パーソナライズ広告の設定・オプトアウト',
    'privacy.optout.body':
      'パーソナライズ広告は以下のGoogle広告設定でオフにしたり管理したりでき、広告関連ポリシーは次で確認できます。',
    'privacy.contact.title': 'お問い合わせ',
    'privacy.contact.body':
      'プライバシーに関するお問い合わせは、GitHubリポジトリ（github.com/lazybuttrying/acnh-villager-picker）のIssueからご連絡ください。',
    'footer.about': 'サイトについて',
    'footer.contact': 'お問い合わせ',
    'contact.title': 'お問い合わせ',
    'contact.intro':
      '本サイトはどうぶつの森ファンが個人的に作成した非公式ツールです。バグ報告・機能提案・データの誤り・プライバシーやコンテンツに関するお問い合わせは、以下のチャンネルからご連絡ください。',
    'contact.github.title': 'GitHub',
    'contact.github.body': 'バグ・提案・お問い合わせは、公開リポジトリのIssueにお寄せいただくと最も早く確認できます：',
    'contact.response.title': '返信について',
    'contact.response.body':
      '個人運営の無料プロジェクトのため、返信が遅れる・難しい場合がある点はご了承ください。可能な範囲で確認し対応します。',
    'footer.guide': 'ガイド',
    'footer.faq': 'よくある質問',
    'footer.methodology': 'スコアの仕組み',
    'footer.changelog': '更新履歴',
    'changelog.title': '更新履歴',
    'changelog.intro': 'サイトの主な変更を新しい順にまとめています。',
    'changelog.e1.date': '2026-10-17',
    'changelog.e1.title': 'コンテンツページの追加とドメイン統一',
    'changelog.e1.body':
      '住民の性格ガイド・よくある質問・スコア算出方式のページとサイト紹介セクションを追加しました。wwwサブドメインを正規ドメインに統一しました。',
    'changelog.e2.date': '2026-06-10',
    'changelog.e2.title': '信頼性ページと検索設定',
    'changelog.e2.body':
      'お問い合わせページ、フッターナビゲーション、robots.txtとサイトマップを追加し、AdSenseのサイト認証を完了しました。',
    'changelog.e3.date': '2026-06-04',
    'changelog.e3.title': 'プライバシーポリシー公開',
    'changelog.e3.body':
      'データの保存方法や広告・Cookieについて説明するプライバシーポリシーページを公開しました。',
    'changelog.e4.date': '2026-06',
    'changelog.e4.title': 'サイト公開',
    'changelog.e4.body':
      '391人の住民ティア評価とドリームチーム提案機能を備えた最初のバージョンを公開しました。韓国語・英語・日本語に対応しています。',
    'guide.title': '住民の性格ガイド',
    'guide.intro':
      'どうぶつの森の住民391人には、それぞれ8種類の性格のうち1つが設定されています。性格は住民の口調や会話の話題、趣味、島での一日の過ごし方を決めます。同じ性格ばかり集めると会話がすぐ重複して飽きてしまいますが、8種類をバランスよく混ぜると毎日新しい会話が聞けます。このページでは性格ごとの特徴と代表的な住民、35種類の種族、ティア評価の活用法、バランスのよいチームの作り方をまとめました。',
    'guide.personalities.title': '8種類の性格',
    'guide.personalities.intro':
      '391人の住民はすべて、下の8種類の性格のいずれかに属します。性格の名前の横には、実際に人気の高い代表的な住民を併記しました。',
    'guide.p.jock.body':
      '運動とトレーニングの話が口癖の熱血スポーツマンタイプ。早朝にジョギングをし、出会う住民みんなに運動をすすめます。明るく元気な会話で島のムードメーカーになりますが、話題が運動に偏りがちなので1〜2人くらいがちょうどいいでしょう。チームに入れると島全体が活気づいた感じになります。',
    'guide.p.lazy.body':
      '食べることと昼寝を愛するのんびりタイプ。おやつの話や突拍子もない空想を楽しみ、誰とでも仲良くできます。温かくユーモラスな会話で島の癒やし担当になりますが、同じのんびりが多すぎると会話が重複しやすいので、他の性格と混ぜるのがおすすめです。',
    'guide.p.cranky.body':
      '見た目はぶっきらぼうでも根は優しい、大人タイプ。最初は口数が少なく冷たく感じますが、仲良くなるほど優しい一面を見せてくれます。島にどっしりした存在感を加え、余裕のある大人の会話が聞けます。個性の強いチームにしたいなら1人入れてみましょう。',
    'guide.p.smug.body':
      '自信に満ちたおしゃれなタイプ。カフェやファッション、音楽の話が好きで、口調も紳士的です。島の雰囲気をぐっと洗練させてくれますが、ときどき自慢げに感じられることも。個性的な見た目の住民が多く、チームのビジュアル担当として人気が高いです。',
    'guide.p.peppy.body':
      'いつも元気いっぱいの明るいタイプ。流行やアイドル、夢の話に関心が高く、誰にでも先に話しかけます。島をぱっと華やかにするムードメーカーですが、テンションが高すぎてにぎやかに感じられることも。活気ある島にしたいなら欠かせない性格です。',
    'guide.p.normal.body':
      '優しく思いやりのあるタイプ。島のお母さんのように他の住民の悩みを聞き、温かい言葉をかけてくれます。誰とでもトラブルなく付き合え、会話も心地よいので、どんなチーム構成にも無理なく入ります。安定した島の雰囲気にしたいならぜひ加えましょう。',
    'guide.p.snooty.body':
      '気品ある洗練されたタイプ。ファッションや美容、上品な趣味に関心が高く、少し高飛車に感じられることもあります。でも仲良くなると意外な優しさを見せてくれます。島に品格を加えてくれ、洗練された会話を楽しみたい方におすすめの性格です。',
    'guide.p.uchi.body':
      'さっぱりして義理堅いお姉さんタイプ。弟や妹のようにプレイヤーを気にかけてくれ、悩み相談にもよく乗ってくれます。口調は少し荒っぽいですが情が深く、すぐに愛着がわきます。島に頼れるお姉さんが1人いると、全体の雰囲気が安定した感じになります。',
    'guide.species.title': '35種類の種族',
    'guide.species.body':
      '住民はネコ・イヌ・オオカミ・ウサギ・シカなど35種類の種族に分かれます。種族ごとに見た目の個性がはっきりしているので、チームのビジュアルは種族構成に大きく左右されます。ネコ・オオカミ・ウサギは人気が高くSティアの住民が集中し、タコ・ワニ・カンガルーのように数が少ない種族は希少性がチームのポイントになります。おすすめアルゴリズムは同じ種族が重なると減点するので、種族を多様に混ぜるほどスコアが上がります。好きな種族があるなら種族プリセットをオンにしておすすめを受けてみましょう。',
    'guide.tiers.title': 'ティア評価の活用法',
    'guide.tiers.body':
      'このサイトの評価はS（4点）・A（3点）・B（2点）・C（1点）の4段階です。Sは「ぜひ同居したい住民」、Aは「好きな住民」、Bは「まあまあな住民」、Cは「あまり好きではないが評価済み」くらいに考えると分かりやすいでしょう。未評価の住民は0点として扱われます。コツをいくつか。まず、Sは10〜20人程度に絞りましょう。多すぎるとおすすめの切れ味が鈍ります。次に、苦手な住民はCではなく除外（🚫）機能を使ってください。Cは候補に残りますが、除外はプールから完全に外れます。最後に、すでに同居中の住民は同居中（🏠）に指定するとおすすめプールから外れ、必要ならチームに固定で含めることもできます。',
    'guide.balance.title': 'バランスのよいチーム作り',
    'guide.balance.body':
      'ドリームチームの理想形は「好きな住民＋性格・種族の多様性」です。8種類の性格がすべて入れば毎日違う会話が聞け、種族が重ならなければ見た目の楽しさも保てます。おすすめパネルの性格カバー（k/8）表示をチェックしましょう。8/8なら全性格カバー、それ以下ならどの性格が欠けているかが分かります。人数は3〜10人で調整できますが、8人未満では全性格カバーが物理的に不可能なため、アルゴリズムはカバー強制から多様性誘導に切り替わります。プリセットも活用しましょう。お気に入りは自分の評価優先、種族は種族の多様性優先、性格は性格の多様性優先で重み付けが変わります。',
    'faq.title': 'よくある質問',
    'faq.intro':
      'あつ森ドリーム住民ピッカーについてよくいただく質問をまとめました。答えが見つからない場合は、お問い合わせページのGitHub Issueからご連絡ください。',
    'faq.q1.q': 'このサイトは何ですか？',
    'faq.q1.a':
      '『あつまれ どうぶつの森』の住民391人をS・A・B・Cで評価すると、自分の好みと性格・種族の多様性を両立したドリーム住民チームをおすすめする非公式ファンツールです。インストールや会員登録は不要で、ブラウザですぐに使えます。',
    'faq.q2.q': '任天堂の公式サイトですか？',
    'faq.q2.a':
      'いいえ。ファンが個人的に作成した非公式サイトで、Nintendoやどうぶつの森とは一切提携していません。住民の名前や画像の権利はNintendoに帰属します。',
    'faq.q3.q': '会員登録やログインは必要ですか？',
    'faq.q3.a':
      '不要です。すべての評価はユーザーのブラウザ（localStorage）にのみ保存され、サーバーへ送信されることはありません。保存キーはacnh-ratings-v1（評価）、acnh-blacklist-v1（除外）、acnh-residents-v1（同居中）、acnh-locale-v1（言語）です。ブラウザのデータを削除すると一緒に消える点にご注意ください。',
    'faq.q4.q': 'おすすめはどうやって決まりますか？',
    'faq.q4.a':
      '各住民のティアスコア（S=4・A=3・B=2・C=1、未評価=0）を合計し、同じ種族・同じ性格の重なりが多いほど減点します。貪欲法による選択と2-opt改善を繰り返して合計スコアが最大のチームを探し、8人以上の場合は8種類の性格をすべて含めるよう強制します。詳しい計算式はスコアの仕組みページにまとめています。',
    'faq.q5.q': 'ティアはどう付ければいいですか？',
    'faq.q5.a':
      'Sはぜひ同居したい住民10〜20人程度に絞るのがおすすめです。多すぎるとおすすめの切れ味が鈍ります。苦手な住民はCではなく除外（🚫）機能を使いましょう。Cは候補に残りますが、除外はプールから完全に外れます。すでに同居中の住民は同居中（🏠）に指定してください。',
    'faq.q6.q': '人数とプリセットとは何ですか？',
    'faq.q6.a':
      '人数は3〜10人で調整できます。プリセットはおすすめの優先度を変える重みセットです。お気に入りは自分の評価を最も重視し、種族は種族の多様性、性格は性格の多様性をより重視します。',
    'faq.q7.q': '対応言語を教えてください。',
    'faq.q7.a':
      '韓国語・英語・日本語の3言語に対応しています。住民の名前・性格・種族の表記まで各言語に切り替わり、ヘッダーの言語切替ボタンでいつでも変更できます。',
    'faq.q8.q': 'スマホでも使えますか？',
    'faq.q8.a':
      'はい。スマホではおすすめパネルが下部のドロワーとして開き、それ以外の機能はデスクトップと同じように動作します。',
    'faq.q9.q': '広告とプライバシーはどうなっていますか？',
    'faq.q9.a':
      '本サイトはGoogle AdSenseの広告を表示する場合があります。詳しくはプライバシーポリシーのページをご覧ください。評価データが外部に送信されることはありませんので、安心してご利用ください。',
    'methodology.title': 'スコアの仕組み',
    'methodology.intro':
      'このページでは、ドリーム住民チームのおすすめスコアの計算方法をそのまま公開します。アプリ内部で行っている計算と同じ内容で、隠れた重みや例外ルールはありません。',
    'methodology.formula.title': 'チームスコアの式',
    'methodology.formula.body':
      'チームの合計スコアは次の式で計算されます。チームスコア = w.お気に入り ×（メンバーの評価の合計）− w.種族 ×（種族の重複ペア数）− w.性格 ×（性格の重複ペア数）。評価はティアを点数に変換した値（S=4・A=3・B=2・C=1、未評価=0）を使います。重複ペア数は、同じ種族（または性格）がc人いる場合にc×(c−1)/2で計算されます。たとえば同じ種族が3人なら3ペア、同じ性格が2人なら1ペアが減点対象です。w.お気に入り・w.種族・w.性格は、後述のプリセットによって変わる重みです。',
    'methodology.tiers.title': 'ティアと評価点',
    'methodology.tiers.body':
      'ユーザーが付けたS/A/B/Cのティアはそれぞれ4/3/2/1点に変換され、未評価の住民は0点です。評価の合計はプリセットのw.お気に入りの重み（0.6〜1.0）を掛けて調整されます。S1人（4点）とC4人（4点）は評価の合計が同じになりますが、重複減点がない分だけS中心のチームが有利です。未評価の性格の枠を埋める際は、チーム全体の減点を最小化する住民が選ばれます。',
    'methodology.penalty.title': '重複の減点',
    'methodology.penalty.body':
      '同じ種族や同じ性格がチームで重なると多様性が下がるとみなして減点します。減点量は重複ペアの数に重みを掛けた値です。同じ種族2人なら1ペア、3人なら3ペア、4人なら6ペアと増えるため、特定の種族に偏ったチームは減点が加速度的に大きくなります。性格も同様です。この減点のおかげで、Sティアばかり集めたチームより、評価が少し低くても多様な性格・種族で構成されたチームの方が高いスコアになることがあります。',
    'methodology.presets.title': 'プリセットの重み',
    'methodology.presets.body':
      'プリセットは3つの重みの組み合わせです。お気に入りプリセットは（お気に入り1.0・種族0.2・性格0.2）で自分の評価を最も重視します。種族プリセットは（お気に入り0.6・種族1.5・性格0.3）で種族の重ならないチームを優先し、性格プリセットは（お気に入り0.6・種族0.3・性格1.5）で性格の多様性を優先します。3つのプリセットのおすすめ結果はおすすめパネルに並べて表示され、それぞれ独立に最適チームが計算されます。',
    'methodology.coverage.title': '性格カバー',
    'methodology.coverage.body':
      '人数が8人以上の場合、おすすめは8種類の性格をすべて含めるよう強制されます。候補プールにその性格の住民が1人でもいれば必ずチームに入り、プールにまったくいない性格は不足として報告されます。カバーはおすすめパネルにk/8の形で表示されます。8人未満では全性格カバーが物理的に不可能なため、強制ルールは解除され、重複減点（ソフトペナルティ）のみで多様性を誘導します。',
    'methodology.algorithm.title': '探索アルゴリズム',
    'methodology.algorithm.body':
      '最適なチームを探す手順は3段階です。まず、カバーが強制される場合は、まだ含まれていない性格ごとにプール内で評価が最も高い住民を1人ずつ先に確保します。次に、残りの枠はチームに入れたときの合計スコアの増加分（限界利得）が最大の住民を1人ずつ加える貪欲法で埋めます。最後に2-opt改善を最大50回繰り返します。チームの1人をプールの別の住民と交換したときにカバーが維持され、合計スコアが上がれば交換を確定します。これ以上改善がなくなれば終了し、そのときのチームと合計スコアが最終的なおすすめ結果になります。',
    'methodology.teamsize.title': '人数',
    'methodology.teamsize.body':
      '人数は3〜10人で調整でき、デフォルトは10人です。8人以上では上記の性格カバー強制が適用され、7人以下では多様性の誘導のみが動作します。人数が少ないほど評価の高い住民中心のチームになりやすく、人数が多いほど多様性確保のために評価がやや低めの住民も含まれることがあります。',
    'methodology.data.title': '除外・同居中・固定',
    'methodology.data.body':
      '除外（🚫）に指定した住民は候補プールから完全に外れ、どのおすすめにも登場しません。同居中（🏠）に指定した住民も基本的にプールから外れますが、「同居中を含む」オプションをオンにするとチームに固定で含まれます（pinned）。固定された住民はおすすめの過程で交換・除外されることは決してなく、スコア計算には含まれます。評価・除外・同居中の状態は互いに排他的で、1人の住民が2つの状態に同時に属することはありません。',
  },
}
