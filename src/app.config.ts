export default defineAppConfig({
  pages: [
    'pages/alerts/index',
    'pages/follow/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '舆情哨兵',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F7FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E64FF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/alerts/index',
        text: '提醒列表'
      },
      {
        pagePath: 'pages/follow/index',
        text: '我的关注'
      }
    ]
  }
})
