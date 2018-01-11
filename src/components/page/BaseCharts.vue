<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统统计</el-breadcrumb-item>
                <el-breadcrumb-item>统计图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="schart">
            <div class="content-title">折线图</div>
            <schart canvasId="line" width="1000" height="400" :data="data1" type="line" :options="options1"></schart>
        </div>
        <div class="schart">
            <div class="content-title">柱状图</div>
            <schart canvasId="bar" width="1000" height="400" :data="data1" type="bar" :options="options1"></schart>
        </div>
        <div class="schart">
        <div class="content-title">饼状图</div>
        <schart canvasId="pie" width="1000" height="400" :data="data2" type="pie" :options="options2"></schart>
        </div>
        <div class="schart">
        <div class="content-title">环形图</div>
        <schart canvasId="ring" width="1000" height="400" :data="data2" type="ring" :options="options2"></schart>
        </div>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    export default {
        components: {
            Schart
        },
        data: () => ({
            data1:[
                {name:'六天前',value:1141},
                {name:'五天前',value:1499},
                {name:'四天前',value:2260},
                {name:'三天前',value:1170},
                {name:'两天前',value:970},
                {name:'昨天',value:1450},
                {name:'今天',value:1450}
            ],
            data2 : [
                {name:'六天前',value:1141},
                {name:'五天前',value:1499},
                {name:'四天前',value:2260},
                {name:'三天前',value:1170},
                {name:'两天前',value:970},
                {name:'昨天',value:1450},
                {name:'今天',value:1450}
            ],
            options1: {
                title: '某段时间段内的设备数量',
                bgColor: '#009688',
                titleColor: '#ffffff',
                fillColor: '#e0f2f1',
                axisColor: '#ffffff',
                contentColor: '#999'
            },
            options2: {
                title: '某段时间段内的设备数量',
                bgColor: '#607d8b',
                titleColor: '#ffffff',
                legendColor: '#ffffff'
            }
        })
    }
</script>

<style scoped>
    .schart{
        width: 600px;
        display: inline-block;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

</style>
