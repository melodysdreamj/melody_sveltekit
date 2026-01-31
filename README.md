# 🎵 Melody SvelteKit Template

> **이 저장소는 템플릿입니다.** 클론하여 내 프로젝트의 출발점으로 사용하세요.

새로운 프로젝트를 빠르게 시작하기 위한 **SvelteKit 풀스택 템플릿**입니다.  
Cloudflare 배포에 최적화되어 있으며, **AI와의 협업을 전제로 설계된 아키텍처**와 코딩 가이드를 내장하고 있습니다.

---

## ⚡ Quick Start

```bash
# 1. 템플릿 클론
git clone https://github.com/melodysdreamj/melody_sveltekit.git my-project
cd my-project

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

### 내 프로젝트에 맞게 수정하기

| 파일 | 수정 내용 |
|---|---|
| `package.json` | `name` 필드를 프로젝트명으로 변경 |
| `vite.config.ts` | PWA `name`, `short_name`, `description` 수정 |
| `static/manifest.webmanifest` | `name`, `short_name` 수정 |
| `.env` | `.env.example`을 복사하여 실제 키 입력 |
| `src/lib/preload.svelte` | AdSense·GA4 ID를 내 계정 ID로 교체 |

> 💡 사용하지 않는 백엔드 모듈 폴더(예: `dynamodb/`, `workerkv/`)는 삭제해도 됩니다.

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Svelte 5 + SvelteKit 2 |
| 빌드/배포 | Vite 6 + Cloudflare Adapter |
| 스타일링 | Tailwind CSS 3 + Typography |
| 서버 DB | AWS DynamoDB, Cloudflare Workers KV |
| 클라이언트 DB | Dexie (IndexedDB) |
| 인증 | Firebase, PocketBase |
| 보안 | jose + jsonwebtoken (JWT) |
| PWA | @vite-pwa/sveltekit |

## 아키텍처

**Frontend → Controller → Backend** 단방향 의존성 구조를 따릅니다.

```
src/
├── routes/                  # Frontend (진입점)
├── lib/
│   ├── server/
│   │   ├── controller/      # 서버 비즈니스 로직 + AI 코딩 가이드
│   │   └── backend/         # 서버 데이터 처리
│   │       ├── dynamodb/    # DynamoDB 모듈 + AI 코딩 가이드
│   │       └── workerkv/    # Workers KV 모듈 + AI 코딩 가이드
│   └── client/
│       ├── controller/      # 클라이언트 비즈니스 로직 + AI 코딩 가이드
│       └── backend/
│           └── dexiejs/     # IndexedDB 모듈 + AI 코딩 가이드
```

상세 규칙은 [`RULES.md`](./RULES.md)를 참조하세요.

## AI 협업

각 모듈 폴더에 `AI_CODING_GUIDE.md`가 포함되어 있습니다. AI 코딩 도구가 새로운 테이블이나 모델을 생성할 때 이 가이드를 참조하면, 프로젝트 전체에서 일관된 코드를 생성할 수 있습니다.

- **`RULES.md`** — 프로젝트 전체 규칙 (헌법)
- **`AI_CODING_GUIDE.md`** — 모듈별 세부 규칙 (법률)

## 라이선스

[MIT](./LICENSE)
