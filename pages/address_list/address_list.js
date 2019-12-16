// pages/address_list/address_list.js
var address_data = require("../../js/test.js").address_data;
var type = 0;
var start_id = '';
var start_address = '';
var start_doorplate = '';
var start_name = '';
var start_phone = '';
var start_latitude = '';
var start_longitude = '';
var end_id = '';
var end_address = '';
var end_doorplate = '';
var end_name = '';
var end_phone = '';
var end_latitude = '';
var end_longitude = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    type = options.type;
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
    this.getaddress_list();
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
  getaddress_list: function() {
    console.log(type);
    var that = this;
    var address_list = address_data;
    for (var i = 0; i < address_list.length; i++) {
      var ishidden = true;
      if (type == 0) {
        if (address_list[i].default_start == 1) {
          that.toFirst(address_list, i);
        }
      } else {
        if (address_list[i].default_end == 1) {
          that.toFirst(address_list, i);
        }
      }
      address_list[i].ishidden = true;
    }
    address_list[0].ishidden = false;
    console.log(JSON.stringify(address_list));
    that.setData({
      address_data: address_list
    })
  },
  toFirst: function(fieldData, index) {    
    if (index != 0) {
      fieldData.unshift(fieldData.splice(index, 1)[0]);    
    }
  },
  change_address: function(event) {
    console.log(type);
    var that = this;
    var aid = event.currentTarget.dataset.aid;
    var address_list = that.data.address_data;
    for (var i = 0; i < address_list.length; i++) {
      if (type == 0) {
        address_list[i].default_start = 0;
        var ishidden = true;
        if (address_list[i].id == aid) {
          address_list[i].default_start = 1;
          start_id = address_list[i].id;
          start_address = address_list[i].address;
          start_doorplate = address_list[i].doorplate;
          start_name = address_list[i].name;
          start_phone = address_list[i].phone;
          start_latitude = address_list[i].latitude;
          start_longitude = address_list[i].longitude;
          that.toFirst(address_list, i);
        }
      } else {
        address_list[i].default_end = 0;
        var ishidden = true;
        if (address_list[i].id == aid) {
          address_list[i].default_end = 1;
          end_id = address_list[i].id;
          end_address = address_list[i].address;
          end_doorplate = address_list[i].doorplate;
          end_name = address_list[i].name;
          end_phone = address_list[i].phone;
          end_latitude = address_list[i].latitude;
          end_longitude = address_list[i].longitude;
          that.toFirst(address_list, i);
        }
      }
      address_list[i].ishidden = true;
    }
    address_list[0].ishidden = false;
    console.log(JSON.stringify(address_list));
    that.setData({
      address_data: address_list
    })
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    if (type == 0) {
      prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        isstart: 1,
        start_id: start_id,
        start_address: start_address,
        start_doorplate: start_doorplate,
        start_name: start_name,
        start_phone: start_phone,
        start_latitude: start_latitude,
        start_longitude: start_longitude
      })
    } else {
      prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        isend: 1,
        end_id: end_id,
        end_address: end_address,
        end_doorplate: end_doorplate,
        end_name: end_name,
        end_phone: end_phone,
        end_latitude: end_latitude,
        end_longitude: end_longitude
      })
    }
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
        prevPage.setcoordinates(type); // 执行前一个页面的onLoad方法
      }
    })
  },
  add_address:function(){
    wx.navigateTo({
      url: '../add_address/add_address?type=' + 2
    })
  },
  setcoordinates:function(){
    console.log('刷新界面');
  }
})