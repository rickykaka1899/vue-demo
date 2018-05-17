<template>
	<div class="search-box" >
		<icon cls-name="search-empty"></icon>
		<input class="search-input"
			   :placeholder="placeholder"
			   :disabled="disabled"
			   v-focus="focusStatus"
			   v-on:input ="getChangeVal"
			   v-model='searchVal'/>
		<icon v-if="searchVal != ''" cls-name="delete-empty" @click.native="cleanVal"></icon>
	</div>
</template>

<script>
    import Icon from '../../common/icon/index'
export default {
    data() {
        return {
        }
    },
	props: {
        searchCallBack: {
            type: Function,
            default: function () {}
        },
        searchVal : {
            type: String,
            default: ''
        },
        focusStatus : {
            type: Boolean,
            default: false
		},
        placeholder: {
			type: String,
			default: '搜索'
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
    components: {
        Icon,
    },
    methods: {
        //val改变时触发
		getChangeVal(){
		    this.searchCallBack(this.searchVal)
		},
        //清除内容
        cleanVal(){
            this.searchVal = ''
            this.searchCallBack(false)
        },
	},
    directives: {
        focus: {
            inserted: function (el, binding) {
                if (binding.value == "true") {
                    el.focus();
                }
            }
        }
    },
}
</script>

<style  lang="less" scoped>
	.search-box{
		position: relative;
		width: 100%;
		height:100%;
		line-height: 0;
		background: #FFFFFF;
		opacity: 0.82;
		padding:29px 20px;
		.icon{
			position: absolute;
			top: 29px;
			line-height: 72px;
			font-size: 30px;
			&.icon-search-empty{
				left:43px;
			}
			&.icon-delete-empty{
				right:43px;
			}
		}
		.search-input{
			width: 100%;
			height : 72px;
			border: none;
			border-radius: 16px;
			color: #333;
			font-size: 28px;
			line-height: 30px;
			background:rgba(51,51,51,0.05);
			padding: 20px 65px;
			cursor: text;
			outline: none;
			font-weight: 300;
			box-sizing: border-box;
			-webkit-tap-highlight-color: transparent;
			&::-webkit-input-placeholder {
				color:#BBBBBB;
				line-height: normal;
				font-size: 28px;
			}
			&:-moz-placeholder {
				color:#BBBBBB;
				line-height: normal;
				font-size: 28px;
			}
			&::-moz-placeholder {
				color:#BBBBBB;
				line-height: normal;
				font-size: 28px;
			}
			&:-ms-input-placeholder {
				color:#BBBBBB;
				line-height: normal;
				font-size: 28px;
			}
		}
		// 
		// input:focus{color:red}//光标颜色
		// input{
		// 	text-shadow: 0px 0px 0px #333333;//文字颜色
		// 	-webkit-text-fill-color: transparent;
		// }

	}
</style>
