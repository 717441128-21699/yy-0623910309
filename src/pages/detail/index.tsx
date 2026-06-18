import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import PriorityBadge from '@/components/PriorityBadge';
import FilterBar, { FilterOption } from '@/components/FilterBar';
import CommentItem from '@/components/CommentItem';
import DutyActionSheet from '@/components/DutyActionSheet';
import { useStore } from '@/store/app-context';
import { mockComments } from '@/data/comments';
import { DUTY_ACTION_OPTIONS, DutyActionType, Priority, Sentiment } from '@/types';
import styles from './index.module.scss';

const DetailPage: React.FC = () => {
  const router = useRouter();
  const alertId = router.params.id || 'a001';
  const { alerts, confirmDuty } = useStore();

  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'time'>('hot');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const alert = useMemo(
    () => alerts.find(a => a.id === alertId) || alerts[0],
    [alerts, alertId]
  );

  useDidShow(() => {
    console.log('[DetailPage] 页面加载，alertId:', alertId);
  });

  const allComments = useMemo(
    () => mockComments.filter(c => c.alertId === (alert?.id || alertId)),
    [alert, alertId]
  );

  const sentimentStats = alert?.sentimentStats || { positive: 0, neutral: 0, negative: 0 };
  const totalSent = sentimentStats.positive + sentimentStats.neutral + sentimentStats.negative || 1;
  const negPercent = Math.round((sentimentStats.negative / totalSent) * 100);
  const neuPercent = Math.round((sentimentStats.neutral / totalSent) * 100);
  const posPercent = 100 - negPercent - neuPercent;

  const sentimentOptions: FilterOption[] = [
    { value: 'all', label: '全部', badge: allComments.length },
    { value: 'negative', label: '负面', badge: sentimentStats.negative },
    { value: 'neutral', label: '中性', badge: sentimentStats.neutral },
    { value: 'positive', label: '正面', badge: sentimentStats.positive }
  ];

  const hotComments = useMemo(() => {
    return [...allComments].sort((a, b) => (b.likes + b.reposts * 2) - (a.likes + a.reposts * 2)).slice(0, 5);
  }, [allComments]);

  const filteredComments = useMemo(() => {
    let list = [...allComments];
    if (sentimentFilter !== 'all') {
      list = list.filter(c => c.sentiment === sentimentFilter);
    }
    if (sortBy === 'hot') {
      list.sort((a, b) => (b.likes + b.reposts * 2) - (a.likes + a.reposts * 2));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [allComments, sentimentFilter, sortBy]);

  const handleConfirm = (action: DutyActionType, note: string) => {
    confirmDuty(alertId, action, note);
    setActionSheetVisible(false);
    Taro.showToast({ title: '值班确认已提交', icon: 'success' });
    console.log('[DetailPage] 值班确认:', { action, note });
  };

  const dutyOption = alert?.dutyAction
    ? DUTY_ACTION_OPTIONS.find(o => o.value === alert.dutyAction)
    : null;

  if (!alert) {
    return (
      <View className={styles.page}>
        <Text style={{ padding: 100, textAlign: 'center', color: '#999' }}>未找到舆情信息</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerBanner}>
        <Text className={styles.bannerTitle}>{alert.title}</Text>
        <View className={styles.bannerMeta}>
          <View style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PriorityBadge priority={alert.priority as Priority} size="sm" />
          </View>
          <Text className={styles.bannerTag}>🎮 {alert.game}</Text>
          <Text className={styles.bannerTag}>📡 {alert.channel}</Text>
          <Text className={styles.bannerTag}>🏷 {alert.keyword}</Text>
        </View>
        <View className={styles.bannerStats}>
          <View className={styles.bannerStat}>
            <Text className={styles.bannerStatVal}>{alert.totalCount}</Text>
            <Text className={styles.bannerStatLabel}>相关反馈</Text>
          </View>
          <View className={styles.bannerStat}>
            <Text className={styles.bannerStatVal} style={{ color: '#FFD23F' }}>
              +{alert.growthRate}%
            </Text>
            <Text className={styles.bannerStatLabel}>较1小时前</Text>
          </View>
          <View className={styles.bannerStat}>
            <Text className={styles.bannerStatVal}>{alert.platforms.length}</Text>
            <Text className={styles.bannerStatLabel}>来源平台</Text>
          </View>
        </View>
      </View>

      {alert.isHandled && dutyOption && (
        <View className={styles.handledBanner}>
          <Text className={styles.handledIcon}>✓</Text>
          <View className={styles.handledInfo}>
            <Text className={styles.handledLabel}>{dutyOption.label}</Text>
            <Text className={styles.handledNote}>{alert.dutyNote}</Text>
            <Text className={styles.handledTime}>
              处理时间：{alert.dutyAt?.slice(5, 16)} · 操作人：李主管
            </Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>情感分布</Text>
          <Text className={styles.sectionMore}>基于 {totalSent} 条评论分析</Text>
        </View>
        <View className={styles.card}>
          <View className={styles.sentimentBlock}>
            <View className={styles.sentimentDonut}>
              <View
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `conic-gradient(
                    #F53F3F 0% ${negPercent}%,
                    #86909C ${negPercent}% ${negPercent + neuPercent}%,
                    #00B42A ${negPercent + neuPercent}% 100%
                  )`
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  inset: '16rpx',
                  borderRadius: '50%',
                  background: '#fff',
                }}
              />
              <View className={styles.sentimentCenter}>
                <Text className={styles.centerVal}>{negPercent}%</Text>
                <Text className={styles.centerLabel}>负面占比</Text>
              </View>
            </View>
            <View className={styles.sentimentLegend}>
              <View className={styles.legendItem}>
                <View className={styles.legendLeft}>
                  <View className={styles.legendDot} style={{ background: '#F53F3F' }} />
                  <Text className={styles.legendLabel}>负面评论</Text>
                </View>
                <View className={styles.legendRight}>
                  <Text className={styles.legendCount}>{sentimentStats.negative}</Text>
                  <Text className={styles.legendPercent}>{negPercent}%</Text>
                </View>
              </View>
              <View className={styles.legendItem}>
                <View className={styles.legendLeft}>
                  <View className={styles.legendDot} style={{ background: '#86909C' }} />
                  <Text className={styles.legendLabel}>中性评论</Text>
                </View>
                <View className={styles.legendRight}>
                  <Text className={styles.legendCount}>{sentimentStats.neutral}</Text>
                  <Text className={styles.legendPercent}>{neuPercent}%</Text>
                </View>
              </View>
              <View className={styles.legendItem}>
                <View className={styles.legendLeft}>
                  <View className={styles.legendDot} style={{ background: '#00B42A' }} />
                  <Text className={styles.legendLabel}>正面评论</Text>
                </View>
                <View className={styles.legendRight}>
                  <Text className={styles.legendCount}>{sentimentStats.positive}</Text>
                  <Text className={styles.legendPercent}>{posPercent}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>主要诉求 TOP {alert.mainDemands.length}</Text>
        </View>
        <View className={styles.card}>
          {alert.mainDemands.map((d, i) => (
            <View key={i} className={styles.demandItem}>
              <Text className={styles.demandNum}>{i + 1}</Text>
              <Text className={styles.demandText}>{d}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>来源平台分布</Text>
        </View>
        <View className={styles.card}>
          <View className={styles.platformRow}>
            {alert.platforms.map(p => (
              <View key={p.name} className={styles.platformCard}>
                <Text className={styles.platformName}>{p.name}</Text>
                <Text className={styles.platformCount}>{p.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>建议处理优先级</Text>
        </View>
        <View className={styles.suggestionBox}>
          <Text className={styles.suggestionLabel}>💡 AI 建议</Text>
          <Text className={styles.suggestionText}>{alert.suggestedPriority}</Text>
        </View>
      </View>

      {hotComments.length > 0 && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>🔥 热门评论 TOP</Text>
            <Text className={styles.sectionMore}>按点赞+转发热度排序</Text>
          </View>
          <View>
            {hotComments.slice(0, 2).map(c => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </View>
        </View>
      )}

      <View className={styles.section} style={{ marginBottom: 16 }}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>玩家原声 ({allComments.length})</Text>
        </View>
      </View>

      <View className={styles.filterBar}>
        <FilterBar
          options={sentimentOptions}
          activeValue={sentimentFilter}
          onChange={setSentimentFilter}
        />
      </View>

      <View className={styles.sortSub}>
        <Text className={styles.sortInfo}>共 {filteredComments.length} 条{sentimentFilter !== 'all' ? '筛选后' : ''}评论</Text>
        <View className={styles.sortBtns}>
          <Text
            className={classnames(styles.sortBtn, sortBy === 'hot' && styles.sortBtnActive)}
            onClick={() => setSortBy('hot')}
          >
            热度排序
          </Text>
          <Text
            className={classnames(styles.sortBtn, sortBy === 'time' && styles.sortBtnActive)}
            onClick={() => setSortBy('time')}
          >
            时间排序
          </Text>
        </View>
      </View>

      <ScrollView scrollY enhanced showScrollbar={false} className={styles.commentList}>
        {filteredComments.length > 0 ? (
          filteredComments.map(c => (
            <CommentItem key={c.id} comment={c} />
          ))
        ) : (
          <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: 28, color: '#86909C' }}>暂无相关评论</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.footerBar}>
        <View className={styles.secondaryBtn} onClick={() => {
          Taro.showToast({ title: '分享功能开发中', icon: 'none' });
          console.log('[DetailPage] 分享详情');
        }}>
          <Text>分享</Text>
        </View>
        <View
          className={styles.primaryBtn}
          onClick={() => setActionSheetVisible(true)}
        >
          <Text>{alert.isHandled ? '更新处理方案' : '值班确认'}</Text>
        </View>
      </View>

      <DutyActionSheet
        visible={actionSheetVisible}
        defaultAction={alert.dutyAction}
        defaultNote={alert.dutyNote}
        onClose={() => setActionSheetVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default DetailPage;
