const  selectable = {
    operations: [{
        name:'批量',
        func:(args) => {
            return Promise.resolve()
        },
        // checkDisable: (keys, records) => {
        //     return true
        // }
    }]
}


export default {
    filter: {
        items: [
            {
                attr: 'field1',
                name: '字段1',
                default: 'foo'
            },
            {
                attr: 'field2',
                name: '字段2',
            },
            {
                attr: ['begin', 'end'],
                name: '时间',
                compName: 'DateRangePicker'
            }
        ],
        appendActs: [
            {name:'test', func({dataInput}) {
                console.log(dataInput)
            }}
        ]
    },
    service(params) {
        console.log(params)
        return new Promise(resolve=>{
            setTimeout(() => {
                resolve({data: {list: Array.from(new Array(10)).map((_,i) => {
                    return {id:i, key:i, time:'2020-12-12'}
                }) ,total:100}})
            }, 600);
        })
    },
    cols: [
        {title: "ID", dataIndex:'id'},
        {title: "Time", dataIndex:'time'},
        {
            title: "操作", 
            operations: [
                {name:'view', func:({record})=>location.href= './demo/view?id='+record.id},
                {name:'edit', vis:record=>record.id>1, func:({record})=>location.href= './demo/edit?id='+record.id},
                {
                    name: 'del', 
                    confirm: (record, doQry) => ({
                        content: `确定删除${record.id}?`,
                        onOk() {
                            doQry()
                        }
                    })
                }
            ],
        }
    ],
    selectable,
    operations: [
        {name:'简单表单', func:_=>location.href= './demo/quickForm'},
        {name:'复杂表单', func:_=>location.href= './demo/form'},
        {name:'log', func({getCurQryParams}) {
            console.log(getCurQryParams())
        }},
    ],
    page: {
        pageNum: 1,
        pageSize: 20
    }
}