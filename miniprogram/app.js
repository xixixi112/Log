//app.js
App({

	onLaunch: function() {
		if (!wx.cloud) {
			console.error('请使用 2.2.3 或以上的基础库以使用云能力')
		} else {
			wx.cloud.init({
				// env 参数说明：
				//   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
				//   此处请填入环境 ID, 环境 ID 可打开云控制台查看
				//   如不填则使用默认环境（第一个创建的环境）
				env: 'cloud1-5gf0uuzj60a1d421',
				traceUser: true,
			})
		}
		// wx.setNavigationBarTitle({
		// 	title: '个人'
		// })
		// //当重新加载这个页面时，查看是否有已经登录的信息
		// let username = wx.getStorageSync('username'),
		// 	avatar = wx.getStorageSync('avatar'),
		// 	signature = wx.getStorageSync('signature'),
		// 	userInfo = wx.getStorageSync("userInfo");
		// console.log("头像: " + userInfo.avatar)
		// if (username) {
		// 	this.setData({
		// 		username: username,
		// 		avatar: userInfo.avatar,
		// 		signature: userInfo.signature,
		// 		gender: userInfo.gender
		// 	})
		// }
		// wx.getSetting({
		// 	success: res => {
		// 		if (res.authSetting['scope.userInfo']) {
		// 			wx.getUserInfo({
		// 				success: res => {
		// 					console.log("setting返回: " + JSON.stringify(res))
		// 					// this.setData({
		// 					// 	avatar: res.userInfo.avatarUrl,
		// 					// 	userInfo: res.userInfo
		// 					// })
		// 				}
		// 			})
		// 		}
		// 	}
		// })
		
		this.globalData = {
			userInfo: {
				userId: '',
				username: '',
				openid: '',
				gender: 1,
				avatar: '',
				signature: ''
			},
			logs: [],
			data: {}
		}
		
		let userInfo = wx.getStorageSync("userInfo")
		this.username = userInfo.username
		if (this.username) {
			wx.switchTab({
				url: '/pages/index/index'
			})
		}
		
		// wx.getSetting({
		// 	success: res => {
		// 		if (res.authSetting['scope.userInfo']) {
		// 			wx.getUserInfo({
		// 				success: res => {
		// 					console.log("setting返回: " + JSON.stringify(res))
		// 					// this.setData({
		// 					// 	avatar: res.userInfo.avatarUrl,
		// 					// 	userInfo: res.userInfo
		// 					// })
		// 				}
		// 			})
		// 		}
		// 	}
		// })


	}
})
