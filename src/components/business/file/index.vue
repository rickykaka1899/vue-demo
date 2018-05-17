<template>
    <app-card class="file-box">
        <template slot="headerLeft">{{$t('file.title')}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoFileList"></icon>
        </template>
        <template slot="content">
            <div class="app-file-main">
                <div class="app-file-bar">
                    <div class="menu-bar-item" v-for="(item,index) in menuList" :key="index" @click="getActiveIndex(item.type)">
                        <div :class="menuActiveIndex == item.type ? 'active' : ''" class="menu-item-text">{{item.name}}</div>
                    </div>
                </div>
                <div class="app-file-con" v-if="list.length&&!loading">
                    <app-file-item v-for="(item,index) in list" :key="index" class="app-file-item" @click.native="gotoFileDetial(item.fid)">
                        <img slot="icon" :src="gridIcon(item.fileext)" />
                        <span slot="title" v-html="item.filename"></span>
                        <span slot="time" v-html="resetCreated(item.created)"></span>
                        <span slot="size" v-html="item.filesize"></span>
                        <span slot="author" v-html="item.uname"></span>
                    </app-file-item>
                </div>
                <div class="app-file-con loading-content" v-else>
                    <inline-loading v-if="loading"></inline-loading>
                    <no-data v-else :nodataText="nodataText"></no-data> 
                </div>      
            </div>
            <div class="app-file-footer"></div>
        </template>
    </app-card>
</template>

<script>
import Icon from '../../common/icon/index'
import AppCard from '../../common/card/index'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import AppFileItem from './fileItem'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        AppFileItem,
        inlineLoading,
        noData
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
                uri: '[phpApi]/doc/list', //获取数据接口地址
                params: {
                    //请求数据配置参数
                    type: 1, //类型
                    count: 4, //条数
                    hash_switch: 'on', //是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'file_list', //缓存数据键名
            menuList: this.$t('file.menuList'), //导航字
            menuActiveIndex: 1, //导航标识
            list: [], //列表数据
            loading: true,
            nodataText: this.$t('file.noDataText'),
            menuFlg: [] //点击导航标识；点击后直接走缓存不再重新请求
        }
    },
    computed: {},
    methods: {
        gotoFileDetial(fid = 0) {
            this.Util.YYBridge.do(
                'previewFile',
                { fid: fid, from_type: 0 },
                rs => {}
            )
        },
        gotoFileList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        getActiveIndex(type) {
            this.menuFlg[type]
            if (type != this.menuActiveIndex && !this.menuFlg[type]) {
                this.menuActiveIndex = type
                this.getList(type)
            } else if (this.menuFlg[type]) {
                this.menuActiveIndex = type
                let storeData =
                    this.$store.getters.getCurrentQzStorageDataByKey(
                        this.localName + type
                    ) || {}
                this.list = storeData.list || []
            } else {
                return
            }
        },
        //获取文库列表
        getList(type) {
            this.menuFlg[type] = true
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName + type
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.httpCfm.params.hash = storeData.hash || ''
            this.httpCfm.params.type = type || 1
            this.loading = this.list.length > 0 ? false : true
            this.$http
                .get(this.httpCfm.uri, { params: this.httpCfm.params })
                .then(res => {
                    this.loading = false
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = this.resetData(reData, hash, type)
                })
                .catch(data => {
                    this.loading = false
                })
            setTimeout(() => {
                this.loading = false
            }, 200)
        },
        resetData(list, hash, type) {
            let data = {
                list: list,
                hash: hash
            }
            let key = this.localName + type
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: key,
                data: data
            })
            return list
        },
        // 设置附件格式图标
        // gridIcon(fileext){
        //     return fileext;
        // },
        gridIcon(fileext) {
            let iconCat = ''
            if (['png', 'jpg', 'jpeg', 'bmp', 'gif'].indexOf(fileext) > -1) {
                iconCat = 'pic'
            } else if (['pdf', 'txt'].indexOf(fileext) > -1) {
                iconCat = fileext
            } else if (
                ['mp3', 'ape', 'm4a', 'midi', 'wma'].indexOf(fileext) > -1
            ) {
                iconCat = 'audio'
            } else if (
                ['mp4', 'rmvb', 'flv', 'rmv', 'avi', 'wmv'].indexOf(fileext) >
                -1
            ) {
                iconCat = 'video'
            } else if (['ppt', 'pptx'].indexOf(fileext) > -1) {
                iconCat = 'ppt'
            } else if (['zip', 'rar', '7z'].indexOf(fileext) > -1) {
                iconCat = 'zip'
            } else if (['doc', 'docx'].indexOf(fileext) > -1) {
                iconCat = 'word'
            } else if (['xls', 'xlsx'].indexOf(fileext) > -1) {
                iconCat = 'excel'
            } else {
                iconCat = 'other'
            }
            return require('./imgs/' + iconCat + '256.png')
        },
        // 时间格式转换
        resetCreated(created) {
            return this.Util.time.formatDate(created * 1000, 'MM月dd日 hh:mm')
        }
    },
    created() {
        this.getList(this.menuActiveIndex)
    },
    mounted () {
        this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.getList(this.menuActiveIndex)
            }
        })
    }
}
</script>
<style lang="less" scoped>
.file-box {
    .app-file-main {
        width: 100%;
        overflow: hidden;
        .app-file-bar {
            width: 100%;
            padding: 0 29px;
            background: #fff;
            height: 80px;
            margin-bottom: 20px;
            .menu-bar-item {
                width: 33.33%;
                text-align: center;
                font-size: 28px;
                float: left;
                height: 80px;
                line-height: 80px;
                .menu-item-text {
                    height: 100%;
                    display: inline-block;
                }
                .menu-item-text.active {
                    border-bottom: 4px solid #e14c46;
                }
            }
        }
        .app-file-con {
            width: 100%;
            padding-left: 40px;
            height: 480px;
            .app-file-item:last-child {
                border-bottom: 1px solid rgba(0, 0, 0, 0);
            }
        }
        .loading-content {
            padding-left: 0;
            text-align: center;
            line-height: 480px;
        }
    }
    .app-file-footer {
        height: 40px;
        width: 100%;
    }
}
</style>
