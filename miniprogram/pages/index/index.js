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
		let that = this
		getApp().globalData.userInfo = wx.getStorageSync("userInfo")
		let userInfo = getApp().globalData.userInfo
		console.log(userInfo.userId)
		wx.cloud.callFunction({
			name: 'getPublicLogs',
		}).then(res => {
			console.log('请求云函数成功', res.result.list);
			var data = res.result.list;
			data.sort(this.compare('time'));
			for (let i = 0; i < data.length; i++) {
				data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
			}
			var data1 = data.filter(item => item.public == true);
			this.setData({
				list: data1,
			})
			const db = wx.cloud.database()
			const _ = db.command
			//查找数据库
			db.collection('favorites').where({
				userId: userInfo.userId
			}).get({
				success(res) {
					console.log("我收藏的")
					console.log(res)
					getApp().globalData.allFavoriteLogs = res.data
					// getApp().globalData.favoriteLogs = arr
					let fLogs = getApp().globalData.allFavoriteLogs
					console.log(getApp().globalData.allFavoriteLogs)
					
					let farr = []
					for (let i = 0; i < data.length; i++) {
						data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
						data[i]["isLiked"] = false
						data[i]["isUnliked"] = false
						fLogs.forEach(favariteLogs =>{
							if(favariteLogs.logId == data[i]._id && favariteLogs.like_type == 2){
								data[i]["isUnliked"] = true;
								farr.push(data[i])
							} 
							if(favariteLogs.logId == data[i]._id && favariteLogs.like_type == 1){
								data[i]["isLiked"] = true;
							}
						})
					}
					getApp().globalData.favoriteLogs = farr
					console.log(getApp().globalData.favoriteLogs)
					getApp().globalData.logs = data
					console.log(getApp().globalData.logs)
					var data1 = data.filter(item => item.public == true);
					that.setData({
						list: data1,
					})
					getApp().globalData.publiclogs = data1
				},
				fail: function(e) {
					console.log(e)
				}
			})

			
			// 我的收藏
			// let fLogs = getApp().globalData.allFavoriteLogs
			// console.log(getApp().globalData.allFavoriteLogs)
			
			// let farr = []
			// for (let i = 0; i < data.length; i++) {
			// 	data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
			// 	data[i]["isLiked"] = false
			// 	data[i]["isUnLiked"] = false
			// 	fLogs.forEach(favariteLogs =>{
			// 		if(favariteLogs.logId == data[i]._id && favariteLogs.like_type == 2){
			// 			data[i]["isUnLiked"] = true;
			// 			farr.push(data[i])
			// 		} 
			// 		if(favariteLogs.logId == data[i]._id && favariteLogs.like_type == 1){
			// 			data[i]["isLiked"] = true;
			// 		}
			// 	})
			// }
			// getApp().globalData.favoriteLogs = farr
			// console.log(getApp().globalData.favoriteLogs)
			// getApp().globalData.logs = data
			// console.log(getApp().globalData.logs)
			// var data1 = data.filter(item => item.public == true);
			// this.setData({
			// 	list: data1,
			// })
			// getApp().globalData.publiclogs = data1
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
	handleDetail(e) {
		let item = e.currentTarget.dataset.id
		console.log(item)
		wx.navigateTo({
			url: '/pages/logDetail/logDetail?id=' + item,
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
		if (isliked == true) {
			db.collection('favorites').add({
				data: {
					userId: getApp().globalData.userInfo.userId,
					log_user_id: item.userId,
					logId: item._id,
					like_type: 1
				},
				success: function(res) {
					console.log(res)
					// // 成功添加之后将数据添加进我的收藏全局变量中
					// let arr = getApp().globalData.favoriteLogs
					// item.isLiked = true;
					// arr.push(item)
					// getApp().globalData.favoriteLogs = arr
					let like = that.data.list[index].like + 1
					console.log(like)
					// 需更新logs集合中的收藏信息并展示到页面
					db.collection('logs').doc(item._id).update({
						data: {
							like: like
						},
						success: function(res) {
							console.log(res)
							let changeList = that.data.list
							changeList[index].like = that.data.list[index].like + 1
							changeList[index].isLiked = true;
							that.setData({
								list: changeList
							})
							console.log(that.data.list[index].like)
						}
					})
				},
				fail: function(e) {
					console.log('新增点赞失败')
				}
			})
		} else {
			db.collection('favorites').where({
				userId: getApp().globalData.userInfo.userId,
				logId: item._id
			}).get({
				success(res) {
					let like = that.data.list[index].like - 1
					db.collection('logs').doc(item._id).update({
						data: {
							like: like
						},
						success: function(res) {
							console.log(res)
							let changeList = that.data.list
							changeList[index].like = that.data.list[index].like - 1
							changeList[index].isLiked = false;
							that.setData({
								list: changeList
							})
							db.collection('favorites').doc(res.data[0]._id).remove({
								success: function(res) {
									console.log(res)
									let arr = getApp().globalData.favoriteLogs
									getApp().globalData.favoriteLogs = arr
										.filter(item => item
											._id != item._id)
									console.log(this.data)
									// 需减少1 logs集合中收藏信息
								},
								fail: function(e) {
									console.log('删除点赞失败')
								}
							})
						}
					})
				}
			})

		}
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
					logId: item._id,
					like_type: 2
				},
				success: function(res) {
					console.log(res)
					// 成功添加之后将数据添加进我的收藏全局变量中
					let arr = getApp().globalData.favoriteLogs
					item.isUnliked = true;
					arr.push(item)
					getApp().globalData.favoriteLogs = arr
					console.log(getApp().globalData.favoriteLogs)
					let unlike = that.data.list[index].unlike + 1
					console.log(unlike)
					// 需更新logs集合中的收藏信息并展示到页面
					db.collection('logs').doc(item._id).update({
						data: {
							unlike: unlike
						},
						success: function(res) {
							console.log(res)
							let changeList = that.data.list
							changeList[index].isUnliked = true;
							that.setData({
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
							let unlike = that.data.list[index].unlike - 1
							// 需更新logs集合中的收藏信息并展示到页面
							db.collection('logs').doc(item._id).update({
								data: {
									unlike: unlike
								},
								success: function(res) {
									console.log(res)
									let changeList = that.data.list
									changeList[index].isUnliked = false;
									that.setData({
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
		db.collection('favorites').where({
			userId: userId
		}).get({
			success(res) {
				console.log("我收藏的")
				console.log(res)
				getApp().globalData.allFavoriteLogs = res.data
				// getApp().globalData.favoriteLogs = arr
			},
			fail: function(e) {
				console.log(e)
			}
		})
	},

	setFlagToLikeAndUnLike() {
		// logs 
		// unlikelogs favoriteLogs
		const db = wx.cloud.database()
		const _ = db.command
		//查找数据库
		db.collection('favorites').where({
			userId: userId
		}).get({
			success(res) {
				console.log("我收藏的")
				console.log(res)
				getApp().globalData.favoriteLogs = arr
			},
			fail: function(e) {
				console.log(e)
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
