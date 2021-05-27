// miniprogram/pages/personal/personal.js
var util = require('../../utils/util.js')
const module  = require("../../commond/tabFunction.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styles:[
      {class:'icon',text:"日志",hidden:false},
      {class:'',text:"收藏",hidden:true},
      {class:'',text:"赞过",hidden:true}
    ],
    index: 0,
    logList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getLog',
    }).then(res=>{
      console.log('请求云函数成功', res.result.data);
      var data = res.result.data;
      for(let i=0; i<data.length; i++) {
        data[i]["time"] = util.formatTime(new Date(data[i]["time"]))
      }
      this.setData({
        logList: data
      })
    })
    .catch(err=>{
      console.log('请求云函数失败', err);
    })
  },
  tab(evt){
    //获取页面传过来的index参数
    var index = evt.target.dataset.index;
    //获取data里的styles对象数组
    var styles = this.data.styles;
    //调用tabFunction.js封装的tab切换方法
    var ret = module.tabComper(styles,index);
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
  changeTab(evt){
        //获取页面当前的index参数
    var index = evt.detail.current;
        //获取data里的styles对象数
    var styles = this.data.styles
    //调用tabFunction.js封装的tab切换方法
    var ret = module.tabComper(styles,index);
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
  settingData(){
    wx.navigateTo({
      url: '/pages/editData/editData',   
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  setting(){
    wx.navigateTo({
      url: '/pages/setting/setting',
      
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
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