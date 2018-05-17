<template>
    <app-card class="task-box">
        <template slot="headerLeft">{{$t("task.title")}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoTaskList"></icon>
        </template>
        <template slot="content">
            <div class="inner-content" v-if="list.length&&!loading">
                <div class="app-task-main">
                    <app-task-item :item="item" v-for="(item,index) in list" :key="index"></app-task-item>
                </div>
            </div>
            <div class="inner-content loading-content" v-else>
                <inline-loading v-if="loading"></inline-loading>
                <no-data v-else :nodataText="nodataText"></no-data> 
            </div> 
            <!-- <div class="app-task-footer">添加任务</div> -->
        </template>
        <template slot="footer">
            <app-button @click.native="createTask" shape="circle">{{$t('task.createTask')}}</app-button>
        </template>
    </app-card>
</template>
<script>
import Icon from '../../common/icon/index'
import AppCard from '../../common/card/index'
import AppButton from '../../common/button/index'
import { checkbox, checkboxGroup } from '../../common/checkbox/'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import AppTaskItem from './taskItem'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        AppButton,
        inlineLoading,
        noData,
        AppTaskItem
    },
    props: {
        appSystem: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            httpCfm: {
                url: {
                    taskList:
                        '[javaApi]/task/workbench/getTaskListForWorkbench', //获取数据接口地址
                    taskCreate: '[javaApi]/task/index/createTask' //获取数据接口地址
                },
                params: {
                    //请求数据配置参数
                    pageSize: 4, //条数
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'task_list', //缓存数据键名
            list: [], //列表数据
            loading: false,
            nodataText: this.$t('task.noDataText'),
            cFlag:false
        }
    },
    computed: {},
    methods: {
        gotoTaskList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        getList() {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.httpCfm.params.hash = storeData.hash || ''
            this.loading = this.list.length > 0 ? false : true
            this.$http
                .get(this.httpCfm.url.taskList, { params: this.httpCfm.params })
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list =[]    
                    this.list = reData
                    this.list.splice(0,0)
                    this.resetData(reData, hash)
                    this.loading = false
                })
                .catch(data => {
                    this.loading = false
                })
        },
        createTask() {
            if(!this.cFlag){
                this.cFlag = true
                this.$http.get(this.httpCfm.url.taskCreate)
                .then(res => {
                    let url = res.data.data
                    this.Util.YYBridge.do(
                        'openWindow',
                        { orientation: 0, url: url },
                        rs => {
                            // 打开后回调
                        }
                    )
                    setTimeout(()=>{
                        this.cFlag = false
                    },3000)
                })
                .catch(data => {
                    this.cFlag = false
                })
                
            }else{
                return
            }
        },
        resetData(list, hash) {
            let data = {
                list: list,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName,
                data: data
            })
            return list
        }
    },
    created() {
        this.getList()
    },
    mounted() {
        this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.getList()
            }
        })
        // this.$eventbus.$on('updateCommonList.commonList', () => {
        //     this.getList()
        // })
    }
}
</script>
<style scoped>
.task-box>>>.footer {
    position: relative;
    height: 160px;
}
.task-box>>>.footer .app-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
<style lang="less" scoped>
.words() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.task-box {
    .inner-content {
        height: 252px;
    }
    .loading-content {
        text-align: center;
        height: 252px;
        line-height: 252px;
    }
    .app-task-main {
        width: 100%;
        padding: 0 47px;
        overflow: hidden;
    }
    .app-task-footer {
        width: 166px;
        height: 60px;
        color: #333333;
        line-height: 60px;
        border-radius: 60px;
        font-size: 28px;
        background: #f2f2f2;
        text-align: center;
        margin: 62px auto 47px;
    }
}
</style>
