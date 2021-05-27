// miniprogram/pages/personal/personal.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		username: '游客',
		userInfo: {},
		avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
		signature: '请输入个性签名',
		gender: 1,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '个人'  
		})
		//当重新加载这个页面时，查看是否有已经登录的信息
		let username = wx.getStorageSync('username'),
			avatar = wx.getStorageSync('avatar'),
			signature = wx.getStorageSync('signature'),
			userInfo = wx.getStorageSync("userInfo");
			console.log("头像: " + userInfo.avatar)
		if (username) {
			this.setData({
				username: username,
				avatar: userInfo.avatar,
				signature: userInfo.signature,
				gender: userInfo.gender
			})
		}    
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					wx.getUserInfo({
						success: res => {
							console.log("setting返回: " + JSON.stringify(res))
							// this.setData({
							// 	avatar: res.userInfo.avatarUrl,
							// 	userInfo: res.userInfo
							// })
						}
					})
				}
			}
		})
	},
	
	getUserInfoHandler: function(e) {
		console.log("获取userinfo: " + JSON.stringify(e.detail))
		let d = e.detail.userInfo
		// var gen = d.gender == 1 ? '男' : '女'
		this.setData({
			avatar: d.avatarUrl,
			username: d.nickName,
			userInfo: d,
			gender: d.gender
			// signature: d.signature
		})      
		wx.setStorageSync('avatar', d.avatarUrl)
		wx.setStorageSync('username', d.nickName)
		wx.setStorageSync('gender', d.gender)
		wx.setStorageSync('userInfo', d)
		//获取数据库引用
		const db = wx.cloud.database()
		const _ = db.command
		//查看是否已有登录，无，则获取id
		var userId = wx.getStorageSync('userId')
		if (!userId) {
			userId = this.getUserId()
		}
		//查找数据库
		db.collection('users').where({
			_openid: d.openid
		}).get({
			success(res) {
				// res.data 是包含以上定义的记录的数组
				//如果查询到数据,将数据记录，否则去数据库注册
				if (res.data && res.data.length > 0) {
					wx.setStorageSync('openId', res.data[0]._openid)
				} else {
					//定时器
					setTimeout(() => {
						//写入数据库
						db.collection('users').add({
							data: {
								userId: userId,
								avatar: d.avatarUrl,
								username: d.nickName,
								signature: '请编辑个性签名',
								gender: d.gender
							},  
							success: function() {   
								// gender = d.gender
								// console.log("性别: " + gender)
								console.log('用户id新增成功')
								db.collection('users').where({
									userId: userId
								}).get({
									success: res => {
										console.log("数据库新增返回: " + JSON.stringify(res))
										wx.setStorageSync('openId',
											res.data[0]._openid)
										wx.setStorageSync('userInfo',
											res.data[0])
										// gender = res.data[0].gender
										// avatar = res.data[0].avatar
									},
									fail: err => {
										console.log('用户_openId设置失败')
									}
								})
							},
							fail: function(e) {
								console.log('用户id新增失败')
							}
						})
					}, 100)
				}
			},
			fail: err => {

			}
		})
	},
	
	getUserId: function() {
		//生产唯一id，采用一个字母或数字+1970年到现在的毫秒数+10w的一个随机数组成
		var w = "abcdefghijklmnopqrstuvwxyz0123456789",
			firstW = w[parseInt(Math.random() * (w.length))];
		var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
		wx.setStorageSync('userId', userId)
		return userId;
	},

	settingData() {
		wx.navigateTo({
			url: '/pages/editData/editData',
			success: (result) => {},
			fail: (res) => {},
			complete: (res) => {},
		})
	},
	
	setting() {
		wx.navigateTo({
			url: '/pages/setting/setting',

			success: (result) => {},
			fail: (res) => {},
			complete: (res) => {},
		})
	},
	
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
