import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

const conf = {
  data: {
    showHb:false,
    currentCalendar:{},
    dayCalendar:{},
    solarTitle: '',
    lunarTitle: '',
    goodContent: "",
    badContent: '',
    showToDo: false,
    showJoke:false,
    jokeConent:"",
    calendarConfig: {
      theme: 'default',
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      emphasisWeek: true, // 是否高亮显示周末日期
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      // showHolidays: true,
      // emphasisWeek: true,
      // chooseAreaMode: true
      // defaultDate: '2020-9-8',
      // autoChoosedWhenJump: true
    },
  },
  onLoad(e){
    this.nextBtn();
    console.log('global',global.hello);
  },
  onShow(){
    // 获取配置
    this.getConfig('hb').then(res=>{
      console.log('获取配置',res);
      this.setData({
        showHb:res.value === 1
      });
    });
  },
  // 点击某一天的回调
  afterTapDate(e) {
    console.log('afterTapDate', e.detail)
    this.setTopTitle(e.detail,true);
  },
  // 切换月份
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
    var next = e.detail.next;
    const calendar = this.selectComponent('#calendar').calendar
    console.log('calendar',calendar);
    // 清空所有选中
    const selected = calendar.getSelectedDates()

    console.log('next',{year: next.year, month: next.month,});
    // 获取下个月\上个月有多少天
    var date = new Date(next.year,next.month,0);
    var days = date.getDate();
    var d = this.data.dayCalendar.date;
    // 如果下个月\上个月的天数小于当前月的天数，就取下个月\上个月最大的一天。
    var nextDay = days>=d?d:days;
    calendar.setSelectedDates([{
      year: next.year, month: next.month, date: nextDay
    }]);
    //设置顶部阳历阴历
    var current = this.getCurrent(next.year, next.month, nextDay, calendar.getCalendarDates({
      lunar: true
    }));
    this.setTopTitle(current);
  },
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  takeoverTap(e) {
    console.log('takeoverTap', e.detail)
  },
  // 组件加载完成执行
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
    var calendar = e.detail.calendar;
    var current = this.getCurrent(calendar.curYear, calendar.curMonth, calendar.curDate, calendar.dates);
    this.setTopTitle(current,true);

    // 获取日历组件上的 calendar 对象
    // const calendar = this.selectComponent('#calendar').calendar
    // console.log('afterCalendarRender -> calendar', calendar)
  },
  setTopTitle(current,isDayChange) {
    if (current) {
      this.data.currentCalendar = {
        year:current.year, month:current.month, date:current.date
      };
      if(isDayChange){
        this.data.dayCalendar = {
          year:current.year, month:current.month, date:current.date
        };
      }
      this.getDate(this.getFormatDate(current.year, current.month, current.date));
      this.setData({
        solarTitle: this.getSolarDay(current.year, current.month, current.date, current.lunar.ncWeek),
        lunarTitle: this.getLunarDay(current.lunar.gzYear, current.lunar.Animal, current.lunar.IMonthCn, current.lunar.IDayCn),
      })
    }
  },
  getCurrent(y, m, d, list) {
    for (var item of list) {
      if (item.year === y && item.month === m && item.date === d) {
        return item;
      }
    }
  },
  getSolarDay(y, m, d, w) {
    return `${y}年${m}月${d}日 ${w}`
  },

  getLunarDay(gzYear, Animal, IMonthCn, IDayCn) {
    return `${gzYear}${Animal}年 ${IMonthCn}${IDayCn}日`
  },
  getFormatDate(y, m, d) {
    return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
  },
  onSwipe(e) {
    console.log('onSwipe', e)
  },
  // 获取当天详细情况
  getDate(date) {
    this.setData({
      showToDo: false,
      goodContent: '',
      badContent: ''
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getDate',
      // 传给云函数的参数
      data: {
        date
      },
      success: (res) => {
        console.log('获取成功', res);
        if (res.result.success) {
          var info = res.result.data;
          this.setData({
            goodContent: info.do,
            badContent: info.nodo
          });
        }
        this.setData({
          showToDo: true
        })
      },
    })
  },
  nextBtn() {
    this.setData({
      showJoke: false,
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getJoke',
      // 传给云函数的参数
      data: {},
      success: (res) => {
        console.log('获取成功', res);
        if (res.result.success) {
          var info = res.result.data;
          this.setData({
            jokeConent:info.content
          })
        }
        this.setData({
          showJoke: true
        })
      },
    })
  },
  getConfig(label){
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        // 云函数名称
        name: 'getConfig',
        // 传给云函数的参数
        data: {
          label
        },
        success: (res) => {
          if(res.result.success){
            resolve(res.result.data);
          }
        },
      })
    });
  },
  openEleBtn(){
    
    var ele_minapp = global.config.ele_minapp;
    console.log('成功打开ele',ele_minapp);
    wx.navigateToMiniProgram({
      ...ele_minapp,
      success(res) {
        console.log('成功打开ele');
      }
    })
  },
  

}

Page(conf)
