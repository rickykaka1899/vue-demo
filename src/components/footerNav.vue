<template>
  <footer class="footer" :class="{'go-back': !showNav}">
  	<section class="footer mint-1px-t" v-show="showNav">
	  	<nav class="nav nav-movie" :class="{'cur-page': route === '/'}">
	  		<router-link to="/">
	  			<div class="nav-icon">
	  				<img v-show="route !== '/'" src="../asset/images/tab_me_norm.png" alt="">
	  				<img v-show="route === '/'" src="../asset/images/tab_me_sel.png" alt="">
	  			</div>
                <div class="nav-title">
                    <p>首页</p>
                </div>
	  		</router-link>
	  	</nav>
	  	<nav class="nav nav-cinama" :class="{'cur-page': route === '/class'}">
			<router-link to="class">
				<div class="nav-icon">
					<img v-show="route !== '/class'" src="../asset/images/tab_board_norm.png" alt="">
					<img v-show="route === '/class'" src="../asset/images/tab_board_sel.png" alt="">
				</div>
                <div class="nav-title">
                    <p>课程</p>
                </div>
			</router-link>
	  	</nav>
		<nav class="nav nav-cinama" :class="{'cur-page': route === '/classpub'}"  v-show="showPub" >
			<router-link to="classpub">
				<div class="nav-icon">
					<img v-show="route !== '/classpub'" src="../asset/images/tab_board_norm.png" alt="">
					<img v-show="route === '/classpub'" src="../asset/images/tab_board_sel.png" alt="">
				</div>
                <div class="nav-title">
                    <p>发布</p>
                </div>
			</router-link>
	  	</nav>
  	</section>
  </footer>
</template>
<script>

import { mapGetters } from 'vuex';

export default{
  props: {
  	'showNav': {
  		type: Boolean,
  		default: true
	}
  },
  data(){
	debugger
	return{
		showPub:this.$store.getters.getUserAuth
	}
  },
//   computed:{
// 	  ...mapGetters([
// 		  'getUserAuth'
// 	  ])
//   },
  create(){

  },
  computed: {
  	route () {
  		return this.$route.path
  	}
  },
  methods: {
  	goBack () {
  		this.$router.back()
  	}
  }
}
</script>

<style>
.footer {
	background-color: #F2F2F2;
	position: fixed;
	width: 100%;
	bottom: 0rem;
	height: 3rem;
	display: -webkit-box; 
	padding-top: 0.2rem;
	box-sizing: border-box;
	z-index: 10000;
}
.footer nav {
	-webkit-box-flex: 1;
	text-align: center;
	color: #8a869e;
}
.footer .cur-page.nav{
	color: #ff4d64;
}
.nav-icon {
	width: 1.5rem;
	height: 1.5rem;
	margin: 0 auto;
}
.nav-icon img {
	width: 100%;
	height: 100%;
}
.nav-title{
    /* padding-top: 0; */
	text-align: center;
	width: 5rem;
	display: inline-block;
	font-size: 0.875rem;
    color: #000000;
}
</style>
