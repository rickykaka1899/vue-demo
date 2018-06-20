<template>
    <div class="wrapper">
        <div class="header">{{title}}</div>
        <router-link :to="{name:'detail'}" class="detail-link">go to detail</router-link>
    </div>
</template>

<script>

export default {
    data(){
        return {
            title: this.$t('application.title')
        }
    },
    components:{

    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            //
        }
    }
}
</script>

<style scoped>
    .header{
        text-align: center;
        font-size: 1.25rem;
        padding: 6.25rem 0;
    }
    .detail-link{
        color: #747574;
        font-size: 0.875rem;
        text-decoration: none;
    }
</style>
