<template>
    <div :class="['app-project-item']">
       <div class="content">
            <slot name="maincontent"></slot>
       </div>
       <div class="footer">
            <slot name="footer"></slot>
       </div>
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
.app-project-item {
    width: 100%;
    // padding: 29px 40px 0;
    .content{
        position: relative;
        border-radius: 14px;
        padding: 0 40px;
        overflow: hidden;
        box-sizing: border-box;
    }
    
}
</style>
