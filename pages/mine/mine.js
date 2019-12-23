// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    picurl: '',
    sno: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_mine_info();
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

  },
  get_mine_info: function() {
    var username = wx.getStorageSync("username");
    var picurl = wx.getStorageSync("picurl");
    var sno = wx.getStorageSync("uname");
    this.setData({
      username: username,
      picurl: picurl,
      sno: sno
    })
  },
  to_myorder: function() {
    wx.navigateTo({
      url: '../order_list/order_list',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  call_service: function() {
    console.log('拨打客服电话')
    wx.makePhoneCall({
      phoneNumber: '13509234754',
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  to_setting: function() {
    wx.navigateTo({
      url: '../setting/setting',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})