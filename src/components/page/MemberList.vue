<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户中心</el-breadcrumb-item>
                <el-breadcrumb-item>会员列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="80">
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="150">
            </el-table-column>
            <el-table-column prop="phone" label="手机" width="130">
            </el-table-column>
            <el-table-column prop="lastip" label="最后登录IP" width="150">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="120">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="120">
            </el-table-column>
            <el-table-column prop="regdateString" label="注册时间" width="150">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                :page-sizes="[8, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogFormEditVisible">
            <el-form :model="form">
                <el-form-item label="账号:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.user" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.pass2" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEditVisible = false">重 置</el-button>
                <el-button type="primary" @click="dialogFormEditVisible = false">提 交</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="10%"
            :before-close="handleClose">
            <span>确认要删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
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
                pageSize: 8,
                totalItems: 0,
                filterTableDataEnd:[],
                flag:false,
                formLabelWidth: '120px',
                dialogEditForm: {
                    user: '当前用户名',
                    pass: '',
                    pass2: ''
                },
                dialogFormEditVisible :false,
                dialogVisible:false
            }
        },
        created: function () {
            var data = [];
            let _this = this;
//            Vue.prototype.$axios = axios;
            this.$axios.get('http://localhost:8080/getAllCommonUserVue')
                .then(function (response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    debugger;
                    for (var i=0; i<resultData.length; i++){
                        var obj = {};
                        obj.username = resultData[i].username;
                        obj.phone = resultData[i].phone;
                        obj.id = resultData[i].id;
                        obj.lastip = resultData[i].lastip;
                        obj.email = resultData[i].email;
                        obj.address = resultData[i].address;
                        obj.regdateString = resultData[i].regdateString;
                        data[i] = obj;
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
                //当前页码
                var currentPage = this.currentPage;
                //每页数量
                var pageSize = this.pageSize;
                //数据总量
                var tableDataBegin = this.tableDataBegin;
                //最终渲染当前页的数据
                var tableDataEnd = this.tableDataEnd;
                //当前页数据起始索引
                var from = pageSize * (currentPage - 1);
                //当前页数据遍历数目
                var to = pageSize * currentPage - 1;
                //清空当前数据
                tableDataEnd.splice(0,tableDataEnd.length)
                for (var from;from<to;from++){
                    tableDataEnd.push(tableDataBegin[from])
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
//                this.$message('编辑第'+(index+1)+'行');
                this.dialogFormEditVisible = true;
            },
            handleDelete(index, row) {
//                this.$message.error('删除第'+(index+1)+'行');
                this.dialogVisible = true;
            },
            delAll(){
//                const self = this,
//                    length = self.multipleSelection.length;
//                let str = '';
//                self.del_list = self.del_list.concat(self.multipleSelection);
//                for (let i = 0; i < length; i++) {
//                    str += self.multipleSelection[i].name + ' ';
//                }
//                self.$message.error('删除了'+str);
//                self.multipleSelection = [];
                this.dialogVisible = true;
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
