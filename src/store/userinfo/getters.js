module.exports = {
	/**
	 * 获取当前用户所有信息
	 */
	getUserInfo: (state) => {
		return state.userinfo
	},
	/**
	 * 获取当前用户的用户ID
	 */
	getUserId: (state) => {
		return state.userinfo.id || 0
	},
	/**
	 * 获取当前用户所在的空间ID
	 */
	getUserQzId: (state) => {
		return state.userinfo.qz_id || 0
	},
	getUserAuth: (state) => {
		debugger
		var ispub = state.userauth.ispublish;
		if (ispub === 1) {
			return true
		}else{
			return false;
		}
	}
}
