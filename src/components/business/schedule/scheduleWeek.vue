<template>
    <div class="schedule-week">
        <div class="schedule-week-title">
            <div v-for="i in weekArray" :key="i">{{i}}</div>
        </div>
        <div class="schedule-week-day">
            <div class="currentWeek" v-for="item in currentWeekArray" :key="item">
                <div
                    @click="scheduleHandle(item)"
                    :class="[(item.isSelected && item.isToday) ? 'active-today' : '', item.isSelected ? 'active' : '', item.hasData ? 'hasData' : '']"
                    :style="item.isToday ? 'color: #FA4F52':'' ">
                    {{item.day}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    props: {
        scheduleCallBack: {
            type: Function,
            default: function() {}
        },
        appSystem: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            weekArray: this.$t('schedule.weekArray'), //语言包获取一周数字
            currentWeekArray: [],
            activeIndex: '',
            initFlag: true,
            nowDateObj: {},
            focusDate: '',
            localName: 'schedule_date_list',
            list: [],
            hash_switch: 'on',
            hash: ''
        }
    },
    computed: {},
    methods: {
        //日程返回处理
        scheduleHandle(item) {
            for (var i = 0; i < this.currentWeekArray.length; i++) {
                if (this.currentWeekArray[i].dateStr === item.dateStr) {
                    this.currentWeekArray[i].isSelected = true
                    this.activeIndex = i
                    item.isSelected = true
                } else {
                    this.currentWeekArray[i].isSelected = false
                }
            }
            this.scheduleCallBack(item)
        },

        //处理显示时间
        timeHandle(num) {
            var numStr = num < 10 ? '0' + num : num
            return numStr
        },
        //获取日期信息
        getDateInfo(date) {
            // 特殊处理php时间戳
            if (date && date.length === 10) {
                date = date * 1000
            }
            if (!date) {
                date = new Date()
            }
            var month = date.getMonth() + 1
            var day = date.getDate()
            var hour = date.getHours()
            var min = date.getMinutes()
            var second = date.getSeconds()
            var week = date.getDay()
            var timestamp = date.getTime()
            var weekStr = ''
            var monthStr = this.timeHandle(month)
            var dayStr = this.timeHandle(day)
            switch (week) {
                case 1:
                    weekStr = '星期一'
                    break
                case 2:
                    weekStr = '星期二'
                    break
                case 3:
                    weekStr = '星期三'
                    break
                case 4:
                    weekStr = '星期四'
                    break
                case 5:
                    weekStr = '星期五'
                    break
                case 6:
                    weekStr = '星期六'
                    break
                case 0:
                    weekStr = '星期日'
                    break
            }
            return {
                year: date.getFullYear(),
                month: month,
                monthStr: monthStr,
                day: day,
                dayStr: dayStr,
                hour: hour,
                hourStr: this.timeHandle(hour),
                min: min,
                minStr: this.timeHandle(min),
                second: second,
                secondStr: this.timeHandle(second),
                week: week,
                weekStr: weekStr,
                timestamp: timestamp,
                DateStr: date.getFullYear() + '-' + monthStr + '-' + dayStr
            }
        },
        //获取是否有时间段内是否有日程
        getHasDataDate(startTime, endTime) {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.list = storeData.list || []
            this.hash = storeData.hash || ''
            if (this.list.length > 0) {
                for (var i = 0; i < this.list.length; i++) {
                    this.handleHasDataDate(this.list[i])
                }
            }
            this.$http
                .get(
                    '[phpApi]/schedule/getSchuduleByDate?hash_switch=' +
                        this.hash_switch +
                        '&hash=' +
                        this.hash,
                    {
                        params: {
                            start_date: startTime,
                            end_date: endTime
                        }
                    }
                )
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.list = this.resetData(reData, hash)
                })
                .catch(data => {})
        },
        //更新数据

        resetData(list, hash) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    this.handleHasDataDate(list[i])
                }
            }
            let data = {
                list: list,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName,
                data: data
            })
            return list
        },
        //处理有日程的日期
        handleHasDataDate(timestamp) {
            let date = new Date(timestamp * 1000) //特殊处理php的时间戳
            let yearStr = date.getFullYear()
            let monthStr = this.timeHandle(date.getMonth() + 1)
            let dayStr = this.timeHandle(date.getDate())
            let dateStr = yearStr + '-' + monthStr + '-' + dayStr
            for (var i = 0; i < this.currentWeekArray.length; i++) {
                if (this.currentWeekArray[i].dateStr === dateStr) {
                    this.currentWeekArray[i].hasData = 1
                    return
                }
            }
        },
        //获取一周日期数组
        getWeekArray() {
            var timestamp = this.nowDateObj.timestamp
            var oneDay = 1000 * 60 * 60 * 24
            var week = this.nowDateObj.week //当前是周几，由此推算出当前周的第一天和最后一天
            var beforeDays = week //前面还有几天
            var afterDays = 7 - week //后面还有几天
            var firstDate = timestamp - beforeDays * oneDay
            var lastDate = timestamp + afterDays * oneDay
            var startDate = Math.floor(firstDate / 1000)
            var endDate = Math.floor(lastDate / 1000)
            var weekArray = []
            for (let i = 0; i < 7; i++) {
                let currentTimestamp = firstDate + oneDay * i
                let date = new Date(currentTimestamp)
                let dateInfo = this.getDateInfo(date)
                let itemData = {
                    day: date.getDate(),
                    timestamp: currentTimestamp,
                    hasData: 0,
                    index: i,
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    isSelected: this.focusDate === dateInfo.DateStr,
                    dateStr: dateInfo.DateStr,
                    isToday:
                        this.nowDateObj.DateStr === dateInfo.DateStr ? 1 : 0
                }
                if(itemData.isToday && this.initFlag){
                    this.activeIndex = i;
                }
                weekArray.push(itemData)
            }
            this.currentWeekArray = weekArray
            this.getHasDataDate(startDate, endDate)
        },
        getList(){
            for (var i = 0; i < this.currentWeekArray.length; i++) {
                if(this.initFlag){
                    if (this.currentWeekArray[i].isSelected == true && this.currentWeekArray[i].isToday == 1) {
                        this.scheduleCallBack(this.currentWeekArray[i])
                    }
                }else {
                    if(this.activeIndex == i){
                        this.currentWeekArray[i].isSelected = true
                        this.scheduleCallBack(this.currentWeekArray[i])
                    }else {
                        this.currentWeekArray[i].isSelected = false
                    }
                }
            }
        }
    },
    mounted(){
        this.getList()
        this.$eventbus.$on('updateApplist.alllist', refresh => {
            if(refresh == 'all' || refresh == this.appSystem.appid){
                this.initFlag = false;
                this.getWeekArray()
                this.getList()
            }
        })
    },
    created() {
        this.nowDateObj = this.getDateInfo()
        this.focusDate = this.nowDateObj.DateStr
        this.getWeekArray()
    }
}
</script>
<style lang="less" scoped>
.bgTransition() {
    background: -webkit-linear-gradient(top, #e14c46 0, #e87672 100%);
    background: -moz-linear-gradient(top, #e14c46 0, #e87672 100%);
    background: -o-linear-gradient(top, #e14c46 0, #e87672 100%);
    background: linear-gradient(to bottom, #e14c46 0, #e87672 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(
            startColorstr=#E14C46,
            endColorstr=#E87672,
            GradientType=0
        );
}
.bgTransition1() {
    background: -webkit-linear-gradient(top, #666666 0, #868686 100%);
    background: -moz-linear-gradient(top, #666666 0, #868686 100%);
    background: -o-linear-gradient(top, #666666 0, #868686 100%);
    background: linear-gradient(to bottom, #666666 0, #868686 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(
            startColorstr=#666666,
            endColorstr=#868686,
            GradientType=0
    );
}
.schedule-week {
    width: 100%;
    padding: 0 10px;
    .schedule-week-title {
        overflow: hidden;
        div {
            width: 14.28%;
            float: left;
            text-align: center;
            height: 64px;
            line-height: 64px;
            font-size: 24px;
            color: #9e9e9e;
        }
    }
    .schedule-week-day {
        width: 100%;
        height: 82px;
        margin-bottom: 18px;
        .currentWeek {
            width: 14.28%;
            float: left;
            height: 82px;
            div {
                text-align: center;
                position: relative;
                margin: 0 auto;
                width: 82px;
                line-height: 82px;
                height: 100%;
                font-size: 30px;
                color: #333333;
                border-radius: 50%;
            }
            div.hasData{
                line-height: 70px;
            }
            div.active {
                .bgTransition1();
                color: #fff !important;
            }
            div.active-today.active{
                .bgTransition();
                color: #fff !important;
            }
            div.hasData:hover:after {
                background-color: #ffffff !important;
            }
            div.hasData:after {
                content: '';
                width: 8px;
                height: 8px;
                background-color: #333333;
                position: absolute;
                border-radius: 50%;
                top: 56px;
                left: 37px;
            }
            div.active.hasData:after {
                background-color: #ffffff !important;
            }
        }
    }
}
</style>
