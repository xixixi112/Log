
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onEditorReady() {
    wx.createSelectorQuery().select('#editor').context(res => {
      this.editorCtx = res.context;
      console.log(app.globalData.data.richTextContents)
      this.editorCtx.setContents({
        html: app.globalData.data.richTextContents,
        success: res => {
          console.log('[setContents success]')
        }
      })
    }).exec()
  }
})