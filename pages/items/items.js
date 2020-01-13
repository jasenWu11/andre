// pages/items/items.js
const app = getApp();
var item_type_data = require("../../js/test.js").item_type_data;
var item_type = false;
var weight = 4;
var type_id = 0;
var price = '';
var type_name = '小于5';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item_type_data: [],
    slider1: "小于5"
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
    wx.request({
      url: app.globalData.URL + '/common/category/list.do',
      method: 'get',
      dataType: 'json',
      data:{
        "disabled":0
      },
      responseType: 'text',
      success: function (res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          item_type_list = res.data.data.data;
          for (var i = 0; i < item_type_list.length; i++) {
            var border = '2rpx solid #666666'
            var color = '#000000'
            item_type_list[i].border = border;
            item_type_list[i].color = color;
          }
          that.setData({
            item_type_data: item_type_list
          })
        } else {
          var msg = res.data.msg
          wx.showToast({
            title: msg,
            image: '/images/icons/wrong.png',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求异常',
          image: '/images/icons/wrong.png',
        })
      },
      complete: function (res) {
        console.log("启动请求" + res);
      },
    })
  },
  check_type: function(event) {
    var that = this;
    var iid = event.currentTarget.dataset.iid;
    type_id = iid;
    var item_type_list = this.data.item_type_data;
    for (var i = 0; i < item_type_list.length; i++) {
      var border = '2rpx solid #666666'
      var color = '#000000'
      item_type_list[i].border = border;
      item_type_list[i].color = color;
      if (item_type_list[i].id == iid) {
        item_type_list[i].border = "2rpx solid #f5c352";
        item_type_list[i].color = "#f5c352";
        type_name = item_type_list[i].categoryname;
        price = item_type_list[i].categoryprice;
      }
    }
    that.setData({
      item_type_data: item_type_list
    })
    item_type = true;
  },
  changeSlider1(e) {
    var slider_val = e.detail.value;
    weight = e.detail.value;
    if (slider_val == 4) {
      slider_val = "小于5"
    }
    this.setData({
      slider1: slider_val
    })
  },
  confirm_item: function() {
    var that = this;
    if (item_type == false) {
      wx.showToast({
        title: '物品类型为空',
        image: '/images/icons/wrong.png',
        duration: 3000
      });
    } else {
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

      prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        istype: 1,
        typeid: type_id,
        weight: weight,
        weight_text: that.data.slider1,
        type_name: type_name,
        price: price
      })
      wx.navigateBack({
        delta: 1, // 返回上一级页面。
        success: function() {
          prevPage.setitem_type(); // 执行前一个页面的onLoad方法
        }
      })
    }
  }
})