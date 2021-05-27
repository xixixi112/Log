// miniprogram/pages/personal/personal.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		username: '游客',
		userId: null,
		userInfo: getApp().globalData.userInfo,
		avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
		signature: '请输入个性签名',
		gender: 1,
		myLogs: []

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '个人'  
		})
		//当重新加载这个页面时，查看是否有已经登录的信息
		let userInfo = wx.getStorageSync("userInfo");
		this.userInfo = getApp().globalData.userInfo
		this.username = userInfo.username
		if (this.username) {
			this.setData({
				username: userInfo.username,
				avatar: userInfo.avatar,
				signature: userInfo.signature,
				gender: userInfo.gender,
				userId: userInfo.userId,
				myLogs: getApp().globalData.logs.filter(item=> item.userId == userInfo.userId)
			})
		}
		console.log("logs: " + JSON.stringify(getApp().globalData.logs))
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
		// this.getMyLogs()
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
	
	getMyLogs() {
		let logs = getApp().globalData.logs
		let userId = this.userInfo.userId
		console.log(userId)
		this.myLogs = logs.filter(item=> item.userId == userId)
		console.log(this.myLogs)
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
		this.userInfo = getApp().globalData.userInfo
		this.userId = this.userInfo.userId
		this.getMyLogs()
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
