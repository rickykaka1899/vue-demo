<template>
    <app-card class="app-box">
        <template slot="headerLeft" v-if="title!=''">
            <span class="leftt-text" v-html="title"></span>
        </template>
        <template slot="headerRight" v-if="hasSetting">
            <div class="right-text" @click="doEdit" v-html="editText"></div>
        </template>
        <template slot="content">
            <div class="app-sortable-main" v-if="list.length">
                <draggable
                        v-model="list"
                        :options="{
                        disabled : dragDisabled,
                        animation: 400,
                        handle :'.drag-item'}"
                        @start="datadragStart"
                        :move="getDragData"
                        @end="datadragEnd"
                        >
                    <transition-group :class ="isDrag ? 'item-is-drag' : ''">
                        <grid-item  class="drag-item"  v-for="(item,index) in list"  :key="index" @click.native="checkItem(item,index)">
                            <span slot="icon" >
                                <img :src="item.icon" @error="imgError($event)">
                                <span v-show="isShow" class="state" :class="appList.length==0?'state-hot':item.stateHot==1?'state-hot':''">
                                     <icon :cls-name="appList.length==0?'minus':'plus'"></icon>
                                </span>
                            </span>
                            <span slot="label" v-html="item.name"></span>
                        </grid-item>
                    </transition-group>
                </draggable>
            </div>
            <div class="inner-content loading-content" v-else>
                <inline-loading v-if="loading"></inline-loading>
                <no-data v-else :nodataText="nodataText"></no-data> 
            </div> 
        </template>
    </app-card>
</template>

