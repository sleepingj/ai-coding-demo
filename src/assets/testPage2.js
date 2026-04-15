
export default {
  compName: 'EahContainer',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: 16,
    },
    eahConfig: {
      data: [{ name: 'counter', value: 0 }],
    },
  },
  children: [
    {
      compName: 'EahTrigger',
      props: {
        eahConfig: {
          triggerName: 'update-counter',
          triggerCode: (_, eahContext) => {
            const nextCounter = (eahContext?.data?.counter || 0) + 1;
            eahContext?.setData?.({ counter: nextCounter });
          },
        },
      },
    },
    {
      compName: 'Button',
      props: {
        children: '点击按钮更新变量',
        onClick: { triggerName: 'update-counter' },
      },
    },
    {
      compName: 'Recorder',
      props: {
        title: '当前变量值：{container.counter}',
        record: {},
      },
    },
  ],
}