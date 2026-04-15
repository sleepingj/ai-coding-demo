
window.fetch = (params) => {
    console.log(params)
    return Promise.resolve({json: () => Promise.resolve({
        data: {
            list: [
                {name: '张三', email: 'zhangsan@example.com'}
            ]
        }
    })});
}

export default {
  compName: 'EahContainer',
  props: {
    eahConfig: {
      data: [{ name: 'pageTitle', value: '管理后台' }]
    }
  },
  children: [
    {
      compName: 'EahDataFactory',
      props: {
        eahConfig: {
          nameSpace: 'userList',
          type: 'query',
          reqConfig: { url: '/api/users' }
        }
      }
    },
    {
      compName: 'EahContainer',
      props: { style: { padding: 20 } },
      children: [
        {
          compName: 'Recorder',
          props: { 
            title: '{container.pageTitle}',
            record: {} 
          }
        },
        {
          compName: 'Button',
          props: {
            children: '刷新列表',
            onClick: { triggerName: 'query-userList' }
          }
        },
        {
          compName: 'Lister',
          props: {
            // Lister 会自动从数据源 userList 获取数据并渲染
            dataSource: '{userList.data.list}',
            cols: [
              { title: '姓名', dataIndex: 'name' },
              { title: '邮箱', dataIndex: 'email' }
            ]
          }
        }
      ]
    }
  ]
}