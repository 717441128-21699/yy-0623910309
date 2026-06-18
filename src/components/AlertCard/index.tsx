import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import PriorityBadge from '@/components/PriorityBadge';
import { Alert, DUTY_ACTION_OPTIONS } from '@/types';
import styles from './index.module.scss';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log('[AlertCard] 点击进入详情:', alert.id);
      Taro.navigateTo({
        url: `/pages/detail/index?id=${alert.id}`
      });
    }
  };

  const dutyOption = alert.dutyAction
    ? DUTY_ACTION_OPTIONS.find(o => o.value === alert.dutyAction)
    : null;

  const totalSentiment =
    alert.sentimentStats.positive +
    alert.sentimentStats.neutral +
    alert.sentimentStats.negative || 1;
  const negPercent = Math.round((alert.sentimentStats.negative / totalSentiment) * 100);
  const neuPercent = Math.round((alert.sentimentStats.neutral / totalSentiment) * 100);

  return (
    <View
      className={classnames(
        styles.card,
        !alert.isRead && styles.unread,
        styles[`priorityBorder-${alert.priority}`]
      )}
      onClick={handleClick}
    >
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <PriorityBadge priority={alert.priority} />
          {!alert.isRead && <View className={styles.unreadDot} />}
        </View>
        <View className={styles.time}>
          <Text className={styles.timeText}>{alert.triggeredAt.slice(5, 16)}</Text>
        </View>
      </View>

      <View className={styles.titleRow}>
        <Text className={styles.title}>{alert.title}</Text>
      </View>

      <View className={styles.metaRow}>
        <Text className={styles.metaItem}>🎮 {alert.game}</Text>
        <Text className={styles.metaSep}>·</Text>
        <Text className={styles.metaItem}>{alert.channel}</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statGrowth}>
          <Text className={styles.growthLabel}>较1小时前</Text>
          <View className={styles.growthValueWrap}>
            <Text className={styles.growthArrow}>↑</Text>
            <Text className={styles.growthValue}>{alert.growthRate}%</Text>
          </View>
        </View>
        <View className={styles.statTotal}>
          <Text className={styles.totalValue}>{alert.totalCount}</Text>
          <Text className={styles.totalLabel}>条相关反馈</Text>
        </View>
      </View>

      <View className={styles.platformRow}>
        {alert.platforms.slice(0, 3).map(p => (
          <View key={p.name} className={styles.platformItem}>
            <Text className={styles.platformName}>{p.name}</Text>
            <Text className={styles.platformCount}>{p.count}</Text>
          </View>
        ))}
        {alert.platforms.length > 3 && (
          <Text className={styles.platformMore}>+{alert.platforms.length - 3}平台</Text>
        )}
      </View>

      <View className={styles.sentimentRow}>
        <View className={styles.sentimentBar}>
          <View
            className={classnames(styles.barSeg, styles.barNeg)}
            style={{ width: `${negPercent}%` }}
          />
          <View
            className={classnames(styles.barSeg, styles.barNeu)}
            style={{ width: `${neuPercent}%` }}
          />
        </View>
        <View className={styles.sentimentLabels}>
          <View className={styles.labelItem}>
            <View className={classnames(styles.dot, styles.dotNeg)} />
            <Text className={styles.labelText}>负面 {negPercent}%</Text>
          </View>
          <View className={styles.labelItem}>
            <View className={classnames(styles.dot, styles.dotNeu)} />
            <Text className={styles.labelText}>中性 {neuPercent}%</Text>
          </View>
        </View>
      </View>

      <View className={styles.demandRow}>
        <Text className={styles.demandLabel}>主要诉求：</Text>
        <Text className={styles.demandText}>{alert.mainDemands[0]}</Text>
      </View>

      {!alert.isHandled && alert.suggestedAction && (
        <View className={styles.suggestRow}>
          <View
            className={styles.suggestTag}
            style={{
              background: `${DUTY_ACTION_OPTIONS.find(o => o.value === alert.suggestedAction)?.color || '#86909C'}15`,
              color: DUTY_ACTION_OPTIONS.find(o => o.value === alert.suggestedAction)?.color || '#86909C'
            }}
          >
            <Text className={styles.suggestTagText}>
              建议{DUTY_ACTION_OPTIONS.find(o => o.value === alert.suggestedAction)?.label || ''}
            </Text>
          </View>
          <Text className={styles.suggestText}>{alert.suggestedPriority}</Text>
        </View>
      )}

      {alert.isHandled && dutyOption && (
        <View className={styles.handledRow}>
          <View className={styles.handledTag} style={{ background: `${dutyOption.color}15`, color: dutyOption.color }}>
            <Text>✓ {dutyOption.label}</Text>
          </View>
          <Text className={styles.handledTime}>{alert.dutyAt?.slice(5, 16)}</Text>
        </View>
      )}
    </View>
  );
};

export default AlertCard;
