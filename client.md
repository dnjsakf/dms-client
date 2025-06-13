### Component 구성
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (main)/
│   │   │   │   └── layout.js
│   │   │   ├── 웹 화면의 기본 구성을 정의
│   │   │   ├── 전역 CSS는 이 곳에서 로드
│   │   │   └── SSR 이므로 Client용 컴포넌트는 사용할 수 없음
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   └── TopMenuBar.js
│   │   │   ├── tree/
│   │   │   │   └── MenuTree.js
│   │   │   └── ClientOnly.js
│   │   ├── context/
│   │   │   └── 
│   │   ├── hooks/
│   │   │   ├── 모든 컴포넌트에서 동일한 동작을 하도록 기능을 제공
│   │   ├── services/
│   │   │   └── common/
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── layoutStore.js
│   │   │   └── windowStore.js
│   │   ├── utils/
│   │   │   ├── commonUtil.js
│   │   │   ├── jwtUtil.js
│   │   │   └── menuUtil.js
│   │   └── styles/
│   │   │   └── global.css
│   │   └── listeners/
│   │       └── WindowEventListener.js
│   ├── client.md