import { Tabs, TabList, TabTrigger, TabSlot, TabListProps } from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from './themed-text';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="dashboard" href="/(tabs)/dashboard" asChild>
            <TabButton IconComponent={Ionicons} iconName="home" label="Home" />
          </TabTrigger>
          <TabTrigger name="search" href="/(tabs)/search" asChild>
            <TabButton IconComponent={Feather} iconName="search" label="Explore" />
          </TabTrigger>
          
          <TabTrigger name="add" href="/(tabs)/add" asChild>
            <TabButton IconComponent={Feather} iconName="plus" isCenter />
          </TabTrigger>
          
          <TabTrigger name="add-client" href="/(tabs)/add-client" asChild>
            <TabButton IconComponent={Feather} iconName="bell" label="Inbox" />
          </TabTrigger>
          <TabTrigger name="profile" href="/(tabs)/profile" asChild>
            <TabButton IconComponent={Feather} iconName="user" label="Profile" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ IconComponent, iconName, label, isCenter, isFocused, ...props }: any) {
  const color = isFocused ? '#1a1a1a' : '#8e8e93';
  
  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButtonWrapper, pressed && styles.pressed]}>
      {isCenter ? (
        <View style={styles.fabWrapper}>
          <View style={[styles.fabBtn, isFocused && { backgroundColor: '#5a4bd1' }]}>
            <IconComponent name={iconName} size={22} color="#FFFFFF" />
          </View>
        </View>
      ) : (
        <View style={styles.navItem}>
          <IconComponent name={iconName} size={20} color={color} />
          {label && (
            <ThemedText style={{ color: color, fontSize: 11, fontWeight: '500', marginTop: 4 }}>
              {label}
            </ThemedText>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View style={styles.bottomNav}>
      <View style={styles.navBgWrapper}>
        <Svg 
          viewBox="0 0 375 70" 
          preserveAspectRatio="none" 
          style={styles.svgBackground}
        >
          <Path 
            d="M0,20 Q0,0 20,0 L135,0 Q155,0 162,18 A35,35 0 0,0 213,18 Q220,0 240,0 L355,0 Q375,0 375,20 L375,70 L0,70 Z" 
            fill="#ffffff" 
          />
        </Svg>
      </View>
      <View style={styles.navContent}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 75,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 10,
  },
  navBgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  svgBackground: {
    width: '100%',
    height: '100%',
  },
  navContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabButtonWrapper: {
    flex: 1,
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
    zIndex: 10,
  },
  fabBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 8,
  },
});
