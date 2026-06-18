import React, { useState, useMemo } from 'react';
import { View, Text, Switch, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockGames, mockGroups, mockKeywords } from '@/data/follow';
import { FollowedGame, FollowedGroup, FollowedKeyword } from '@/types';
import styles from './index.module.scss';

type TabKey = 'game' | 'group' | 'keyword';

const FollowPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('game');
  const [games, setGames] = useState<FollowedGame[]>(mockGames);
  const [groups, setGroups] = useState<FollowedGroup[]>(mockGroups);
  const [keywords, setKeywords] = useState<FollowedKeyword[]>(mockKeywords);

  const toggleGame = (id: string) => {
    setGames(prev =>
      prev.map(g => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    console.log('[FollowPage] 切换游戏关注:', id);
  };

  const toggleGroup = (id: string) => {
    setGroups(prev =>
      prev.map(g => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    console.log('[FollowPage] 切换群体关注:', id);
  };

  const toggleKeyword = (id: string) => {
    setKeywords(prev =>
      prev.map(k => (k.id === id ? { ...k, isActive: !k.isActive } : k))
    );
    console.log('[FollowPage] 切换敏感词关注:', id);
  };

  const activeGames = useMemo(() => games.filter(g => g.isActive).length, [games]);
  const activeGroups = useMemo(() => groups.filter(g => g.isActive).length, [groups]);
  const activeKeywords = useMemo(() => keywords.filter(k => k.isActive).length, [keywords]);

  const tabs = [
    { key: 'game' as TabKey, label: '游戏', count: activeGames },
    { key: 'group' as TabKey, label: '玩家群体', count: activeGroups },
    { key: 'keyword' as TabKey, label: '敏感词', count: activeKeywords }
  ];

  const handleAdd = (type: string) => {
    Taro.showToast({ title: `新增${type}功能开发中`, icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        {tabs.map(t => (
          <View
            key={t.key}
            className={classnames(styles.tabItem, tab === t.key && styles.tabActive)}
            onClick={() => setTab(t.key)}
          >
            <Text className={styles.tabText}>
              {t.label} ({t.count})
            </Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY enhanced showScrollbar={false}>
        {tab === 'game' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>关注的游戏</Text>
              <Text className={styles.addBtn} onClick={() => handleAdd('游戏')}>＋ 新增</Text>
            </View>
            <View className={styles.cardList}>
              {games.length > 0 ? (
                games.map(g => (
                  <View key={g.id} className={styles.gameCard}>
                    <View className={styles.gameHeader}>
                      <View className={styles.gameInfo}>
                        <Text className={styles.gameName}>🎮 {g.name}</Text>
                        <View className={styles.gameChannels}>
                          {g.channels.map(c => (
                            <Text key={c} className={styles.channelTag}>
                              {c}
                            </Text>
                          ))}
                        </View>
                      </View>
                      <View
                        className={classnames(styles.switch, g.isActive && styles.switchOn)}
                        onClick={() => toggleGame(g.id)}
                      >
                        <View className={styles.switchKnob} />
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyHint}>
                  <Text className={styles.emptyText}>暂未关注任何游戏</Text>
                  <Text className={styles.hintText}>点击右上角新增按钮添加关注游戏</Text>
                </View>
              )}
            </View>
          </>
        )}

        {tab === 'group' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>关注的玩家群体</Text>
              <Text className={styles.addBtn} onClick={() => handleAdd('玩家群体')}>＋ 新增</Text>
            </View>
            <View className={styles.cardList}>
              {groups.length > 0 ? (
                groups.map(g => (
                  <View key={g.id} className={styles.groupCard}>
                    <View className={styles.groupHeader}>
                      <View className={styles.groupInfo}>
                        <Text className={styles.groupName}>👥 {g.name}</Text>
                        <Text className={styles.groupDesc}>{g.description}</Text>
                      </View>
                      <View
                        className={classnames(styles.switch, g.isActive && styles.switchOn)}
                        onClick={() => toggleGroup(g.id)}
                      >
                        <View className={styles.switchKnob} />
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyHint}>
                  <Text className={styles.emptyText}>暂未关注任何玩家群体</Text>
                  <Text className={styles.hintText}>点击右上角新增按钮添加关注群体</Text>
                </View>
              )}
            </View>
          </>
        )}

        {tab === 'keyword' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>监控的敏感词</Text>
              <Text className={styles.addBtn} onClick={() => handleAdd('敏感词')}>＋ 新增</Text>
            </View>
            <View className={styles.cardList}>
              {keywords.length > 0 ? (
                keywords.map(k => (
                  <View key={k.id} className={styles.keywordCard}>
                    <View className={styles.kwHeader}>
                      <View className={styles.kwInfo}>
                        <Text className={styles.kwWord}># {k.word}</Text>
                        <Text className={styles.kwCat}>{k.category}</Text>
                      </View>
                      <View
                        className={classnames(styles.switch, k.isActive && styles.switchOn)}
                        onClick={() => toggleKeyword(k.id)}
                      >
                        <View className={styles.switchKnob} />
                      </View>
                    </View>
                    <View className={styles.kwThreshold}>
                      <Text className={styles.kwThLabel}>触发阈值：</Text>
                      <Text className={styles.kwThValue}>
                        1小时内超过 {k.triggerThreshold} 条触发告警
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View className={styles.emptyHint}>
                  <Text className={styles.emptyText}>暂未配置任何敏感词</Text>
                  <Text className={styles.hintText}>点击右上角新增按钮添加敏感词</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FollowPage;
