import { useState, useCallback, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Alert, DutyRecord, FollowedGame, FollowedGroup, FollowedKeyword, DutyActionType } from '@/types';
import { mockAlerts } from '@/data/alerts';
import { mockGames, mockGroups, mockKeywords, mockDutyRecords } from '@/data/follow';

const STORAGE_KEYS = {
  alerts: 'yqsb_alerts',
  dutyRecords: 'yqsb_duty_records',
  games: 'yqsb_games',
  groups: 'yqsb_groups',
  keywords: 'yqsb_keywords'
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = Taro.getStorageSync(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (e) {
    console.error('[Store] 读取缓存失败:', key, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(data));
  } catch (e) {
    console.error('[Store] 写入缓存失败:', key, e);
  }
}

export function useAppStore() {
  const [alerts, setAlerts] = useState<Alert[]>(() => loadFromStorage(STORAGE_KEYS.alerts, mockAlerts));
  const [dutyRecords, setDutyRecords] = useState<DutyRecord[]>(() => loadFromStorage(STORAGE_KEYS.dutyRecords, mockDutyRecords));
  const [games, setGames] = useState<FollowedGame[]>(() => loadFromStorage(STORAGE_KEYS.games, mockGames));
  const [groups, setGroups] = useState<FollowedGroup[]>(() => loadFromStorage(STORAGE_KEYS.groups, mockGroups));
  const [keywords, setKeywords] = useState<FollowedKeyword[]>(() => loadFromStorage(STORAGE_KEYS.keywords, mockKeywords));

  useEffect(() => { saveToStorage(STORAGE_KEYS.alerts, alerts); }, [alerts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.dutyRecords, dutyRecords); }, [dutyRecords]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.games, games); }, [games]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.groups, groups); }, [groups]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.keywords, keywords); }, [keywords]);

  const markAlertRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  }, []);

  const markAllRead = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  }, []);

  const confirmDuty = useCallback((alertId: string, action: DutyActionType, note: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAlerts(prev => prev.map(a =>
      a.id === alertId
        ? { ...a, isHandled: true, dutyAction: action, dutyNote: note, dutyAt: now }
        : a
    ));
    const alert = alerts.find(a => a.id === alertId);
    const record: DutyRecord = {
      id: `d_${Date.now()}`,
      alertId,
      alertTitle: alert?.title || '未知提醒',
      action,
      note,
      operator: '李主管',
      createdAt: now
    };
    setDutyRecords(prev => [record, ...prev]);
    console.log('[Store] 值班确认已持久化:', { alertId, action, note });
  }, [alerts]);

  const toggleGame = useCallback((id: string) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
  }, []);

  const toggleGroup = useCallback((id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
  }, []);

  const toggleKeyword = useCallback((id: string) => {
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, isActive: !k.isActive } : k));
  }, []);

  const addGame = useCallback((name: string, channels: string[]) => {
    const newGame: FollowedGame = {
      id: `g_${Date.now()}`,
      name,
      channels,
      isActive: true
    };
    setGames(prev => [newGame, ...prev]);
    console.log('[Store] 新增游戏:', name);
  }, []);

  const addGroup = useCallback((name: string, description: string) => {
    const newGroup: FollowedGroup = {
      id: `grp_${Date.now()}`,
      name,
      description,
      isActive: true
    };
    setGroups(prev => [newGroup, ...prev]);
    console.log('[Store] 新增群体:', name);
  }, []);

  const addKeyword = useCallback((word: string, category: string, triggerThreshold: number) => {
    const newKw: FollowedKeyword = {
      id: `k_${Date.now()}`,
      word,
      category,
      isActive: true,
      triggerThreshold
    };
    setKeywords(prev => [newKw, ...prev]);
    console.log('[Store] 新增敏感词:', word);
  }, []);

  return {
    alerts, dutyRecords, games, groups, keywords,
    markAlertRead, markAllRead, confirmDuty,
    toggleGame, toggleGroup, toggleKeyword,
    addGame, addGroup, addKeyword
  };
}

export type AppStoreType = ReturnType<typeof useAppStore>;
