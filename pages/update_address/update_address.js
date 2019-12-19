// pages/update_address/update_address.js
const app = getApp();
const chooseLocation = requirePlugin('chooseLocation');
var type = ''
var longitude = '';
var latitude = '';
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
var end_longitude = '';
var aid ='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    address: '',
    doorplate: '',
    name: '',
    phone: '',
    latitude:'',
    longitude:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    aid = options.aid;
    console.log('aid是' + aid);
    this.get_address_info();
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
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    var address = location.address + location.name;
    longitude = location.longitude;
    latitude = location.latitude;
    this.setData({
      address: address
    })
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
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  turn_to_map: function () {
    const key = 'BDRBZ-5JD34-NH7UR-D4QJG-HNQDS-H2BK3'; //使用在腾讯位置服务申请的key
    const referer = '跑腿'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: latitude,
      longitude: longitude
    });
    var url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
    if (latitude == 0 && longitude == 0) {
      url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    }
    wx.navigateTo({
      url: url
    });
  },
  data_Input: function (e) {
    var code = e.currentTarget.dataset.code;
    if (code == 'door') {
      this.setData({
        doorplate: e.detail.value
      })
    } else if (code == 'name') {
      this.setData({
        name: e.detail.value
      })
    } else if (code == 'phone') {
      this.setData({
        phone: e.detail.value
      })
    }
  },
  get_address_info: function () {
    var that =this;
    wx.request({
      url: app.globalData.URL + '/common/address/info.do?id='+aid,
      method: 'get',
      dataType: 'json',
      header: {
        'Content-Type': 'application/json',
        'Cookie': wx.getStorageSync('cookieKey')
      },
      responseType: 'text',
      success: function (res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          var data = res.data.data;
          that.setData({
            address: data.address,
            doorplate: data.details,
            name: data.username,
            phone: data.phone,
            latitude: data.latitude,
            longitude: data.longitude
          })
          longitude = data.longitude;
          latitude = data.latitude;
        }
      },
      fail: function (res) {
        console.log("返回错误" + res);
      },
      complete: function (res) {
        console.log("启动请求" + res);
      },
    })
  },
  save_and_use: function () {
    var address = this.data.address;
    var doorplate = this.data.doorplate;
    var name = this.data.name;
    var phone = this.data.phone;
    if (address == '' || doorplate == '' || name == '' || phone == "") {
      wx.showToast({
        title: '请完整填写信息',
        image: '/images/icons/wrong.png',
        duration: 3000
      });
    }
    if (this.isPoneAvailable(phone) == false) {
      wx.showToast({
        title: '联系方式不正确',
        image: '/images/icons/wrong.png',
        duration: 3000
      });
    }
    else {
      console.log('cookie是' + wx.getStorageSync('cookieKey'));
      wx.request({
        url: app.globalData.URL + '/common/address/update.do',
        method: 'get',
        dataType: 'json',
        data: {
          id: aid,
          address: address,
          details: doorplate,
          username: name,
          longitude: longitude,
          latitude: latitude
        },
        header: {
          'Content-Type': 'application/json',
          'Cookie': wx.getStorageSync('cookieKey')
        },
        responseType: 'text',
        success: function (res) {
          console.log("返回结果" + JSON.stringify(res));
          var status = res.data.status;
          if (status == 0) {
            wx.navigateBack({
              delta: 1, // 返回上一级页面。
              success: function () {
              }
            })
          }
        },
        fail: function (res) {
          console.log("返回错误" + res);
        },
        complete: function (res) {
          console.log("启动请求" + res);
        },
      })
    }
    console.log('地址是' + address + '，门牌号是' + doorplate + '，联系人是' + name + '，联系方式是' + phone + '，经度是' + longitude + '，纬度是' + latitude);
  },
  isPoneAvailable: function (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
  delete_address:function(){
    var that = this;
    wx.showModal({
      title: '确定删除此地址吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/common/address/delete.do?Id='+aid,
            method: 'get',
            dataType: 'json',
            header: {
              'Content-Type': 'application/json',
              'Cookie': wx.getStorageSync('cookieKey')
            },
            responseType: 'text',
            success: function (res) {
              console.log("返回结果" + JSON.stringify(res));
              var status = res.data.status;
              if (status == 0) {
                wx.navigateBack({
                  delta: 1, // 返回上一级页面。
                  success: function () {
                  }
                })
              }
            },
            fail: function (res) {
              console.log("返回错误" + res);
            },
            complete: function (res) {
              console.log("启动请求" + res);
            },
          })
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  }
})