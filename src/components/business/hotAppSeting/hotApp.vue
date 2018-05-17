<template>
    <transition name="fade">
        <div class="hot-app-box" id="hot-app-box">
            <app-card  v-if="!loading">
                <template slot="headerLeft" v-if="title!=''">
                    <span class="left-text" v-html="title"></span>
                </template>
                <template slot="headerRight">
                    <div class="right-text" @click="doEdit" v-html="editText"></div>
                </template>
                <template slot="content">
                    <div class="app-sortable-main" v-if="list.length&&!loading">
                                    <!-- delay:100 -->
                        <draggable
                                v-model="list"
                                :options="{
                                        disabled : dragDisabled,
                                        animation: 0,
                                        handle :'.summer-content'
                                    }"
                                    @clone="datadragClone"
                                    @start="datadragStart"
                                    :move="getDragData"
                                    @end="datadragEnd"
                                >
                            <transition-group :class ="isDrag ? 'item-is-drag' : ''">
                                <grid-item  class="drag-item"  v-for="(item,index) in list"  :key="index" @click.native="checkItem(item,index)"  >
                                    <span slot="icon" >
                                        <img class="summer-content" v-if="item.ext_id ==''" :src="item.icon" @error="imgError($event)">
                                        <summer v-else :item=item></summer>  
                                        <span v-show="showEdt" class="state" @click="deleteItem(item,index)">
                                            <icon cls-name="canminus"></icon>
                                        </span>
                                    </span>
                                    <span slot="label" v-html="item.name"></span>
                                </grid-item>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="loading-content" v-else>
                        <inline-loading v-if="loading"></inline-loading>
                        <no-data v-else :nodataText="nodataText"></no-data> 
                    </div> 
                </template>
            </app-card>
        </div>    
    </transition>
