<template>
<app-card class="tile-box" v-if="tileList.length">
    <template slot="content">
        <grid :cols="4">
            <grid-item v-for="(item, index) in tileList" :key="index"  @click.native="open(item)">
                <span slot="icon">
                    <span v-if="showNumber(item.showtype,item.ext_id)==1" slot="icon">{{item.count}}</span>
                    <img v-if="showNumber(item.showtype,item.ext_id)==2" :src="item.iconurl" @error="imgError($event)">
                    <summer v-if="showNumber(item.showtype,item.ext_id)==3" :item=item></summer>  
                </span>
                <span slot="label">{{item.name}}</span>
            </grid-item>
        </grid>
    </template>
</app-card>
</template>
<script>
import { Grid, GridItem } from '../../common/grid/index'
import AppCard from '../../common/card/index'
import summer from '../summer/index'
import defaultImg from '../../../asset/images/default_application_icon.png'

export default {
    data() {
        return {
            tileList: [],
            loading: true,
            key: 'tile_list',
            cgi: '[phpApi]/app/getMobilepluginList'
        }
    },
    components: {
        Grid,
        GridItem,
        AppCard
    },
   
    methods: {
        async init() {
            try {
                let list = await this.getStorageData()
                if (list && list.data && list.data.code === 0) {
                    let data = {
                        hash: list.data.hash || '',
                        list: list.data.data || []
                    }
                    this.tileList = data.list
                    this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                        vue: this,
                        key: this.key,
                        data: data
                    })
                }
            } catch (e) {
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
            this.tileList = data.list || []
            return this.$http.get(this.cgi, { params })
        },
        showNumber(showtype,ext_id) {
            if(ext_id!=''){
                return 3
            }else{
                return showtype-0 +1
            }
        },
        open(item) {
            let parameters = {
                plugin_id: item.id,
            }
            this.Util.YYBridge.do('openPluginWithParams', parameters, rs => {
                // 打开后回调
            })
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
<style lang="less" scoped>
.tile-box {
    background: #fff;
    height: 180px;
}
</style>
