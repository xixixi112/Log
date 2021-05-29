// pages/index/index.js
var util = require('../../utils/util.js')
var startPoint
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		buttonTop: 0,
		buttonLeft: 0,
		windowHeight: '',
		windowWidth: '',
		LogTime: "",
		LogTitle: "",
		LogImg: "",
		LogLocation: "",
		Logdetail: "",
		LogInfo: [],
		curTime: "",
		list: [],
		username: "",
		avatar: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		getApp().globalData.userInfo = wx.getStorageSync("userInfo")
		let userInfo = getApp().globalData.userInfo
		this.getMyFavoritesLogs(userInfo.userId)
		wx.cloud.callFunction({
			name: 'getPublicLogs',
		}).then(res => {
			console.log('请求云函数成功', res.result.list);
			var data = res.result.list;
			data.sort(this.compare('time'));
			for (let i = 0; i < data.length; i++) {
				data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
			}
			getApp().globalData.logs = data
			var data1 = data.filter(item => item.public == true);
			this.setData({
				list: data1,
			})
			getApp().globalData.publiclogs = data1
		}).catch(err => {
			console.log('请求云函数失败', err);
		})
		
		//console.log({list});
		// wx.getStorage({
		//   key: '2021/05/26 11:29:37',
		//   success: (result) => {
		//     console.log(result)
		//     this.setData({
		//       LogTitle:result.data[0],
		//       LogTime:result.data[1],
		//       LogLocation:result.data[2],
		//       LogImg:result.data[3],
		//       Logdetail:result.data[4],
		//       curTime:result.data[5]
		//     })

		//   },
		//   fail: (res) => {},
		//   complete: (res) => {},
		// }),

		wx.getSystemInfo({
			success: (res) => {
				this.setData({
					windowHeight: res.windowHeight,
					windowWidth: res.windowWidth,
					buttonTop: res.windowHeight * 0.70, //这里定义按钮的初始位置
					buttonLeft: res.windowWidth * 0.70, //这里定义按钮的初始位置
				})
			}
		})
	},

	compare: function(property) {
		return function(a, b) {
			var value1 = Date.parse(a[property]);
			var value2 = Date.parse(b[property]);
			// console.log(value1);
			// console.log(value2);
			return value2 - value1;
		}
	},
	//可拖动悬浮按钮点击事件
	btn_Suspension_click() {
		wx.navigateTo({
			url: "/pages/addLog/addLog",
		})
	},
	//以下是按钮拖动事件
	buttonStart: function(e) {
		// console.log("buttonStart",e)
		startPoint = e.touches[0] //获取拖动开始点
	},
	buttonMove: function(e) {
		// console.log("buttonMove",e)
		var endPoint = e.touches[e.touches.length - 1] //获取拖动结束点
		//计算在X轴上拖动的距离和在Y轴上拖动的距离
		var translateX = endPoint.clientX - startPoint.clientX
		var translateY = endPoint.clientY - startPoint.clientY
		startPoint = endPoint //重置开始位置
		var buttonTop = this.data.buttonTop + translateY
		var buttonLeft = this.data.buttonLeft + translateX
		//判断是移动否超出屏幕
		if (buttonLeft + 50 >= this.data.windowWidth) {
			buttonLeft = this.data.windowWidth - 50;
		}
		if (buttonLeft <= 0) {
			buttonLeft = 0;
		}
		if (buttonTop <= 0) {
			buttonTop = 0
		}
		if (buttonTop + 50 >= this.data.windowHeight) {
			buttonTop = this.data.windowHeight - 50;
		}
		this.setData({
			buttonTop: buttonTop,
			buttonLeft: buttonLeft
		})
	},
	buttonEnd: function(e) {},

	getLogDetail() {
		wx.navigateTo({
			url: '/pages/logDetail/logDetail?curTime=' + this.data.curTime,
			success: (res) => {
				console.log("携带数据跳转成功");
			}
		})
	},
	handleLike(e) {
		console.log(e)
		let that = this;
		let item = e.currentTarget.dataset.item
		let index = e.currentTarget.dataset.index
		let isliked = e.detail.isLiked
		const db = wx.cloud.database()
		const _ = db.command
		db.collection('logs').where({
			_id: item._id
		}).get({
			success(res) {
				console.log(res)
				//写入数据库
				let like = res.data[0].like
				if (isliked == false) {
					like = like - 1
				} else {
					like = like + 1
				}
				db.collection('logs').doc(res.data[0]._id).update({
					data: {
						like: like
					},
					success: function(res) {
						console.log(res)
						let changeList = that.data.list
						changeList[index].like = like
						that.setData({
							list: changeList
						})
						console.log("我喜欢的数 " + that.data.list[index].like)
					},
					fail: function(e) {
						console.log('更新日志喜欢数失败')
					}
				})
			}
		})
	},

	// 本质上是收藏事件
	handleUnlike(e) {
		console.log(e)
		let that = this
		let item = e.currentTarget.dataset.item
		let index = e.currentTarget.dataset.index
		let isUnLiked = e.detail.isUnliked
		const db = wx.cloud.database()
		const _ = db.command
		if (isUnLiked == true) {
			db.collection('favorites').add({
				data: {
					userId: getApp().globalData.userInfo.userId,
					log_user_id: item.userId,
					logId: item._id
				},
				success: function(res) {
					console.log(res)
					// 成功添加之后将数据添加进我的收藏全局变量中
					let arr = getApp().globalData.favoriteLogs
					arr.push(item)
					getApp().globalData.favoriteLogs = arr
					let unlike = that.data.list[index].unlike + 1
					console.log(unlike)
					// 需更新logs集合中的收藏信息并展示到页面
					db.collection('logs').doc(item._id).update({
						data: {
							unlike: unlike
						},
						success: function(res) {
							console.log(res)
							let changeList = this.data.list
							changeList[index].unlike = this.data.list[index].unlike + 1
							this.setData({
								list: changeList
							})
						}
					})
				},
				fail: function(e) {
					console.log('新增收藏失败')
				}
			})
		} else {
			db.collection('favorites').where({
				userId: getApp().globalData.userInfo.userId,
				logId: item._id
			}).get({
				success(res) {
					db.collection('favorites').doc(res.data[0]._id).remove({
						success: function(res) {
							console.log(res)
							let arr = getApp().globalData.favoriteLogs
							getApp().globalData.favoriteLogs = arr.filter(item => item
								._id != item._id)
							// 需减少1 logs集合中收藏信息
							let unlike = this.data.list[index].unlike - 1
							// 需更新logs集合中的收藏信息并展示到页面
							db.collection('logs').doc(item._id).update({
								data: {
									unlike: unlike
								},
								success: function(res) {
									console.log(res)
									let changeList = this.data.list
									changeList[index].unlike = this.data.list[index].unlike + 1
									this.setData({
										list: changeList
									})
								}
							})
						},
						fail: function(e) {
							console.log('删除收藏失败')
						}
					})
				}
			})

		}

	},

	getMyFavoritesLogs(userId) {
		console.log("我爱的： " + userId)
		const db = wx.cloud.database()
		const _ = db.command
		//查找数据库
		db.collection('favorites').get({
			success(res) {
				console.log(res)
				let arr = []
				for (let i = 0; i < res.data.length; i++) {
					db.collection('logs').where({
						_id: res.data[i].logId
					}).get({
						success(res) {
							arr.push(res.data[0])
						}
					})
				}
				getApp().globalData.favoriteLogs = arr
			},
			fail: function(e) {
				console.log('查找收藏失败')
			}
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
		this.setData({
			list: getApp().globalData.publiclogs
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
