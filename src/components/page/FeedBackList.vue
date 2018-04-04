<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 反馈管理</el-breadcrumb-item>
                <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="80">
            </el-table-column>
            <el-table-column prop="nickName" label="用户名" width="200">
            </el-table-column>
            <el-table-column prop="content" label="反馈内容" width="260">
            </el-table-column>
            <el-table-column prop="state" label="处理状态" width="150">
            </el-table-column>
            <el-table-column prop="timeString" label="反馈时间" width="200">
            </el-table-column>
            <el-table-column label="操作" width="250">
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
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>
        </div>
        <el-dialog title="编辑回复" :visible.sync="dialogFormEditVisible">
            <el-form :model="form">
                <el-form-item label="回复内容:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.backtext" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEditVisible = false">重 置</el-button>
                <el-button type="primary" @click="solveSubmit">提 交</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="20%"
            :before-close="handleClose">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
                pageSize: 10,
                totalItems: 0,
                filterTableDataEnd:[],
                dialogVisible:false,
                flag:false,
                formLabelWidth: '120px',
                dialogFormEditVisible : false,
                dialogEditForm: {
                    cid:'',
                    backtext: '好的,已收到！'
                }
            }
        },
        created: function () {
            var tableData = [];
            let _this = this;
            this.$axios.get('http://localhost:8080/getProblemsVue')
                .then(function (response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    for (var i = 0;i < resultData.length;i++){
                        var  obj = {};
                        obj.id = resultData[i].id;
                        if (resultData[i].id == 1){
                            obj.nickName = '15695983201';
                        }else if (resultData[i].id == 3){
                            obj.nickName = '15695983201';
                        }else {
                            obj.nickName = '15695983201';
                        }
                        obj.content = resultData[i].content;
                        if (resultData[i].state == '0'){
                            obj.state = '未处理';
                        }else {
                            obj.state = '已处理';
                        }
                        obj.timeString = resultData[i].timeString;
                        tableData.push(obj);
                    }
                    _this.tableDataBegin = tableData;
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
                //搜索处理逻辑
                this.is_search = true;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
//                this.$message('编辑第'+(index+1)+'行');
                this.dialogFormEditVisible = true;
                this.dialogEditForm.cid = this.tableDataEnd[index].id;
            },
            solveSubmit(){
                var form_data= Qs.stringify(this.dialogEditForm);
                this.dialogFormEditVisible = false;
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/solveSubmitVue',
                    responseType:'json',
                    data:form_data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    debugger;
                    if (jsonObject.code == 0){

                    }
                })
                    .catch(function (error) {
                        console.log("发生错误了");
                        this.dialogFormEditVisible = false;
                    });

                var tableData = [];
                let _this = this;
                this.$axios.get('http://localhost:8080/getProblemsVue')
                    .then(function (response) {
                        var jsonObject = response.data;
                        var  resultData = jsonObject.data;
                        for (var i = 0;i < resultData.length;i++){
                            var  obj = {};
                            obj.id = resultData[i].id;
                            if (resultData[i].id == 1){
                                obj.nickName = '15695983201';
                            }else if (resultData[i].id == 3){
                                obj.nickName = '15695983201';
                            }else {
                                obj.nickName = '15695983201';
                            }
                            obj.content = resultData[i].content;
                            if (resultData[i].state == '0'){
                                obj.state = '未处理';
                            }else {
                                obj.state = '已处理';
                            }
                            obj.timeString = resultData[i].timeString;
                            tableData.push(obj);
                        }
                        _this.tableDataBegin = tableData;
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
