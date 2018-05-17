<template>
    <transition name="fade">
        <div id="menuBar" :class="listscrollFlg?'fixmenuwrapper':(menuwrapper=='menuwrapper'?'menuwrapper':'menuwrappertop')" class="menuwrapper" ref="menuwrapper">
            <div class="menubarContent" :id="menuwrapper">
                <div class="menu-bar" id="appMenuBarM" v-if="list.length">
                    <div :id="'menuItem' + index" :class="activeIndex == index ? 'active' : ''"  @click="menuClick(index)" class="menu-bar-item" v-for="(item,index) in list" :key="index" >
                        <span v-html="item.name"></span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        menuwrapper: {
            type: String,
            default: 'menuwrapper'
        }
    },
    data() {
        return {
            overallName: 'application_all_menuW',
            localName: 'application_all_list', //缓存数据键名
            list: [], //列表数据
            menuBar_w: '',
            menuBarI_w: [],
            activeIndex: 0,
            scroll: '',
            content_W: 0,
            listscrollFlg: false,
            navclickFlg:true

        }
    },
    methods: {
        getMenuList(list, hash) {
            if (hash) {
                this.list = list || []
                this.$nextTick(() => {
                    this.getDomAttribute(hash)
                })
            } else {
                return
            }
        },
        initWithStore() {
            let listStoreData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = listStoreData.list || []
            let menuStoreData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.overallName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.menuBarI_w = menuStoreData.menuBarI_w || [] //获取分类导航每个导航按钮宽度
            this.menuBar_w = menuStoreData.menuBar_w || 0 //获取导航宽度
            this.content_W = menuStoreData.content_W || 0
            document.getElementById(this.menuwrapper).style.width =
                this.content_W + 'px' //设置最后一个列表高度
            this.initScroll()
        },
        getDomAttribute() {
            //存在缓存里避免每次都获取dom节点
            this.menuBarI_w = []

            this.content_W = 0
            this.menuBar_w = document.getElementById('menuBar').offsetWidth //获取导航宽度
            for (let i = 0, len = this.list.length; i < len; i++) {
                let menuMom = document.getElementById('menuItem' + i)
                let w = menuMom && menuMom.clientWidth
                this.menuBarI_w.push(w) //获取分类导航每个导航按钮宽度
                this.content_W += w
            }
            document.getElementById(this.menuwrapper).style.width =
                this.content_W + 'px' //设置content宽度
            this.initScroll()
            let data = {
                menuBar_w: this.menuBar_w,
                menuBarI_w: this.menuBarI_w,
                content_W: this.content_W
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.overallName,
                data: data
            })
        },
        menuClick(index) {
            if (this.activeIndex != index&&!this.navclickFlg) {
                this.navclickFlg = true;
                this.activeIndex = index
                this.$eventbus.$emit('clickMenu.appSet', index, false)
                setTimeout(()=>{
                    this.navclickFlg = false
                },600)
            } else {
                return
            }
        },
        changeActive(val, old) {
            let w = 0
            for (let i = 0, len = this.menuBarI_w.length; i < len; i++) {
                if (i < val) {
                    w += this.menuBarI_w[i]
                } else {
                    break
                }
            }
            if (w <= this.menuBar_w / 2) {
                this.srcollLeftAnimate(0)
            } else if (
                this.menuBar_w / 2 + this.menuBarI_w[val] / 2 + w >=
                this.content_W
            ) {
                this.srcollLeftAnimate(this.content_W - this.menuBar_w)
            } else {
                this.srcollLeftAnimate(
                    w - this.menuBar_w / 2 + this.menuBarI_w[val] / 2
                )
            }
        },
        srcollLeftAnimate(x) {
            this.scroll.scrollTo(-x, 0, 300)
        },
        initScroll() {
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new this.BScroll(this.$refs.menuwrapper, {
                        scrollX: true,
                        scrollY:false,
                        click: true,
                        deceleration:0.0015,
                        probeType: 3
                    })
                } else {
                    this.scroll.refresh()
                }
                this.navclickFlg = false
            })
        }
    },
    mounted() {
        this.initWithStore()
        // 接收列表滚动方法
        this.$eventbus.$on(
            'scrollHotapplist.appSet',
            (active, listscrollFlg) => {
                this.listscrollFlg = listscrollFlg
                this.activeIndex = listscrollFlg ? active : 0
            }
        )
        // 接收显示吸顶导航方法
        this.$eventbus.$on('showTopHotapplist.appSet', (active, clickflg) => {
            this.activeIndex = active
            this.listscrollFlg = clickflg
        })
        // 接收导航数据改变
        this.$eventbus.$on('menuHotapplist.appSet', (list, hash) => {
            this.getMenuList(list, hash)
        })
    },
    watch: {
        activeIndex: function(val, old) {
            this.changeActive(val, old)
        }
    }
}
</script>

<style lang="less" scoped>
#menuBar,
.menuwrapper {
    width: 100%;
    height: 100px;
    background: #fff;
    overflow: hidden;
    .content {
        background: #fff;
        height: 100px;
    }
}
.fade-enter-active {
    transition: all 0.5s;
}
.menuwrapper {
    margin-top: 20px;
}
.fixmenuwrapper {
    margin-top: 0;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 99;
}
.menuwrappertop {
    margin-top: 0;
    position: fixed;
    top: -100px;
    background: #fff;
    z-index: 99;
}

.menubarContent{
    height: 100px;
    overflow-y: hidden;
}
.menu-bar {
    overflow: hidden;
    background: #fff;
    position: relative;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    vertical-align: text-top;
    font-size: 0;
    height: 120px;
    top: 0;
    .menu-bar-item {
        display: inline-block;
        padding: 0 25px;
        font-size: 28px;
        height: 100px;
        line-height: 100px;
    }
    .menu-bar-item:first-child {
        padding-left: 30px;
    }
    .menu-bar-item:last-child {
        padding-right: 30px;
    }
    .menu-bar-item.active span {
        display: inline-block;
        height: 100px;
        line-height: 100px;
        font-size: 28px;
        border-bottom: 4px solid #e14c46;
    }
}
</style>
