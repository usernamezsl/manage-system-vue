<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="150">
            </el-table-column>
            <el-table-column prop="userId" label="用户号" width="200">
            </el-table-column>
            <el-table-column prop="orderNum" label="订单号" width="200">
            </el-table-column>
            <el-table-column prop="context" label="内容" width="250">
            </el-table-column>
            <el-table-column prop="stringTime" label="时间" width="150">
            </el-table-column>
            <el-table-column prop="state" label="处理状态" width="150">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    import axios from 'axios';
    export default {
        data() {
            return {
                tableDataBegin: [
                ],
                tableDataName: "",
                tableDataEnd: [],
                currentPage: 1,
                pageSize: 10,
                totalItems: 0,
                filterTableDataEnd:[],
                flag:false
            }
        },
        created: function () {
            var data = [];
            let _this = this;
//            Vue.prototype.$axios = axios;
            this.$axios.get('http://localhost:8090/getOrderVue')
                .then(function (response) {
                    if (response.data != null && response.data != ''){
                        for (let i = 0; i < response.data.length; i++) {
                            console.log(response.data);
                            console.log(response.data[i].user);
                            var obj = {};
                            if (response.data[i].id != '' && response.data[i].id != null && typeof(response.data[i].id) != undefined){
                                obj.id = response.data[i].id;
                            }
//                            if (response.data[i].user.id != '' && response.data[i].user.id != null &&
//                                typeof(response.data[i].user.id) != undefined){
//                                obj.userId = response.data[i].user.id;
//                            }
                            if (response.data[i].orderNum != '' && response.data[i].orderNum != null
                                && typeof(response.data[i].orderNum) != undefined){
                                obj.orderNum = response.data[i].orderNum;
                            }
                            if (response.data[i].context != '' && response.data[i].context != null &&
                                typeof(response.data[i].orderNum )!= undefined){
                                obj.context = response.data[i].context;
                            }
                            if (response.data[i].stringTime != '' && response.data[i].stringTime != null &&
                                typeof(response.data[i].stringTime )!= undefined){
                                obj.stringTime = response.data[i].stringTime;
                            }
                            if (response.data[i].state != '' && response.data[i].state != null &&
                                typeof(response.data[i].state )!= undefined){
                                obj.state = response.data[i].state;
                            }
                            data[i] = obj;
                        }
                    }
                    _this.tableDataBegin = data;
                    _this.totalItems = _this.tableDataBegin.length;
                    if (_this.totalItems > _this.pageSize) {
                        for (let index = 0; index < _this.pageSize; index++) {
                            _this.tableDataEnd.push(_this.tableDataBegin[index]);
                        }
                    } else {
                        _this.tableDataEnd = _this.tableDataBegin;
                    }
                }).catch(function (error) {
                console.log(error);
            });
        },
        methods: {
            //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
            //用两个变量接收currentChangePage函数的参数
            doFilter() {
                if (this.tableDataName == "") {
                    this.$message.warning("查询条件不能为空！");
                    return;
                }
                this.tableDataEnd = [];
                //每次手动将数据置空,因为会出现多次点击搜索情况
                this.filterTableDataEnd=[];
                this.tableDataBegin.forEach((value, index) => {
                    if(value.name){
                        if(value.name.indexOf(this.tableDataName)>=0){
                            this.filterTableDataEnd.push(value)
                        }
                    }
                });
                //页面数据改变重新统计数据数量和当前页
                this.currentPage=1;
                this.totalItems=this.filterTableDataEnd.length;
                //渲染表格,根据值
                this.currentChangePage(this.filterTableDataEnd);
                //页面初始化数据需要判断是否检索过
                this.flag=true
            },
            openData() {},
            handleSizeChange(val) {
                debugger;
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.handleCurrentChange(this.currentPage);
            },
            handleCurrentChange(val) {
                debugger;
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                //需要判断是否检索
                if(!this.flag){
                    this.currentChangePage(this.tableDataEnd)
                }else{
                    this.currentChangePage(this.filterTableDataEnd)
                }
            }, //组件自带监控当前页码
            currentChangePage(list) {
                let from = (this.currentPage - 1) * this.pageSize;
                let to = this.currentPage * this.pageSize;
                this.tableDataEnd = [];
                for (; from < to; from++) {
                    if (list[from]) {
                        this.tableDataEnd.push(list[from]);
                    }
                }
            },
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
</style>
