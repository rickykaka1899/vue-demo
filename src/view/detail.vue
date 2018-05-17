<template>
    <div>
        <h2 v-text="title"></h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'detail'
        }
    },
}
</script>

<style scoped>
    h2{
        font-size: 20px;
        text-align: center;
        padding: 200px 0;
    }
</style>
