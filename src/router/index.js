import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/ProductManager.vue'], resolve)
                },
                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve)
                },
                {
                    path: '/vuetable',
                    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/baseform',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                },
                {
                    path: '/vueeditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/productManager',
                    component: resolve => require(['../components/page/ProductManager.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/orderList',
                    component: resolve => require(['../components/page/OrderList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/goodsList',
                    component: resolve => require(['../components/page/GoodsList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/feedBackList',
                    component: resolve => require(['../components/page/FeedBackList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/mailList',
                    component: resolve => require(['../components/page/MainlList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/memberList',
                    component: resolve => require(['../components/page/MemberList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/memberRecordBrowse',
                    component: resolve => require(['../components/page/MemberRecordBrowse.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/adminRecordAction',
                    component: resolve => require(['../components/page/AdminRecordAction.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/dataList',
                    component: resolve => require(['../components/page/DataList.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/systemLog',
                    component: resolve => require(['../components/page/SystemLog.vue'], resolve)    // 拖拽列表组件
                },{
                    path: '/addNewRecord',
                    component: resolve => require(['../components/page/AddNewRecord.vue'], resolve)    // 拖拽列表组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
