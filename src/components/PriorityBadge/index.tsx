import React from 'react';
import { View, Text } from '@tarojs/components';
import { Priority } from '@/types';
import styles from './index.module.scss';
import classnames from 'classnames';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const textMap: Record<Priority, string> = {
    high: '高优先级',
    mid: '中优先级',
    low: '低优先级'
  };

  return (
    <View className={classnames(styles.badge, styles[`priority-${priority}`], styles[`size-${size}`])}>
      <View className={styles.dot} />
      <Text className={styles.text}>{textMap[priority]}</Text>
    </View>
  );
};

export default PriorityBadge;
