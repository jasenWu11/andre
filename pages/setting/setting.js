// pages/setting/setting.js
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

  },
  to_logout:function(){
    wx.showToast({
      title: '暂不支持此功能',
      image: '/images/icons/wrong.png',
      duration: 1000
    });
  },
  agreement:function(){
    wx.navigateTo({
      url: '../agreement/agreement',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  service_introduced:function(){
    wx.navigateTo({
      url: '../service_introduced/service_introduced',
    })
  }
})