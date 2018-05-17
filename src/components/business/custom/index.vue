<template>
    <div class="custom-box">
        <app-card>
            <template slot="content">
                <div class="custom-box-name" @click="goCustomSetting">{{$t('custom.title')}}</div>
            </template>
        </app-card>
         <div class="footer" :style="setheight()"></div>
    </div>
</template>

<script>
import AppCard from '../../common/card/index'
export default {
    components: {
        AppCard
    },
    data() {
        return {}
    },
    methods: {
        goCustomSetting() {
            this.$router.push({ name: 'customSetting' })
        },
        setheight(){
            if(/iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)){
                return 'height: '+25+'px'
            }

        }
    },
    created () {
    }
}
</script>


<style lang="less" scoped>
.custom-box {
    .custom-box-name {
        height: 88px;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: #333;
        line-height: 88px;
    }
    .footer {
        height: 50px;
    }
}
</style>
