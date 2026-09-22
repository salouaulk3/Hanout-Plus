declare module 'expo-router' {
  export const useRouter: () => any;
  export const usePathname: () => string;
  export const useSegments: () => string[];
  export const Stack: any;
  export const Tabs: any;
  export const Link: any;
  export const DarkTheme: any;
  export const DefaultTheme: any;
  export const ThemeProvider: any;
  export type Href = any;
}

declare module 'expo-router/unstable-native-tabs' {
  export const NativeTabs: any;
}

declare module 'expo-router/ui' {
  export const Tabs: any;
  export const TabList: any;
  export const TabTrigger: any;
  export const TabSlot: any;
  export type TabListProps = any;
}
