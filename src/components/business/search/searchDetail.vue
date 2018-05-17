<template>
<div id="searchDetailBox">
	<div class="app-setting-search-main" v-show="hasSearchVal">
		<grid :cols="4">
            <div class="nodata" v-show="searchData.length<1">
                <no-data :nodataText="'没有搜索到“'+searchtext+'”相关内容'"></no-data>
            </div>
			<grid-item v-for="(item,index) in searchData" :key="index" @click.native="gotoAppdetail(item)">
				<span slot="icon" >
                    <img v-if="item.ext_id ==''" :src="item.icon" @error="imgError($event)">
                    <summer v-else :item=item></summer> 
					<span class="state">
						 <icon :cls-name="item.stateHot==1?'canplus':'noplus'"></icon>
					</span>
				</span>
				<span slot="label">{{item.name}}</span>
			</grid-item>
		</grid>
	</div>
</div>
</template>
<script>
// import appHeader from '../components/common/header/index'
import { Grid, GridItem } from '../../common/grid/index'
import Icon from '../../common/icon/index'
import AppSortable from '../sortable/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
import summer from '../summer/index'
import noData from '../../common/no-data/index'
import { redirect } from '../../../mixins/redirect'
export default {
    mixins: [redirect],
    props:{
        searchCallBack: {
            type: Function,
            default: function () {}
        },
        searchtext : {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            hasSearchVal: false, //无searchVal时，不显示任何数据
            localName: 'application_all_list',
            appList: [],
            list: [],
            hash_switch: 'on',
            hash: '',
            searchFlg:true,
            nodataText:''
        }
    },
    components: {
        Icon,
        AppSortable,
        Grid,
        GridItem,
        summer,
        noData
    },
    computed: {
        //当searchVal发生改变时触发，过滤数据
        searchData: function() {
            var searchtext = this.searchtext
            if (searchtext) {
                this.hasSearchVal = true
                return this.appList.filter(function(item) {
                    return String(item.name).toLowerCase().indexOf(searchtext) > -1
                })
            } else {
                this.hasSearchVal = false
            }
            return this.appList
        }
    },
    mounted() {},
    methods: {
        gotoAppdetail(item) {
            this.mixdirect_goAppUrl(item)
        },
        //返回搜索val
        searchCallBack(val) {
            this.searchtext = val
        },
        //因为进入搜索时，缓存中一定有处理过的数据，直接获取，无需再次请求数据并过滤
        getAllAppList() {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            for (var i = 0; i < this.list.length; i++) {
                this.appList.push.apply(this.appList, this.list[i].list)
            }
        },
        //图片错误处理
        imgError(obj) {
            let $img = obj.target
            $img && $img.setAttribute('src', defaultImg)
        },
        init(){
            this.searchFlg=false
            setTimeout(()=>{
                this.searchFlg=true
            },10)
            this.getAllAppList()
        }
    },
    created() {
    },
    activated() {
        this.init()
    }
}
</script>
<style scoped>
#searchDetailBox>>>.grid-item .item .grid-icon {
    position: relative;
}
</style>
<style lang="less" scoped>
body {
    background: #f9f9f9;
    width: 100%;
}
#searchDetailBox {
    .app-setting-search-main {
        background: #fff;
        .nodata{
            height: 300px;
        }
        .state {
            position: absolute;
            width: 28px !important;
            height: 28px !important;
            line-height: 28px;
            text-align: center;
            top: 0;
            right: -44px;
            border-radius: 14px;
            font-size: 0;
            .icon {
                font-size: 24px;
            }
        }
    }
}
</style>
