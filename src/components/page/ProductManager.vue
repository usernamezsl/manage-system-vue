<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-button type="primary" icon="add" class="handle-del mr10" @click="addData">添加产品</el-button>
            <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="sncode" label="ID" sortable width="120">
            </el-table-column>
            <el-table-column prop="alias" label="产品名称" width="180">
            </el-table-column>
            <el-table-column prop="des" label="描述" width="180">
            </el-table-column>
            <el-table-column prop="state" label="绑定状态" width="100">
            </el-table-column>
            <el-table-column prop="online" label="运行状态" width="100">
            </el-table-column>
            <el-table-column prop="addtimeString" label="添加时间" width="150">
            </el-table-column>
            <el-table-column label="操作" width="220">
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
        <el-dialog title="产品编辑" :visible.sync="dialogFormEditVisible">
            <el-form :model="form">
                <el-form-item label="产品id:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.sncode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品名称:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.alias" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品描述:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.desc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEditVisible = false">重 置</el-button>
                <el-button type="primary" @click="handleEditForm">提 交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="产品添加" :visible.sync="dialogFormAddVisible">
            <el-form :model="form">
                <el-form-item label="产品id:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.sncode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品名称:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.alias" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品描述:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.desc" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品类别" :label-width="formLabelWidth">
                <el-select v-model="dialogAddForm.type" placeholder="请选择产品类别">
                <el-option label="禽类养殖设备" value="0"></el-option>
                <el-option label="食用菌大棚设备" value="1"></el-option>
                <el-option label="鸡腿菇种植设备" value="2"></el-option>
                <el-option label="农作物大棚设备" value="3"></el-option>
                <el-option label="鶵鸡养殖设备" value="4"></el-option>
                <el-option label="酒窖监控设备" value="5"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAddVisible = false">重 置</el-button>
                <el-button type="primary" @click="addDataForm">提 交</el-button>
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
                <el-button type="primary" @click="deleteForm">确 定</el-button>
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
                dialogFormEditVisible: false,
                dialogFormAddVisible : false,
                dialogVisible: false,
                totalItems: 0,
                filterTableDataEnd:[],
                formLabelWidth: '120px',
                dialogEditForm: {
                    desc: '',
                    alias: '',
                    sncode: ''
                },
                dialogAddForm: {
                    type: [],
                    desc: '',
                    alias: '',
                    sncode: ''
                },
                dialogDeleteForm:{
                    sncode: ''
                },
                flag:false
            }
        },
        created: function () {
            var tableData = [];
            let _this = this;
            this.$axios.get('http://localhost:8080/getProductVue')
                .then(function (response) {
                    var jsonObject = response.data;
                    var  resultData = jsonObject.data;
                    for (var i = 0;i < resultData.length;i++){
                        var  obj = {};
                        obj.sncode = resultData[i].sncode;
                        obj.alias = resultData[i].alias;
                        obj.des = resultData[i].des;
                        if (resultData[i].bind == '0'){
                            obj.state = '未绑定';
                        }else if (resultData[i].bind == '1'){
                            obj.state = '已绑定';
                        }
                        if (resultData[i].online == '0'){
                            obj.online = '未运行';
                        }else if (resultData[i].online == '1'){
                            obj.online = '已运行';
                        }
                        obj.addtimeString = resultData[i].addtimeString;
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
                var data = this.tableDataEnd[index];
                var sncode = data.sncode;
                var desc = data.des;
                var  alias = data.alias;
                this.dialogEditForm.sncode = sncode;
                this.dialogEditForm.alias = alias;
                this.dialogEditForm.desc = desc;
            },
            handleEditForm(){
                var sncode = this.dialogEditForm.sncode;
                var desc = this.dialogEditForm.desc;
                var  alias = this.dialogEditForm.alias;
                var form_data= Qs.stringify(this.dialogEditForm);
                this.dialogFormEditVisible = false;
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/editDevice',
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
                var tableData = [];
                let _this = this;
                this.$axios.get('http://localhost:8080/getProductVue')
                    .then(function (response) {
                        var jsonObject = response.data;
                        var  resultData = jsonObject.data;
                        for (var i = 0;i < resultData.length;i++){
                            var  obj = {};
                            obj.sncode = resultData[i].sncode;
                            obj.alias = resultData[i].alias;
                            obj.des = resultData[i].des;
                            if (resultData[i].bind == '0'){
                                obj.state = '未绑定';
                            }else if (resultData[i].bind == '1'){
                                obj.state = '已绑定';
                            }
                            if (resultData[i].online == '0'){
                                obj.online = '未运行';
                            }else if (resultData[i].online == '1'){
                                obj.online = '已运行';
                            }
                            obj.addtimeString = resultData[i].addtimeString;
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
                var data = this.tableDataEnd[index];
                var sncode = data.sncode;
                this.dialogDeleteForm.sncode = sncode;
                this.dialogVisible = true;
            },
            deleteForm(){
                this.dialogVisible = false;
                var form_data= Qs.stringify(this.dialogDeleteForm);
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/deleteProductListVue',
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

                var tableData = [];
                let _this = this;
                this.$axios.get('http://localhost:8080/getProductVue')
                    .then(function (response) {
                        var jsonObject = response.data;
                        var  resultData = jsonObject.data;
                        for (var i = 0;i < resultData.length;i++){
                            var  obj = {};
                            obj.sncode = resultData[i].sncode;
                            obj.alias = resultData[i].alias;
                            obj.des = resultData[i].des;
                            if (resultData[i].bind == '0'){
                                obj.state = '未绑定';
                            }else if (resultData[i].bind == '1'){
                                obj.state = '已绑定';
                            }
                            if (resultData[i].online == '0'){
                                obj.online = '未运行';
                            }else if (resultData[i].online == '1'){
                                obj.online = '已运行';
                            }
                            obj.addtimeString = resultData[i].addtimeString;
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
            addData(){
                this.dialogFormAddVisible = true;
            },
            addDataForm(){
                var alias =  this.dialogAddForm.alias;
                var desc = this.dialogAddForm.desc;
                var sncode = this.dialogAddForm.sncode;
                var  type = this.dialogAddForm.type[0];
                var data = Qs.stringify({
                    "alias":alias,
                    "desc":desc,
                    "sncode":sncode,
                    "type":type
                });
                this.dialogFormAddVisible = false;
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/addDevice',
                    responseType:'json',
                    data:data,
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
                        this.dialogFormAddVisible = false;
                    });

                var tableData = [];
                let _this = this;
                this.$axios.get('http://localhost:8080/getProductVue')
                    .then(function (response) {
                        var jsonObject = response.data;
                        var  resultData = jsonObject.data;
                        for (var i = 0;i < resultData.length;i++){
                            var  obj = {};
                            obj.sncode = resultData[i].sncode;
                            obj.alias = resultData[i].alias;
                            obj.des = resultData[i].des;
                            if (resultData[i].bind == '0'){
                                obj.state = '未绑定';
                            }else if (resultData[i].bind == '1'){
                                obj.state = '已绑定';
                            }
                            if (resultData[i].online == '0'){
                                obj.online = '未运行';
                            }else if (resultData[i].online == '1'){
                                obj.online = '已运行';
                            }
                            obj.addtimeString = resultData[i].addtimeString;
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
