<template>
    <div id='visual-map'>
        <div id='echarts'></div>
        <div id='side-bar'>
          <div class='function-list'>
          <el-dropdown>
            <el-button type='primary'>
              功能菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item @click.native='showShift'>线路查询</el-dropdown-item>
              <el-dropdown-item @click.native='showStop'>车次查询</el-dropdown-item>
              <el-dropdown-item @click.native='showHotel'>酒店查询</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
          <div class="search" v-if='isShowShift'>
            线路查询
            <div class='input'>
              出发站:
              <el-input v-model="from"></el-input>
            </div>
            <div class="input">
              目标站:
              <el-input v-model="dest"></el-input>
            </div>
            <el-button round @click="btnStopClick">查询</el-button>
            <div class='result' v-if="shiftsTableShow">
            <el-table :data="result" height="600">
            <el-table-column
              prop='name'
              label='车次'>
            </el-table-column>
            <el-table-column
              prop='arrive_time'
              label='到达时间'
            >
            </el-table-column>
            <el-table-column
              prop='depart_time'
              label='出发时间'
            >
            </el-table-column>
            </el-table>
            </div>
          </div>
          <div class="search" v-if='isShowStop'>
            车次查询:
            <el-input v-model="shift"></el-input>
            <el-button round @click="btnShiftClick">查询</el-button>
            
            <div class="result" v-if="stopsTableShow">
              <el-table :data="result">
              <el-table-column
                prop='stop'
                label='停靠站'>
              </el-table-column>
              <el-table-column
                prop='arrive_time'
                label='到达时间'
              >
              </el-table-column>
              <el-table-column
                prop='depart_time'
                label='出发时间'
              >
              </el-table-column>
            </el-table>
            </div>
          </div>
          <div class='search' v-if='isShowHotel'>
            酒店地点:
            <el-input v-model="hotel"></el-input>
            <el-button round @click="btnSearchClick">查询</el-button>
            <div class="result" v-if="hotelsTableShow">
              <el-table :data="result" :height="725">
              <el-table-column
                prop='name'
                label='酒店名'>
              </el-table-column>
              <el-table-column
                prop='address'
                label='地址'
              >
              </el-table-column>
            </el-table>
            </div>
          </div>
        </div>
        <!-- <ECharts id='charts' :options='vmap'></ECharts> -->
    </div>
</template>

<script>
import echarts from 'echarts'
// import bmap from 'echarts/extension/bmap/bmap'
import 'echarts/map/js/china.js'
import VueResource from 'vue-resource'

