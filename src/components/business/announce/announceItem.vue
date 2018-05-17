<template>
    <div :class="['app-announce-item']">
        <div :class="haveimg?'announce-left':'announce-list'" >
            <div class="announce-title"><slot name="title"></slot></div>
            <div class="announce-dept"><slot name="dept"></slot></div>
        </div>
        <div class="announce-right" v-if="haveimg"><slot name="icon"></slot></div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        haveimg: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    }
}
</script>
<style lang="less" scoped>
.words() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.app-announce-item {
    width: 100%;
    padding: 29px 40px 0;
    height: 136px;
    .announce-left,
    .announce-list {
        float: left;
        width: 503px;
        .announce-title {
            width: 100%;
            color: #333333;
            height: 32px;
            font-size: 28px;
            line-height: 32px;
            .words();
        }
        .announce-dept {
            width: 100%;
            font-size: 22px;
            line-height: 59px;
            height: 59px;
            color: #999999;
            .words();
        }
    }
    .announce-list {
        width: 100%;
    }
    .announce-right {
        float: left;
        width: 100px;
        height: 100px;
        border-radius: 8px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
