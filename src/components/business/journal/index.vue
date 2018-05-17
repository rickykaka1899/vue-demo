<template>
    <app-card class="journal-box">
        <template slot="headerLeft">{{$t("journal.title")}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoJournalList"></icon>

        </template>
        <template slot="content">
            <div class="journal-con">
                <div class="journal-item-title">{{$t("journal.contentTitle")}}</div>
                <div class="journal-item-main" v-if="list.length&&!loading">
                    <app-avatar class="journal-item-avatar" v-for="(item,index) in list" :key="index"  :src="item.avatar" className="journal-avatar" hasName="true" :title="item.userName"></app-avatar>
                </div>
                <div class="journal-item-load loading-content" v-else>
                    <inline-loading v-if="loading"></inline-loading>
                    <no-data :showIcon=false v-else :nodataText="noDataText"></no-data>
                </div>
            </div>
        </template>
        <template slot="footer">
            <app-button @click.native="createJournal" shape="circle">{{$t('journal.createJournal')}}</app-button>
        </template>
    </app-card>
</template>

<script>
import Icon from '../../common/icon/index'
import AppButton from '../../common/button/index'
import AppCard from '../../common/card/index'
import AppAvatar from '../../common/avatar/index'
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppButton,
        AppCard,
        AppAvatar,
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
            localName: 'journal_list',
            noDataText: this.$t('journal.noDataText'),
            loading: true,
            showList: [],
            list: [],
            hash: '',
            cFlag:false,
        }
    },
    computed: {},
    methods: {
        gotoJournalList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        getList() {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.hash = storeData.hash || ''
            this.loading = this.list.length > 0 ? false : true
            this.$http
                .get(
                    '[javaApi]/logger/workbench/getDiaryLastCommit?hash=' +
                        this.hash
                )
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
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
        createJournal() {
            if(!this.cFlag){
                this.cFlag = true
                this.$http.get('[javaApi]/logger/index/createLoggerForWorkbench')
                .then(res => {
                    let url = res.data.data.url
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
                return;
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
    }
    
}
</script>
<style scoped>
.journal-box>>>.journal-item-main .journal-avatar {
    height: 90px !important;
    width: 90px !important;
    font-size: 32px !important;
    line-height: 90px !important;
}
.journal-box>>>.journal-item-main .app-avatar-box {
    width: 90px !important;
}
.journal-box>>>.journal-item-main .app-avatar-name {
    height: 60px !important;
    line-height: 60px !important;
    margin-top: 0 !important;
}
.journal-box>>>.footer {
    position: relative;
    height: 160px;
    line-height: 160px;
}
.journal-box>>>.footer .app-button {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
<style lang="less" scoped>
.journal-box {
    .journal-item-title {
        width: 100%;
        height: 48px;
        font-size: 28px;
        color: #333333;
        line-height: 48px;
        margin-bottom: 52px;
        text-align: center;
    }
    .journal-con {
        height: 252px;
        .journal-item-main {
            width: 100%;
            padding: 0 40px;
            height: 150px;
            text-align: center;
            .journal-item-avatar + .journal-item-avatar {
                margin-left: 40px;
                overflow: hidden;
                float: left;
            }
        }
        .journal-item-load {
            width: 100%;
            padding: 0 40px;
            height: 110px;
        }
        .loading-content {
            text-align: center;
            line-height: 110px;
        }
    }

    .journal-item-footer {
        width: 166px;
        height: 40px;
        color: #333333;
        line-height: 60px;
        border-radius: 60px;
        font-size: 28px;
        background: #f2f2f2;
        text-align: center;
        margin: 59px auto 49px;
    }
    .journal-swiper-slide {
        height: 509px;
    }
}
</style>
