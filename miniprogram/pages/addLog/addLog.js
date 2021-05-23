var util = require('../../utils/util.js');
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    curTime:"",
    maxDate:"",
    displayValue:"点击选择日期",
    showLocation:"点击选择位置",
    curLocation:"",
    dailyTitle:"",
    showImgUrl:"点击选择封面",
    ImgUrl:""
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
      curTime:value,
      maxDate:value,     
    });
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
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
  onChooseData(e){
    console.log(e);
    this.setData({
      displayValue:e.detail.label,
      curTime:e.detail.label
    })
    console.log(this.data.displayValue)
  },
  loseDailyTitleBlur(e){
    this.setData({
      dailyTitle:e.detail.value      
    }) 
    console.log(this.data.dailyTitle) 
  },
  getCurLocation(res){
    let _this=this
    wx.getLocation({
      type:"wgs84",
      success:(res)=>{
        console.log(res)
        _this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    })
    wx.chooseLocation({
      latitude: this.latitude,
      longitude:this.longitude,
      success:(res)=>{
        console.log(res.name)
        if(res.name.length>14){
          var temp_str=res.name.slice(0,15)
        }
        else{
          var temp_str=res.name
        }
        _this.setData({
          showLocation:temp_str,
          curLocation:res.name
        })
        
      }
    })
  },

  getImgUrl(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths)
        this.setData({
          ImgUrl:res.tempFilePaths[0],
          showImgUrl:"封面选择完成"
        })
      }
    })
  },


  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },

  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  insertDivider(){
    this.editorCtx.insertDivider({
      success:function(res){
        console.log("insertDivider success");
      }
    })
  },
  undo(){
    this.editorCtx.undo({
      success:function(res){
        console.log("undo success");
      }
    })
  },
  redo(){
    this.editorCtx.redo({
      success:function(res){
        console.log("redo success");
      }
    })
  },
  getContents(){
    var that=this;
    this.editorCtx.getContents({
      success:function(res){
        // console.log(res);
        if(that.data.dailyTitle===""||that.data.displayValue==="点击选择日期"||that.data.curLocation===""||that.data.ImgUrl===""||res.html===""){
          wx.showToast({
            title: '请填写必要信息',
            icon: 'error',
            duration: 1500
          })
        }
        else{
          var saveArr=[];
          saveArr.push(that.data.dailyTitle,that.data.displayValue,that.data.curLocation,that.data.ImgUrl,res.html,that.data.maxDate);
          wx.setStorage({
            key: that.data.maxDate,
            data:saveArr,
            success: (result) => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1500
              })
            },
            fail: (res) => {},
            complete: (res) => {},
          })
          setTimeout(function(){
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
          },1800)
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
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  }
})
