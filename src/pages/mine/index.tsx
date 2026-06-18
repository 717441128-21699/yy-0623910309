import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockDutyRecords } from '@/data/follow';
import { DutyRecord } from '@/types';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const records: DutyRecord[] = mockDutyRecords.slice(0, 3);
  const todayHandled = mockDutyRecords.filter(
    r => r.createdAt.startsWith('2026-06-19')
  ).length;

  const getActionMeta = (action: DutyRecord['action']) => {
    switch (action) {
      case 'tech':
        return { label: '已联系技术', color: '#1E64FF', bg: 'rgba(30, 100, 255, 0.1)' };
      case 'notice':
        return { label: '需公告解释', color: '#FF7D00', bg: 'rgba(255, 125, 0, 0.1)' };
      case 'ticket':
        return { label: '并入工单高峰', color: '#00B42A', bg: 'rgba(0, 180, 42, 0.1)' };
      default:
        return { label: '待处理', color: '#86909C', bg: '#F2F3F5' };
    }
  };

  const handleMenuClick = (label: string) => {
    console.log('[MinePage] 点击菜单项:', label);
    Taro.showToast({ title: `${label}功能开发中`, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>李</Text>
        </View>
        <View className={styles.profileInfo}>
          <View className={styles.nameRow}>
            <Text className={styles.name}>李明</Text>
            <View className={styles.roleTag}>客服主管</View>
          </View>
          <Text className={styles.subInfo}>今日值班中 · 上次登录 10分钟前</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCol}>
          <Text className={styles.statVal}>{todayHandled}</Text>
          <Text className={styles.statLabel}>今日处理</Text>
        </View>
        <View className={styles.statCol}>
          <Text className={styles.statVal}>{mockDutyRecords.length}</Text>
          <Text className={styles.statLabel}>累计处理</Text>
        </View>
        <View className={styles.statCol}>
          <Text className={styles.statVal}>3</Text>
          <Text className={styles.statLabel}>值班天数</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>最近值班记录</Text>
        <View className={styles.dutyList}>
          {records.map(r => {
            const meta = getActionMeta(r.action);
            return (
              <View key={r.id} className={styles.dutyItem}>
                <View className={styles.dutyHead}>
                  <Text className={styles.dutyTitle}>{r.alertTitle}</Text>
                  <View
                    className={styles.dutyTag}
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </View>
                </View>
                <Text className={styles.dutyBody}>{r.note}</Text>
                <View className={styles.dutyMeta}>
                  <Text className={styles.dutyTime}>{r.createdAt.slice(5, 16)}</Text>
                  <Text className={styles.dutyOperator}>操作人：{r.operator}</Text>
                </View>
              </View>
            );
          })}
          <View className={styles.viewAll} onClick={() => handleMenuClick('值班记录')}>
            查看全部记录 →
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>快速入口</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => handleMenuClick('联系技术')}>
            <View className={`${styles.menuIcon} ${styles.iconTech}`}>📞</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>联系技术值班</Text>
              <Text className={styles.menuDesc}>快速通知运维/客户端组</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('发布公告模板')}>
            <View className={`${styles.menuIcon} ${styles.iconNotice}`}>📝</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>公告模板库</Text>
              <Text className={styles.menuDesc}>常用公告文案一键调用</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('工单高峰调度')}>
            <View className={`${styles.menuIcon} ${styles.iconTicket}`}>📊</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>工单调度</Text>
              <Text className={styles.menuDesc}>查看实时工单队列状态</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>设置</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => handleMenuClick('推送设置')}>
            <View className={`${styles.menuIcon} ${styles.iconNotify}`}>🔔</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>推送与通知</Text>
              <Text className={styles.menuDesc}>高优告警全天开启</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('帮助与反馈')}>
            <View className={`${styles.menuIcon} ${styles.iconHelp}`}>💡</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>使用帮助</Text>
              <Text className={styles.menuDesc}>产品说明与常见问题</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => handleMenuClick('关于')}>
            <View className={`${styles.menuIcon} ${styles.iconAbout}`}>ℹ️</View>
            <View className={styles.menuContent}>
              <Text className={styles.menuLabel}>关于舆情哨兵</Text>
              <Text className={styles.menuDesc}>版本 v1.0.0</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