export default {
  components: {
    echarts
  },
  data () {
    return {
      shiftsTableShow: false,
      stopsTableShow: false,
      hotelsTableShow: false,
      isShowShift: false,
      isShowStop: false,
      isShowHotel: false,
      chart: null,
      shifts: null,
      stops: null,
      hotel: null,
      num: null,
      from: null,
      dest: null,
      shift: null,
      result: null,
      color: null,
      start: null,
      end: null,
      geoCoordMap: null,
      marrive_time: null,
      mdepart_time: null,
      
    }
  },

  mounted () {
    this.draw();
  },
  methods: {
    draw() {
      var chezhan=[];
      var long=[];
      var lat=[];
      var geoCoordMap={};
      var main_stops = {
          '上海': [121.4648, 31.2891],
          '乌鲁木齐': [87.9236, 43.5883],
          '兰州': [103.5901, 36.3043],
          '北京': [116.4551, 40.2539],
          '南京': [118.8062, 31.9208],
          '南宁': [108.479, 23.1152],
          '南昌': [116.0046, 28.6633],
          '厦门': [118.1689, 24.6478],
          '合肥': [117.29, 32.0581],
          '呼和浩特': [111.4124, 40.4901],
          '哈尔滨': [127.9688, 45.368],
          '大连': [122.2229, 39.4409],
          '天津': [117.4219, 39.4189],
          '太原': [112.3352, 37.9413],
          '宁波': [121.5967, 29.6466],
          '广州': [113.5107, 23.2196],
          '成都': [103.9526, 30.7617],
          '扬州': [119.4653, 32.8162],
          '拉萨': [91.1865, 30.1465],
          '昆明': [102.9199, 25.4663],
          '杭州': [119.5313, 29.8773],
          '武汉': [114.3896, 30.6628],
          '沈阳': [123.1238, 42.1216],
          '济南': [117.1582, 36.8701],
          '济宁': [116.8286, 35.3375],
          '海口': [110.3893, 19.8516],
          '深圳': [114.5435, 22.5439],
          '珠海': [113.7305, 22.1155],
          '石家庄': [114.4995, 38.1006],
          '西宁': [101.4038, 36.8207],
          '西安': [109.1162, 34.2004],
          '贵阳': [106.6992, 26.7682],
          '郑州': [113.4668, 34.6234],
          '重庆': [107.7539, 30.1904],
          '银川': [106.3586, 38.1775],
          '长春': [125.8154, 44.2584],
          '长沙': [113.0823, 28.2568],
          '青岛': [120.4651, 36.3373]
      };

      var attributeCount = function(obj) {
          var count = 0;
          for(var i in obj) {
              if(obj.hasOwnProperty(i)) {
                  count++;
              }
          }
          return count;
      };

      var zhandian=[];
      var mdepart_time=[];
      var marrive_time=[];
      var num=[];               //各车次站点数目（可以不要)
      var start=[];             //各车次从起始站开车时间
      var end=[];            //各车次到达终点站时间
      var checi=[];            //各车次编号
      var checi_num=0;      //车次数目

      this.$http.get('static/stops.json').then((data) => {
        data = data.body;
        var n = data.length;
        for(var i = 0;i < n;i++){
            chezhan[i] = data[i].name;
            long[i] = data[i].lng;
            lat[i] = data[i].lat;
            geoCoordMap[chezhan[i]] = [long[i],lat[i]];
        }
        return geoCoordMap
      }).then((geoCoordMap) => {
          this.$http.get('static/xian.json').then((result) => {
          result = result.body;
          var n=result.length;
          var m=0;
          for(var i=0; i<n; i++){
            m=attributeCount(result[i].stop);
            var tujing=[];
            var t_arrive=[];
            var t_depart=[];
            var time1;
            var time2=0;

            var time_d;
            for(var j=1;j<=m;j++){
                var stop=result[i].stop[j.toString()].stop_name;
                stop=stop.replace(/站/,"");
                tujing.push(stop);
                var time_a=result[i].stop[j.toString()].arrive_time;
                var time_d=result[i].stop[j.toString()].depart_time;
                t_arrive.push(time_a);
                t_depart.push(time_d);

                if(j!=1){
                    var duration=parseInt(result[i].stop[j.toString()].arrive_time)-parseInt(result[i].stop[(j-1).toString()].depart_time);
                    if(duration>0){
                        time2+=duration;
                    }
                    else if(duration<0){
                        time2=time2+duration+24;
                    }
                }
                else {
                    checi.push(result[i].name);
                    time1=result[i].stop[j.toString()].depart_time;
                }
            }
            zhandian.push(tujing);
            marrive_time.push(t_arrive);
            mdepart_time.push(t_depart);
            start.push(time1);
            end.push(time2);
            num.push(m);
            checi_num++;
          }
          this.shifts = checi;
          this.stops = zhandian;
          this.stop_num = checi_num;
          this.num = num;
          this.geoCoordMap = geoCoordMap;
          this.marrive_time = marrive_time;
          this.mdepart_time = mdepart_time;
          this.start = start;
          this.end = end;
        // var a;
        // a=0;
        return geoCoordMap
        }).then((geoCoordMap) => {
          var color = ['#a6c84c', '#ffa022', '#46bee9'];
          this.color = color;
          var series = [];    
          for (var i=0;i<checi_num;i++){
            var res=[];
            var m_coord=[];
            for(var j=0;j<num[i];j++){
                m_coord.push(geoCoordMap[zhandian[i][j]]);
            }
            res.push({
                fromName:zhandian[i][0],
                toName:zhandian[i][num[i]-1],
                coords:m_coord
            });
            series.push(
                {
                    type: 'lines',
                    zlevel: 1,
                    polyline:true,

                    animationThreshold:10000,
                    lineStyle: {
                        normal: {
                            color: color[1],
                            width: 0,
                            curveness: 0
                        }
                    },
                    data: res
                },
                {
                  type: 'lines',
                  zlevel: 2,
                  symbol: ['none', 'arrow'],
                  symbolSize: 10,
                  polyline:true,
                  animationThreshold:10000,
                  effect: {
                      show: true,
                      period: end[i]/2,
                      delay:1000*parseInt(start[i]),
                      loop:false,
                      trailLength: 0,
                      symbol: 'image://http://localhost:8081/static/gaotie1.png',
                      symbolSize: 30
                  },
                  lineStyle: {
                      normal: {
                          color: color[1],
                          width: 1,
                          opacity: 0.6,
                          curveness: 0
                      }
                  },
                  data: res
                }
              
            )
          }
                var series1=series.splice(2000,3999);
      var data=[];
      for(var name in main_stops){
        data.push(geoCoordMap[name]);
      }
      series1.push(
        {
            name:'主要站点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,

            rippleEffect: {
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            symbolSize: 10,
            itemStyle: {
                normal: {
                    color: color[0]
                }
            },
            data: data
          }
        );
        var int=[
          "上海，简称“沪”或“申”，是中国共产党的诞生地，中华人民共和国直辖市、国家中心城市、超大城市，国际经济、金融、贸易、航运、科技创新中心和综合交通枢纽，首批沿海开放城市。上海地处长江入海口，是长江经济带的龙头城市、G60科创走廊核心城市。隔东中国海与日本九州岛相望，南濒杭州湾，北、西与江苏、浙江两省相接。",
          "乌鲁木齐,地处中国西北，新疆中部，天山北麓，亚欧大陆腹地，毗邻中亚各国，有“亚心之都”的称呼。是世界上最内陆、距离海洋和海岸线最远的大型城市。",
          "兰州，简称“兰”，是甘肃省省会，中国西北地区重要的工业基地和综合交通枢纽，西部地区重要的中心城市之一，西陇海兰新经济带重要支点，西北地区重要的交通枢纽和物流中心，是新亚欧大陆桥中国段五大中心城市之一，西北地区第二大城市，是我国华东、华中地区联系西部地区的桥梁和纽带，西北的交通通信枢纽和科研教育中心，丝绸之路经济带的重要节点城市。",
          "北京，简称“京”，是中华人民共和国的首都、直辖市、国家中心城市、超大城市、国际大都市，全国政治中心、文化中心、国际交往中心、科技创新中心和综合交通枢纽。",
          "南京地处中国东部、长江下游、濒江近海，是中国东部战区司令部驻地，长江国际航运物流中心，长三角辐射带动中西部地区发展的国家重要门户城市，也是东部沿海经济带与长江经济带战略交汇的重要节点城市。",
          "南昌，简称 “洪”或“昌”，古称豫章、洪都，江西省省会，是新中国航空工业的发源地、中国重要的综合性交通枢纽，世界重要的光伏、光电和VR产业基地。",
          "厦门，隶属于福建省，别称鹭岛， 简称鹭， 副省级城市、经济特区，东南沿海重要的中心城市、港口及风景旅游城市。厦门位于福建省东南端，西界漳州，北邻南安和晋江，东南与大小金门和大担岛隔海相望，通行闽南方言，是闽南地区的主要城市，与漳州、泉州并称厦漳泉闽南金三角经济区。",
          "合肥是一座具有2000多年历史的古城，因东淝河与南淝河均发源于该地而得名。合肥素有“三国故地，包拯家乡”之称。秦置合肥县，隋至明清时，合肥一直是庐州府治所，故又称“庐州” 、又名“庐阳”，境内名胜古迹众多，如包公祠、李鸿章故居、吴王遗踪等。合肥还诞生了周瑜、包拯、李鸿章等一批历史名人。",
          "呼和浩特有着悠久的历史和光辉灿烂的文化，是华夏文明的发祥地之一。先秦时期，赵武灵王在此设云中郡，故址在今呼市西南托克托县境。民国时期为绥远省省会，蒙绥合并后，呼和浩特成为内蒙古自治区首府。呼市中心城区本是由归化城与绥远城两座城市在清末民国合并而成，故名归绥。",
          "哈尔滨地处东北亚中心地带，被誉为欧亚大陆桥的明珠，是第一条欧亚大陆桥和空中走廊的重要枢纽，也是哈大齐工业走廊的起点，也是中国历史文化名城、热点旅游城市和国际冰雪文化名城。是国家战略定位的“沿边开发开放中心城市”、“东北亚区域中心城市”及“对俄合作中心城市”。",
          "天津，简称津，别名津沽、津门等，中华人民共和国直辖市、国家中心城市、超大城市、环渤海地区经济中心、首批沿海开放城市、综合交通枢纽，全国先进制造研发基地、北方国际航运核心区、金融创新运营示范区、改革开放先行区。",
          "太原，山西省省会，简称“并(bīng)”，别称并州，古称晋阳，也称龙城，是中国优秀旅游城市、国家历史文化名城、国家园林城市、太原都市圈核心城市，山西省政治、经济、文化、交通和国际交流中心，是一座具有4700多年历史，2500年建城史，“控带山河，踞天下之肩背”，“襟四塞之要冲，控五原之都邑”的历史古都。",
          "广州是国家历史文化名城，从秦朝开始，广州一直是郡治、州治、府治的行政中心；一直是华南地区的政治、军事、经济、文化和科教中心，是岭南文化的发源地和兴盛地。广州从3世纪30年代起成为海上丝绸之路的主港，唐宋时期成为中国第一大港，是世界著名的东方港市；明清时期是中国唯一的对外贸易大港，是世界上唯一2000多年长盛不衰的大港。",
          "成都是国家历史文化名城，古蜀文明发祥地，中国十大古都之一。公元前五世纪，开明王朝九世以“二年成邑，三年成都”，故名成都。城址未徙，城名未易；先后有7个割据政权在此建都。",
          "拉萨全年多晴朗天气，降雨稀少，冬无严寒，夏无酷暑，气候宜人。全年日照时间在3000小时以上，素有“日光城”的美誉。拉萨境内蕴藏着丰富的各类资源，相对于全国和自治区其他地市，具有较明显的资源优势。",
          "昆明开放而时尚，浓缩了云南的区位优势，从两千多年前的“南方丝绸之路”到开放的昆明一直是东亚大陆与中南半岛、南亚次大陆各国进行经济贸易往来及政治联系的陆路枢纽。",
          "杭州人文古迹众多，西湖及其周边有大量的自然及人文景观遗迹，具代表性的有西湖文化、良渚文化、丝绸文化、茶文化，以及流传下来的许多故事传说成为杭州文化代表。",
          "武汉地处江汉平原东部、长江中游。世界第三大河长江及其最大支流汉江横贯市境中央，将武汉中心城区一分为三，形成武汉三镇（武昌、汉口、汉阳）隔江鼎立的格局，市内江河纵横、湖港交织，水域面积占全市总面积四分之一，构成了滨江滨湖的水域生态环境。武汉有“九省通衢”之称，是中国内陆最大的水陆空交通枢纽、长江中游航运中心，其高铁网辐射大半个中国，是华中地区唯一可直航全球五大洲的城市。",
          "沈阳是国家历史文化名城，是中华文明的重要发祥地，素有“一朝发祥地，两代帝王都”之称。长期是东北的政治、经济、文化中心，是中国最重要的以装备制造业为主的重工业基地，有着“共和国长子”和“东方鲁尔”的美誉。",
          "济南因境内泉水众多，拥有“七十二名泉”，被称为“泉城”，素有“四面荷花三面柳，一城山色半城湖”的美誉，济南八景闻名于世，是拥有“山、泉、湖、河、城”独特风貌的旅游城市，是国家历史文化名城、首批中国优秀旅游城市，史前文化——龙山文化的发祥地之一。",
          "海口，别称“椰城”，海南省省会，国家“一带一路”战略支点城市，北部湾城市群中心城市。地处海南岛北部，东邻文昌，西接澄迈，南毗定安，北濒琼州海峡，是海南省政治、经济、科技、文化中心和最大的交通枢纽。",
          "深圳是中国设立的第一个经济特区，是中国改革开放的窗口和新兴移民城市，已发展成为有一定影响力的现代化国际化大都市，创造了举世瞩目的“深圳速度”，享有“设计之都”、“时尚之城”、“创客之城”、“志愿者之城”等美誉。",
          "珠海是全国唯一以整体城市景观入选“全国旅游胜地四十佳”的城市，中国海滨城市。2013中国城市可持续发展指数报告珠海综合排名全国第一，珠海为新型花园城市；珠海属国家新颁布的“幸福之城”，有“浪漫之城” 的称号。",
          "石家庄跨华北平原和太行山地两大地貌单元，是全国粮、菜、肉、蛋、果主产区之一，农业集约化和产业化水平较高，生产规模位居全国36个重点城市第一位，被国家确定为优质小麦生产基地，素有“北方粮仓”之称。",
          "西宁位于青海省东部，湟水中游河谷盆地，是青藏高原的东方门户，古“丝绸之路”南路和“唐蕃古道”的必经之地，自古就是西北交通要道和军事重地，素有”西海锁钥“、海藏咽喉之称，是世界高海拔城市之一。",
          "贵阳是国家级大数据产业发展集聚区、呼叫中心与服务外包集聚区、大数据交易中心、数据中心集聚区。为中国首个国家森林城市、国家循环经济试点城市、中国避暑之都，荣登“中国十大避暑旅游城市”榜首。2017年，贵阳市复查确认保留全国文明城市荣誉称号。",
          "郑州是国家历史文化名城，是华夏文明重要发祥地之一，为中华人文始祖轩辕黄帝的故里，历史上曾五次为都、八代为州，是“中国八大古都”之一和世界历史都市联盟成员。全市有世界文化遗产2项15处，全国重点文物保护单位38处43项，拥有黄帝故里、商城遗址、天地之中等众多历史人文景观。",
          "重庆是国家历史文化名城。1189年，宋光宗赵惇先封恭王再即帝位，自诩“双重喜庆”，重庆由此得名。重庆既是“红岩精神”起源地，又是巴渝文化发祥地，“火锅”、“吊脚楼”等影响深远；在3000余年历史中，曾三为国都，四次筑城，史称“巴渝”；抗战时期为国民政府陪都。",
          "银川是历史悠久的塞上古城，早在3万年前就有人类在水洞沟遗址繁衍生息，史上西夏王朝的首都，是国家历史文化名城，民间传说中又称“凤凰城”，古称“兴庆府”、“宁夏城”，素有“塞上江南、鱼米之乡”的美誉，城西有著名的国家级风景名胜区西夏王陵。",
          "长春，简称“长”，别称“春城”，古称“喜都”、“茶啊冲”、“黄龙府”，是吉林省省会、副省级市、东北亚经济圈中心城市，是国务院定位的中国东北地区中心城市之一，国家历史文化名城，我国重要的工业基地和综合交通枢纽。",
          "长沙是首批国家历史文化名城，历经三千年城名、城址不变，有“屈贾之乡”、“楚汉名城”、“潇湘洙泗”之称。存有马王堆汉墓、四羊方尊、三国吴简、岳麓书院、铜官窑等历史遗迹。凝练出“经世致用、兼收并蓄”的湖湘文化。"
        ];
        var mindex=1;
          for(var name in main_stops){
              var item={};
              item.name=name;
              item.value=main_stops[name].concat(mindex);
              mindex++;
              data.push(item);
          }
      var option = {
        backgroundColor: '#404a59',
        title : {
            text: '高铁线路图',
            left: 'center',
            textStyle : {
                color: '#fff'
            }
        },
        tooltip: {

        formatter: function (params) {
            return params.name + ' : ' + int[params.value[2]-1];
        },
        extraCssText:'width:250px;white-space:pre-wrap'
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series1
      };
      var chart = echarts.init(document.getElementById('echarts'));
      this.chart = chart;
      chart.setOption(option);   
      
        });
      });
    },
    btnStopClick() {
      this.stopsTableShow = false;
      var from = this.from;
      var dest = this.dest;
      var result = Array();
      var result_num=0;
      var result_index=[];
      for(var i=0;i<this.stop_num;i++){
          for(var j=0;j<this.stops[i].length;j++){
              if(from.indexOf(this.stops[i][j])!=-1||this.stops[i][j].indexOf(from)!=-1){
                  for(var m=j;m<this.stops[i].length;m++){
                      if(dest.indexOf(this.stops[i][m])!=-1||this.stops[i][m].indexOf(dest)!=-1){
                          var res = {
                            'name': this.shifts[i],
                            'depart_time': this.mdepart_time[i][j],
                            'arrive_time': this.marrive_time[i][m]
                          };
                          result_num++;
                          result_index.push(i);
                          result.push(res);
                      }
                  }
              }
          }
      }
      this.result = result;
      this.shiftsTableShow = true;
      var series1 = [];
        for (var i=0;i<result_num;i++){
          var res1=[];
          var m_coord=[];
          for(var j=0;j<this.num[result_index[i]];j++){
              m_coord.push(this.geoCoordMap[this.stops[result_index[i]][j]]);
          }
          res1.push({
              fromName:this.stops[result_index[i]][0],
              toName:this.stops[result_index[i]][this.num[result_index[i]]-1],
              coords:m_coord
          });
          series1.push(
              {
                  type: 'lines',
                  zlevel: 1,
                  polyline:true,

                  animationThreshold:50000,
                  lineStyle: {
                      normal: {
                          color: this.color[1],
                          width: 0,
                          curveness: 0
                      }
                  },

                  data: res1

              },
              {

                  type: 'lines',
                  zlevel: 2,
                  symbol: ['none', 'arrow'],
                  symbolSize: 10,
                  polyline:true,
                  animationThreshold:50000,
                  effect: {
                      show: true,
                      period: this.end[result_index[i]]/2,
                      delay:1000*parseInt(this.start[result_index[i]]),
                      loop:false,
                      trailLength: 0,
                      symbol: 'image://./source/gaotie1.png',
                      symbolSize: 30
                  },
                  lineStyle: {
                      normal: {
                          color: this.color[1],
                          width: 1,
                          opacity: 0.6,
                          curveness: 0
                      }
                  },

                  data: res1

              }
          )
      }
      var option1 = {
          backgroundColor: '#404a59',
          title : {
              text: '高铁线路图',

              left: 'center',
              textStyle : {
                  color: '#fff'
              }
          },

          tooltip : {
              trigger: 'item'
          },
          geo: {
              map: 'china',
              label: {
                  emphasis: {
                      show: false
                  }
              },
              roam: true,
              itemStyle: {
                  normal: {
                      areaColor: '#323c48',
                      borderColor: '#404a59'
                  },
                  emphasis: {
                      areaColor: '#2a333d'
                  }
              }
          },
          series: series1
      };
        this.chart.setOption(option1);
    },
    btnShiftClick() {
      this.shiftsTableShow = false;
      var input = this.shift;
      var result = Array();
      var if_find=false;
      var result_index=0;
      for(var i=0;i<this.stop_num;i++){
          if(input==this.shifts[i]){
              for(var j=0;j<this.stops[i].length;j++){
                var res = {}
                res['stop'] = this.stops[i][j]
                res['depart_time'] = this.mdepart_time[i][j];
                res['arrive_time'] = this.marrive_time[i][j];
                result.push(res);
              }
              result_index=i;
              if_find=true;
          }
      }
      this.result = result
      this.stopsTableShow = true;
      var res1=[];
      var m_coord=[];
      var series2 = [];
      if (if_find) {
        for(var j=0;j<this.num[result_index];j++){
          m_coord.push(this.geoCoordMap[this.stops[result_index][j]]);
                      res1.push({
                fromName:this.stops[result_index][0],
                toName:this.stops[result_index][this.num[result_index]-1],
                coords:m_coord
            });
        }

        series2.push(
                {
                    type: 'lines',
                    zlevel: 1,
                    polyline:true,

                    animationThreshold:50000,
                    lineStyle: {
                        normal: {
                            color: this.color[1],
                            width: 5,
                            curveness: 0
                        }
                    },

                    data: res1

                },
                {

                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    polyline:true,
                    animationThreshold:50000,
                    effect: {
                        show: true,
                        period: this.end[result.index]/2,
                        delay:1000*parseInt(this.start[result.index]),
                        loop:false,
                        trailLength: 0,
                        symbol: 'image://./source/gaotie1.png',
                        symbolSize: 30
                    },
                    lineStyle: {
                        normal: {
                            color: this.color[1],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0
                        }
                    },

                    data: res1

                }
            );

            var option2 = {
            backgroundColor: '#404a59',
            title : {
                text: '高铁线路图',

                left: 'center',
                textStyle : {
                    color: '#fff'
                }
            },

            tooltip : {
                trigger: 'item'
            },


            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: series2
        };
        this.chart.setOption(option2);
      }

    },
    btnSearchClick() {
      var loc = this.hotel;
      var str = 'https://restapi.amap.com/v3/place/text?key=e00566d83933522b59563d40afba206b&types=100100&city=' + loc;
      this.$http.get(str).then((data) => {
          var hotels = data['body']['pois'];
          var result = Array();
          for (var key in hotels) {
            var hotel = hotels[key];
            console.log(hotel);
            var res = {};
            res['name'] = hotel['name'];
            res['address'] = hotel['address'];
            result.push(res);
          }
          this.result = result;
          this.hotelsTableShow = true;
      })
    },
    showShift() {
      this.isShowShift = true;
      this.isShowStop = false;
      this.isShowHotel = false;
    },
    showStop() {
      this.isShowShift = false;
      this.isShowStop = true;
      this.isShowHotel = false;
    },
    showHotel() {
      this.isShowShift = false;
      this.isShowStop = false;
      this.isShowHotel = true;
    }
  }
}
</script>

<style scoped>
#visual-map {
    position: fixed;
    line-height: 40px;
    width: 100%;
    left: 0;
    float: left;
}

#echarts {
    position: fixed;
    margin: auto;
    left: 0;
    width: 80%;
    height: 900px;
    float: left;
    /* display: inline; */
}

#side-bar {
  position: fixed;
  margin: auto;
  width: 20%;
  height: 600px;
  right: 0;
  float: left;
  /* display: inline; */
}

.result {
  overflow-y: auto;
}
</style>
