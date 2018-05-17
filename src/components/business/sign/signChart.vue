<template>
    <div class="sign-chart">
        <div class="sign-chart-con" v-show="!noDataIcon && !loading">
            <div class="sign-chart-title" v-if="!(type == 0 && !isLooseClassesMonth)"  :class="isLooseClassesMonth ? 'sign-chart-loose' : ''" v-html="chartTitle"></div>
            <div class="sign-chart-canvas">
                <canvas :id="canvasId" width="610" height="460" style="width: 305px;height: 230px"></canvas>
            </div>
        </div>
        <div class="sign-chart-load loading-content" v-show="!(!noDataIcon && !loading)">
            <inline-loading v-if="loading"></inline-loading>
            <no-data v-else :nodataText="noDataText"></no-data>
        </div>
    </div>
</template>
<script>
import inlineLoading from '../../common/inline-loading/index'
import noData from '../../common/no-data/index'
export default {
    components: {
        inlineLoading,
        noData
    },
    props: {
        canvasId: {
            type: String
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            chartTitle: '',
            noDataText: this.$t('sign.noDataText'),
            personalTitle: this.$t('sign.personalTitle'),
            deptDayTitle: this.$t('sign.deptDayTitle'),
            deptMonthTitle: this.$t('sign.deptMonthTitle'),
            attendanceTime: this.$t('sign.attendanceTime'),
            attendanceUnit: this.$t('sign.attendanceUnit'),
            attendanceTimeDaily: this.$t('sign.attendanceTimeDaily'),
            workingHoursRanking: this.$t('sign.workingHoursRanking'),
            chartItemList: this.$t('sign.signChartItem'),
            deptChartList: [],
            bgColor: {},
            localName: 'sign_chart_list',
            isLooseClassesMonth: false,
            showList: [],
            personalList: [],
            personalHash: '',
            dayList: [],
            dayHash: '',
            loading: true,
            noDataIcon: false,
            monthList: [],
            monthHash: '',
            baseUrl: {
                personalUrl:
                    '[javaApi]/signin/workbench/getPersonal?pointMonth=' +
                    this.Util.time.formatDate(new Date().getTime(), 'yyyy-MM') +
                    '&',
                dayUrl: '[javaApi]/signin/workbench/getDepartmentDaily?',
                monthUrl: '[javaApi]/signin/workbench/getDepartmentMonthly?'
            },
            p_flg: false,
            m_flg: false,
            d_flg: false
        }
    },
    computed: {},
    methods: {
        //获取个人数据列表
        getPersonalList(context) {
            let storeData = this.$store.getters.getCurrentQzStorageDataByKey(this.localName + this.type) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.personalList = storeData.list || {}
            this.personalHash = storeData.hash || ''
            this.$http
                .get(this.baseUrl.personalUrl + '&hash=' + this.personalHash)
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.personalList = this.resetData(reData, hash)
                    this.getIsLooseClassesMonth(context)
                })
                .catch(data => {
                    this.getIsLooseClassesMonth(context)
                })
            // setTimeout(() => {
            //     if (this.p_flg) {
            //         this.getIsLooseClassesMonth(context)
            //     }
            // }, 5000)
        },
        //是否为个人平均统计图
        getIsLooseClassesMonth(context) {
            this.p_flg = false
            var isLooseClassesMonth = this.personalList.isLooseClassesMonth
            var normal = this.personalList.countNormal
            var early = this.personalList.countEarly
            var late = this.personalList.countLate
            var noSignin = this.personalList.countNoSignin
            if (isLooseClassesMonth == 1) {
                this.isLooseClassesMonth = true
                this.chartTitle =
                    this.attendanceTime +
                    ' ' +
                    this.personalList.attendanceTime +
                    ' ' +
                    this.attendanceUnit +
                    ' / ' +
                    this.attendanceTimeDaily +
                    ' ' +
                    this.personalList.attendanceTime
                    +' ' +
                    this.attendanceUnit
            } else {
                this.isLooseClassesMonth = false
                this.chartTitle = this.personalTitle
            }
            this.personalList.attendanceTimeDaily
            if (normal == 0 && early == 0 && late == 0 && noSignin == 0) {
                this.loading = false
                this.noDataIcon = true
            } else {
                this.loading = false
                this.noDataIcon = false
                this.getCircleChart(context, normal, late, early, noSignin)
            }
        },
        //获取日数据列表
        getDayList(context) {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName + this.type
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.dayList = storeData.list || {}
            this.dayHash = storeData.hash || ''
            this.$http
                .get(this.baseUrl.dayUrl + '&hash=' + this.dayHash)
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.dayList = this.resetData(reData, hash)
                    this.getDayChart(context)
                })
                .catch(data => {
                    this.getDayChart(context)
                })
            setTimeout(() => {
                if (this.d_flg) {
                    this.getDayChart(context)
                }
            }, 5000)
        },
        getDayChart(context) {
            this.d_flg = false
            var normal = this.dayList.countNormal
            var late = this.dayList.countLate
            var noSignin = this.dayList.countNoSignin
            if (normal == 0 && late == 0 && noSignin == 0) {
                this.loading = false
                this.noDataIcon = true
            } else {
                this.loading = false
                this.noDataIcon = false
                this.getCircleChart(context, 100, 11, 0, 100)
            }
        },
        //获取月份数据列表
        getMonthList(context) {
            let storeData =
                this.$store.getters.getCurrentQzStorageDataByKey(
                    this.localName + this.type
                ) || {} //获取store数据优先展示；如数据有更新再次覆盖
            this.monthList = storeData.list || []
            this.monthHash = storeData.hash || ''
            this.$http
                .get(this.baseUrl.monthUrl + '&hash=' + this.monthHash)
                .then(res => {
                    let reData = res.data.data || [],
                        hash = res.data.hash || ''
                    this.monthList = this.resetData(reData, hash)
                    this.getMonthChart(context)
                })
                .catch(data => {
                    this.getMonthChart(context)
                })
            setTimeout(() => {
                if (this.m_flg) {
                    this.getMonthChart(context)
                }
            }, 5000)
        },
        getMonthChart(context) {
            this.m_flg = false
            if (this.monthList.list.length > 0) {
                this.loading = false
                this.noDataIcon = false
                this.deptChartList = []
                var memberList = this.monthList.list
                for (let i = 0; i < memberList.length; i++) {
                    this.deptChartList.push(memberList[i])
                }
                this.getRectangleChart(context)
                if (this.deptChartList[0].workHour > 0) {
                    this.getRemarks(
                        context,
                        60,
                        55,
                        50,
                        38,
                        '#00E6CD',
                        '#00CDB5',
                        this.deptChartList[0].workHour + 'h'
                    )
                }
            } else {
                this.loading = false
                this.noDataIcon = true
            }
        },
        resetData(list, hash) {
            let data = {
                list: list,
                hash: hash
            }
            this.$store.dispatch('updateCurrentQzStorageDataByKey', {
                vue: this,
                key: this.localName + this.type,
                data: data
            })
            return list
        },
        //转换弧度
        getRadian(i) {
            return Math.PI * i / 180
        },
        //画实线
        getLine(context, startX, startY, endX, endY, color) {
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(endX, endY)
            context.strokeStyle = color
            context.stroke()
        },
        //画虚线
        getLine2(context, startX, startY, endX, endY, color) {
            context.setLineDash([10, 10]) //每段的线长10，间隔10
            context.lineWidth = 1 //线宽
            context.strokeStyle = color
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(endX, endY)
            context.stroke()
        },
        //画平三角形
        getTriangle(context, startX, startY, width, height, color) {
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(startX + width, startY)
            context.lineTo(startX + width / 2, startY + height)
            context.fillStyle = color
            context.fill()
            context.closePath()
        },
        //画圆弧
        getCircle(
            context,
            centerX,
            centerY,
            startAngle,
            endAngle,
            radius,
            color
        ) {
            context.beginPath()
            context.moveTo(centerX, centerY)
            context.arc(
                centerX,
                centerY,
                radius,
                this.getRadian(startAngle),
                this.getRadian(endAngle),
                false
            )
            context.closePath()
            context.fillStyle = color
            context.fill()
        },
        //画矩形
        getRectangle(context, startX, startY, width, height, color) {
            context.beginPath()
            context.fillStyle = color
            context.rect(startX, startY, width, height)
            context.fill()
            context.closePath()
        },
        //画渐变色
        getGradientColor(
            context,
            startX,
            startY,
            endX,
            endY,
            startColor,
            endColor
        ) {
            var grad = context.createLinearGradient(startX, startY, endX, endY) //使用渐变颜色填充,从(0,0)到(170,0)
            grad.addColorStop(0, startColor) //起始颜色
            grad.addColorStop(1, endColor) //终点颜色
            return grad
        },
        //画备注
        getRemarks(
            context,
            centerX,
            centerY,
            width,
            height,
            startColor,
            endColor,
            content
        ) {
            let circleColor = this.getGradientColor(
                context,
                centerX,
                centerY - height / 2,
                centerX,
                centerY + height / 2,
                startColor,
                endColor
            )
            let RectangleColor = this.getGradientColor(
                context,
                centerX,
                centerY - height / 2,
                centerX,
                centerY + height / 2,
                startColor,
                endColor
            )
            this.getCircle(
                context,
                centerX - width / 2,
                centerY,
                90,
                270,
                height / 2,
                circleColor
            )
            this.getCircle(
                context,
                centerX + width / 2,
                centerY,
                -90,
                90,
                height / 2,
                circleColor
            )
            this.getRectangle(
                context,
                centerX - width / 2,
                centerY - height / 2,
                width,
                height,
                RectangleColor
            )
            this.getTriangle(
                context,
                centerX - 8,
                centerY + height / 2,
                16,
                8,
                endColor
            )
            this.drawText(
                context,
                centerX,
                centerY + 7,
                '#fff',
                content,
                '19px PingFang SC',
                'center'
            )
        },
        //画柱形统计的每一项
        getRectangleItem(
            context,
            startX,
            startY,
            width,
            height,
            startColor,
            endColor
        ) {
            if (height < 22) {
                let gradientColor = this.getGradientColor(
                    context,
                    startX,
                    startY,
                    startX,
                    startY + height,
                    startColor,
                    endColor
                )
                this.getCircle(
                    context,
                    startX + width / 2,
                    startY + width / 2,
                    -90,
                    270,
                    width / 2,
                    gradientColor
                )
                this.getRectangle(
                    context,
                    startX,
                    startY + height,
                    width,
                    22,
                    '#fff'
                )
            } else {
                let gradientColor = this.getGradientColor(
                    context,
                    startX,
                    startY + width / 2,
                    startX + width,
                    startY + height - width / 2,
                    startColor,
                    endColor
                )
                this.getCircle(
                    context,
                    startX + width / 2,
                    startY + width / 2,
                    -180,
                    0,
                    width / 2,
                    startColor
                )
                this.getRectangle(
                    context,
                    startX,
                    startY + width / 2 - 1,
                    width,
                    height - width + 1,
                    gradientColor
                )
                this.getCircle(
                    context,
                    startX + width / 2,
                    startY + height - width / 2,
                    0,
                    180,
                    width / 2,
                    endColor
                )
            }
        },
        //描绘柱状图文字
        drawText(
            context,
            centerX,
            centerY,
            color,
            content,
            fontSize,
            textAlign,
            maxWidth
        ) {
            context.beginPath()
            context.fillStyle = color
            context.textAlign = textAlign
            context.font = fontSize
            context.fillText(content, centerX, centerY, maxWidth)
            context.closePath()
        },
        //描绘文字
        drawCircularText(context, string, startAngle, endAngle) {
            if (endAngle <= startAngle) {
                return
            }
            var radius = 190
            var angle = parseFloat((endAngle - startAngle) / 2 + startAngle)
            context.save()
            context.fillStyle = '#666'
            context.font = '24px PingFang SC'
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.save()
            context.beginPath()
            context.translate(
                305 + Math.cos(angle) * radius,
                170 + Math.sin(angle) * radius
            )
            //context.rotate(Math.PI/2 + angle); //文字旋转
            context.fillText(string, 0, 0)
            context.restore()
        },
        //计算占据比例并画图
        getCircleChart(context, normal, late, early, noSign) {
            let total = noSign + early + normal + late
            let centNo = parseFloat((noSign / total).toFixed(4))
            let centEarly = parseFloat((early / total).toFixed(4))
            let centNormal = parseFloat((normal / total).toFixed(4))
            let centLate = parseFloat((late / total).toFixed(4))
            let centTotal = centNo + centEarly + centNormal + centLate
            if (centTotal != 1) {
                var offset = parseFloat((1 - centTotal).toFixed(4))
                centNormal > 0
                    ? (centNormal = centNormal + offset)
                    : centNo > 0
                      ? (centNo = centNo + offset)
                      : centEarly > 0
                        ? (centEarly = centEarly + offset)
                        : centLate > 0
                          ? (centLate = centLate + offset)
                          : centLate
            }
            let radNormal = -90 + centNormal * 360
            let radLate = radNormal + centLate * 360
            let radEarly = radLate + centEarly * 360
            let radNo = radEarly + centNo * 360
            let minY = 170 + Math.sin(this.getRadian(-90)) * 160
            let radNormalY =
                centNormal == 1
                    ? minY + 320
                    : 170 + Math.sin(this.getRadian(radNormal)) * 160
            let radLateY =
                centLate == 1
                    ? minY + 320
                    : 170 + Math.sin(this.getRadian(radLate)) * 160
            let radEarlyY =
                centEarly == 1
                    ? minY + 320
                    : 170 + Math.sin(this.getRadian(radEarly)) * 160
            let radNoY =
                centNo == 1
                    ? minY + 320
                    : 170 + Math.sin(this.getRadian(radNo)) * 160
            let normalColor = this.getGradientColor(
                context,
                305,
                minY,
                305,
                radNormalY,
                '#00E6CD',
                '#00CDB5'
            )
            let lateColor = this.getGradientColor(
                context,
                305,
                radNormalY,
                305,
                radLateY,
                '#E87672',
                '#E14C46'
            )
            let earlyColor = this.getGradientColor(
                context,
                305,
                radLateY,
                305,
                radEarlyY,
                '#5BCCFF',
                '#47BAEE'
            )
            let noColor = this.getGradientColor(
                context,
                305,
                radEarlyY,
                305,
                radNoY,
                '#EEEEEE',
                '#D9D9D9'
            )
            this.getCircle(context, 305, 170, -90, radNormal, 160, normalColor)
            this.getCircle(
                context,
                305,
                170,
                radNormal,
                radLate,
                160,
                lateColor
            )
            this.getCircle(
                context,
                305,
                170,
                radLate,
                radEarly,
                160,
                earlyColor
            )
            this.getCircle(context, 305, 170, radEarly, radNo, 160, noColor)
            this.chartItemList[0].count = normal + '次'
            this.chartItemList[1].count = late + '次'
            this.chartItemList[2].count = early + '次'
            this.chartItemList[3].count = noSign + '次'
            for (var i = 0; i < this.chartItemList.length; i++) {
                let color = this.chartItemList[i].color
                let X = i == 0 || i == 2 ? 120 : 350
                let Y = i < 2 ? 389 : 449
                this.getCircle(context, X, Y - 9, -90, 270, 11, color)
                var name = this.getName(this.chartItemList[i].des)
                name = name + ' ' + this.chartItemList[i].count
                this.drawText(
                    context,
                    X + 20,
                    Y,
                    '#999999',
                    name,
                    '24px PingFang SC',
                    'left'
                )
            }
        },
        //姓名显示计算
        getName(string) {
            if (!string) {
                return ' '
            }
            var str = string
            if (str.length > 3) {
                return str.substring(str.length - 3)
            } else {
                return str.substring(str.length - 3)
            }
        },
        //柱状统计图
        getRectangleChart(context) {
            var deptChart = this.deptChartList
            var maxCount = parseFloat(deptChart[0].workHour);
            var scale = maxCount == 0 ? 0 : 300 / maxCount
            var workHour = this.monthList.workHour
            let workHourY = 398 - workHour * scale
            this.getLine2(context, 0, workHourY, 610, workHourY, '#D9D9D9')
            this.getCircle(context, 560, workHourY, 0, 360, 5, '#01E7CD')
            this.getRemarks(
                context,
                560,
                workHourY - 45,
                50,
                38,
                '#00CDB5',
                '#00E6CD',
                workHour + 'h'
            )
            for (var i = 0; i < deptChart.length; i++) {
                var X = 50 + i * 110
                var width = 20
                var height = deptChart[i].workHour * scale
                if (height > 0) {
                    var Y = 398 - height
                    this.getRectangleItem(
                        context,
                        X,
                        Y,
                        width,
                        height,
                        '#E87672',
                        '#E14C46'
                    )
                }
                var name = this.getName(deptChart[i].userName)
                this.drawText(
                    context,
                    X + 10,
                    455,
                    '#999999',
                    name,
                    '24px PingFang SC',
                    'center'
                )
            }
        }
    },
    mounted() {
        var canvas = document.getElementById(this.canvasId)
        var context = canvas.getContext('2d')
        if (this.type == 1 || this.type == 0) {
            this.getPersonalList(context)
        } else if (this.type == 2) {
            this.chartTitle = this.deptDayTitle
            this.getDayList(context)
        } else if (this.type == 3) {
            this.chartTitle = this.deptMonthTitle
            this.getMonthList(context)
        }
    },
    created() {}
}
</script>
<style lang="less" scoped>
.sign-chart {
    .sign-chart-con {
        .sign-chart-title {
            width: 100%;
            padding: 0 40px;
            margin: 20px 0;
            font-size: 28px;
            height: 28px;
            color: #333333;
        }
        .sign-chart-canvas {
            width: 100%;
            min-height: 370px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sign-chart-loose {
            text-align: center;
        }
    }
    .sign-chart-load {
        width: 100%;
        padding: 0 40px;
        height: 520px;
    }
    .loading-content {
        text-align: center;
        line-height: 520px;
    }
}
</style>
