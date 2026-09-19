import { useRouter } from 'expo-router';
import { StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <ThemedText style={styles.logoText}>HANOT+</ThemedText>
              <ThemedText style={styles.sloganText}>
                Solution Numérique{'\n'}pour Commerçants
              </ThemedText>
            </View>
            
            <Pressable 
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => router.replace('/login')}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#054687',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 32,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  sloganText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#054687',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