</template>
<script>
import draggable from 'vuedraggable'
import AppCard from '../../common/card/index'
import { Grid, GridItem } from '../../common/grid/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
import Icon from '../../common/icon/index'
import noData from '../../common/no-data/index'
import inlineLoading from '../../common/inline-loading/index'
import summer from '../summer/index'
import { redirect } from '../../../mixins/redirect'
import { navBar } from '../../../mixins/navbar'
export default {
    mixins: [redirect, navBar],
    
    components: {
        AppCard,
        Grid,
        GridItem,
        draggable,
        defaultImg,
        Icon,
        noData,
        inlineLoading,
        summer
    },
    props: {},
    data() {
        return {
            httpCfm: {
                uri: '[phpApi]/app/getCommonAppList', //获取数据接口地址
                magnetorderUri: '[phpApi]/app/setCommonAppOrder', //排序接口
                //请求数据配置参数
                params: {
                    hash_switch: 'on', //是否开启缓存  on开启  off关闭
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'application_hot_list', //缓存数据键名
            list: [], //列表数据
            hash:[],
            loading: true,
            nodataText: this.$t('hotApp.noDataText'),
            title: this.$t('hotApp.title'),
            editText: this.$t('hotApp.editText'),
            appEditText: this.$t('hotApp.appEditText'),
            isDrag: false,
            dragDisabled: true,
            showEdt: false, //显示隐藏常用应用标识
            magnetorder: [], //排序id
            tempMagnetorder: [], //处理前id排序
            ediding: '' //拖动的元素数据
        }
    },
    methods: {
        // 点击每个应用触发的事件
        checkItem(item, index) {
            if (!this.showEdt) {
                this.mixdirect_goAppUrl(item)
            }
        },
        // 删除
        deleteItem(item, index){
             if (this.showEdt) {
                this.list.splice(index, 1) //当前列表更新
                this.magnetorder.splice(index, 1) //顺序id数据更新
                this.$eventbus.$emit('updateApplist.appSet', item)
            } else {
               return
            }

        },
        // 获取拖拽元素数据
        datadragClone(){
            // this.$eventbus.$emit('hotdataDrag.appSet', true)
        },
        getDragData(evt) {
            this.ediding = evt.draggedContext.element.id
        },
        datadragStart() {
            this.$eventbus.$emit('hotdataDrag.appSet', true)
        },
        //拖拽后事件 更新排序id
        datadragEnd(evt) {
            this.magnetorder.splice(evt.oldIndex, 1)
            this.magnetorder.splice(evt.newIndex, 0, this.ediding)
            setTimeout(() => {
                this.$eventbus.$emit('hotdataDrag.appSet', false)
            }, 300)
        },
        // 保存设置数据
        seaveMagnetorder() {
            let params = new URLSearchParams()
            params.append('apporder', this.magnetorder.join(','))
            this.$http
                .post(this.httpCfm.magnetorderUri, params)
                .then(res => {
                    this.updateEdit(this.magnetorder)
                    // 保存成功后更新store 列表应用需要判断常用应用长度
                    let data = {
                        hash: this.hash,
                        list: this.list
                    }
                    this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                        vue: this,
                        key: this.localName,
                        data: data
                    })
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
            if (this.showEdt) {
                // var r = 0
                // var tt = setInterval(() => {
                //   if (r >= 100) {
                //     clearInterval(tt)
                //   } else {
                //     r = r + 1
                //     this.downloadApp(r)
                //   }
                // }, 300)

                this.editText = this.appEditText[0]
                this.showEdt = false
                this.dragDisabled = true
                this.isChange()
                this.updateEdit()
            } else {
                this.editText = this.appEditText[1]
                this.showEdt = true
                this.dragDisabled = false
                this.updateEdit()
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
            this.loading = this.list.length > 0 ? false : true
            this.$http
                .get(this.httpCfm.uri, { params: this.httpCfm.params })
                .then(res => {
                    let list = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = list.splice(0)
                    this.hash= res.data.hash || ''
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
                    this.loading = false
                })
                .catch(data => {
                    this.getMagnetorder()
                    this.loading = false
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
        },

        updateEdit(magnetorder = []) {
            // 触发分类列表内方法
            this.$eventbus.$emit('updateShow.appSet', this.showEdt, magnetorder)
        }
    },
    mounted() {
        //接收常用应用更新事件
        this.$eventbus.$on('updateHotapplist.appSet', item => {
            this.list.splice(this.list.length, 0, item)
            this.magnetorder.push(item.id)
        })
    },
    created() {
        this.getHostList()
    }
}
</script>
<style scoped>
.hot-app-box>>>.header {
    background-color: #f7f7f7;
    height: 60px !important;
    line-height: 60px !important;
}
.hot-app-box>>>.header .header-left {
    font-size: 24px;
    max-width: 510px !important;
}
.hot-app-box>>>.header .header-right {
    font-size: 28px;
}
.hot-app-box>>>.content {
    padding: 30px 0;
}
.hot-app-box>>>.grid-item .item .grid-icon {
    position: relative;
}
.hot-app-box>>>.card-box {
    border-radius: 0;
}
</style>

<style lang="less" scoped>
.hot-app-box {
    border-radius: 0;
    .app-sortable-main {
        width: 100%;
        background: #fff;
    }
    .loading-content {
        text-align: center;
        height: 516px;
        line-height: 516px;
    }
    .left-text {
        color: #999;
        font-size: 24px;
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
        top: -20px;
        right: -64px;
        border-radius: 14px;
        font-size: 0 !important;
        box-sizing: content-box;
        border: solid 20px rgba(0,0,0,0);
        i {
            font-size: 24px;
        }
    }
    .summer {
        width: 60px;
        height: 60px;
        position: absolute;
        border-radius: 50%;
        top: 0;
        border: solid 2px #000;
        overflow: hidden;
    }
    .left,
    .right {
        width: 60px;
        height: 60px;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .pie_left,
    .pie_right {
        width: 40px;
        height: 40px;
        position: absolute;
        border-radius: 50%;
        top: 8px;
        left: 8px;
        background-color: #e6e6e6;
    }

    .pie_right,
    .right {
        clip: rect(0, auto, auto, 20px);
    }
    .pie_left,
    .left {
        clip: rect(0, 20px, auto, 0);
    }
    /*
*当top和left取值为auto时，相当于0
*当bottom和right取值为auto时，相当于100%
*/
}
.item-is-drag {
    .sortable-drag {
        background: rgba(245, 245, 245, 1);
    }
}
.sortable-ghost {
    background-color: rgba(245, 245, 245, 0.9) !important;
    
    opacity: 0!important;
    background-color: red;
}
.sortable-chosen{
    // opacity: 0!important;
    // background-color: rgba(245, 245, 245, 0.9) !important;
}
.sortable-fallback:last-child {
    background-color: rgba(245, 245, 245, 0.9) !important;
    margin-top: -50px !important;
}
</style>
