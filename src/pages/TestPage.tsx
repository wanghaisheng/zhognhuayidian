const TestPage = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个页面，说明路由工作正常</p>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        background: 'linear-gradient(45deg, #2E8B57, #B8860B)',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        测试元素
      </div>
    </div>
  )
}

export default TestPage
