<template>
    <transition name="fade">
        <div class="all-app-box" v-if="list.length&&!loading">
            <app-card v-for="(item,index) in list"  :key="index" :id="'appbox_'+index">
                <template slot="headerLeft">{{item.name}}</template>
                <template slot="content">
                    <grid :cols="4">
                        <grid-item v-for="(subitem, subindex) in item.list" :key="subindex" link="{name:'detail'}" @click.native="checkItem(subitem,index,subindex)">
                            <span slot="icon" >
                                <img v-if="subitem.ext_id ==''" :src="subitem.icon" @error="imgError($event)">
                                <summer v-else :item=subitem></summer> 
                                <span v-show="showAdd" class="state" >
                                    <icon :cls-name="subitem.stateHot==1?'canplus':'noplus'"></icon>
                                </span>
                            </span>
                            <span slot="label" v-html="subitem.name"></span>
                        </grid-item>
                    </grid>
                </template>
            </app-card>
            <div class="market" id="market" @click="getMarket">更多精彩应用!尽在应用市场</div>
            <div class="footerheignt" id="footerheignt"></div>
            <div class="menuhidden" id="menuhidden"></div>
        </div>
    </transition>
</template>
<script>
import AppCard from '../../common/card/index'
import { Grid, GridItem } from '../../common/grid/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
import Icon from '../../common/icon/index'
import summer from '../summer/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    data() {
        return {
            alerttitle:this.$t('application.alerttitle'),
            httpCfm: {
                uri: '[phpApi]/app/getAppList', //获取数据接口地址
                params: {
                    //请求数据配置参数
                    hash_switch: 'on', //是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'application_all_list', //缓存数据
            hotAppListName: 'application_hot_list',
            overallName: 'application_all_itemH',
            list: [], //列表数据
            loading: true,
            window_h: document.documentElement.clientHeight,
            menuBar_h: '',
            menuBar_t:'',
            item_h: [],
            showAdd: false,
            hotAppLength:0,//常用应用长度
            hotAppMaxL:12,
            alertFlg:false,
        }
    },
    components: {
        AppCard,
        Grid,
        GridItem,
        defaultImg,
        Icon,
        summer
    },
    methods: {
        //进入应用市场
        getMarket(){
             this.Util.YYBridge.do(
                    'openAppMarket',{},rs => {}
                )
        },
        // 点击每个应用触发的事件
        checkItem(item, index, subindex) {
            if (this.showAdd && this.list[index].list[subindex].stateHot == 1&&this.hotAppLength<this.hotAppMaxL) {
                 this.hotAppLength +=1;
                // 选择分类内应用触发常用应用添加
                this.$eventbus.$emit('updateHotapplist.appSet', item)
                this.list[index].list[subindex].stateHot = 0 //设置为不可点击状态
                setTimeout(() => {
                    this.getDomAttribute(false)
                }, 500)
            } else if(!this.showAdd&&!this.showAdd ){
                this.mixdirect_goAppUrl(item)
            }else if(this.showAdd&&this.list[index].list[subindex].stateHot == 1){
                this.$eventbus.$emit('updateAlert.show',this.alerttitle)

            }else{
                this.showAdd 
            }
        },
        // 更新缓存数据状态
        resetAPPlist(hotId) {
            let list = this.list || []
            let hash = this.httpCfm.params.hash || ''
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].list.length; j++) {
                    for (let m = 0, len = hotId.length; m < len; m++) {
                        if (list[i].list[j].id == hotId[m]) {
                            list[i].list[j].stateHot = 0
                        }
                    }
                }
            }
            let data = {
                list: list,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName,
                data: data
            })
        },
        getAllAppList() {
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
                    let list = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = this.resetData(list, hash)
                    this.loading = false
                    this.checkExistDom(false)
                    // 触发导航组件获取数据
                    this.$eventbus.$emit(
                        'menuHotapplist.appSet',
                        this.list.slice(0),
                        true
                    )
                })
                .catch(data => {
                    // 触发导航组件获取数据
                    this.$eventbus.$emit(
                        'menuHotapplist.appSet',
                        this.list.slice(0),
                        false
                    )
                    this.loading = false
                    this.checkExistDom(true)
                })
        },
        resetData(list, hash) {
            let storeHotData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.hotAppListName
                ) || {}
            let reList = []
            let hotList = storeHotData.list || []
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].list.length; j++) {
                    list[i].list[j].stateHot = 1
                    for (let m = 0, len = hotList.length; m < len; m++) {
                        if (list[i].list[j].id == hotList[m].id) {
                            list[i].list[j].stateHot = 0
                        } else {
                        }
                    }
                }
            }
            reList = list
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
        checkExistDom(hash) {
            if (document.getElementById('appbox_' + (this.list.length - 1))) {
                this.getDomAttribute(hash)
            } else {
                setTimeout(() => {
                    if (this.list.length) {
                        this.checkExistDom(hash)
                    } else {
                        return
                    }
                }, 5)
            }
        },
        getDomAttribute(hash) {
            //存在缓存里避免每次都获取dom节点
            this.menuBar_h = document.getElementById('menuhidden').clientHeight
            this.menuBar_t = document.getElementById('hot-app-box').offsetTop
            this.item_h = []
            if (hash) {
                let storeData =
                    this.$store.getters.getCurrentQzStorageDataByKey(
                        this.overallName
                    ) || {} //获取store数据优先展示；如数据有更新再次覆盖
                this.item_h = storeData.item_h || [] //获取所有分类列表高度
            } else {
                for (let i = 0, len = this.list.length; i < len; i++) {
                    let listDom = document.getElementById('appbox_' + i)
                    let h = listDom && listDom.offsetTop
                    let sh =1*this.menuBar_t + 1*this.menuBar_h - h
                    this.item_h.push(sh) //获取所有分类列表高度
                }
                let data = {
                    item_h: this.item_h
                }
                this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                    vue: this,
                    key: this.overallName,
                    data: data
                })
            }
            let h =this.window_h - document.getElementById('appbox_' + (this.list.length - 1)).clientHeight -this.menuBar_h + 'px'
            document.getElementById('footerheignt').style.height = h
            setTimeout(() => {
                this.$plugins.loading.hiden()
            }, 300);
        },
        // 图片错误处理
        imgError(obj) {
            let $img = obj.target
            $img && $img.setAttribute('src', defaultImg)
        }
    },
    created() {
        this.$plugins.loading.show('加载中...')
        this.getAllAppList()
    },
    mounted() {
        // 常用应用点击设置按钮
        this.$eventbus.$on('updateShow.appSet', (state, hotId) => {
            this.showAdd = state
            // 获取常用应用长度
             let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.hotAppListName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            let list = storeData.list || []
            this.hotAppLength = list.length

            if (!state) {
                this.resetAPPlist(hotId)
            }
        })
        // 常用应用数据更新
        this.$eventbus.$on('updateApplist.appSet', item => {
            this.hotAppLength -=1;
            setTimeout(() => {
                this.getDomAttribute(false)
            }, 500)
            let templist = this.list
            for (let i = 0, len = templist.length; i < len; i++) {
                for (let j = 0, lens = templist[i].list.length; j < lens; j++)
                    if (templist[i].list[j].id == item.id) {
                        this.list[i].list[j].stateHot = 1
                        this.list.splice(0, 0)
                        return
                    } else {
                        continue
                    }
            }
        })
    }
}
</script>
<style scoped>
.all-app-box>>>.header {
    background-color: #f7f7f7;
    height: 60px !important;
    line-height: 60px !important;
    padding: 0 30px;
}
.all-app-box>>>.header .header-left {
    font-size: 24px;
    color: #999;
    max-width: 510px !important;
}
.all-app-box>>>.content {
    padding: 30px 0;
}
.all-app-box>>>.grid-item .item .grid-icon {
    position: relative;
}
.all-app-box>>>.grid-item .item .grid-icon {
    position: relative;
}
</style>

<style lang="less" scoped>
.menuhidden {
    height: 110px;
}

.all-app-box {
    .app-sortable-main {
        width: 100%;
        background: #fff;
    }
    .loading-content {
        text-align: center;
        line-height: 516px;
    }
    .left-text {
        color: #999;
    }
    .right-text {
        color: #e14c46;
    }
    .card-box {
        border-radius: 0;
    }
}

.grid-icon {
    background: #fff;
    .state {
        position: absolute;
        width: 28px !important;
        height: 28px !important;
        line-height: 28px;
        text-align: center;
        top: 0;
        right: -44px;
        border-radius: 14px;
        font-size: 0 !important;
        i {
            font-size: 24px;
        }
    }
}
.market{
    width: 100%;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    text-align: center;
    background-color: #ffffff;
    margin-top: 20px;
}
</style>
