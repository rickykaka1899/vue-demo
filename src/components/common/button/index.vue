<template>
<button :class="classes" :disabled="disabled">
	<span><slot></slot></span>
</button>
</template>

<script>
import cx from 'classnames'
export default {
	props: {
		className: {
			type: String,
			default: 'app-button'
		},
		type: {
			type: String,
			default: ''
		},
		shape: {
			type: String,
			default: ''
		},
		long: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		classes() {
			return cx({
				[this.className]: !!this.className,
				[`${this.className}-${this.type}`]: !!this.type,
				[`${this.className}-long`]: !!this.long,
				[`${this.className}-circle`]: !!this.shape
			})
		}
	}
}
</script>

<style scoped lang="postcss">
.app-button{
    height: 60px;
    line-height: 61px;
    padding: 0 34px;
    color: #333;
    background: #f2f2f2;
	border: 0;
	font-size: 28px;
	outline: none;
	vertical-align: middle;
	
}
.app-button span{
		font-size: 28px;
	}
.app-button-primary{
    color: #fff;
    background: #39f;
    border-color: #39f;
}
.app-button-success{
	color: #fff;
    background: #0c6;
    border-color: #0c6;
}
.app-button-warning{
    color: #fff;
    background: #f90;
    border-color: #f90;
}
.app-button-error{
    color: #fff;
    background: #f30;
    border-color: #f30;
}
.app-button-long{
    width: 100%;
}
.app-button[disabled]{
    color: #c3cbd6;
}
.app-button-icon-only{
    border-radius: 30px;
}
.app-button-circle{
    border-radius: 30px;
}
</style>
