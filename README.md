# 🍉 수박게임 (Suika Game)


> 과일을 합쳐 수박을 만들어보세요! 🍉  
> **[지금 플레이하기 →](https://suika-game-mauve.vercel.app/)**

Matter.js 물리 엔진을 활용해 구현한 웹 기반 수박게임입니다.  
같은 과일끼리 충돌하면 다음 단계 과일로 합쳐지며, 게임오버 라인을 넘지 않도록 관리하는 것이 핵심입니다.

<br />
<br />

## 🎮 게임 규칙

1. 마우스를 움직여 과일 위치를 조정합니다  
2. 클릭하면 과일이 떨어집니다  
3. **같은 종류의 과일**이 만나면 더 큰 과일로 합쳐집니다  
4. 과일이 **게임오버 라인**을 넘으면 게임 종료  

<br />
<br />

## 🍊 과일 단계
```
블루베리 → 딸기 → 레몬 → 사과 → 복숭아 → 오렌지 → 파인애플 → 수박
```

<br />
<br />

## ✨ 주요 기능

- 🧲 Matter.js 기반 물리 충돌 처리
- 🔄 같은 과일 합체 시스템
- 🎯 점수 시스템
- 👀 다음 과일 미리보기
- 🚫 게임오버 판정 로직
- 🔁 리스타트 기능
- 🖱 마우스 기반 인터랙션

<br />
<br />

## 🛠 기술 스택

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Matter.js](https://img.shields.io/badge/Matter.js-0.20-yellow)](https://brm.io/matter-js/)
[![Deploy](https://img.shields.io/badge/Play%20Now-Vercel-black?logo=vercel)](https://suika-game-pearl.vercel.app/)

| 분류 | 기술 |
|------|------|
| 프레임워크 | **Next.js (App Router)** |
| 언어 | **TypeScript** |
| 물리 엔진 | **Matter.js** |
| 스타일링 | **Tailwind CSS** |
| 배포 | **Vercel** |

<br />
<br />

## 📁 프로젝트 구조
src/<br />
├── app/<br />
│   ├── layout.tsx<br />
│   ├── page.tsx<br />
│   └── globals.css<br />
├── components/<br />
│   ├── SuikaGameCanvas.tsx   # 게임 로직 + 렌더링<br />
│   └── SuikaGameLoader.tsx   # dynamic import (SSR 비활성화)<br />
├── game/<br />
│   └── engine.ts             # Matter.js 엔진 및 벽 설정<br />

<br />
<br />

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 실행
npm start
