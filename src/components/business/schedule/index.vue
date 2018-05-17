<template>
    <app-card class="schedule-box">
        <template slot="headerLeft">{{$t('schedule.title')}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoSheduleList"></icon>
        </template>
        <template slot="content">
            <div class="schedule-con">
                <app-schedule-week :scheduleCallBack="scheduleCallBack" :appSystem="appSystem">
                </app-schedule-week>
                <div  class="app-schedule-main">
                    <div v-if="list.length&&!loading">
                        <div class="schedule-padding-top"></div>
                        <app-schedule-flow :activeIndex="index" :type="item.type" v-for="(item,index) in list" :key="index">
                            <span slot="time" v-html="scheduleTime(item)"></span>
                            <span slot="content">
                                <span class="app-schedule-title">{{item.title}}</span>
                                <span class="app-schedule-bottom" v-html="roleHandle(item.role)"></span>
                                <span v-if="item.is_important == 1" class="app-schedule-imp">
                                    <icon cls-name="schedule-important"></icon>
                                </span>
                            </span>
                        </app-schedule-flow>
                    </div>
                    <div class="app-schedule-load loading-content" v-else>
                        <inline-loading v-if="loading"></inline-loading>
                        <no-data v-else :showIcon="false" :nodataText="nodataText"></no-data>
                    </div>
                </div>
            </div>
        </template>
        <template slot="footer">
            <app-button shape="circle" @click.native="createSchedule">{{$t('schedule.createSchedule')}}</app-button>
        </template>
    </app-card>
</template>

<script>
import Icon from '../../common/icon/index'
import AppCard from '../../common/card/index'
import AppScheduleWeek from './scheduleWeek'
import AppScheduleFlow from './scheduleFlow'
import AppButton from '../../common/button/index'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        AppButton,
        AppScheduleWeek,
        AppScheduleFlow,
        inlineLoading,
        noData,
    },
    props: {
        appSystem: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            nodataText: this.$t('schedule.noDataText'),
            localName: 'schedule_list',
            roleList: this.$t('schedule.roleList'),
            loading: true,
            showList: [],
            list: [],
            hash_switch: 'on',
            hash: '',
            menuFlag: [], //点击导航标识；点击后直接走缓存不再重新请求
            cFlag:false
        }
    },
    computed: {},
    methods: {
        createSchedule() {
            if(!this.cFlag){
                this.cFlag = true
                let parameters = {}
                this.Util.YYBridge.do('createSchedule', parameters, rs => {
                    // 打开后回调
                })

                setTimeout(()=>{
                    this.cFlag = false
                },3000)
            }else{
                return
            }
        },
        gotoSheduleList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        //显示的角色
        roleHandle(type) {
            for (var i = 0; i < this.roleList.length; i++) {
                if (type == this.roleList[i].type) {
                    return this.roleList[i].content
                }
            }
        },
        //处理显示时间
        timeHandle(num) {
            var numStr = num < 10 ? '0' + num : num
            return numStr
        },
        scheduleTime(item) {
            let startTime = this.getTimeInfo(item.start_time)
            let endTime = this.getTimeInfo(item.end_time)
            return startTime + '-' + endTime
        },
        getTimeInfo(timestamp) {
            let date = new Date(timestamp * 1000) //特殊处理php的时间戳
            var hour = this.timeHandle(date.getHours())
            var min = this.timeHandle(date.getMinutes())
            return hour + ':' + min
        },
        scheduleCallBack(item) {
            var timestamp = Math.floor(item.timestamp / 1000)
            this.getScheduleData(timestamp, item.index)
        },

        //获取指定日期的日程
        getScheduleData(timestamp, index) {
            let storeData = this.$store.getters.getCurrentQzStorageDataByKey(this.localName + index) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.hash = storeData.hash || ''
            // if (this.menuFlag[index]) {
            //     this.loading = false
            //     return
            // }
            this.loading = true
            let url = '[phpApi]/schedule/getScheduleList?hash_switch=' + this.hash_switch + '&hash=' + this.hash + '&date=' + timestamp+'&vercode='+ this.Util.tools.getVersion()
            // this.Util.tools.getVersion()
            this.$http
                .get(url)
                .then(res => {
                    this.loading = false
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = reData
                    this.menuFlag[index] = true
                    this.resetData(reData, hash, index)
                })
                .catch(data => {
                    this.loading = false
                })
            setTimeout(() => {
                this.loading = false
            }, 200)
        },
        resetData(list, hash, index) {
            let data = {
                list: list,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName + index,
                data: data
            })
            return list
        }
    },
    mounted() {},
    created() {
        
    }
}
</script>
<style scoped>
.schedule-box>>>.footer {
    position: relative;
    height: 160px;
}
.schedule-box>>>.footer .app-button {
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
.schedule-box {
    min-height: 660px;
    .schedule-con {
        min-height: 380px;
        overflow: hidden;
        .app-schedule-main {
            height: 240px;
            .schedule-padding-top {
                width: 100%;
                height: 40px;
            }
        }
        .app-schedule-load {
            width: 100%;
            padding: 0 40px;
            height: 240px;
        }
        .loading-content {
            text-align: center;
            line-height: 240px;
        }
        .app-schedule-title {
            max-width: 380px;
            display: block;
            float: left;
            .words();
        }
        .app-schedule-bottom {
            border: 1px solid #00cdb5;
            color: #00cdb5;
            max-width: 80px;
            height: 30px;
            line-height: 32px;
            border-radius: 6px;
            padding: 0 13px;
            font-size: 20px;
            margin: 0 40px 0 10px;
            display: block;
            float: left;
            .words();
        }
        .app-schedule-imp {
            display: block;
            float: left;
            height: 32px;
            .icon {
                font-size: 26px;
                line-height: 32px;
                color: #e14c46;
            }
        }
    }
}
</style>
