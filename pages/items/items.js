// pages/items/items.js
var item_type_data = require("../../js/test.js").item_type_data;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_type_data: [],
    slider1: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getitem_type_list();
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
  getitem_type_list: function() {
    var that = this;
    var item_type_list = item_type_data;
    for (var i = 0; i < item_type_list.length; i++) {
      var border = '2rpx solid #666666'
      var color = '#000000'
      item_type_list[i].border = border;
      item_type_list[i].color = color;
    }
    that.setData({
      item_type_data: item_type_list
    })
  },
  check_type: function(event) {
    var that = this;
    var iid = event.currentTarget.dataset.iid;
    var item_type_list = item_type_data;
    for (var i = 0; i < item_type_list.length; i++) {
      var border = '2rpx solid #666666'
      var color = '#000000'
      item_type_list[i].border = border;
      item_type_list[i].color = color;
      if (item_type_list[i].id == iid) {
        item_type_list[i].border = "2rpx solid #f5c352";
        item_type_list[i].color = "#f5c352";
      }
    }
    that.setData({
      item_type_data: item_type_list
    })
  },
  changeSlider1(e) {
    this.setData({ slider1: e.detail.value })
  }
})