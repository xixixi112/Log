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
    username:"",
    avatar:"",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
    getApp().globalData.userInfo = wx.getStorageSync("userInfo")
    let userInfo = getApp().globalData.userInfo
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
			})
			.catch(err => {
				console.log('请求云函数失败', err);
      })
  
        // wx.cloud.callFunction({
        //     name: 'getPublicLogs',
        //   }).then(res => {
        //     console.log('请求云函数成功', res.result.list);
        //     var data = res.result.list;
        //    // data.sort(this.compare('time'));
        //     // for (let i = 0; i < data.length; i++) {
        //     //   data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
        //     // }
        //     this.setData({
        //       list: data
        //     })
        //     getApp().globalData.publiclogs = data
        //   })
        //   .catch(err => {
        //     console.log('请求云函数失败', err);
        //   })

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
