<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户中心</el-breadcrumb-item>
                <el-breadcrumb-item>浏览记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="80">
            </el-table-column>
            <el-table-column prop="time" label="用户名" width="160">
            </el-table-column>
            <el-table-column prop="content" label="浏览内容" width="250">
            </el-table-column>
            <el-table-column prop="timeString" label="访问时间" width="250">
            </el-table-column>
            <el-table-column prop="content" label="URL" width="200">
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
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="10%"
            :before-close="handleClose">
            <span>确认要删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDeleteForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import axios from 'axios';
    import Qs from 'qs'
    export default {
        data() {
            return {
                tableDataBegin: [
                ],
                tableDataName: "",
                tableDataEnd: [],
                currentPage: 1,
                dialogVisible:false,
                pageSize: 10,
                totalItems: 0,
                filterTableDataEnd:[],
                flag:false,
                dialogDeleteForm:{
                    id:''
                }
            }
        },
        created: function () {
            var data = [];
            let _this = this;
            this.$axios.get('http://localhost:8080/getUserRecordVue')
                .then(function (response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    _this.tableDataBegin = resultData;
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
                var to = pageSize * currentPage;
                //清空当前数据
                tableDataEnd.splice(0,tableDataEnd.length)
                for (var from;from<to;from++){
                    tableDataEnd.push(tableDataBegin[from])
                }
            },
//            getData(){
//                let self = this;
//                if(process.env.NODE_ENV === 'development'){
//                    self.url = '/ms/table/list';
//                };
//                self.$axios.post(self.url, {page:self.cur_page}).then((res) => {
//                    self.tableData = res.data.list;
//                })
//            },
            search(){
                //搜索处理逻辑
                this.is_search = true;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
//                this.$message.error('删除第'+(index+1)+'行');
                this.dialogDeleteForm.id = this.tableDataEnd[index].id;
                this.dialogVisible = true;
            },
            handleDeleteForm(){
                var form_data= Qs.stringify(this.dialogDeleteForm);
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/deleteUserRecordVue',
                    responseType:'json',
                    data:form_data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    if (jsonObject.code == 0){
                        console.log(jsonObject.msg);
                    }
                })
                .catch(function (error) {
                    console.log("发生错误了");
                    this.dialogFormEditVisible = false;
                });
                this.dialogVisible = false;
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
