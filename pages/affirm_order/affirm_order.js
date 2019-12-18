// pages/affirm_order/affirm_order.js
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
    start_date:'',
    end_date:'',
    note:'',
    type_name:'',
    weight_text:'',
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
    moneys:6,
    showDialog: false,
    istrue:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    weight = options.weight;
    weight_text = options.weight_text;
    type_id = options.type_id;
    distance = options.distance;
    typename = options.typename;
    price = options.price;
    console.log('单价是'+price +'重量是'+weight +'距离是'+distance);
    var moneys = this.getmoneys(price,weight,distance);
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
    var statrdate = this.getNowFormatDate('-',0);
    var enddate = this.getNowFormatDate('-',1);
    var time = this.gettime();
    this.setData({
      type_name:typename,
      weight_text:weight_text,
      start_date:statrdate,
      end_date:enddate,
      time:time,
      start_id:start_id,
      start_address:start_address,
      start_doorplate:start_doorplate,
      start_name:start_name,
      start_phone:start_phone,
      start_latitude:start_latitude,
      start_longitude:start_longitude,
      end_id:end_id,
      end_address:end_address,
      end_doorplate:end_doorplate,
      end_name:end_name,
      end_phone:end_phone,
      end_latitude:end_latitude,
      end_longitude:end_longitude,
      moneys:moneys
    })
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
  setmap:function(){
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
      success: function (res) {
        _page.setData({
          latitude: latstart,
          longitude: lngstart,
          scale: 10
        });
      }
    })
  },
  //事件回调函数
  driving: function () {

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
      success: function (res) {
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
  data_Input: function (e) {
    this.setData({
      note: e.detail.value
    })
  },
  //获取当前年月日
  getNowFormatDate: function (type,addDayCount) {
    var date;
    date = new Date();
    date.setDate(date.getDate() + addDayCount);//获取AddDayCount天后的日期 
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
  gettime:function(){
    var d = new Date();
    var my_hours=d.getHours();
    var my_minutes=d.getMinutes();
    var time = my_hours+":"+my_minutes;
    return time;
  },
  getmoneys:function(price,weight,distance){
    var moneys = 6;
    distance = distance/1000
    if(distance<=3){
      moneys = moneys+distance*1
    }else if(distance>3){
      moneys = moneys+3*1+(distance-3)*2
    }
    if(weight>=6&&weight<10){
      moneys = moneys + 6
    }else if(weight>=10){
      moneys = moneys +10
    }
    moneys = Math.ceil(moneys)
    return moneys
  },
    openDialog: function () {
        this.setData({
            istrue: true
        })
    },
    closeDialog: function () {
      var istrue = 
        this.setData({
            istrue: false
        })
    },
    clickDialog:function(){
      if(this.data.istrue == false){
        this.openDialog();
      }else{
        this.closeDialog();
      }
    }

})