<template>
   <div class="summer-content" @click="getSumer">
        <img :src="item.icon||item.iconurl" @error="imgError($event)">
        <div class="load-out" v-if="loadFlg">
            <div class="load-inner">
            </div>
        </div>
        <div class="load-content" id="load_content" v-show="loadFlg">
            <canvas id="cvs"></canvas>
            <!-- <div class="sub-content l">
                <span id="leftLoad" :style="leftLoad"></span>
            </div>
            <div class="sub-content r">
                <span id="rightLoad" :style="rightLoad"></span>
            </div> -->
        </div>
        <div class="name"></div>
    </div>
</template>

<script>
import Icon from '../../common/icon/index'
import defaultImg from '../../../asset/images/default_application_icon.png'
export default {
    components: {
        Icon,
        defaultImg
    },
    props: {
        item:{
            type:Object,
            default:{}
        }
       
    },
    data() {
        return {
            leftLoad:'',
            rightLoad:'',
            loadFlg:false,
            getFlg:false,
            loadW:'',
            ctx:'',
            initprogress:0.1,
        }
    },
    methods: {
        download(data){
            this.loadFlg =true
            this.loadW = document.getElementById('load_content').clientWidth/2
            let progress = (JSON.parse(data).progress)/100
            let ctx = document.getElementById('cvs').getContext('2d');
            if(progress<1){
                ctx.clearRect(0,0,300,300);
                ctx.fillStyle="rgba(0, 0, 0, .5)"
                ctx.sector(this.loadW,this.loadW,this.loadW,Math.PI/180*(progress*360+270),Math.PI/180*270).fill(); 
            }else{
                ctx.clearRect(0,0,300,300);
                this.loadFlg =false
                this.getFlg = false
            }
        },
        getSumer(){
            if(this.getFlg){
                return
            }
            this.getFlg = true
            let parameters = {
                plugin_id: this.item.id,
                registerHandler: [
                    {"action":this.download,"parameters":'summer_progress'}
                ]
            }
            this.Util.YYBridge.do('openPluginWithParams', parameters, rs => {
                // 打开后回调
            })
        },
        imgError(obj) {
            let $img = obj.target
            $img && $img.setAttribute('src', defaultImg)
        },
        init(){
             //扇形
            CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
                // 初始保存
                this.save();
                // 位移到目标点
                this.translate(x, y);
                this.beginPath();
                // 画出圆弧
                this.arc(0,0,radius,sDeg, eDeg);
                // 再次保存以备旋转
                this.save();
                // 旋转至起始角度
                this.rotate(eDeg);
                // 移动到终点，准备连接终点与圆心
                this.moveTo(radius,0);
                // 连接到圆心
                this.lineTo(0,0);
                // 还原
                this.restore();
                // 旋转至起点角度
                this.rotate(sDeg);
                // 从圆心连接到起点
                this.lineTo(radius,0);
                this.closePath();
                // 还原到最初保存的状态
                this.restore();
                return this;
            }
        }
    },
    created () {
        this.init()
    }
}
</script>


<style lang="less" scoped>

	.summer-content {
        position: relative;
        width: 60px;
        height: 108px;
        img{
            position: absolute;
            z-index: 2;
            left: 0;
            top: 0;
            width: 100%;
            height: 60px;
        }
        .load-out{
            width: 60px;
            height: 60px;
            border-radius: 10px;
            box-sizing: border-box;
            position: absolute;
            z-index: 1;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, .5);
            .load-inner{
                position: relative;
                left: 9px;
                top: 9px;
                width: 42px;
                height: 42px;
                border-radius: 21px;
                background-color: white;
            }
           
        }
        @w:42px;    
        @mw:21px;    
        .load-content{
            position: absolute;
            top: 9px;
            left: 9px;
            width: @w;
            height: @w;
            // border-radius: 50%;
            overflow: hidden;
            z-index: 3;
            font-size: 0;
            margin: 0;
            padding: 0;
                    // background-color: rgba(0, 0, 0, .5);
           
            .sub-content{
                position: absolute;
                width: @mw;
                height: 100%;
                overflow: hidden;
                font-size: 0;
                margin: 0;
                padding: 0;
                // box-sizing: border-box;
                box-sizing: border-box;
                
                span{
                    display: block;
                    position: absolute;
                    top: 0px;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, .5);
                    border: none;
                    margin: 0;
                    padding: 0;
                }

            }
            .l{
                left: 0px;
                top: 0;
                border-radius:@mw 0 0 @mw;
            }
            .r{
                border-radius:0 @mw  @mw  0;
                left: @mw;
                top: 0;
            }
            .l span{
                transform-origin: 100% 50%;
                transform: rotate(0deg);
                right: 0px;
            }
            .r span{
                transform-origin: 0 50%;
                transform: rotate(0deg);
                left:0px;
            }
        }
    }


</style>
