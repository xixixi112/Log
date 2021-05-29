// miniprogram/pages/personal/personal.js
var util = require('../../utils/util.js')
const module = require("../../commond/tabFunction.js");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		styles: [{
				class: 'icon',
				text: "公开",
				hidden: false
			},
			{
				class: '',
				text: "私密",
				hidden: true
			},
			{
				class: '',
				text: "收藏",
				hidden: true
			}
		],
		index: 0,
		username: '游客',
		userId: null,
		userInfo: getApp().globalData.userInfo,
		avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
		signature: '',
		gender: 1,
		publicLogs: [],
		privateLogs: [],
		focus: false,
		favoriteLogs: []
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
		this.signature = userInfo.signature
		var user=""
		if (this.username) {
			wx.cloud.callFunction({
				name: 'getUser',
				data:{
					userId:userInfo.userId
				}
			}).then(res => {
				console.log('请求云函数成功', res.result.data);
				user = res.result.data
			}).catch(err => {
				console.log('请求云函数失败', err);
			})
			wx.cloud.callFunction({
				name: 'getLog',
			}).then(res => {
				console.log('请求云函数成功', res.result.data);
				var data = res.result.data;
				// data.sort(this.compare('time'));
				for (let i = 0; i < data.length; i++) {
					data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
				}
				var data = data.filter(item => item.userId == userInfo.userId);
				getApp().globalData.logs = data
				var data1 = data.filter(item => item.public == true);
				getApp().globalData.myPublic = data1
				var data2 = data.filter(item => item.public == false);
				getApp().globalData.myPrivate = data2
				
				this.setData({
					username: userInfo.username,
					avatar: userInfo.avatar,
					signature:user[0].signature,
					gender: userInfo.gender,
					userId: userInfo.userId,
					publicLogs: data1,
					privateLogs: data2,
					favoriteLogs: getApp().globalData.favoriteLogs
				})
			}).catch(err => {
				console.log('请求云函数失败', err);
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
		// wx.cloud.callFunction({
		//   name: 'getLog',
		// }).then(res=>{
		//   console.log('请求云函数成功', res.result.data);
		//   var data = res.result.data;
		//   for(let i=0; i<data.length; i++) {
		//     data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
		//   }
		//   this.setData({
		//     logList: data
		//   })
		// })
		// .catch(err=>{
		//   console.log('请求云函数失败', err);
		// })
	},
	tab(evt) {
		//获取页面传过来的index参数
		var index = evt.target.dataset.index;
		//获取data里的styles对象数组
		var styles = this.data.styles;
		//调用tabFunction.js封装的tab切换方法
		var ret = module.tabComper(styles, index);
		//将对象设置到数据里
		this.setData(ret);

		//实现方式二
		// styles.map((val,key) =>{
		//   // console.log(styles[key].class);
		//     if(key == index){
		//       styles[key].class = 'icon';
		//     }else{
		//       styles[key].class = '';
		//     }
		// })

		// this.setData({
		//   index,
		//   styles
		//   }
		// );
	},

	//swiper切换时触发
	changeTab(evt) {
		//获取页面当前的index参数
		var index = evt.detail.current;
		//获取data里的styles对象数
		var styles = this.data.styles
		//调用tabFunction.js封装的tab切换方法
		var ret = module.tabComper(styles, index);
		//将对象设置到数据里
		this.setData(ret);

		//实现方式二
		// console.log("index =>"+index2);
		// console.log("styles => "+styles);

		// styles.map((val,key) =>{
		//   // console.log(styles[key].class);
		//     if(key == index2){
		//       styles[key].class = 'icon';
		//     }else{
		//       styles[key].class = '';
		//     }
		// })

		// this.setData({
		//   index2,
		//   styles
		//   }
		// );
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

	bindKeyInput: function(e) {
		this.setData({
			signature: e.detail.value
		})
		const db = wx.cloud.database()
		const _ = db.command
		//查找数据库
		db.collection('users').where({
			_openid: this.userInfo._openid
		}).get({
			success(res) {
				console.log(res.data[0]._id)
				let _id = res.data[0]._id
				db.collection('users').doc(_id).update({
					data: {
						signature: _.set(e.detail.value)
					},
					success: function(res) {
						getApp().globalData.userInfo.signature = e.detail.value
						wx.setStorageSync('userInfo', getApp().globalData.userInfo)
					},
					fail: err => {
						console.error('[数据库] [更新记录] 失败：', err)
					}
				})
			}
		})
	},

	getPublicLogs() {
		this.publicLogs = getApp().globalData.myPublic
		console.log(this.publicLogs)
	},

	getPrivateLogs() {
		this.privateLogs = getApp().globalData.myPrivate
		console.log(this.privateLogs)
	},

	getLogDetail(e){
			let item = e.currentTarget.dataset.id
			console.log(item)
			wx.navigateTo({
				url:'/pages/logDetail/logDetail?id='+item,
			})
	},

	// getMyFavoritesLogs() {
	// 	favoriteLogs
	// 	const db = wx.cloud.database()
	// 	const _ = db.command
	// 	//查找数据库
	// 	db.collection('favorites').where({
	// 		userId: this.userId
	// 	}).get({
	// 		success(res) {
	// 			console.log(res)
	// 			getApp().globalData.favoriteLogs = res.data
	// 		}
	// 	})



	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		// this.setData({
		// 	userInfo : getApp().globalData.userInfo,
		// 	userId : this.data.userInfo.userId
		// 	list: getApp().globalData.publiclogs
		// })
		this.userInfo = getApp().globalData.userInfo
		this.userId = this.userInfo.userId
		this.getPublicLogs()
		this.getPrivateLogs()
		this.setData({
			favoriteLogs: getApp().globalData.favoriteLogs
		})
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
