import React from 'react';
import { View, Text } from '@tarojs/components';
import SentimentTag from '@/components/SentimentTag';
import { PlayerComment } from '@/types';
import styles from './index.module.scss';
import classnames from 'classnames';

interface CommentItemProps {
  comment: PlayerComment;
  showFullContent?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, showFullContent = true }) => {
  const playerInitial = comment.playerName.charAt(0);
  const avatarBgColors = ['#FF9843', '#1E64FF', '#00B42A', '#8B5CF6', '#F53F3F', '#FFD23F'];
  const colorIndex = parseInt(comment.playerId.replace(/\D/g, '').slice(-1)) % 6;
  const avatarBg = avatarBgColors[colorIndex] || '#1E64FF';

  const timeFromNow = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
    if (diff < 60) return `${Math.floor(diff)}分钟前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
    return `${Math.floor(diff / 1440)}天前`;
  };

  return (
    <View className={classnames(styles.card, comment.isHot && styles.hot)}>
      <View className={styles.header}>
        <View className={styles.avatar} style={{ background: avatarBg }}>
          <Text className={styles.avatarText}>{playerInitial}</Text>
        </View>
        <View className={styles.userInfo}>
          <View className={styles.userRow}>
            <Text className={styles.userName}>{comment.playerName}</Text>
            {comment.isHot && <View className={styles.hotTag}>🔥热门</View>}
          </View>
          <View className={styles.metaRow}>
            <Text className={styles.metaText}>{comment.platform}</Text>
            <Text className={styles.metaSep}>·</Text>
            <Text className={styles.metaText}>{timeFromNow(comment.createdAt)}</Text>
          </View>
        </View>
        <View className={styles.rightTag}>
          <SentimentTag sentiment={comment.sentiment} />
        </View>
      </View>

      <View className={styles.content}>
        <Text className={styles.contentText}>{comment.content}</Text>
      </View>

      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statIcon}>❤</Text>
          <Text className={styles.statNum}>{comment.likes}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statIcon}>↗</Text>
          <Text className={styles.statNum}>{comment.reposts}</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statIcon}>💬</Text>
          <Text className={styles.statNum}>{comment.replies}</Text>
        </View>
      </View>
    </View>
  );
};

export default CommentItem;
