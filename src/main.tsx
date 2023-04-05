import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // �� ���� ������ ������ �˾Ƴ��� ���� ����. ���ʿ��� �������� ���� �Ͼ�� �� �ľ��ϱ� ���� dev�� ������Ʈ.
  // ��ü������ �˻縦 ���� �ι� ������ �߻���Ŵ.���δ��� ������ �� ����ÿ��� �۵����� ! 
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
