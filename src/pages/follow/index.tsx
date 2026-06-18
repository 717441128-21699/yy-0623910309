import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useStore } from '@/store/app-context';
import { DUTY_ACTION_OPTIONS } from '@/types';
import styles from './index.module.scss';

type TabKey = 'game' | 'group' | 'keyword' | 'record';

const FollowPage: React.FC = () => {
  const {
    games, groups, keywords, dutyRecords,
    toggleGame, toggleGroup, toggleKeyword,
    addGame, addGroup, addKeyword
  } = useStore();

  const [tab, setTab] = useState<TabKey>('game');
  const [showAdd, setShowAdd] = useState(false);

  const [newGameName, setNewGameName] = useState('');
  const [newGameChannels, setNewGameChannels] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newKwWord, setNewKwWord] = useState('');
  const [newKwCategory, setNewKwCategory] = useState('技术故障');
  const [newKwThreshold, setNewKwThreshold] = useState('50');

  const activeGames = useMemo(() => games.filter(g => g.isActive).length, [games]);
  const activeGroups = useMemo(() => groups.filter(g => g.isActive).length, [groups]);
  const activeKeywords = useMemo(() => keywords.filter(k => k.isActive).length, [keywords]);

  const tabs = [
    { key: 'game' as TabKey, label: '游戏', count: activeGames },
    { key: 'group' as TabKey, label: '玩家群体', count: activeGroups },
    { key: 'keyword' as TabKey, label: '敏感词', count: activeKeywords },
    { key: 'record' as TabKey, label: '值班记录', count: dutyRecords.length }
  ];

  const handleAddGame = () => {
    if (!newGameName.trim()) {
      Taro.showToast({ title: '请输入游戏名称', icon: 'none' });
      return;
    }
    const channels = newGameChannels.trim()
      ? newGameChannels.split(/[,，、]/).map(s => s.trim()).filter(Boolean)
      : ['全渠道'];
    addGame(newGameName.trim(), channels);
    setNewGameName('');
    setNewGameChannels('');
    setShowAdd(false);
    Taro.showToast({ title: '游戏已添加', icon: 'success' });
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      Taro.showToast({ title: '请输入群体名称', icon: 'none' });
      return;
    }
    addGroup(newGroupName.trim(), newGroupDesc.trim() || '自定义玩家群体');
    setNewGroupName('');
    setNewGroupDesc('');
    setShowAdd(false);
    Taro.showToast({ title: '群体已添加', icon: 'success' });
  };

  const handleAddKeyword = () => {
    if (!newKwWord.trim()) {
      Taro.showToast({ title: '请输入敏感词', icon: 'none' });
      return;
    }
    const threshold = parseInt(newKwThreshold) || 50;
    addKeyword(newKwWord.trim(), newKwCategory, threshold);
    setNewKwWord('');
    setNewKwThreshold('50');
    setShowAdd(false);
    Taro.showToast({ title: '敏感词已添加', icon: 'success' });
  };

  const getActionMeta = (action: string) => {
    const opt = DUTY_ACTION_OPTIONS.find(o => o.value === action);
    if (opt) return { label: opt.label, color: opt.color };
    return { label: '待处理', color: '#86909C' };
  };

  const kwCategories = ['技术故障', '账号安全', '充值/支付', '运营活动', '其他'];

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        {tabs.map(t => (
          <View
            key={t.key}
            className={classnames(styles.tabItem, tab === t.key && styles.tabActive)}
            onClick={() => { setTab(t.key); setShowAdd(false); }}
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
              <Text className={styles.addBtn} onClick={() => setShowAdd(showAdd === 'game' ? false : 'game')}>
                {showAdd === 'game' ? '取消' : '＋ 新增'}
              </Text>
            </View>
            {showAdd === 'game' && (
              <View className={styles.addCard}>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>游戏名称</Text>
                  <Input
                    className={styles.addInput}
                    value={newGameName}
                    placeholder="例如：星辰幻想"
                    onInput={e => setNewGameName(e.detail.value)}
                  />
                </View>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>渠道服（逗号分隔）</Text>
                  <Input
                    className={styles.addInput}
                    value={newGameChannels}
                    placeholder="例如：安卓官服，iOS官服"
                    onInput={e => setNewGameChannels(e.detail.value)}
                  />
                </View>
                <View className={styles.addActions}>
                  <View className={styles.addCancelBtn} onClick={() => setShowAdd(false)}>
                    <Text className={styles.addCancelText}>取消</Text>
                  </View>
                  <View className={styles.addConfirmBtn} onClick={handleAddGame}>
                    <Text className={styles.addConfirmText}>确认添加</Text>
                  </View>
                </View>
              </View>
            )}
            <View className={styles.cardList}>
              {games.map(g => (
                <View key={g.id} className={styles.gameCard}>
                  <View className={styles.gameHeader}>
                    <View className={styles.gameInfo}>
                      <Text className={styles.gameName}>🎮 {g.name}</Text>
                      <View className={styles.gameChannels}>
                        {g.channels.map(c => (
                          <Text key={c} className={styles.channelTag}>{c}</Text>
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
              ))}
            </View>
          </>
        )}

        {tab === 'group' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>关注的玩家群体</Text>
              <Text className={styles.addBtn} onClick={() => setShowAdd(showAdd === 'group' ? false : 'group')}>
                {showAdd === 'group' ? '取消' : '＋ 新增'}
              </Text>
            </View>
            {showAdd === 'group' && (
              <View className={styles.addCard}>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>群体名称</Text>
                  <Input
                    className={styles.addInput}
                    value={newGroupName}
                    placeholder="例如：付费高价值用户"
                    onInput={e => setNewGroupName(e.detail.value)}
                  />
                </View>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>群体描述</Text>
                  <Input
                    className={styles.addInput}
                    value={newGroupDesc}
                    placeholder="例如：累计充值>5000元玩家"
                    onInput={e => setNewGroupDesc(e.detail.value)}
                  />
                </View>
                <View className={styles.addActions}>
                  <View className={styles.addCancelBtn} onClick={() => setShowAdd(false)}>
                    <Text className={styles.addCancelText}>取消</Text>
                  </View>
                  <View className={styles.addConfirmBtn} onClick={handleAddGroup}>
                    <Text className={styles.addConfirmText}>确认添加</Text>
                  </View>
                </View>
              </View>
            )}
            <View className={styles.cardList}>
              {groups.map(g => (
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
              ))}
            </View>
          </>
        )}

        {tab === 'keyword' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>监控的敏感词</Text>
              <Text className={styles.addBtn} onClick={() => setShowAdd(showAdd === 'keyword' ? false : 'keyword')}>
                {showAdd === 'keyword' ? '取消' : '＋ 新增'}
              </Text>
            </View>
            {showAdd === 'keyword' && (
              <View className={styles.addCard}>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>敏感词</Text>
                  <Input
                    className={styles.addInput}
                    value={newKwWord}
                    placeholder="例如：无法登录"
                    onInput={e => setNewKwWord(e.detail.value)}
                  />
                </View>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>分类</Text>
                  <View className={styles.catRow}>
                    {kwCategories.map(cat => (
                      <View
                        key={cat}
                        className={classnames(styles.catTag, newKwCategory === cat && styles.catTagActive)}
                        onClick={() => setNewKwCategory(cat)}
                      >
                        <Text className={styles.catTagText}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className={styles.addField}>
                  <Text className={styles.addLabel}>触发阈值（1小时内条数）</Text>
                  <Input
                    className={styles.addInput}
                    type='number'
                    value={newKwThreshold}
                    placeholder="50"
                    onInput={e => setNewKwThreshold(e.detail.value)}
                  />
                </View>
                <View className={styles.addActions}>
                  <View className={styles.addCancelBtn} onClick={() => setShowAdd(false)}>
                    <Text className={styles.addCancelText}>取消</Text>
                  </View>
                  <View className={styles.addConfirmBtn} onClick={handleAddKeyword}>
                    <Text className={styles.addConfirmText}>确认添加</Text>
                  </View>
                </View>
              </View>
            )}
            <View className={styles.cardList}>
              {keywords.map(k => (
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
              ))}
            </View>
          </>
        )}

        {tab === 'record' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>值班处理记录</Text>
              <Text className={styles.recordCount}>共 {dutyRecords.length} 条</Text>
            </View>
            <View className={styles.cardList}>
              {dutyRecords.length > 0 ? dutyRecords.map(r => {
                const meta = getActionMeta(r.action);
                return (
                  <View key={r.id} className={styles.recordCard}>
                    <View className={styles.recordHead}>
                      <Text className={styles.recordTitle}>{r.alertTitle}</Text>
                      <View
                        className={styles.recordTag}
                        style={{ background: `${meta.color}15`, color: meta.color }}
                      >
                        {meta.label}
                      </View>
                    </View>
                    <Text className={styles.recordNote}>{r.note}</Text>
                    <View className={styles.recordMeta}>
                      <Text className={styles.recordTime}>{r.createdAt.slice(5, 16)}</Text>
                      <Text className={styles.recordOp}>操作人：{r.operator}</Text>
                    </View>
                  </View>
                );
              }) : (
                <View className={styles.emptyHint}>
                  <Text className={styles.emptyText}>暂无值班记录</Text>
                  <Text className={styles.hintText}>在提醒详情页点击"值班确认"提交处理</Text>
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
