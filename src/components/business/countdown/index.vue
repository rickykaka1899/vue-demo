<template>
    <app-card class="banner-box">
        <template slot="content">
            <swiper :options="swiperOption">
                <swiper-slide class="banner-swiper-slide" v-for="n in 5" :key="n">
                    <app-countdown @click.native="goDetail"></app-countdown>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </template>
    </app-card>
</template>

<script>
import AppCard from '../../common/card/index'
import AppCountdown from './countdown'
export default {
    components: {
        AppCard,
        AppCountdown
    },
    data() {
        return {
            swiperOption: {
                pagination: {
                    el: '.swiper-pagination'
                }
            }
        }
    },
    computed: {},
    methods: {
        goDetail() {
            this.$router.push({ name: 'detail' })
        }
    }
}
</script>
<style lang="less" scoped>
.banner-box {
    background: #fff;
    overflow: hidden;
    .swiper-pagination-bullets {
        bottom: 0;
    }
}
</style>
