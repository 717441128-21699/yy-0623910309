import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { DUTY_ACTION_OPTIONS, DutyActionType } from '@/types';
import styles from './index.module.scss';

interface DutyActionSheetProps {
  visible: boolean;
  defaultAction?: DutyActionType;
  defaultNote?: string;
  onClose: () => void;
  onConfirm: (action: DutyActionType, note: string) => void;
}

const DutyActionSheet: React.FC<DutyActionSheetProps> = ({
  visible,
  defaultAction = null,
  defaultNote = '',
  onClose,
  onConfirm
}) => {
  const [selected, setSelected] = useState<DutyActionType>(defaultAction);
  const [note, setNote] = useState(defaultNote);

  React.useEffect(() => {
    if (visible) {
      setSelected(defaultAction);
      setNote(defaultNote);
    }
  }, [visible, defaultAction, defaultNote]);

  if (!visible) return null;

  const handleConfirm = () => {
    if (!selected) {
      Taro.showToast({ title: '请选择处理方式', icon: 'none' });
      return;
    }
    if (!note.trim()) {
      Taro.showToast({ title: '请填写判断备注', icon: 'none' });
      return;
    }
    console.log('[DutyActionSheet] 值班确认:', { action: selected, note });
    onConfirm(selected, note.trim());
  };

  return (
    <View className={styles.mask} onClick={onClose}>
      <View className={styles.sheet} onClick={e => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>值班确认</Text>
          <View className={styles.closeBtn} onClick={onClose}>
            <Text className={styles.closeText}>✕</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择处理方式</Text>
          <View className={styles.options}>
            {DUTY_ACTION_OPTIONS.map(opt => (
              <View
                key={opt.value}
                className={classnames(
                  styles.optionCard,
                  selected === opt.value && styles.optionSelected
                )}
                style={selected === opt.value ? { borderColor: opt.color } : {}}
                onClick={() => setSelected(opt.value)}
              >
                <View
                  className={styles.optionRadio}
                  style={selected === opt.value ? { background: opt.color, borderColor: opt.color } : {}}
                >
                  {selected === opt.value && <Text className={styles.radioCheck}>✓</Text>}
                </View>
                <View className={styles.optionInfo}>
                  <Text className={styles.optionLabel} style={selected === opt.value ? { color: opt.color } : {}}>
                    {opt.label}
                  </Text>
                  <Text className={styles.optionDesc}>{opt.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>备注判断</Text>
            <Text className={styles.noteCount}>{note.length}/100</Text>
          </View>
          <View className={styles.textareaWrap}>
            <Textarea
              className={styles.textarea}
              value={note}
              maxLength={100}
              placeholder="请填写一句话判断，例如：紧急联系运维组排查登录服务异常"
              placeholderClass={styles.textareaPlaceholder}
              onInput={e => setNote(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={onClose}>
            取消
          </Button>
          <Button className={styles.confirmBtn} onClick={handleConfirm}>
            确认处理
          </Button>
        </View>
      </View>
    </View>
  );
};

export default DutyActionSheet;
