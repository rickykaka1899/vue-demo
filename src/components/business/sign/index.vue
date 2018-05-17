<template>
    <app-card class="sign-box">
        <template slot="headerLeft">{{$t("sign.title")}}</template>
        <template slot="headerRight">
            <icon cls-name="arrow-right" @click.native="gotoSignList"></icon>
        </template>
        <template slot="content">
            <div class="sign-con">
                <swiper v-if="isAdmin" :options="swiperOption">
                    <swiper-slide class="sign-swiper-slide" v-for="index in 3" :key="index">
                        <app-sign-chart :type="index" :canvasId="'chartCanvas' + index"></app-sign-chart>
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
                <div class="sign-con-no-swiper" v-if="!isAdmin">
                    <app-sign-chart type="0" canvasId="chartCanvas0"></app-sign-chart>
                </div>
            </div>
        </template>
    </app-card>
</template>

<script>
import Icon from '../../common/icon/index'
import AppCard from '../../common/card/index'
import AppSignChart from './signChart'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    components: {
        Icon,
        AppCard,
        AppSignChart
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
                initialSlide: 0,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            isAdmin: false
        }
    },
    computed: {},
    methods: {
        gotoSignList() {
            this.mixdirect_goAppUrl(this.appSystem)
        },
        //获取是否是负责人
        getPermission() {
            this.$http
                .get('[javaApi]/signin/workbench/isHavePermission')
                .then(res => {
                    if (res.data && res.data.isHavePermission == 1) {
                        this.isAdmin = true
                    } else {
                        this.isAdmin = false
                    }
                })
                .catch(data => {})
        }
    },
    created() {
        this.getPermission()
    },
    mounted() {
         this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.getPermission()
            }
        })
    }
}
</script>
<style lang="less" scoped>
.sign-box {
    .sign-swiper-slide {
        height: 620px;
    }
    .sign-con-no-swiper {
        min-height: 560px;
    }
}
</style>
