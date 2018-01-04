<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '设备管理',
                        subs: [
                            {
                                index: 'productManager',
                                title : '产品管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '订单管理',
                        subs: [
                            {
                                index: 'orderList',
                                title: '订单管理'
                            },
                            {
                                index: 'goodsList',
                                title: '信息编辑'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '3',
                        title: '反馈管理',
                        subs: [
                            {
                                index: 'feedBackList',
                                title: '意见反馈'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: '4',
                        title: '用户中心',
                        subs: [
                            {
                                index: 'mailList',
                                title: '通知信息'
                            },
                            {
                                index: 'memberList',
                                title: '会员信息'
                            },
                            {
                                index: 'memberRecordBrowse',
                                title: '浏览记录'
                            },
                            {
                                index: 'adminRecordAction',
                                title: '操作记录'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: '5',
                        title: '系统统计',
                        subs: [
                            {
                                index: 'dataList',
                                title: '数据表'
                            },
                            {
                                index: 'basecharts',
                                title: '折线图'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: '5',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'systemlog',
                                title: '系统日志'
                            },
                            {
                                index: 'addNewRecord',
                                title: '新增通知'
                            }
                        ]
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
