<template>
    <app-card class="announce-box">
        <template slot="headerLeft">{{$t('announce.title')}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoAnnounceList"></icon>
        </template>
        <template slot="content">
            <div class="inner-content" v-if="list.length&&!loading">
                <swiper :options="swiperOption">
                    <swiper-slide class="announce-swiper-slide"  v-for="(item,index) in list" :key="index">
                        <div class="app-announce-main">
                            <app-announce-item v-for="(subitem,subindex) in item" :key="subindex" :haveimg="subitem.avatar" @click.native="gotoAnnounceDetial(subitem.id)">
                                <span slot="title" v-html="subitem.title"></span>
                                <div slot="dept" class="dept">
                                    <span class="classify" v-html="subitem.classify_name">
                                        <!-- <span class="innerclass" v-html="subitem.classify_name"></span> -->
                                    </span>
                                    <span class="depart" v-html="resetCreated(subitem.created,subitem.dept_name)"></span>
                                </div>
                                <img v-if="subitem.avatar" slot="icon" src="subitem.avatar">
                            </app-announce-item>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" v-if="list.length>1" slot="pagination"></div>
                </swiper>
                <!-- <div class="app-announce-footer"></div> -->
            </div>
            <div class="inner-content" :class="loading?'loading-content':'nodata-content'"  v-else>
                <inline-loading v-if="loading"></inline-loading>
                <no-data v-else :nodataText="nodataText"></no-data> 
            </div> 
        </template>
    </app-card>
</template>

<script>
import AppCard from '../../common/card/index'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import AppAnnounceItem from './announceItem'
import Icon from '../../common/icon/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        inlineLoading,
        noData,
        AppAnnounceItem
    },
    props: {
        appSystem: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            qz_id: this.$store.getters.getUserQzId,
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            httpCfm: {
                uri: '[phpApi]/announce/getAnnounceList', //获取数据接口地址
                params: {
                    //请求数据配置参数
                    count: 9, //条数
                    hash_switch: 'on', //是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'announce_list', //缓存数据键名
            list: [], //列表数据
            loading: true,
            nodataText: this.$t('announce.noDataText')
        }
    },
    methods: {
        gotoAnnounceDetial(id) {
            this.Util.YYBridge.do(
                'announceDetail',
                { announce_id: id, qz_id: this.qz_id },
                rs => {}
            )
        },
        gotoAnnounceList() {
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
                    let reData = res.data.data || [],
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
        resetCreated(created, dept) {
            return (
                this.Util.time.formatDate(created * 1000, 'MM-dd hh:mm') + '&nbsp;' +  dept
            )
        }
    },
    created() {
        this.getList()
    },
    mounted () {
         this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.getList()
            }
        })
    }
}
</script>
<style scoped>
.announce-box>>>.no-data {
    transform: translateY(-70%) !important;
}
.announce-box>>>.swiper-container {
    overflow: hidden;
    border-radius: 20px;
    /* transform-style: preserve-3d; */
    /* transform:perspective(800px); */
    transform:rotate(0deg);
    position: relative;
    z-index: 2;
}
.announce-box>>>.swiper-wrapper{
    position: relative;
    z-index: 1;
}
.announce-box>>>.swiper-pagination-bullets{
    /* bottom: 0; */
}
.announce-box>>>.swiper-pagination-bullet{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0px;
    transform: scale(0.5, 0.5)
}
</style>

<style lang="less" scoped>
.words() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.announce-box {
    .inner-content {
        min-height: 400px;
    }
    .nodata-content {
        text-align: center;
        height: 330px;
        // line-height: 450px;
    }
    .loading-content {
        text-align: center;
        height: 500px;
        line-height: 500px;
    }
    .app-announce-main {
        width: 100%;
        overflow: hidden;
        min-height: 408px;
        .classify {
            display: inline-block;
            box-sizing: border-box;
            height: 30px;
            font-size: 0;
            line-height: 30px;
            padding: 0 11px;
            border: solid 2px #5bccff;
            border-radius: 6px;
            max-width: 100%;
            overflow-y: hidden;
            vertical-align: middle;
            .words();
            color: #5bccff;
            font-size: 18px;
        }
        .depart {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            padding-left: 12px;
            font-size: 22px;
            vertical-align: middle;
        }
    }
    .app-announce-footer {
        height: 40px;
        width: 100%;
    }
    .announce-swiper-slide {
        height: 460px;
    }
}
</style>
