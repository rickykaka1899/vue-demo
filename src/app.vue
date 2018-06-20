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
    update(){
        this.stateChange();
    },
    methods:{
        ...mapMutations({
            updateStorage: types.UPDATE_STORAGE
        }),
        ...mapActions({
            setUserInfo: 'setUserInfo',
            getUserAuth: 'getUserAuth'
        }),
        init(){
            this.updateStorage()
            this.setUserInfo({ vue: this }).then(rs => {
                this.hasUserInfo = true
                this.getUserAuth({vue: this}).then(rs => {
                    console.log("getAuths")
                })
            }).catch(error => {
                console.log(error)
            })
        },
        routeChange () {
            let path = this.$route.path
            if (path === '/' || path === '/detail' || path === '/class' || path === '/classpub') {
                this.showNav = true
            } else {
                this.showNav = false
            }
        },
        stateChange(){
            console.log("state changed");
        }
    },
}
</script>

<style scoped>
</style>
