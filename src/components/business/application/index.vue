<template>
    <app-card class="app-application-box">
        <template slot="headerLeft">{{$t("application.title")}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoAppList"></icon>
        </template>
        <template slot="content">
            <grid :cols="4" v-if="applicationList.length">
                <grid-item v-for="(item, index) in applicationList" :key="index" @click.native="gotoAppdetail(item)">
                    <span slot="icon">
                        <img v-if="item.ext_id ==''" :src="item.icon" @error="imgError($event)">
                        <summer v-else :item=item></summer>  
                    </span>

                    <span slot="label">{{item.name}}</span>
                </grid-item>
            </grid>
            <div class="app-application-con loading-content" v-else>
                <inline-loading v-if="loading"></inline-loading>
                <no-data :nodataText="noDataText" v-if="noDate"></no-data>
            </div>
        </template>
    </app-card>
</template>

<script>
import AppCard from '../../common/card/index'
import Icon from '../../common/icon/index'
import noData from '../../common/no-data/index'
import { Grid, GridItem } from '../../common/grid/index'
import inlineLoading from '../../common/inline-loading/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
import summer from '../summer/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    data() {
        return {
            loading: true,
            noDataText: this.$t('application.noDataText'),
            defaultNumber: 12,
            applicationList: [],
            key: 'application_hot_list',
            cgi: '[phpApi]/app/getCommonAppList'
        }
    },
    components: {
        AppCard,
        Grid,
        GridItem,
        Icon,
        noData,
        inlineLoading,
        summer
    },
    computed: {
        noDate() {
            return !this.applicationList.length && !this.loading ? true : false
        }
    },
    methods: {
        gotoAppdetail(item) {
            this.mixdirect_goAppUrl(item)
        },
        async init() {
            try {
                let list = await this.getStorageData()
                if (list && list.data && list.data.code === 0) {
                    let data = {
                        hash: list.data.hash || '',
                        list: list.data.data || []
                    }
                    this.applicationList = data.list.slice(
                        0,
                        this.defaultNumber
                    )
                    this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                        vue: this,
                        key: this.key,
                        data: data
                    })
                }
            } catch (e) {
                //防止控制台报错，catch语句必须保留
            } finally {
                this.loading = false
            }
        },
        getStorageData() {
            let data =
                this.$store.getters.getCurrentQzStorageDataByKey(this.key) || []
            let params = {
                hash_switch: 'on',
                hash: data.hash || ''
            }
            this.applicationList =
                (data.list && data.list.slice(0, this.defaultNumber)) || []
            return this.$http.get(this.cgi, { params })
        },

        gotoAppList() {
            // window.open(window.location.href+'appSetting')
            let appseturl = window.location.href+'appSetting'
            this.Util.YYBridge.do(
					"openWindow",
					{ orientation: 0, url: appseturl },
					rs => {
						// 打开后回调
					}
				)
            // this.$router.push({ name: 'appSetting' })
        },
        imgError(obj) {
            let $img = obj.target
            $img && $img.setAttribute('src', defaultImg)
        }
    },
    created() {
        this.init()
    },
    mounted () {
         this.$eventbus.$on('updateCommonList.commonList', () => {
            this.init()
        })
    }
}
</script>
<style  lang="less" scoped>
.app-application-box {
    .app-application-con {
        width: 100%;
        padding: 0 40px;
        height: 535px;
    }
    .loading-content {
        text-align: center;
        line-height: 535px;
    }
}
</style>
