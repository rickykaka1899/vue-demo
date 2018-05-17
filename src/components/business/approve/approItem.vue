<template>
    <div :class="['app-appro-item']">
        <div class="appro-list" >
            <div class="appro-title">
                <slot name="title"></slot>
            </div>
            <div class="appro-amount">
                <slot name="amount"></slot>
            </div>
            <div class="appro-user">
                <slot name="user"></slot>
            </div>
        </div>
        <slot name="state"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>
<style lang="less" scoped>
.app-appro-item {
    width: 100%;
    height: 162px;
    position: relative;
    .appro-list {
        padding-top: 22px;
    }
    .appro-title,
    .appro-amount,
    .appro-user {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 22px;
        color: #999;
        height: 40px;
        line-height: 40px;
    }
    .appro-title {
        height: 46px;
        line-height: 46px;
    }
    .appro-amount {
        font-size: 22px;
        color: #999;
        height: 40px;
        line-height: 40px;
    }
    .appro-user {
        font-size: 20px;
        color: #ccc;
        height: 40px;
        line-height: 40px;
    }
}
</style>
