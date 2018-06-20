/**
 * wiki: https://wiki.upesn.com/pages/viewpage.action?pageId=2396500
 */
import config from '../../config/config'
import * as types from './mutations_types'

const CGI = {
	userInfoUrl: '[javaApi]/users/code',
	authInfoUrl:'[javaApi/auths/user'
}
module.exports = {
	/**
	 * 更新store中的当前用户信息
	 * @params Object {commit, state}
	 * @params Object {vue实例}
	 */
	setUserInfo: ({commit, state}, {vue}) => {
		return new Promise((reslove, reject) => {
			if(!state.userinfo.id){
				var code = vue.$route.query.code
				vue.$http.get(CGI.userInfoUrl+"?code="+code).then((rs) => {
					let data = rs.data || {}
					if(data.code === 200){ //请求成功
						commit(types.UPDATE_USERINFO, data.data)
						reslove(data.data)
					} else {
						reject(data.msg)
					}
				}).catch((error) => {
					reject(error)
				})
			} else{
				reslove(state.userinfo)
			}
		})
	},
	getUserAuth:({commit,state},{vue}) => {
		return new Promise((reslove,reject) => {
			if (state.userinfo.id) {
				vue.$http.defaults.headers.common['token'] = state.userinfo.id;
				vue.$http.get(CGI.authInfoUrl).then((rs) => {
					debugger
					let data = rs.data || {}
					if(data.code === 200){ //请求成功
						commit(types.UPDATE_USERAUTHINFO, data.data)
						reslove(data.data)
					} else {
						reject(data.msg)
					}
				}).catch((error) => {
					reject(error)
				})				
			}else{
				reslove(state.userinfo)
			}
		})
	}
}
