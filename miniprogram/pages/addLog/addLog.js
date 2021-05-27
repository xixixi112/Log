var util = require('../../utils/util.js');
Page({
	data: {
		formats: {},
		readOnly: false,
		placeholder: '开始输入...',
		editorHeight: 300,
		keyboardHeight: 0,
		isIOS: false,
		curTime: "",
		maxDate: "",
		displayValue: "点击选择日期",
		showLocation: "点击选择位置",
		curLocation: "",
		dailyTitle: "",
		showImgUrl: "点击选择封面",
		ImgUrl: "",
		userInfo: getApp().globalData.userInfo
	},
	readOnlyChange() {
		this.setData({
			readOnly: !this.data.readOnly
		})
	},
	onLoad() {
		let value = util.formatTime(new Date());
		// 再通过setData更改Page()里面的data，动态更新页面的数据

		this.setData({
			curTime: value,
			maxDate: value,
			userInfo: getApp().globalData.userInfo
		});
		const platform = wx.getSystemInfoSync().platform
		const isIOS = platform === 'ios'
		this.setData({
			isIOS
		})
		const that = this
		this.updatePosition(0)
		let keyboardHeight = 0
		wx.onKeyboardHeightChange(res => {
			if (res.height === keyboardHeight) return
			const duration = res.height > 0 ? res.duration * 1000 : 0
			keyboardHeight = res.height
			setTimeout(() => {
				wx.pageScrollTo({
					scrollTop: 0,
					success() {
						that.updatePosition(keyboardHeight)
						that.editorCtx.scrollIntoView()
					}
				})
			}, duration)

		})
	},
	onChooseData(e) {
		console.log(e);
		this.setData({
			displayValue: e.detail.label,
			curTime: e.detail.label
		})
		console.log(this.data.displayValue)
	},
	loseDailyTitleBlur(e) {
		this.setData({
			dailyTitle: e.detail.value
		})
		console.log(this.data.dailyTitle)
	},
	getCurLocation(res) {
		let _this = this
		wx.getLocation({
			type: "wgs84",
			success: (res) => {
				console.log(res)
				_this.setData({
					latitude: res.latitude,
					longitude: res.longitude
				})
			}
		})
		wx.chooseLocation({
			latitude: this.latitude,
			longitude: this.longitude,
			success: (res) => {
				console.log(res.name)
				if (res.name.length > 14) {
					var temp_str = res.name.slice(0, 15)
				} else {
					var temp_str = res.name
				}
				_this.setData({
					showLocation: temp_str,
					curLocation: res.name
				})

			}
		})
	},

	getImgUrl() {
		let that = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				// tempFilePath可以作为img标签的src属性显示图片
				console.log(res.tempFilePaths)
				
				that.setData({
					// ImgUrl: res.tempFilePaths[0],
					showImgUrl: "封面选择完成"
				})
				let filePath = res.tempFilePaths[0];
				const name = Math.random() * 1000000;
				const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
				wx.cloud.uploadFile({
					cloudPath, //云存储图片名字
					filePath, //临时路径
					success: res => {						
						that.setData({
							ImgUrl: res.fileID, //云存储图片路径,可以把这个路径存到集合，要用的时候再取出来
						});
					},
					fail: e => {
						console.error('[上传图片] 失败：', e)
					},
					complete: () => {
						wx.hideLoading()
					}
				});
			}
		})
	},


	updatePosition(keyboardHeight) {
		const toolbarHeight = 50
		const {
			windowHeight,
			platform
		} = wx.getSystemInfoSync()
		let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
		this.setData({
			editorHeight,
			keyboardHeight
		})
	},

	calNavigationBarAndStatusBar() {
		const systemInfo = wx.getSystemInfoSync()
		const {
			statusBarHeight,
			platform
		} = systemInfo
		const isIOS = platform === 'ios'
		const navigationBarHeight = isIOS ? 44 : 48
		return statusBarHeight + navigationBarHeight
	},
	onEditorReady() {
		const that = this
		wx.createSelectorQuery().select('#editor').context(function(res) {
			that.editorCtx = res.context
		}).exec()
	},
	blur() {
		this.editorCtx.blur()
	},
	format(e) {
		let {
			name,
			value
		} = e.target.dataset
		if (!name) return
		console.log('format', name, value)
		this.editorCtx.format(name, value)
	},
	onStatusChange(e) {
		const formats = e.detail
		console.log(formats)
		this.setData({
			formats: formats
		})
	},
	insertDivider() {
		this.editorCtx.insertDivider({
			success: function() {
				console.log('insert divider success')
			}
		})
	},
	clear() {
		this.editorCtx.clear({
			success: function(res) {
				console.log("clear success")
			}
		})
	},
	insertDivider() {
		this.editorCtx.insertDivider({
			success: function(res) {
				console.log("insertDivider success");
			}
		})
	},
	undo() {
		this.editorCtx.undo({
			success: function(res) {
				console.log("undo success");
			}
		})
	},
	redo() {
		this.editorCtx.redo({
			success: function(res) {
				console.log("redo success");
			}
		})
	},

	getContents() {
		// 存储数据
		var that = this;
		this.editorCtx.getContents({
			success: function(res) {
				console.log(res)
				if (that.data.dailyTitle === "" || that.data.displayValue === "点击选择日期" || that.data
					.curLocation === "" || that.data.ImgUrl === "") {
					wx.showToast({
						title: '请填写必要信息',
						icon: 'error',
						duration: 1500
					})
				} else {
					var saveArr = getApp().globalData.logs;
					// displayValue 日期 curLocation 位置 imgurl封皮 html 返回的链接 maxDate
					console.log('userId: ' + getApp().globalData.userInfo.userId)
					let obj = {
						image: that.data.ImgUrl,
						detail: res.delta,
						title: that.data.dailyTitle,
						time: that.data.displayValue,
						location: that.data.curLocation,
						subhead: '还没写',
						userId: getApp().globalData.userInfo.userId
					}
					saveArr.push(obj);
					getApp().globalData.logs = saveArr
					//把图片存到users集合表
					const db = wx.cloud.database();
					db.collection("logs").add({
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
					setTimeout(function() {
						wx.switchTab({
							url: "../index/index",
							success: (result) => {
								console.log("switchTab success")
							},
							fail: (res) => {
								console.log(res)
							},
							complete: (res) => {
								console.log("complete")
							},
						})
					}, 1800)
					console.log("getContents success");
				}
			}
		})
	},

	removeFormat() {
		this.editorCtx.removeFormat()
	},
	insertDate() {
		const date = new Date()
		const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
		this.editorCtx.insertText({
			text: formatDate
		})
	},
	insertImage() {
		const that = this
		wx.chooseImage({
			count: 1,
			success: function(res) {
				that.editorCtx.insertImage({
					src: res.tempFilePaths[0],
					data: {
						id: 'abcd',
						role: 'god'
					},
					width: '80%',
					success: function() {
						console.log('insert image success')
					}
				})
			}
		})
	}
})
