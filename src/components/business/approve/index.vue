<template>
    <app-card class="approve-box">
        <template slot="headerLeft">{{$t("approve.title")}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoApproveList"></icon>
        </template>
        <template slot="content">
            <div class="inner-content" v-if="list.length&&!loading">
                <swiper :options="swiperOption">
                    <swiper-slide class="approve-swiper-slide" v-for="(item,index) in list" :key="index">
                        <appro-item class="appro-item" v-for="(subitem,subindex) in item" :key="subindex" @click.native="gotoApproveDetial(subitem.url)">
                             <span slot="title" class="appro-title">
                                 <span class="title" v-html="subitem.title"></span>
                                 <span class="time" v-html="resetCreated(subitem.taskTime-1111100101010*subindex*index)"></span>
                             </span>
                             <span slot="amount" v-html="'金额:'+3+subindex*3*index+subindex*index">
                             </span>
                             <span slot="user" v-html="'提交人:'+subitem.committer">
                             </span>
                             <span slot="state" class="appro-state" :class="setStateBg(subitem.status)">
                                <span class="text" v-html="setState(subitem.status)"></span>
                             </span>
                        </appro-item>
                    </swiper-slide>
                    <div class="swiper-pagination" v-if="list.length>1" slot="pagination"></div>
                </swiper>
            </div>
            <div class="inner-content" :class="loading?'loading-content':'nodata-content'" v-else>
                <inline-loading v-if="loading"></inline-loading>
                <no-data v-else :nodataText="nodataText"></no-data> 
            </div> 
        </template>
    </app-card>
</template>

<script>
import Icon from '../../common/icon/index'
import AppCard from '../../common/card/index'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import ApproItem from './approItem'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        inlineLoading,
        noData,
        ApproItem
    },
    props: {
        appSystem: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            httpCfm: {
                uri: '[approveApi]/api/tasks/all', //获取数据接口地址
                params: {
                    //请求数据配置参数
                    // count:9,//条数
                    // hash_switch:"on",//是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'appro_list', //缓存数据键名
            list: [], //列表数据
            loading: true,
            nodataText: '还没有审批需要处理哦'
        }
    },
    methods: {
        gotoApproveDetial(url) {
            window.open(url, '_blank')
        },
        gotoApproveList() {
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
                .get(this.httpCfm.uri, { params: this.httpCfm.params })
                .then(res => {
                    let reData = res.data.tasks || [],
                        hash = res.data.hash || ''
                    this.list = this.resetData(reData, hash)
                    this.loading = false
                })
                .catch(data => {
                    this.loading = false
                })
            setTimeout(() => {
                this.loading = false
            }, 200)
        },
        resetData(list, hash) {
            let reList = []
            for (let i = 0; i < list.length; i += 3) {
                reList[parseInt(i / 3)] = list.slice(i, i + 3)
            }
            let data = {
                list: reList,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName,
                data: data
            })
            return reList
        },
        // 处理时间和部门字符串拼接
        resetCreated(created) {
            return this.Util.time.formatDate(created - 0, 'MM-dd hh:mm')
        },
        setStateBg(status) {
            let state = ['state-overdue', 'state-warning']
            return state[status]
        },
        setState(status) {
            let stateText = ['逾期', '警告']
            return stateText[status]
        }
    },
    created() {
        this.getList()
    },
    mounted () {
        this.$eventbus.$on('updateCommonList.commonList', () => {
            this.getList()
        })
        //  this.$eventbus.$on('updateApplist.alllist', refresh => {
        //     if(refresh == 'all' || refresh == this.appSystem.appid){
        //          this.getList()
        //     }
        // })
    }
}
</script>
<style lang="css" scoped>
.approve-box>>>.no-data {
    transform: translateY(-70%) !important;
}
</style>
<style lang="less" scoped>
.words() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.approve-box {
    .approve-item-title {
        width: 100%;
        height: 166px;
        font-size: 28px;
        color: #333;
        line-height: 166px;
        text-align: center;
    }
    .approve-item-main {
        width: 100%;
        padding: 0 60px;
        height: 114px;
        text-align: center;
    }
    .approve-item-footer {
        width: 166px;
        height: 60px;
        color: #333;
        line-height: 60px;
        border-radius: 60px;
        font-size: 28px;
        background: #f2f2f2;
        text-align: center;
        margin: 59px auto 49px;
    }

    .inner-content {
        width: 100%;
        height: 548px;
        padding-left: 40px;
    }
    .loading-content {
        padding-left: 0;
        text-align: center;
        line-height: 548px;
    }
    .nodata-content {
        padding-left: 0;
        text-align: center;
        height: 348px;
    }
    .approve-swiper-slide {
        height: 548px;
    }
    .approve-swiper-slide .appro-item {
        border-top: solid 1px #eee;
    }
    .approve-swiper-slide .appro-item:first-child {
        border-top: solid 1px rgba(0, 0, 0, 0);
    }
    .appro-title {
        overflow: hidden;
        padding-right: 40px;
        line-height: 46px;
        span {
            display: inline-block;
            line-height: 46px;
        }
        .title {
            float: left;
            color: #333;
            font-size: 28px;
            width: 436px;
            .words();
        }
        .time {
            float: right;
            color: #ccc;
            font-size: 20px;
            max-width: 160px;
            .words();
        }
    }
    .appro-state {
        display: block;
        position: absolute;
        top: -5px;
        right: -23px;
        transform: rotate(45deg);
        width: 0;
        height: 0;
        border-left: 40px solid transparent;
        border-right: 40px solid transparent;
        border-bottom: 40px solid #14e9d7;
        .text {
            display: block;
            position: relative;
            top: 12px;
            right: 37px;
            width: 80px;
            font-size: 32px;
            transform: scale(0.5, 0.5);
            color: #fff;
        }
    }
    .state-overdue {
        border-bottom: 40px solid #e14c46;
    }
    .state-warning {
        border-bottom: 40px solid #ffbb37;
    }
}
</style>
