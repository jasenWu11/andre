// pages/affirm_order/affirm_order.js
const app = getApp();
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var latstart = '';
var lngstart = '';
var latend = '';
var lngend = '';
var weight = '';
var weight_text = ''
var type_id = '';
var distance = '';
var typename = '';
var price = '';
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'XC3BZ-MNB36-LF7S3-EUFKC-DEDNS-M2F5K'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "12:01",
    start_date: '',
    end_date: '',
    note: '',
    type_name: '',
    weight_text: '',
    start_id: '',
    start_address: '',
    start_doorplate: '',
    start_name: '',
    start_phone: '',
    start_latitude: '',
    start_longitude: '',
    end_id: '',
    end_address: '',
    end_doorplate: '',
    end_name: '',
    end_phone: '',
    end_latitude: '',
    end_longitude: '',
    moneys: 6,
    showDialog: false,
    istrue: false,
    distance_text: '',
    out_distance: '',
    out_weight: '',
    out_time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    weight = options.weight;
    weight_text = options.weight_text;
    type_id = options.type_id;
    distance = options.distance;
    typename = options.typename;
    price = options.price;
    console.log('单价是' + price + '重量是' + weight + '距离是' + distance);
    var moneys = this.getmoneys(price, weight, distance);
    var start_id = wx.getStorageSync("start_info").id;
    var start_address = wx.getStorageSync("start_info").address;
    var start_doorplate = wx.getStorageSync("start_info").doorplate;
    var start_name = wx.getStorageSync("start_info").name;
    var start_phone = wx.getStorageSync("start_info").phone;
    var start_latitude = wx.getStorageSync("start_info").latitude;
    var start_longitude = wx.getStorageSync("start_info").longitude;
    var end_id = wx.getStorageSync("end_info").id;
    var end_address = wx.getStorageSync("end_info").address;
    var end_doorplate = wx.getStorageSync("end_info").doorplate;
    var end_name = wx.getStorageSync("end_info").name;
    var end_phone = wx.getStorageSync("end_info").phone;
    var end_latitude = wx.getStorageSync("end_info").latitude;
    var end_longitude = wx.getStorageSync("end_info").longitude;
    latstart = start_latitude;
    lngstart = start_longitude;
    latend = end_latitude;
    lngend = end_longitude;
    this.setmap();
    this.driving();
    var statrdate = this.getNowFormatDate('-', 0);
    var enddate = this.getNowFormatDate('-', 1);
    var time = this.gettime();
    this.setData({
      type_name: typename,
      weight_text: weight_text,
      start_date: statrdate,
      end_date: enddate,
      time: time,
      start_id: start_id,
      start_address: start_address,
      start_doorplate: start_doorplate,
      start_name: start_name,
      start_phone: start_phone,
      start_latitude: start_latitude,
      start_longitude: start_longitude,
      end_id: end_id,
      end_address: end_address,
      end_doorplate: end_doorplate,
      end_name: end_name,
      end_phone: end_phone,
      end_latitude: end_latitude,
      end_longitude: end_longitude,
      moneys: moneys,
      distance_text: (distance / 1000).toFixed(1) + '公里',
      student_no: ''
    })
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
  remark_Input: function(e) {
    this.setData({
      note: e.detail.value
    })
  },
  //获取当前年月日
  getNowFormatDate: function(type, addDayCount) {
    var date;
    date = new Date();
    date.setDate(date.getDate() + addDayCount); //获取AddDayCount天后的日期 
    var seperator1 = type;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  gettime: function() {
    var d = new Date();
    var my_hours = d.getHours();
    var my_minutes = d.getMinutes();
    var time = my_hours + ":" + my_minutes;
    return time;
  },
  getmoneys: function(price, weight, distance) {
    var moneys = 6;
    distance = distance / 1000
    var out_distance = '￥' + 0
    var out_weight = '￥' + 0
    var out_time = '￥' + 0
    if (distance <= 3) {
      moneys = moneys + distance * 1
      out_distance = '￥' + Math.ceil(distance * 1)
    } else if (distance > 3) {
      moneys = moneys + 3 * 1 + (distance - 3) * 2
      out_distance = '￥' + Math.ceil(3 * 1 + (distance - 3) * 2)
    }
    if (weight >= 6 && weight < 10) {
      moneys = moneys + 6
      out_weight = 6;
    } else if (weight >= 10) {
      moneys = moneys + 10
      out_weight = 10;
    }
    var out_mo = this.checkTime(['0:00', '06:00']);
    var out_ni = this.checkTime(['22:00', '24:00']);
    if (out_mo == true) {
      moneys = moneys + 6;
      out_time = '￥' + 6;
    } else if (out_ni == true) {
      moneys = moneys + 3;
      out_time = '￥' + 3;
    }
    console.log(out_mo + '和' + out_ni);
    this.setData({
      out_distance: out_distance,
      out_weight: out_weight,
      out_time: out_time
    })
    moneys = Math.ceil(moneys)
    return moneys
  },
  openDialog: function() {
    this.setData({
      istrue: true
    })
  },
  closeDialog: function() {
    var istrue =
      this.setData({
        istrue: false
      })
  },
  clickDialog: function() {
    if (this.data.istrue == false) {
      this.openDialog();
    } else {
      this.closeDialog();
    }
  },
  checkTime: function(ar) {
    var d = new Date();
    var current = d.getHours() * 60 + d.getMinutes();
    var ar_begin = ar[0].split(':');
    var ar_end = ar[1].split(':');
    var b = parseInt(ar_begin[0]) * 60 + parseInt(ar_begin[1]);
    var e = parseInt(ar_end[0]) * 60 + parseInt(ar_end[1]);
    if (current > b && current < e) return true;
    else return false;
  },
  to_rule: function() {
    wx.navigateTo({
      url: '../rule/rule',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  affirm: function() {
    var that = this;
    var disable = wx.getStorageSync('disable')
    var ispass = wx.getStorageSync('ispass')
    if (ispass == false) {
      wx.showModal({
        title: '未绑定学号',
        content: '您未绑定学号，绑定后才能发布订单',
        confirmText: "确定",
        cancelText: "取消",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            that.openbangDialog()
          } else {
            console.log('用户点击辅助操作')
          }
        }
      });
    } else {
      if (disable == false) {
        that.affirm_order()
      } else {
        wx.showToast({
          title: '你已被禁用',
          image: '/images/icons/wrong.png',
          duration: 0,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
  },
  affirm_order: function() {
    var that = this;
    var ordersenddate = that.data.start_date + ' ' + that.data.time + ':00';
    var state = new Date(ordersenddate) - new Date();
    if (state < 0) {
      wx.showToast({
        title: '送达时间已过',
        image: '/images/icons/wrong.png'
      })
    } else {
      var startaddressid = that.data.start_id;
      var endaddressid = that.data.end_id;
      var orderstate = 0;
      var goodcategoryid = type_id;
      var orderprice = that.data.moneys;
      var ordertype = 0;
      var note = that.data.note;
      wx.request({
        url: app.globalData.URL + '/order/create.do',
        method: 'get',
        dataType: 'json',
        responseType: 'text',
        header: {
          'Cookie': wx.getStorageSync('cookieKey')
        },
        data: {
          'ordersenddate': ordersenddate,
          'startaddressid': startaddressid,
          'endaddressid': endaddressid,
          'orderstate': orderstate,
          'goodcategoryid': goodcategoryid,
          'orderprice': orderprice,
          'ordertype': ordertype,
          'weight': weight,
          'remarks': note
        },
        success: function(res) {
          console.log("返回结果" + JSON.stringify(res));
          var status = res.data.status;
          if (status == 0) {
            var order_id = res.data.data
            wx.navigateTo({
              url: '../order_detail/order_detail?order_id=' + order_id,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {
            var msg = res.data.msg;
            wx.showToast({
              title: msg,
              image: '/images/icons/wrong.png',
              duration: 0,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function(res) {
          console.log("返回错误" + res);
        },
        complete: function(res) {
          console.log("启动请求" + res);
        },
      })
    }
  },
  bindDateChange: function(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  openbangDialog: function(event) {
    this.setData({
      bangtrue: true
    })
  },
  closebangDialog: function() {
    this.setData({
      bangtrue: false
    })
  },
  data_Input: function(e) {
    this.setData({
      student_no: e.detail.value
    })
  },
  name_Input: function(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  tobang: function() {
    var that = this;
    var sno = this.data.student_no + '';
    var nickname = this.data.nickname + '';
    console.log('绑定学号' + sno)
    wx.request({
      url: app.globalData.URL + '/user/update.do?username=' + sno + '&nickname=' + nickname,
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      header: {
        'Cookie': wx.getStorageSync('cookieKey')
      },
      success: function(res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          wx.showToast({
            title: '等待管理员审核',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: function(res) {
        console.log("返回错误" + res);
      },
      complete: function(res) {
        console.log("启动请求" + res);
      },
    })
    this.setData({
      bangtrue: false
    })
  }
})