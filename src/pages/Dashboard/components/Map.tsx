import * as React from 'react';
import AMapLoader from '../../../../map-loader'
import {useEffect} from "react";

const Map = () => {
  let AMap = null
  let $map = {}
  let $geocoder = {}
  const plugin = [
    'AMap.PlaceSearch', // POI搜索插件
    'AMap.Geolocation', // 定位控件，用来获取和展示用户主机所在的经纬度位置
    'AMap.Geocoder'
  ]

  useEffect(() => {
    AMapLoader(plugin).then((res) => {
      AMap = res
      mapInit()
    })

  },[])


  const reset = () => {
    // if (this.$marker) {
    //   // this.$marker.setMap(null)
    //   this.$map.remove([this.$marker, this.$circle])
    // }
  }
    // 查询地址关键字
  // const querySearch = (queryString, cb) => {
  //   this.$map.getCity(({ city }) => {
  //     if (!this.$placeSearch || city !== this.$city) {
  //       this.$city = city
  //       this.$placeSearch = new AMap.PlaceSearch({
  //         city
  //       })
  //     }
  //     this.$placeSearch.search(queryString, (status, result) => {
  //       try {
  //         const { pois } = result.poiList
  //         cb(pois)
  //       } catch (e) {
  //         console.log(e)
  //         cb([])
  //       }
  //     })
  //   })
  // }
    // 从建议选择某地址
  // const onSelect = (item) => {
  //   this.onClickMap(item.location)
  // }
  const drawLocation = ({ lng, lat }) => {
      // 绘制当前位置
      $map.setCenter([lng, lat])
      if ($map.getZoom() < 12) {
        $map.setZoom(16)
      }
      // this.reset() // 再次点击时清除原标记
      // 创建circle表示范围
      this.$circle = new AMap.Circle({
        bubble: true, // 圆心位置
        center: new AMap.LngLat(lng, lat), // 圆心位置
        radius: 300, // 半径
        strokeColor: '#409eff', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线粗细度
        fillColor: '#409eff', // 填充颜色
        fillOpacity: 0.35 // 填充透明度
      })
      // 创建marker表示位置
      this.$marker = new AMap.Marker({
        position: [lng, lat],
        draggable: true
      })
      this.$marker.on('dragend', e => {
        // this.$circle.setCenter(e.lnglat)
        this.onClickMap(e.lnglat) // 拖拽后获取新位置信息
      })
      // this.$marker.setMap(this.$map)
      $map.add([this.$marker, this.$circle])
    }
    // const queryLocation = ({ lng, lat }) => {
    //   // 选定经纬度，查询地址信息并提交事件
    //   this.$geocoder.getAddress([lng, lat], (status, result) => {
    //     if (status === 'complete' && result.info === 'OK') {
    //       try {
    //         const { name, address } = result.regeocode.pois[0]
    //         this.$emit('change', {
    //           lng,
    //           lat,
    //           name,
    //           address
    //         })
    //       } catch (e) {
    //         console.log(e)
    //       }
    //     }
    //   })
    // }
    // const onClickMap = ({ lng, lat }) => {
    //   // 在地图上点击任意位置
    //   this.queryLocation({ lng, lat })
    // }
    const mapInit = () => {
      $map = new AMap.Map(document.querySelector('.map-container'), {
        resizeEnable: true,
        zoom: 16
      })
      // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
      $map.addControl(new AMap.Geolocation())
      // 初始化逆地址解析
      $geocoder = new AMap.Geocoder({ extensions: 'all' })
      // 地图点击事件
      $map.on('click', event => {
        const { lng, lat } = event.lnglat
        this.onClickMap({ lng, lat })
      })
    }
    // watch: {
    //   distance(value) {
    //     if (this.$circle) {
    //       this.$circle.setRadius(value)
    //     }
    //   },
    //   location(value) {
    //     if (value) {
    //       this.drawLocation(value)
    //     } else {
    //       this.reset()
    //     }
    //   }
    // }
  return (
    <div>
      <div className="map-container" style={{height: 400, width: 400}}/>
    </div>
  )
}

export default Map;
