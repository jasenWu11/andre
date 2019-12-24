// pages/order_detail/order_detail.js
const app = getApp();
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var star_data = require("../../js/test.js").star_data;
var latstart = '';
var lngstart = '';
var latend = '';
var lngend = '';
var star_num = 0;
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'XC3BZ-MNB36-LF7S3-EUFKC-DEDNS-M2F5K'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '2667794103135985',
    runner_phone: '15625527284',
    star_data: [],
    showDialog: false,
    evaluation_text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setmap();
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
    this.getstardata();
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
  setmap: function() {
    let _page = this;
    _page.setData({
      markers: [{
          id: 0,
          latitude: latstart,
          longitude: lngstart,
          // 起点图标
          iconPath: '/images/icons/start.png'
        },
        {
          id: 1,
          latitude: latend,
          longitude: lngend,
          // 终点图标
          iconPath: '/images/icons/end.png'
        },
      ]
    });
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        _page.setData({
          latitude: latstart,
          longitude: lngstart,
          scale: 10
        });
      }
    })
  },
  //事件回调函数
  driving: function() {

    let _page = this;

    _page.setData({
      latitude: latstart,
      longitude: lngstart,
      scale: 16
    });

    //网络请求设置
    let opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${latstart},${lngstart}&to=${latend},${lngend}&key=${qqmapsdk.key}`,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function(res) {
        let ret = res.data
        if (ret.status != 0) return; //服务异常处理
        let coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        _page.setData({
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      }
    };
    wx.request(opt);
  },
  textPaste: function() {
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: this.data.order_id,
      success: function(res) {
        wx.getClipboardData({
          //这个api是把拿到的数据放到电脑系统中的
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  call_runner: function() {
    console.log('拨打电话')
    wx.makePhoneCall({
      phoneNumber: this.data.runner_phone,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  getstardata: function() {
    var star_list = star_data;
    this.setData({
      star_data: star_data
    })
  },
  change_star: function(event) {
    var that = this;
    var sid = event.currentTarget.dataset.sid;
    star_num = sid;
    var star_list = this.data.star_data;
    var src1 = "/images/icons/star_null.png"
    var src2 = "/images/icons/star_all.png"
    for (var i in star_list) {
      star_list[i].src = src1;
      if (star_list[i].id <= sid) {
        star_list[i].src = src2;
      }
    }
    that.setData({
      star_data: star_list
    })
    that.openDialog();
  },
  openDialog: function() {
    console.log('显示');
    this.setData({
      istrue: true
    })
  },
  closeDialog: function() {
    this.setData({
      istrue: false
    })
  },
  data_Input: function(e) {
    this.setData({
      evaluation_text: e.detail.value
    })
  },
  affirm_evaluation: function() {
    var that = this;
    console.log('星级' + star_num+'提交评价' + this.data.evaluation_text);
  }
})