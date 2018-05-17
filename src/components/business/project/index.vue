<template>
    <app-card class="project-box">
        <template slot="headerLeft">{{$t('project.title')}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoProjectList"></icon>
        </template>
        <template slot="content">
            <div class="inner-content" v-if="list.length&&!loading">
                <swiper :options="swiperOption">
                    <swiper-slide class="project-swiper-slide"  v-for="(item,index) in list" :key="index">
                        <div class="app-project-main">
                            <app-project-item @click.native="gotoProjectDetial(item.projectId)">
                                <div slot="maincontent" class="maincontent project_img_box">
                                    <img v-show="wFlg" :src='haveimgsrc(item.img)' alt="">
                                    <div class="title" v-html="item.projectName"></div>
                                </div>
                                <div slot="footer" class="footercontent">
                                    <div class="item">
                                        <div class="number" v-html="item.partMemberCount"></div>
                                        <div class="name">参与人数</div>
                                    </div>
                                     <div class="item">
                                        <div class="number" v-html="item.focus.isFocus"></div>
                                        <div class="name">关注</div>
                                    </div>
                                     <div class="item">
                                        <div class="number" v-html="item.honourCount"></div>
                                        <div class="name">荣耀</div>
                                    </div>
                                     <div class="item">
                                        <div class="number" v-html="item.storyCount"></div>
                                        <div class="name">故事数</div>
                                    </div>
                                </div>
                                <!-- <div ></div> -->
                            </app-project-item>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" v-if="list.length>1" slot="pagination"></div>
                </swiper>
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
import AppProjectItem from './prohectItem'
import Icon from '../../common/icon/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        inlineLoading,
        noData,
        AppProjectItem
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
                uri: '[javaApi]/project/workbench/getHotList', //获取数据接口地址
                params: {
                    //请求数据配置参数
                    pageNo: 1, //条数
                    pageSize: 4, //条数
                    hash: '' //后台判断数据是否更新唯一标识
                }
            },
            localName: 'project_list', //缓存数据键名
            list: [], //列表数据
            loading: true,
            nodataText: this.$t('project.noDataText'),
            itemUrl:'',
            wFlg:false,//获取宽高标识
            imgW:0,//图片box宽度
            imgH:0,//图片box高度
            
        }
    },
    methods: {
        gotoProjectDetial(id) {
            if(this.itemUrl){
                let url = this.itemUrl+'?p_id=' + id
                this.Util.YYBridge.do(
					"openWindow",
					{ orientation: 0, url: url },
					rs => {
						// 打开后回调
					}
				)
            }else{
                return
            }
        },
        haveimgsrc(src){
          
               let url = src +"?x-oss-process=image/resize,m_fill,h_"+this.imgH+",w_"+this.imgW+',limit_0'
               return url
        },
        gotoProjectList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        getList() {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.httpCfm.params.hash = storeData.hash || ''
            this.itemUrl = storeData.url || ''
            this.loading = this.list.length > 0 ? false : true
            this.$http
                .get(this.httpCfm.uri, { params: this.httpCfm.params })
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                        this.itemUrl = res.data.url || ''
                        this.list = reData
                        this.resetData(reData, hash)
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
            let data = {
                list: list,
                hash: hash,
                url:this.itemUrl
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName,
                data: data
            })
        },
       
        init(){
             let w = document.getElementsByClassName('project_img_box')[0]&&document.getElementsByClassName('project_img_box')[0].clientWidth
            let h = document.getElementsByClassName('project_img_box')[0]&&document.getElementsByClassName('project_img_box')[0].clientHeight
            if(w&&h){
                this.wFlg = true
                this.imgW = w
                this.imgH = h
            }else{
                setTimeout(() => {
                    this.init()
                }, 300);
            }
        }
    },
    created() {
        this.getList()
    },
    mounted () {
        this.init()
        this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.getList()
            }
        })
    }
}
</script>
<style scoped>
.project-box>>>.no-data {
    transform: translateY(-70%) !important;
}
.project-box>>>.swiper-container {
    overflow: hidden;
    border-radius: 20px;
    /* transform-style: preserve-3d; */
    /* transform:perspective(800px); */
    transform:rotate(0deg);
    position: relative;
    z-index: 2;
}
.project-box>>>.swiper-wrapper{
    position: relative;
    z-index: 1;
}
.project-box>>>.swiper-pagination-bullet{
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
.project-box {
    .inner-content {
        // height: 500px;
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
    .app-project-main {
        width: 100%;
        overflow: hidden;
        min-height: 408px;
        
        .maincontent{
            position: relative;
            width: 100%;
            height: 290px;
            line-height: 0;
            font-size: 0;
            overflow: hidden;
            border-radius: 14px;
            .project_img_box{
                width: 100%;
                height: 290px;
            }
            img{
                position: relative;
                top: 0;
            }
            .title{
                box-sizing: border-box;
                width: 100%;
                height: 62px;
                line-height: 62px;
                position: absolute;
                bottom: 0;
                padding-left: 37px;
                .words();
                background-color: rgba(0, 0, 0, .5);
                font-size: 28px;
                color: #fff;
                border-bottom-right-radius: 14px;
                border-bottom-left-radius: 14px;

            }
        }
        .footercontent{
            width: 100%;
            height: 84px;
            margin-top: 30px;
            font-size: 0;
            .item{
                width: 25%;
                height: 84px;
                float: left;
                .number{
                    width: 100%;
                    height: 42px;
                    line-height: 42px;
                    text-align: center;
                    color: #333;
                    font-size: 30px;
                    .words();
                }
                .name{
                    width: 100%;
                    height: 32px;
                    line-height: 32px;
                    margin-top: 10px;
                    text-align: center;
                    color: #333;
                    font-size:24px;
                    .words();
                }
            }
        }




        .classify {
            display: inline-block;
            height: 28px;
            line-height: 28px;
            padding: 0 11px;
            border: solid 1px #5bccff;
            color: #5bccff;
            border-radius: 6px;
            max-width: 100%;
            .words();
            vertical-align: middle;
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
    .app-project-footer {
        height: 40px;
        width: 100%;
    }
    .project-swiper-slide {
        // height: 460px;
        padding-bottom: 90px;
    }
}
</style>
