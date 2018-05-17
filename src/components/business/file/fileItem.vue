<template>
    <div :class="['app-file-item']">
        <div class="file-left"><slot name="icon"></slot></div>
        <div class="file-right">
            <div class="file-title"><slot name="title"></slot></div>
            <div class="file-des">
                <div class="file-time"><slot name="time"></slot></div>
                <div class="file-size"><slot name="size"></slot></div>
                <div class="file-author"><slot name="author"></slot></div>
            </div>
        </div>
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
.words() {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.app-file-item {
    width: 100%;
    height: 120px;
    padding: 20px 0;
    border-bottom: 1px solid #eeeeee;
    .file-left {
        float: left;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .file-right {
        float: left;
        width: 500px;
        height: 80px;
        .file-title {
            width: 100%;
            color: #333333;
            height: 36px;
            font-size: 28px;
            line-height: 36px;
            .words();
        }
        .file-des {
            width: 100%;
            color: #999999;
            height: 68px;
            font-size: 24px;
            line-height: 24px;
            padding: 20px 0 24px;
            .file-time {
                max-width: 40%;
                float: left;
                .words();
            }
            .file-size {
                max-width: 30%;
                float: left;
                text-indent: 20px;
                .words();
            }
            .file-author {
                max-width: 30%;
                float: left;
                text-indent: 20px;
                .words();
            }
        }
    }
}
</style>
