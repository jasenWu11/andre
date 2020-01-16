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
    star_data: [],
    showDialog: false,
    evaluation_text: '',
    start_address: "",
    start_doorplate: "",
    start_name: "",
    start_phone: "",
    end_address: "",
    end_doorplate: "",
    end_name: "",
    end_phone: "",
    orderstate: '',
    price: 0,
    o_id: '',
    creat_time: '',
    send_time: '',
    weight_text: '',
    resultDistance: '',
    hiddrunner: true,
    state_text: '',
    hiddevaluate: true,
    rnickname: '',
    rphone: '',
    satisfaction: '',
    satisfact_text: '',
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    time_text: '正在为您寻找骑手，预计在 5分钟 内接单',
    hidden_pay:'flex',
    canel_state:'flex',
    canceltype:'',
    pay_text:'支付订单'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var o_id = options.order_id;
    this.get_order_info(o_id);
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
    qqmapsdk.calculateDistance({
      from: {
        latitude: latstart,
        longitude: lngstart
      },
      to: [{
        latitude: latend,
        longitude: lngend
      }],
      success: function(res) {
        console.log(res, '两点之间的距离：', res.result.elements[0].distance);
        var distance = res.result.elements[0].distance;
        if (distance > 1000) {
          _page.setData({
            resultDistance: (res.result.elements[0].distance / 1000).toFixed(1) + '千米'
          });
        } else {
          _page.setData({
            resultDistance: res.result.elements[0].distance + '米'
          });
        }
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
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
      phoneNumber: this.data.rphone,
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
    console.log('订单' + that.data.o_id + '星级' + star_num + '提交评价' + this.data.evaluation_text);

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx64148b0d13e32750&secret=6923086ad2c81fe33397ca73d2c8d2cc',
      method: 'GET',
      success: res => {
        console.log("返回结果" + JSON.stringify(res));
        var access_token = res.data.access_token;
        wx.request({
          method: 'POST',
          url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + access_token,
          data: {
            content: that.data.evaluation_text
          },
          success(res) {
            console.log("返回结果1" + JSON.stringify(res));
            if (res.errcode != 87014) {
              wx.request({
                url: app.globalData.URL + '/evaluate/add.do',
                method: 'get',
                dataType: 'json',
                header: {
                  'Cookie': wx.getStorageSync('cookieKey')
                },
                data: {
                  orderid: that.data.o_id,
                  orderstar: star_num,
                  remarks: that.data.evaluation_text
                },
                responseType: 'text',
                success: function(res) {
                  console.log("返回结果" + JSON.stringify(res));
                  var status = res.data.status;
                  if (status == 0) {
                    that.setData({
                      istrue: false
                    })
                    wx.showToast({
                      title: '评论发布成功',
                    })
                    var orderstate = 5
                    that.setData({
                      orderstate: orderstate
                    })
                    that.set_status(orderstate, that.data.evaluation_text);
                  }
                },
                fail: function(res) {
                  console.log("返回错误" + res);
                },
                complete: function(res) {
                  console.log("启动请求" + res);
                },
              })
            } else {
              wx.showToast({
                title: '内含违规文字',
                image: '/images/icons/wrong.png',
                duration: 0,
                mask: true,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        })
      },
      fail() {
        console.log(res);
      }
    })
  },
  get_order_info: function(o_id) {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/order/info.do?Id=' + o_id,
      method: 'get',
      dataType: 'json',
      header: {
        'Content-Type': 'application/json',
        'Cookie': wx.getStorageSync('cookieKey')
      },
      responseType: 'text',
      success: function(res) {
        console.log("返回结果" + JSON.stringify(res));
        var status = res.data.status;
        if (status == 0) {
          var data = res.data.data;
          if (data != {}) {
            var endAddress = data.endAddress;
            var startAddress = data.startAddress;
            latstart = startAddress.latitude;
            lngstart = startAddress.longitude;
            var saddress = startAddress.address;
            var sname = startAddress.username;
            var sdetails = startAddress.details;
            var sphone = startAddress.phone;
            latend = endAddress.latitude;
            lngend = endAddress.longitude;
            var eaddress = endAddress.address;
            var ename = endAddress.username;
            var edetails = endAddress.details;
            var ephone = endAddress.phone;
            that.setmap();
            var order = data.order;
            var price = order.orderprice;
            var o_id = order.id;
            var categoryname = order.categoryname;
            var weight = order.weight;
            if (weight < 5) {
              weight = "小于5"
            }
            var ordercreatedate = order.ordercreatedate;
            var ordersenddate = order.ordersenddate;
            var remarks = order.remarks;
            if (remarks == null){
              remarks = ''
            }
            var runner = data.runner;
            var hiddrunner = true;
            if (runner == null) {
              hiddrunner = true
            } else {
              hiddrunner = false
            }
            var evaluate = data.evaluate;
            var orderstate = order.orderstate;
            if (orderstate == 6){
              that.setData({
                canceltype: order.canceltype
              })
            }
            that.set_status(orderstate, evaluate);
            that.setData({
              start_address: saddress,
              end_address: eaddress,
              start_name: sname,
              end_name: ename,
              start_doorplate: sdetails,
              end_doorplate: edetails,
              start_phone: sphone,
              end_phone: ephone,
              price: price,
              o_id: o_id,
              creat_time: ordercreatedate,
              send_time: ordersenddate,
              weight_text: weight,
              hiddrunner: hiddrunner,
              type_name: categoryname,
              orderstate: orderstate,
              remarks: remarks
            })
            if (hiddrunner == false) {
              var rnickname = runner.nickname;
              var rphone = runner.phone;
              var start = runner.start;
              var satisfaction = ((start / 5) * 100).toFixed(1)
              console.log(satisfaction + '满意度')
              var satisfact_text = "跑腿新手"
              if (satisfaction == 100) {
                satisfact_text = '绝佳跑腿'
              } else if (satisfaction >= 90 && satisfaction < 100) {
                satisfact_text = '优质跑腿'
              } else if (satisfaction >= 80 && satisfaction < 90) {
                satisfact_text = '良好跑腿'
              } else if (satisfaction == 0) {
                satisfact_text = '跑腿新手'
              } else {
                satisfact_text = '跑腿玩家'
              }
              that.setData({
                rnickname: rnickname,
                rphone: rphone,
                satisfaction: satisfaction,
                satisfact_text: satisfact_text
              })
            }
          }
        }
      },
      fail: function(res) {
        console.log("返回错误" + res);
      },
      complete: function(res) {
        console.log("启动请求" + res);
      },
    })
  },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function() {
    var that =this;
    var orderstate = this.data.orderstate;
    var o_id = that.data.o_id;
    if (orderstate == 0){
      this.setData({
        showPayPwdInput: true,
        payFocus: true
      });
    } else if (orderstate == 3){
      console.log('用户确认')
      wx.request({
        url: app.globalData.URL + '/order/confirm.do?id=' + o_id,
        method: 'get',
        dataType: 'json',
        header: {
          'Cookie': wx.getStorageSync('cookieKey')
        },
        responseType: 'text',
        success: function (res) {
          console.log("返回结果" + JSON.stringify(res));
          var status = res.data.status;
          if (status == 0) {
            wx.showToast({
              title: '确认送达成功',
              icon: 'success'
            })
            var orderstate = that.data.orderstate;
            orderstate++;
            that.setData({
              orderstate: orderstate
            })
            that.set_status(orderstate, null);
          } else {
            var msg = res.data.msg;
            wx.showToast({
              title: msg,
              image: '/images/icons/wrong.png',
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
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function() {
    var that = this;
    /**获取输入的密码**/
    var val = this.data.pwdVal;
    var o_id = that.data.o_id;
    /**在这调用支付接口**/
    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: ''
    }, function() {
      /**弹框**/
      if (val == '') {
        wx.showToast({
          title: '取消付款'
        })
      } else {
        wx.request({
          url: app.globalData.URL + '/order/pay.do?id=' + o_id,
          method: 'get',
          dataType: 'json',
          header: {
            'Cookie': wx.getStorageSync('cookieKey')
          },
          responseType: 'text',
          success: function(res) {
            console.log("返回结果" + JSON.stringify(res));
            var status = res.data.status;
            if (status == 0) {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              })
              var orderstate = that.data.orderstate;
              orderstate++;
              that.setData({
                orderstate: orderstate
              })
              that.set_status(orderstate, null);
            } else {
              var msg = res.data.msg;
              wx.showToast({
                title: msg,
                image: '/images/icons/wrong.png',
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
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function() {
    this.setData({
      payFocus: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e) {
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  },
  set_status: function (orderstate, evaluate) {
    var state_text = '';
    var time_text = '正在为您寻找骑手，预计在 5分钟 内接单';
    var hiddevaluate = true;
    var hidden_pay = 'none';
    var canel_state = 'none'
    var pay_text = '支付订单'
    console.log('orderstate是' + orderstate)
    switch (orderstate) {
      case 0:
        state_text = "等待用户支付"
        time_text = '订单创建成功，请在 10分钟 内付款'
        hidden_pay = 'flex';
        canel_state = 'flex';
        break;
      case 1:
        state_text = "等待骑手接单"
        hidden_pay = 'none';
        canel_state = 'flex';
        break;
      case 2:
        state_text = "等待骑手送达"
        time_text = '跑腿正在加急中，请耐心等候'
        hidden_pay = 'none';
        canel_state = 'flex';
        break;
      case 3:
        state_text = "等待用户确认送达"
        time_text = '跑腿已经送达，请确认'
        pay_text = '确认送达'
        hidden_pay = 'flex';
        canel_state = 'none';
        break;
      case 4:
        state_text = "等待用户评价"
        time_text = '订单确认成功，请为跑腿评价'
        hidden_pay = 'none';
        canel_state = 'none';
        if (evaluate == null) {
          hiddevaluate = false
        }
        break;
      case 5:
        state_text = "订单已完成"
        hidden_pay = 'none';
        time_text = '订单已完成，欢迎下次使用'
        canel_state = 'none';
        break;
      case 6:
        state_text = "订单已取消"
        hidden_pay = 'none';
        canel_state = 'none';
        var canceltype = this.data.canceltype;
        if (canceltype == 11){
          var time_text = '用户已取消订单，欢迎再次下单';
        } else if (canceltype == 12){
          var time_text = '跑腿已取消订单，请重新下单';
        }
        break;
    }
    this.setData({
      state_text: state_text,
      time_text: time_text,
      hiddevaluate: hiddevaluate,
      hidden_pay: hidden_pay,
      canel_state: canel_state,
      pay_text: pay_text
    })
  },
  canel_order:function(){
    var that = this;
    var o_id = that.data.o_id;
    wx.showModal({
      title: '是否取消订单',
      content: '取消订单，将无法享受跑腿服务',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/order/cancel.do?id=' + o_id,
            method: 'get',
            dataType: 'json',
            header: {
              'Cookie': wx.getStorageSync('cookieKey')
            },
            responseType: 'text',
            success: function (res) {
              console.log("返回结果" + JSON.stringify(res));
              var status = res.data.status;
              if (status == 0) {
                wx.showToast({
                  title: '订单已取消',
                  icon: 'success'
                })
                var orderstate = 6
                that.setData({
                  orderstate: orderstate,
                  canceltype: 11
                })
                that.set_status(orderstate, null);
              } else {
                var msg = res.data.msg;
                wx.showToast({
                  title: msg,
                  image: '/images/icons/wrong.png',
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