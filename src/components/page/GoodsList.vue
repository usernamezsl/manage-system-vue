<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>信息编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="addData">添加产品</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr20"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableDataEnd" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" sortable width="80">
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="150">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100">
            </el-table-column>
            <el-table-column prop="lost" label="剩余数量" width="100">
            </el-table-column>
            <el-table-column prop="num" label="交易量" width="150">
            </el-table-column>
            <el-table-column prop="context" label="描述" width="150">
            </el-table-column>
            <el-table-column prop="url" label="图片地址" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
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
                :page-sizes="[2, 4, 6, 8]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>
        </div>
        <el-dialog title="产品编辑" :visible.sync="dialogFormEditVisible">
            <el-form :model="form">
                <el-form-item label="商品名称:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品价格:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品数目:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.lost" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品描述:" :label-width="formLabelWidth">
                    <el-input v-model="dialogEditForm.context" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormEditVisible = false">重 置</el-button>
                <el-button type="primary" @click="handleEditForm">提 交</el-button>
            </div>
        </el-dialog>
        <el-dialog title="产品添加" :visible.sync="dialogFormAddVisible">
            <el-form :model="form">
                <el-form-item label="商品名称:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品价格:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.price" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品数目:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.lost" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="产品描述:" :label-width="formLabelWidth">
                    <el-input v-model="dialogAddForm.context" auto-complete="off"></el-input>
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
                dialogVisible:false,
                pageSize: 2,
                totalItems: 0,
                filterTableDataEnd:[],
                dialogFormEditVisible: false,
                dialogFormAddVisible : false,
                formLabelWidth: '120px',
                dialogEditForm: {
                    name: '',
                    price: '',
                    lost: '',
                    context: ''
                },
                dialogAddForm: {
                    name: '',
                    price: '',
                    lost: '',
                    context: ''
                },
                dialogDeleteForm:{
                    sncode: ''
                },
                flag:false

            }
        },
        created: function () {
            this.queryInfo();
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
                debugger;
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
                    var data = tableDataBegin[from];
                    if (typeof(data) != undefined){
                        tableDataEnd.push(data);
                    }
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
//                this.$message('编辑第'+(index+1)+'行');
                this.dialogFormEditVisible = true;
                var data = this.tableDataEnd[index];
                var name = data.name;
                var price = data.price;
                var  lost = data.lost;
                var context = data.context;
                this.dialogEditForm.name = name;
                this.dialogEditForm.price = price;
                this.dialogEditForm.lost = lost;
                this.dialogEditForm.context = context;
            },
            handleEditForm(){
                this.dialogFormEditVisible = false;
            },
            handleDelete(index, row) {
//                this.$message.error('删除第'+(index+1)+'行');
                this.dialogVisible = true;
                var data= Qs.stringify(this.dialogEditForm);
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
                this.queryInfo;
            },
            deleteForm(){

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
            },
            addData(){
                this.dialogFormAddVisible = true;
            },
            addDataForm(){
                var data = Qs.stringify(this.dialogAddForm);
                this.dialogFormAddVisible = false;
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/addGoodsVue',
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
                this.queryInfo();
            },
            queryInfo(){
                var data = [];
                let _this = this;
                this.$axios.get('http://localhost:8080/getGoodsVue')
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
            handleClose(){

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
