export type Priority = 'high' | 'mid' | 'low';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type DutyActionType = 'tech' | 'notice' | 'ticket' | null;

export interface PlatformSource {
  name: string;
  count: number;
}

export interface Alert {
  id: string;
  title: string;
  game: string;
  channel: string;
  keyword: string;
  priority: Priority;
  growthRate: number;
  totalCount: number;
  platforms: PlatformSource[];
  mainDemands: string[];
  suggestedPriority: string;
  triggeredAt: string;
  isRead: boolean;
  isHandled: boolean;
  sentimentStats: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dutyAction?: DutyActionType;
  dutyNote?: string;
  dutyAt?: string;
}

export interface PlayerComment {
  id: string;
  alertId: string;
  playerId: string;
  playerName: string;
  avatar?: string;
  content: string;
  sentiment: Sentiment;
  likes: number;
  reposts: number;
  replies: number;
  platform: string;
  createdAt: string;
  isHot: boolean;
}

export interface FollowedGame {
  id: string;
  name: string;
  channels: string[];
  isActive: boolean;
}

export interface FollowedGroup {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface FollowedKeyword {
  id: string;
  word: string;
  category: string;
  isActive: boolean;
  triggerThreshold: number;
}

export interface DutyRecord {
  id: string;
  alertId: string;
  alertTitle: string;
  action: DutyActionType;
  note: string;
  operator: string;
  createdAt: string;
}

export interface DutyActionOption {
  value: DutyActionType;
  label: string;
  desc: string;
  color: string;
}

export const DUTY_ACTION_OPTIONS: DutyActionOption[] = [
  { value: 'tech', label: '已联系技术', desc: '同步研发团队排查处理', color: '#1E64FF' },
  { value: 'notice', label: '需公告解释', desc: '需运营发布官方公告', color: '#FF7D00' },
  { value: 'ticket', label: '并入工单高峰', desc: '增加客服排班处理工单', color: '#00B42A' }
];
