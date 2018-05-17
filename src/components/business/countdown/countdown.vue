<template>
    <div class="countdown">
        <div class="left">
            <span id="days" class="time">{{timeArr.days}}</span>天
        </div>
        <div class="right">
            <span id="hours" class="time">{{timeArr.hours}}</span>:<span id="minutes" class="time">{{timeArr.minutes}}</span>:<span id="seconds" class="time">{{timeArr.seconds}}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            timer: 0,
            endTime: 1538736000000,
            timeArr() {
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }
            }
        }
    },
    methods: {
        leftTimer(currentTime) {
            let obj = {},
                leftTime = new Date(this.endTime) - new Date(currentTime) //计算剩余的毫秒数
            if (leftTime > 0) {
                obj = {
                    days: parseInt(leftTime / 1000 / 60 / 60 / 24, 10), //计算剩余的天数
                    hours: parseInt((leftTime / 1000 / 60 / 60) % 24, 10), //计算剩余的小时
                    minutes: parseInt((leftTime / 1000 / 60) % 60, 10), //计算剩余的分钟
                    seconds: parseInt((leftTime / 1000) % 60, 10) //计算剩余的秒数
                }
            }
            this.timeArr = {
                days: this.checkTime(obj.days),
                hours: this.checkTime(obj.hours),
                minutes: this.checkTime(obj.minutes),
                seconds: this.checkTime(obj.seconds)
            }
        },
        checkTime(i) {
            return i >= 10 ? i : '0' + i
        },
        getData() {
            let promise = this.$http.get(
                'https://im.yonyoucloud.com/sysadmin/rest/system/time',
                {
                    responseType: 'text',
                    params: { r: Math.random() }
                }
            )
            return promise
        },
        async test() {
            try {
                let rs = await this.getData()
                let currentTime = parseInt(rs.data)
                if (isNaN(currentTime)) {
                    currentTime = +new date()
                }
                this.timer = setInterval(() => {
                    this.leftTimer(currentTime)
                    currentTime += 1000
                }, 1000)
            } catch (err) {
                //
            }
        }
    },
    mounted() {
        this.test()
    }
}
</script>

<style scoped lang="postcss">
    .countdown{
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        background:url('./bg.png') no-repeat;
        background-size: cover;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        color: #fff;
        font-size: 60px;
        line-height: 1;
        letter-spacing: 2px;
        font-family: PingFangSC-Medium,Microsoft YaHei,SimSun,Helvetica;
    }
    .left, .right{
        position: absolute;
        top: 93px;
    }
    .left{
        left: 165px;
    }
    .right{
        left: 357px;  
    }
    .right span{
        width: 77px;
        text-align: center;
        display: inline-block;
    }
    #days{
        padding-right: 12px;
    }
    .countdown :before{
        display: block;
        position: absolute;
        top: -23px;
        font-size: 14px;
        font-weight: 100;
        letter-spacing: normal;
    }
    #hours:before{
        content: 'Hours';
        left: 18px;     
    }
    #minutes:before{
        content: 'Minutes';
        left: 110px;
    }
    #seconds:before{
        content: 'Seconds';
        left: 200px;
    }
</style>
