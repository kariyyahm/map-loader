<!-- 地图 -->
<template>
  <div class="location-picker">
    <div class="map-container" />
    <el-autocomplete
        v-model="search"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        value-key="name"
        clearable
        placeholder="搜索地址"
        class="map-search"
        @select="onSelect"
    >
      <template slot-scope="{ item }">
        <div class="poi-item">
          <div class="name">
            {{ item.name }}
          </div>
          <span class="addr">{{ item.address }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import AMapLoader from 'src/util/amap/amap-loader'

let AMap = null
const plugin = [
  'AMap.PlaceSearch', // POI搜索插件
  'AMap.Geolocation', // 定位控件，用来获取和展示用户主机所在的经纬度位置
  'AMap.Geocoder'
]

export default {
  components: {},
  props: {
    location: {
      // 当前位置
      type: Object,
      default: null
    },
    distance: {
      // 范围
      type: Number,
      required: true
    }
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {},
  methods: {
    reset() {
      if (this.$marker) {
        // this.$marker.setMap(null)
        this.$map.remove([this.$marker, this.$circle])
      }
    },
    // 查询地址关键字
    querySearch(queryString, cb) {
      this.$map.getCity(({ city }) => {
        if (!this.$placeSearch || city !== this.$city) {
          this.$city = city
          this.$placeSearch = new AMap.PlaceSearch({
            city
          })
        }
        this.$placeSearch.search(queryString, (status, result) => {
          try {
            const { pois } = result.poiList
            cb(pois)
          } catch (e) {
            console.log(e)
            cb([])
          }
        })
      })
    },
    // 从建议选择某地址
    onSelect(item) {
      this.onClickMap(item.location)
    },
    drawLocation({ lng, lat }) {
      // 绘制当前位置
      this.$map.setCenter([lng, lat])
      if (this.$map.getZoom() < 12) {
        this.$map.setZoom(16)
      }
      this.reset() // 再次点击时清除原标记
      // 创建circle表示范围
      this.$circle = new AMap.Circle({
        bubble: true, // 圆心位置
        center: new AMap.LngLat(lng, lat), // 圆心位置
        radius: this.distance, // 半径
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
      this.$map.add([this.$marker, this.$circle])
    },
    queryLocation({ lng, lat }) {
      // 选定经纬度，查询地址信息并提交事件
      this.$geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          try {
            const { name, address } = result.regeocode.pois[0]
            this.$emit('change', {
              lng,
              lat,
              name,
              address
            })
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    onClickMap({ lng, lat }) {
      // 在地图上点击任意位置
      this.queryLocation({ lng, lat })
    },
    mapInit() {
      this.$map = new AMap.Map(this.$el.querySelector('.map-container'), {
        resizeEnable: true,
        zoom: 16
      })
      // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
      this.$map.addControl(new AMap.Geolocation())
      // 初始化逆地址解析
      this.$geocoder = new AMap.Geocoder({ extensions: 'all' })
      // 地图点击事件
      this.$map.on('click', event => {
        const { lng, lat } = event.lnglat
        this.onClickMap({ lng, lat })
      })
    }
  },
  created() {
    // 提前加载AMapLoader
    AMapLoader(plugin)
  },
  async mounted() {
    AMap = await AMapLoader(plugin)
    this.mapInit()
  },
  watch: {
    distance(value) {
      if (this.$circle) {
        this.$circle.setRadius(value)
      }
    },
    location(value) {
      if (value) {
        this.drawLocation(value)
      } else {
        this.reset()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.location-picker {
  width: 100%;
  height: 100%;
  position: relative;

  .map-container {
    width: 100%;
    height: 100%;
  }

  .map-search {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.poi-item {
  line-height: normal;
  padding: 6px 0;

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .addr {
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    color: #b4b4b4;
  }
}
</style>
