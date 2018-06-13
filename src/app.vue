<template>
    <div>
        <div>
        <router-view></router-view>
        </div>
        <footer-nav :showNav="showNav"></footer-nav>
    </div>
</template>

<script>
import { footerNav } from './components'
import { mapActions, mapMutations } from 'vuex'
import * as types from './store/storage/mutations_types'

export default {
    name: 'app',
    data() {
        return {
            showNav:true
        }
    },
    components: {
        footerNav
    },
    watch: {
        // 如果路由有变化，会执行该方法
        '$route': function() {
        this.routeChange()
        }
    },
    created(){
        this.init();
        this.routeChange();
    },
    methods:{
        ...mapMutations({
            updateStorage: types.UPDATE_STORAGE
        }),
        ...mapActions({
            setUserInfo: 'setUserInfo'
        }),
        init(){
            this.updateStorage()
            this.setUserInfo({ vue: this }).then(rs => {
                this.hasUserInfo = true
            }).catch(error => {
                console.log(error)
            })
        },
        routeChange () {
            let path = this.$route.path
            if (path === '/' || path === '/detail') {
                this.showNav = true
            } else {
                this.showNav = false
            }
        }
    },
}
</script>

<style scoped>
</style>
