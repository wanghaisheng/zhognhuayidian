const DebugPage = () => {
  return (
    <div style={{ 
      padding: '50px', 
      background: 'red', 
      color: 'white', 
      fontSize: '24px',
      fontWeight: 'bold',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 9999
    }}>
      <h1>DEBUG PAGE</h1>
      <p>如果你能看到这个红色背景的页面，说明路由工作正常</p>
      <p>当前时间: {new Date().toLocaleString()}</p>
      <div style={{ 
        background: 'yellow', 
        color: 'black', 
        padding: '20px',
        margin: '20px 0'
      }}>
        这是一个黄色方块，应该非常明显
      </div>
    </div>
  )
}

export default DebugPage
