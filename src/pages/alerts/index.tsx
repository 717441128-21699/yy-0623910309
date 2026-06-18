import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import AlertCard from '@/components/AlertCard';
import FilterBar, { FilterOption } from '@/components/FilterBar';
import { useStore } from '@/store/app-context';
import { Priority } from '@/types';
import styles from './index.module.scss';

const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, markAllRead } = useStore();
  const [filterValue, setFilterValue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('time');

  useDidShow(() => {
    console.log('[AlertsPage] 页面显示，刷新未读状态');
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const highCount = alerts.filter(a => a.priority === 'high').length;
  const handledCount = alerts.filter(a => a.isHandled).length;

  const filterOptions: FilterOption[] = useMemo(() => [
    { value: 'all', label: '全部', badge: alerts.length },
    { value: 'unread', label: '未读', badge: unreadCount },
    { value: 'high', label: '高优先级', badge: highCount },
    { value: 'unhandled', label: '待处理', badge: alerts.length - handledCount },
    { value: 'handled', label: '已处理', badge: handledCount }
  ], [alerts, unreadCount, highCount, handledCount]);

  const sortedAlerts = useMemo(() => {
    let list = [...alerts];
    switch (filterValue) {
      case 'unread':
        list = list.filter(a => !a.isRead);
        break;
      case 'high':
        list = list.filter(a => a.priority === 'high');
        break;
      case 'unhandled':
        list = list.filter(a => !a.isHandled);
        break;
      case 'handled':
        list = list.filter(a => a.isHandled);
        break;
    }
    if (sortBy === 'priority') {
      const order: Record<Priority, number> = { high: 0, mid: 1, low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else {
      list.sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
    }
    return list;
  }, [alerts, filterValue, sortBy]);

  const handleMarkAllRead = () => {
    markAllRead();
    Taro.showToast({ title: '已全部标记已读', icon: 'success' });
  };

  const onRefresh = () => {
    console.log('[AlertsPage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '已是最新数据', icon: 'none' });
    }, 800);
  };

  React.useEffect(() => {
    Taro.eventCenter.on('__taroStartPullDownRefresh', onRefresh);
    return () => {
      Taro.eventCenter.off('__taroStartPullDownRefresh', onRefresh);
    };
  }, []);

  return (
    <View className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>今日舆情概览</Text>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{unreadCount}</Text>
            <Text className={styles.summaryLabel}>未读提醒</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{handledCount}</Text>
            <Text className={styles.summaryLabel}>已处理</Text>
          </View>
        </View>
        <View className={styles.summarySub}>
          <View className={styles.subItem}>
            <View className={styles.subDot} style={{ background: '#F53F3F' }} />
            <Text className={styles.subText}>高优 {highCount} 条</Text>
          </View>
          <View className={styles.subItem}>
            <View className={styles.subDot} style={{ background: '#FF7D00' }} />
            <Text className={styles.subText}>
              中优 {alerts.filter(a => a.priority === 'mid').length} 条
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.filterBarWrap}>
        <FilterBar options={filterOptions} activeValue={filterValue} onChange={setFilterValue} />
      </View>

      <View className={styles.sortBar}>
        <Text className={styles.sortText}>共 {sortedAlerts.length} 条提醒</Text>
        <View className={styles.sortActions}>
          <Text
            className={styles.sortBtn}
            style={{ opacity: sortBy === 'time' ? 1 : 0.6 }}
            onClick={() => setSortBy('time')}
          >
            按时间
          </Text>
          <Text
            className={styles.sortBtn}
            style={{ opacity: sortBy === 'priority' ? 1 : 0.6 }}
            onClick={() => setSortBy('priority')}
          >
            按优先级
          </Text>
          {unreadCount > 0 && <Text className={styles.sortBtn} onClick={handleMarkAllRead}>全部已读</Text>}
        </View>
      </View>

      {sortedAlerts.length > 0 ? (
        <ScrollView scrollY enhanced showScrollbar={false} className={styles.listWrap}>
          {sortedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={() => {
                markAlertRead(alert.id);
                console.log('[AlertsPage] 进入详情:', alert.id);
                Taro.navigateTo({ url: `/pages/detail/index?id=${alert.id}` });
              }}
            />
          ))}
        </ScrollView>
      ) : (
        <View className={styles.emptyState}>
          <View className={styles.emptyIcon}>🎉</View>
          <Text className={styles.emptyTitle}>暂无相关提醒</Text>
          <Text className={styles.emptyDesc}>
            当前筛选条件下没有舆情提醒{'\n'}
            建议放宽筛选条件或稍后查看
          </Text>
        </View>
      )}
    </View>
  );
};

export default AlertsPage;
