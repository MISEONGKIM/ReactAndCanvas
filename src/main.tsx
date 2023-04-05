import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // 앱 내에 잠재적 문제를 알아내기 위한 도구. 불필요한 렌더링이 많이 일어나는 등 파악하기 위해 dev용 컴포넌트.
  // 자체적으로 검사를 위해 두번 렌더링 발생시킴.프로덕션 용으로 앱 빌드시에는 작동안함 ! 
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
