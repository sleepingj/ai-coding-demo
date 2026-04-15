import './App.css'
import { useState, useEffect } from 'react'
import PageRender from './PageRender'
import testConfig from './assets/testPage2'
// import testConfig from './assets/testLister'

const parentOrigin = 'http://localhost:5175'


function App() {
  const [config, setConfig] = useState(testConfig)
   useEffect(() => {
    // 监听 message 事件
    const handleMessage = (event) => {
      // 安全校验：只允许父域名发送消息
      if (event.origin !== parentOrigin) { 
        return;
      }
      const { type, config: newConfig } = event.data;
      console.log('✅ iframe 收到最新 config', newConfig);
      // 接收配置更新
      if (type === 'UPDATE_CONFIG') {
        setConfig(newConfig);
      }
    };
    // 绑定监听
    window.addEventListener('message', handleMessage);

    // 组件销毁时清理（必须写！）
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      <PageRender config={config} />
    </>
  )
}

export default App
