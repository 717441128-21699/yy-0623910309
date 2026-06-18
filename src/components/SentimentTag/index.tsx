import React from 'react';
import { View, Text } from '@tarojs/components';
import { Sentiment } from '@/types';
import styles from './index.module.scss';

interface SentimentTagProps {
  sentiment: Sentiment;
  count?: number;
}

const SentimentTag: React.FC<SentimentTagProps> = ({ sentiment, count }) => {
  const labelMap: Record<Sentiment, string> = {
    positive: '正面',
    neutral: '中性',
    negative: '负面'
  };

  const iconMap: Record<Sentiment, string> = {
    positive: '＋',
    neutral: '○',
    negative: '−'
  };

  return (
    <View className={`${styles.tag} ${styles[`sentiment-${sentiment}`]}`}>
      <Text className={styles.icon}>{iconMap[sentiment]}</Text>
      <Text className={styles.label}>{labelMap[sentiment]}</Text>
      {typeof count === 'number' && <Text className={styles.count}>{count}</Text>}
    </View>
  );
};

export default SentimentTag;
