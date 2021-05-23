// pages/index/index.js
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
    LogTime:"",
    LogTitle:"",
    LogImg:"",
    LogLocation:"",
    Logdetail:"",
    LogInfo:[],
    curTime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: '2021/05/22 15:59:24',
      success: (result) => {
        console.log(result)
        this.setData({
          LogTitle:result.data[0],
          LogTime:result.data[1],
          LogLocation:result.data[2],
          LogImg:result.data[3],
          Logdetail:result.data[4],
          curTime:result.data[5]
        })
        
      },
      fail: (res) => {},
      complete: (res) => {},
    }),
  
    wx.getSystemInfo({
      success:(res)=> {
        this.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth,
          buttonTop:res.windowHeight*0.70,//这里定义按钮的初始位置
          buttonLeft:res.windowWidth*0.70,//这里定义按钮的初始位置
        })
      }
    })
  },
  //可拖动悬浮按钮点击事件
  btn_Suspension_click(){
    wx.navigateTo({
      url: "/pages/addLog/addLog",
    })
  },
  //以下是按钮拖动事件
  buttonStart: function (e) {
    // console.log("buttonStart",e)
    startPoint = e.touches[0]//获取拖动开始点
  },
  buttonMove: function (e) {
    // console.log("buttonMove",e)
    var endPoint = e.touches[e.touches.length - 1]//获取拖动结束点
    //计算在X轴上拖动的距离和在Y轴上拖动的距离
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint//重置开始位置
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft+50 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-50;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 50 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-50;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
  },

  getLogDetail(){
     wx.navigateTo({
      url: '/pages/logDetail/logDetail?curTime='+this.data.curTime,
      success:(res)=>{
        console.log("携带数据跳转成功");
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})