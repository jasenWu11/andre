var address_data = [{
    "id": 1,
    "address": "中惠松湖城1期",
    "doorplate": "2栋2单元2001",
    "name": "宋迎宾",
    "sex": "0",
    "phone": "15625527280",
    "latitude": "22.981760",
    "longitude": "113.912910",
    "default_start": 0,
    "default_end": 0
  },
  {
    "id": 3,
    "address": "中惠松湖城1期",
    "doorplate": "2栋2单元2001",
    "name": "钟活动",
    "sex": "0",
    "phone": "15625527283",
    "latitude": "22.981760",
    "longitude": "113.912910",
    "default_start": 0,
    "default_end": 1
  },
  {
    "id": 2,
    "address": "东莞理工学院城市学院",
    "doorplate": "3D301",
    "name": "陈观花",
    "sex": "1",
    "phone": "15625527281",
    "latitude": "22.978630",
    "longitude": "113.838140",
    "default_start": 1,
    "default_end": 0
  },
  {
    "id": 4,
    "address": "中惠松湖城1期",
    "doorplate": "2栋2单元2001",
    "name": "丘奇幻",
    "sex": "0",
    "phone": "15625527285",
    "latitude": "22.981760",
    "longitude": "113.912910",
    "default_start": 0,
    "default_end": 0
  }
]

var item_type_data = [{
  "id": 1,
  "categoryname": "餐饮",
  "categoryprice": 1.2,
  "disabled": true
}, {
  "id": 2,
  "categoryname": "文件",
  "categoryprice": 2,
  "disabled": true
}, {
  "id": 3,
  "categoryname": "生鲜",
  "categoryprice": 1.2,
  "disabled": false
}, {
  "id": 4,
  "categoryname": "蛋糕",
  "categoryprice": 3,
  "disabled": false
}, {
  "id": 5,
  "categoryname": "鲜花",
  "categoryprice": 4,
  "disabled": false
}, {
  "id": 6,
  "categoryname": "钥匙",
  "categoryprice": 3,
  "disabled": false
}, {
  "id": 7,
  "categoryname": "数码",
  "categoryprice": 2.9,
  "disabled": false
}, {
  "id": 8,
  "categoryname": "服饰",
  "categoryprice": 1.9,
  "disabled": false
}, {
  "id": 9,
  "categoryname": "其他",
  "categoryprice": 8,
  "disabled": false
}]

var star_data = [{
    id: 1,
    src: "/images/icons/star_null.png"
  },
  {
    id: 2,
    src: "/images/icons/star_null.png"
  },
  {
    id: 3,
    src: "/images/icons/star_null.png"
  },
  {
    id: 4,
    src: "/images/icons/star_null.png"
  },
  {
    id: 5,
    src: "/images/icons/star_null.png"
  }
]

module.exports = {
  address_data: address_data,
  item_type_data: item_type_data,
  star_data: star_data
}