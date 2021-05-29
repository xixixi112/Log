// miniprogram/pages/logDetail/logDetail.js
var WxParse = require("../../wxParse/wxParse.js")
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		LogTitle: "",
		LogContext: "",
		log:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
	
		console.log(options.id)
		var data = getApp().globalData.logs.filter(item => item._id == options.id);
		
		console.log(data)
		this.setData({
			log: data[0]
		})
		// wx.cloud.database().collection('logs').where({_id:options.id}).get()
		// .then(res=>{//请求成功
		// 	console.log( res.result.data)
		// 	this.setData({
		// 		log: res.result.data
		// 	})
		// })
		// .catch(res=>{//请求失败
		// 	console.log("failed")
		// })
		// .getStorage({
		// 	key: options.curTime,
		// 	success: (result) => {
		// 		console.log(result)
		// 		WxParse.wxParse("article", "html", result.data[4], that, 0)
		// 		this.setData({
		// 			LogTitle: result.data[0],
		// 			LogContext: result.data[4]
		// 		})
		// 	}
		// })

	},
	
	toCollection() {
		// let obj = {
		// 	logId: ,
		// 	log_user_id: ,
		// 	userId: getApp().globalData.userInfo.userId
		// }
		const db = wx.cloud.database();
		db.collection("collections").add({
			data: obj,
			success: function() {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
					duration: 1500
				})
			},
			fail: function() {
				wx.showToast({
					title: '保存失败',
					'icon': 'none',
					duration: 3000
				})
			}
		});
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
	onEditorReady() {
		// richText = this.selectComponent('#show'); //获取组件实例
    wx.createSelectorQuery().select('#editor').context(res => {
			app.globalData.data.richTextContents = this.data.log.detail;
      this.editorCtx = res.context;
      console.log(app.globalData.data.richTextContents)
      this.editorCtx.setContents({
        html: app.globalData.data.richTextContents,
        success: res => {
          console.log('[setContents success]')
        }
      })
    }).exec()
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
