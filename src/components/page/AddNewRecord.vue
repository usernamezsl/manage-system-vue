<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="通知内容:">
            <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">立即发送</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
    <!--<div>-->
        <!--<el-dialog-->
            <!--title="提示"-->
            <!--:visible.sync="dialogVisible"-->
            <!--width="10%"-->
            <!--:before-close="handleClose">-->
            <!--<span>提交成功</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    <!--</div>-->

</template>

<script>

    import axios from 'axios';
    import Qs from 'qs'
    export default {
        data() {
            return {
                form: {
                    content: '填写发送通知内容~'
                },
//                dialogVisible:false
            }
        },
        created: function () {

        },
        methods: {
            onSubmit() {
                var form_data= Qs.stringify(this.form);
                this.$axios({
                    method:'post',
                    url:'http://localhost:8080/sendMsgVue',
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
                        alert("发送成功！")
                    }
                })
                    .catch(function (error) {
                        console.log("发生错误了");
                        this.dialogFormEditVisible = false;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
