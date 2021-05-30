var util = require('../../utils/util.js');
const app = getApp();
let richText = null; //富文本编辑器实例
Page({
	data: {
		formats: {},
		readOnly: false,
		placeholder: '开始输入...',
		editorHeight: 300,
		keyboardHeight: 0,
		isIOS: false,
		public: true,
		maxDate: "",
		dailyTitle: "",
		abstract: "",
		showImgUrl: "点击选择封面",
		ImgUrl: "",
		userInfo: getApp().globalData.userInfo,
		checked: false
	},
	onShow: function() {

	},

	// 编辑器初始化完成时触发，可以获取组件实例
	onEditorReady() {
		console.log('[onEditorReady callback]')
		console.log('000')
		richText = this.selectComponent('#richText'); //获取组件实例
	},

	//设置富文本内容
	setContents(rechtext) {
		this.editorCtx.setContents({
			html: rechtext,
			success: res => {
				console.log('[setContents success]', res)
			}
		})
	},

	//撤销
	undo() {
		console.log('[undo callback]')
	},

	//恢复
	restore() {
		console.log('[restore callback]')
	},

	//清空编辑器内容
	clear() {
		this.editorCtx.clear({
			success: res => {
				console.log("[clear success]", res)
			}
		})
	},

	//清空编辑器事件
	clearBeforeEvent() {
		console.log('[clearBeforeEvent callback]')
		wx.showModal({
			cancelText: '取消',
			confirmText: '确认',
			content: '确认清空编辑器内容吗？',
			success: (result) => {
				if (result.confirm) {
					richText.clear();
				}
			},
			fail: (res) => {},
		})
	},

	//清空编辑器成功回调
	clearSuccess() {
		console.log('[clearSuccess callback]')
	},

	//清除当前选区的样式
	removeFormat() {
		this.editorCtx.removeFormat();
	},

	//插入图片
	insertImageEvent() {
		wx.chooseImage({
			count: 1,
			success: res => {
				let path = res.tempFilePaths[0];
				//调用子组件方法，图片应先上传再插入，不然预览时无法查看图片。
				richText.insertImageMethod(path).then(res => {
					console.log('[insert image success callback]=>', res)
				}).catch(res => {
					console.log('[insert image fail callback]=>', res)
				});
			}
		})
	},

	//保存，获取编辑器内容
	getEditorContent(res) {
		let {
			value
		} = res.detail;
		wx.showToast({
			title: '获取编辑器内容成功',
			icon: 'none',
		})
		console.log('[getEditorContent callback]=>', value)
	},

	//show文本工具栏
	showTextTool() {
		this.setData({
			textTool: !this.data.textTool
		})
	},

	//编辑器聚焦时触发
	bindfocus(res) {
		let {
			value
		} = res.detail;
		// console.log('[bindfocus callback]=>', value)
	},

	//编辑器失去焦点时触发
	bindblur(res) {
		let {
			value
		} = res.detail;
		// console.log('[bindblur callback]=>', value)
	},

	//编辑器输入中时触发
	bindinput(res) {
		let {
			value
		} = res.detail;
		// console.log('[bindinput callback]=>', value)
		console.log(app.globalData.data.richTextContents)
		app.globalData.data.richTextContents = value.detail.html;
	},

	//预览富文本
	preview() {
		wx.navigateTo({
			url: `../preview/preview`,
		})
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

	loseDailyTitleBlur(e) {
		this.setData({
			dailyTitle: e.detail.value
		})
		console.log(this.data.dailyTitle)
	},
	loseAbstractBlur(e) {
		this.setData({
			abstract: e.detail.value
		})
		console.log(this.data.abstract)
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
	radioChange() {
		this.setData({
			checked: !this.data.checked
		})
		console.log(this.data.checked)
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
	// onEditorReady() {
	// 	const that = this
	// 	wx.createSelectorQuery().select('#editor').context(function(res) {
	// 		that.editorCtx = res.context
	// 	}).exec()
	// },
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
		console.log(that.data);
		if (that.data.dailyTitle === "" || that.data.abstract === "" || that.data.ImgUrl === "") {
			wx.showToast({
				title: '请填写必要信息',
				icon: 'error',
				duration: 1500
			})
		} else {
			var saveArr = getApp().globalData.logs;
			let userId = getApp().globalData.userInfo.userId
			console.log('userId: ' + userId)
			var curtime = util.formatTime(new Date());
			let obj = {
				image: that.data.ImgUrl,
				detail: app.globalData.data.richTextContents,
				title: that.data.dailyTitle,
				time: curtime,
				abstract: that.data.abstract,
				userId: userId,
				public: !that.data.checked,
				like: 0,
				unlike: 0
			}
			//把图片存到users集合表
			const db = wx.cloud.database();
			db.collection("logs").add({
				data: obj,
				success: function(res) {
					obj._id = res.data[0]._id
					saveArr.push(obj);
					obj.isLiked = false
					obj.isUnliked = false
					getApp().globalData.logs = saveArr
					getApp().globalData.myPrivate = saveArr.filter(item => item.public == false && item.userId == userId)
					getApp().globalData.myPublic = saveArr.filter(item => item.public == true && item.userId == userId)
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
