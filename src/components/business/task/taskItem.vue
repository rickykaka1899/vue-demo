<template>
    <div :class="['app-task-item']">
        <checkbox
                :value="nowStatus"
                :valueCallBack="valueCallBack"
                class="checkbox-inner"
                :class="item.status == 1 ? 'task-progress' : ''"
                :disabled="(item.taskRole == 1 || item.taskRole == 2) ? false : true">
        </checkbox>
        <div :class="nowStatus == true ? 'task-complete' : ''" class="checkbox-label" v-html="item.name">
        </div>
        <div v-if="item.status == 5" class="checkbox-status">已延期</div>
    </div>
</template>
<script>
    import {checkbox, checkboxGroup} from '../../common/checkbox/'
    export default {
        components: {
            checkbox,
            checkboxGroup,
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            item: {
                type: Object,
                default : {}
            }
        },
        data(){
            return {
                baseUrl : {
                    doneUrl :  '[javaApi]/task/workbench/done',
                    restartUrl :  '[javaApi]/task/workbench/restart',
                },
                nowStatus:false
            }
        },
        methods: {
            valueCallBack(value){
                if(value){
                    this.doneTask(value)
                }else {
                    this.restartTask(value)
                }
            },
            doneTask(value){
                let params = new URLSearchParams()
                params.append('taskId', this.item.id)
                this.$http.post(this.baseUrl.doneUrl, params).then(res => {
                    this.nowStatus = true
                }).catch(data => {

                })
            },
            restartTask(value){
                let params = new URLSearchParams()
                params.append('taskId', this.item.id)
                this.$http.post(this.baseUrl.restartUrl, params).then(res => {
                    this.nowStatus = false
                }).catch(data => {

                })
            },

        },
        activated () {
        },
        mounted(){
        },
        created(){
        },
        watch: {
            item:function(val,old){
                this.nowStatus = false
            }
        }
    }
</script>
<style lang="less" scoped>
    .words(){
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
   
    .app-task-item{
        height: 38px;
        line-height: 38px;
        margin-top: 30px;
        font-size: 28px;
        color: #333;
        .words();
        .checkbox-inner{
            display: block;
            padding-right: 30px;
            float: left;
        }
        .checkbox-label{
            .words();
            float: left;
            display: block;
            max-width: 435px;
        }
        .task-progress{
            max-width: 535px;
        }
        .task-complete{
            text-decoration: line-through;
            color: #ccc;
        }
        .checkbox-status{
            padding: 0 5px;
            border: solid 2px #E14C46;
            color: #E14C46;
            margin-left: 10px;
            border-radius: 6px;
            vertical-align: middle;
            font-size: 18px;
            height: 28px;
            line-height: 30px;
            display: inline-block;
        }
    }
    .app-task-item:first-child{
        margin-top: 20px;
    }
</style>