<script>
import draggable from 'vuedraggable'
import AppCard from '../../common/card/index'
import { Grid, GridItem } from '../../common/grid/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
import Icon from '../../common/icon/index'
export default {
    components: {
        AppCard,
        Grid,
        GridItem,
        draggable,
        defaultImg,
        Icon
    },
    props: {
        //是否显示配置按钮
        hasSetting: {
            type: Boolean,
            default: false
        },
        //标题
        title: {
            type: String,
            default: ''
        },
        //传递过来的分类应用列表
        appList: {
            type: Array,
            default: []
        },
        //设置触发的回调
        callBack: {
            type: Function,
            default: function() {}
        },
        //添加常用应用的回调
        updateHotApp: {
            type: Function,
            default: function() {}
        }
    },
    data() {
        return {
            editText: '设置',
            appEditText: ['设置', '完成'],
            isDrag: false,
            dragDisabled: true,
            isShow: false, //显示隐藏常用应用标识
            httpCfm: {
                uri: '[phpApi]/app/getCommonAppList', //获取数据接口地址
                magnetorderUri: '[phpApi]/app/setCommonAppOrder', //排序接口
                params: {
                    //请求数据配置参数
                    hash_switch: 'on', //是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'application_hot_list', //缓存数据键名
            list: [], //列表数据
            loading: true,
            nodataText: '还未收到公告消息哦!',
            defaultNumber: 12,
            magnetorder: [], //排序id
            tempMagnetorder: [], //处理前id排序
            ediding: '' //拖动的元素数据
        }
    },
    methods: {
        init() {
            // 判断是常用应用还是分类应用
            if (this.appList.length == 0) {
                this.getHostList()
            } else {
                this.list = this.appList
            }
        },
        // 点击每个应用触发的事件
        checkItem(item, index) {
            // 点击分类下 可点击应用触发的事件
            if (this.isShow && this.list[index].stateHot == 1) {
                this.updateHotApp(item)
                this.list[index].stateHot = 0 //设置为不可点击状态
                this.list.splice(0, 0)
                // 点击常用应用中应用触发的事件
            } else if (this.isShow && this.list[index].stateHot === undefined) {
                this.list.splice(index, 1) //当前列表更新
                this.magnetorder.splice(index, 1) //顺序id数据更新
                this.updateHotApp(item)
            } else {
                return
            }
        },
        // 获取拖拽元素数据
        getDragData(evt) {
            this.ediding = evt.draggedContext.element.id
        },
        //拖拽后事件 更新排序id
        datadragEnd(evt) {
            this.magnetorder.splice(evt.oldIndex, 1)
            this.magnetorder.splice(evt.newIndex, 0, this.ediding)
        },
        // 保存设置数据
        seaveMagnetorder() {
            let params = new URLSearchParams()
            params.append('apporder', this.magnetorder.join(','))
            this.$http
                .post(this.httpCfm.magnetorderUri, params)
                .then(res => {
                    this.callBack(this.isShow, this.magnetorder)
                })
                .catch(data => {
                    this.loading = false
                })
        },
        // 判断操作是否更新 如不更新则不调保存接口不处理分类app数据
        isChange() {
            if (this.tempMagnetorder.join('') != this.magnetorder.join('')) {
                this.tempMagnetorder = this.magnetorder.slice(0)
                this.seaveMagnetorder()
            } else {
                return
            }
        },
        // 点击设置（保存）按钮
        doEdit() {
            if (this.isShow) {
                this.editText = this.appEditText[0]
                this.isShow = false
                this.dragDisabled = true
                this.isChange()
            } else {
                this.editText = this.appEditText[1]
                this.isShow = true
                this.dragDisabled = false
                this.callBack(this.isShow)
            }
        },
        // 获取常用应用数据列表
        getHostList() {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.httpCfm.params.hash = storeData.hash || ''
            this.hotLoading = this.list.length > 0 ? false : true
            this.$http
                .get(this.httpCfm.uri, { params: this.httpCfm.params })
                .then(res => {
                    let list = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = list.splice(0)
                    let data = {
                        hash: hash,
                        list: this.list
                    }
                    this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                        vue: this,
                        key: this.localName,
                        data: data
                    })
                    this.getMagnetorder()
                    this.hotLoading = false
                })
                .catch(data => {
                    this.getMagnetorder()
                    this.hotLoading = false
                })
        },
        // 获取常用应用id
        getMagnetorder() {
            let templist = this.list
            for (let i = 0, len = templist.length; i < len; i++) {
                this.magnetorder.push(templist[i].id)
            }
            this.tempMagnetorder = this.magnetorder.slice(0)
        },
        imgError(obj) {
            let $img = obj.target
            $img && $img.setAttribute('src', defaultImg)
        }
    },
    mounted() {
        // 接收设置按钮点击事件
        this.$eventbus.$on('updateShow.appSet', state => {
            this.isShow = state
        })
        // 接收列表更新事件
        this.$eventbus.$on('updateApplist.appSet', item => {
            if (this.appList.length) {
                for (let i = 0, len = this.appList.length; i < len; i++) {
                    if (this.appList[i].id == item.id) {
                        this.appList[i].stateHot = 1
                        this.list.splice(0, 0)
                    } else {
                        continue
                    }
                }
            } else {
                return
            }
        })
        //接收常用应用更新事件
        this.$eventbus.$on('updateHotapplist.appSet', item => {
            if (!this.appList.length) {
                let tempItem = {}
                for (let t in item) {
                    if (t != 'stateHot') {
                        tempItem[t] = item[t]
                    }
                }
                this.list.splice(this.list.length, 0, tempItem)
                this.magnetorder.push(tempItem.id)
            } else {
                return
            }
        })
    },
    created() {
        this.init()
    }
}
</script>
<style scoped>
.app-box>>>.header {
    background-color: #f7f7f7;
    height: 60px !important;
    line-height: 60px !important;
}
.app-box>>>.header .header-left {
    font-size: 24px;
    max-width: 510px !important;
}
.app-box>>>.header .header-right {
    font-size: 28px;
}
.app-box>>>.grid-item .item .grid-icon {
    position: relative;
}
</style>

<style lang="less" scoped>
.app-box {
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
}
.drag-item {
    width: 25%;
    cursor: move;
    background: #fff;
    cursor: -webkit-grabbing;
    .state {
        position: absolute;
        width: 28px !important;
        height: 28px !important;
        line-height: 28px;
        text-align: center;
        top: 0;
        right: -44px;
        border-radius: 14px;
        font-size: 0;
        background-color: #e0e0e0;
        i {
            font-size: 24px;
        }
    }
    .state-hot {
        background-color: #e14c46;
    }
}
.item-is-drag {
    .sortable-drag {
        background: rgba(245, 245, 245, 1);
    }
}
.sortable-ghost {
    opacity: 0;
}
.sortable-chosen {
    // opacity: 0;
}
</style>
