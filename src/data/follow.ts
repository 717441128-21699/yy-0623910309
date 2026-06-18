import { FollowedGame, FollowedGroup, FollowedKeyword, DutyRecord } from '@/types';

export const mockGames: FollowedGame[] = [
  { id: 'g1', name: '星辰幻想', channels: ['安卓官服', 'iOS官服', 'TapTap', 'B站'], isActive: true },
  { id: 'g2', name: '三界传说', channels: ['安卓官服', 'iOS官服', '华为渠道服', '小米渠道服'], isActive: true },
  { id: 'g3', name: '剑影江湖', channels: ['安卓官服', 'iOS官服', 'B站渠道服'], isActive: true },
  { id: 'g4', name: '梦境奇缘', channels: ['全渠道'], isActive: false }
];

export const mockGroups: FollowedGroup[] = [
  { id: 'grp1', name: '付费高价值用户', description: '累计充值>5000元玩家', isActive: true },
  { id: 'grp2', name: '公会核心成员', description: '各大公会会长/副会长', isActive: true },
  { id: 'grp3', name: '社区意见领袖', description: 'TapTap/NGA/贴吧高声望用户', isActive: true },
  { id: 'grp4', name: '新注册用户', description: '注册<7天新手玩家', isActive: false },
  { id: 'grp5', name: '流失回归玩家', description: '30天以上未登录后回归', isActive: true }
];

export const mockKeywords: FollowedKeyword[] = [
  { id: 'k1', word: '无法登录', category: '技术故障', isActive: true, triggerThreshold: 50 },
  { id: 'k2', word: '封号误判', category: '账号安全', isActive: true, triggerThreshold: 30 },
  { id: 'k3', word: '退款', category: '充值/支付', isActive: true, triggerThreshold: 20 },
  { id: 'k4', word: '补偿太少', category: '运营活动', isActive: true, triggerThreshold: 80 },
  { id: 'k5', word: '概率', category: '运营活动', isActive: true, triggerThreshold: 60 },
  { id: 'k6', word: '卡顿', category: '技术故障', isActive: true, triggerThreshold: 100 },
  { id: 'k7', word: 'BUG', category: '技术故障', isActive: true, triggerThreshold: 80 },
  { id: 'k8', word: '外挂', category: '账号安全', isActive: true, triggerThreshold: 40 },
  { id: 'k9', word: '闪退', category: '技术故障', isActive: true, triggerThreshold: 70 },
  { id: 'k10', word: '骗氪', category: '充值/支付', isActive: false, triggerThreshold: 50 }
];

export const mockDutyRecords: DutyRecord[] = [
  {
    id: 'd1',
    alertId: 'a004',
    alertTitle: '大量玩家申请退款',
    action: 'tech',
    note: '已联系支付组核查到账问题，运营准备补偿方案',
    operator: '李主管',
    createdAt: '2026-06-19 14:45:00'
  },
  {
    id: 'd2',
    alertId: 'a005',
    alertTitle: '新卡池概率被质疑',
    action: 'notice',
    note: '已准备概率说明公告，补充保底案例展示',
    operator: '李主管',
    createdAt: '2026-06-19 12:05:00'
  },
  {
    id: 'd3',
    alertId: 'a007',
    alertTitle: '赛季奖励发放异常',
    action: 'ticket',
    note: '已并入今日工单高峰，客服按模板处理补发申请',
    operator: '王主管',
    createdAt: '2026-06-19 09:00:00'
  },
  {
    id: 'd4',
    alertId: 'a998',
    alertTitle: '充值钻石未到账',
    action: 'tech',
    note: '支付渠道回调延迟，已通知渠道方排查',
    operator: '李主管',
    createdAt: '2026-06-18 22:30:00'
  },
  {
    id: 'd5',
    alertId: 'a997',
    alertTitle: '新版本闪退问题集中',
    action: 'tech',
    note: '已同步客户端组紧急发版修复，运营已推送临时公告',
    operator: '李主管',
    createdAt: '2026-06-18 18:15:00'
  }
];
