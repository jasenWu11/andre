// let coors;
// // 引入SDK核心类
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var latstart = '';
var lngstart = '';
var latend = '';
var lngend = '';
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'XC3BZ-MNB36-LF7S3-EUFKC-DEDNS-M2F5K'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openNav: true,
    isstart: 0,
    isend: 0,
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
    end_longitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _page = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        _page.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 10
        });
      }
    })
    wx.clearStorageSync('latlngstart');
    wx.clearStorageSync('latlngend');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 起点
   */
  getStart(e) {
    let _page = this;

    /**
     * 修改：以前示例(2018-09-15)地址转经纬度用错接口了
     */
    latstart = this.data.start_latitude;
    lngstart = this.data.start_longitude;
    wx.setStorageSync('latlngstart', {
      lat: latstart,
      lng: lngstart
    });

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


    /**
     * 修改为（2018-09-19）
     */

    qqmapsdk.geocoder({
      //address: res.address,
      success: function(res) {
        let lat = res.result.location.lat;
        let lng = res.result.location.lng;
        wx.setStorageSync('latlngendSend', {
          lat: lat,
          lng: lng
        });

        // 起点经纬度
        let latStart = wx.getStorageSync('latlngstartSend').lat;
        let lngStart = wx.getStorageSync('latlngstartSend').lng;

        // 终点经纬度
        let latEnd = wx.getStorageSync('latlngendSend').lat;
        let lngEnd = wx.getStorageSync('latlngendSend').lng;

        qqmapsdk.calculateDistance({
          to: [{
            latitude: latStart,
            longitude: lngStart
          }, {
            latitude: latEnd,
            longitude: lngEnd
          }],
          success: function(res) {
            console.log(res, '两点之间的距离(代送)：', res.result.elements[1].distance);
            wx.setStorageSync('kmSend', res.result.elements[1].distance + "");
          }
        });
      }
    });



    // 如果输入地点为空：则不规划路线
    if (this.data.start_latitude == '') {
      _page.setData({
        openNav: true,
        resultDistance: ''
      });
    } else {
      _page.setData({
        openNav: false
      });
    }
  },

  /**
   * 终点
   */
  getEnd(e) {
    let _page = this;
    // 输入地点获取经纬度,我取得是数据的第一条数据.
    let lat = this.data.end_latitude;
    let lng = this.data.end_longitude;
    latend = this.data.end_latitude;
    lngend = this.data.end_longitude;
    wx.setStorageSync('latlngend', {
      lat: lat,
      lng: lng
    });

    // 起点经纬度
    let latStart = wx.getStorageSync('latlngstartSend').lat;
    let lngStart = wx.getStorageSync('latlngstartSend').lng;

    // 终点经纬度
    let latEnd = wx.getStorageSync('latlngendSend').lat;
    let lngEnd = wx.getStorageSync('latlngendSend').lng;
    _page.setData({
      scale: 16,
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
          latitude: latend,
          longitude: lngend,
          scale: 10
        });
      }
    })
    // 如果输入地点为空：则不规划路线
    if (this.data.end_latitude == '') {
      _page.setData({
        openNav: true,
        resultDistance: ''
      });
    } else {
      _page.setData({
        openNav: false
      });
    }
  },
  //事件回调函数
  driving: function() {

    let _page = this;

    // 起点经纬度
    let latStart = wx.getStorageSync('latlngstart').lat;
    let lngStart = wx.getStorageSync('latlngstart').lng;

    // 终点经纬度
    let latEnd = wx.getStorageSync('latlngend').lat;
    let lngEnd = wx.getStorageSync('latlngend').lng;


    _page.setData({
      latitude: latStart,
      longitude: lngStart,
      scale: 16
    });

    /**
     * 获取两点的距离
     */
    qqmapsdk.calculateDistance({
      to: [{
        latitude: latStart,
        longitude: lngStart
      }, {
        latitude: latEnd,
        longitude: lngEnd
      }],
      success: function(res) {
        console.log(res, '两点之间的距离：', res.result.elements[1].distance);
        _page.setData({
          resultDistance: res.result.elements[1].distance + '米'
        });
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });

    //网络请求设置
    let opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: `https://apis.map.qq.com/ws/direction/v1/driving/?from=${latStart},${lngStart}&to=${latEnd},${lngEnd}&key=${qqmapsdk.key}`,
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
  choose_address: function(event) {
    var that = this;
    var type = event.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../address_list/address_list?type=' + type
    })
  },
  setcoordinates: function(type) {
    console.log('type是' + type);
    if (type == 0) {
      this.getStart();
    } else {
      this.getEnd();
    }
    if (this.data.isstart == 1 && this.data.isend == 1) {
      this.driving();
    }
  },
  clear_address: function() {
    var _page = this;
    this.setData({
      isend: 0,
      isstart: 0
    })
    wx.removeStorageSync('latlngstart');
    wx.removeStorageSync('latlngend');
    this.setData({
      scale: 16,
      markers: [],
      polyline: []
    });
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        _page.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 10
        });
      }
    })
  }
})