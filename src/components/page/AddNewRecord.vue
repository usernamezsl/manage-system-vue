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
</template>

<script>

    import axios from 'axios';
    export default {
        data() {
            return {
                form: {
                    content: '填写发送通知内容~'
                }
            }
        },
        created: function () {

        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>

<style scoped>

</style>
