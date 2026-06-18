import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface FilterOption {
  value: string;
  label: string;
  badge?: number | string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ options, activeValue, onChange }) => {
  return (
    <View className={styles.container}>
      <ScrollView scrollX enhanced showScrollbar={false} className={styles.scroll}>
        <View className={styles.inner}>
          {options.map(opt => (
            <View
              key={opt.value}
              className={classnames(
                styles.item,
                activeValue === opt.value && styles.active
              )}
              onClick={() => onChange(opt.value)}
            >
              <Text className={styles.label}>{opt.label}</Text>
              {opt.badge !== undefined && (
                <View
                  className={classnames(
                    styles.badge,
                    activeValue === opt.value && styles.badgeActive
                  )}
                >
                  <Text className={styles.badgeText}>{opt.badge}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterBar;
