// pages/address_list/add_address.js
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
var end_longitude = ''
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
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    type = options.type;
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
    else{
      console.log('cookie是' + wx.getStorageSync('cookieKey'));
      wx.request({
        url: app.globalData.URL + '/common/address/add.do',
        method: 'get',
        dataType: 'json',
        data: {
          phone: phone,
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
            if (type == 0) {
              start_id = 3;
              start_address = address;
              start_doorplate = doorplate;
              start_name = name;
              start_phone = phone;
              start_latitude = latitude;
              start_longitude = longitude;
            } else {
              end_id = 4;
              end_address = address;
              end_doorplate = doorplate;
              end_name = name;
              end_phone = phone;
              end_latitude = latitude;
              end_longitude = longitude;
            }
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
            // var data = res.data.data.data;
            // var item_type_list = data;
            // for (var i = 0; i < item_type_list.length; i++) {
            //   var border = '2rpx solid #666666'
            //   var color = '#000000'
            //   item_type_list[i].border = border;
            //   item_type_list[i].color = color;
            // }
            // that.setData({
            //   item_type_data: item_type_list
            // })
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
  }
})