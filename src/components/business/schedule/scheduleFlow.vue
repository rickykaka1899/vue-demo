<template>
    <div :class="['flow']">
        <div class="flow-left">
            <div class="flow-state">
                <icon :cls-name="showState()"></icon>
            </div>
            <div :class="activeIndex == 1 ?'flow-last-line' : ''" class="flow-line"></div>
        </div>
        <div class="flow-right">
            <div class="flow-content">
                <slot name="content"></slot>
            </div>
            <div class="flow-time">
                <slot name="time"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from '../../common/icon/index'
export default {
    components: {
        Icon
    },
    props: {
        type: {
            type: String
        },
        activeIndex: {
            type: String
        },
        lastFlow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {
        //日程类型显示
        showState() {
            if (this.type == 0) {
                return 'schedule-schedule'
            } else if (this.type == 1) {
                return 'schedule-task'
            } else if (this.type == 2) {
                return 'schedule-meeting'
            }
        }
    },
    mounted() {},
    created() {}
}
</script>
<style lang="less" scoped>
.bgTransition() {
    background: -webkit-linear-gradient(top, #00cdb5 0, #fff 100%);
    background: -moz-linear-gradient(top, #00cdb5 0, #fff 100%);
    background: -o-linear-gradient(top, #00cdb5 0, #fff 100%);
    background: linear-gradient(to bottom, #00cdb5 0, #fff 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(
            startColorstr=#00CDB5,
            endColorstr=#fff,
            GradientType=0
        );
}
.flow {
    width: 100%;
    padding: 0 40px;
    height: 114px;
    .flow-left {
        float: left;
        width: 37px;
        .flow-state {
            width: 37px;
            height: 37px;
            display: block;
            line-height: 0px;
            .icon {
                font-size: 37px;
            }
        }
        .flow-line {
            width: 2px;
            margin: 0 auto;
            height: 77px;
            background: #00ceb5;
        }
        .flow-line.flow-last-line {
            height: 49px;
            .bgTransition();
        }
    }
    .flow-right {
        float: left;
        padding-left: 20px;
        .flow-time {
            font-size: 22px;
            color: #9e9e9e;
            line-height: 42px;
        }
        .flow-content {
            font-size: 28px;
            color: #666666;
            height: 32px;
            line-height: 32px;
        }
    }
}
</style>
