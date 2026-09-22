import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [whatsappReminders, setWhatsappReminders] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const displayName = user?.name || 'Sami Commerçant';
  const displayEmail = user?.email || 'admin@gmail.com';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    const doLogout = () => {
      logout();
      router.replace('/login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        doLogout();
      }
    } else {
      Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  const handleExportData = () => {
    const msg = 'Données de la boutique exportées au format CSV avec succès.';
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert('Exportation', msg);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil & Paramètres</Text>
        <Text style={styles.headerSubtitle}>Gérez votre compte commerçant et votre boutique</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte Identité Commerçant */}
        <View style={styles.merchantCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.merchantDetails}>
            <Text style={styles.merchantName}>{displayName}</Text>
            <Text style={styles.merchantEmail}>{displayEmail}</Text>
            <View style={styles.proBadge}>
              <Ionicons name="sparkles" size={13} color="#B45309" />
              <Text style={styles.proBadgeText}>Abonnement Pro • Illimité</Text>
            </View>
          </View>
        </View>

        {/* Informations Boutique */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Ma Boutique</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="shopping-bag" size={18} color="#054687" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nom du commerce</Text>
              <Text style={styles.infoValue}>Épicerie & Alimentation HANOT+</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="map-pin" size={18} color="#054687" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Emplacement</Text>
              <Text style={styles.infoValue}>Alger, Algérie</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="dollar-sign" size={18} color="#054687" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Devise par défaut</Text>
              <Text style={styles.infoValue}>Dinar Algérien (DA)</Text>
            </View>
          </View>
        </View>

        {/* Paramètres & Préférences */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Préférences de Gestion</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextGroup}>
              <Text style={styles.toggleTitle}>Rappels automatiques WhatsApp</Text>
              <Text style={styles.toggleDesc}>
                Préremplir le message de rappel avec le solde exact
              </Text>
            </View>
            <Switch
              value={whatsappReminders}
              onValueChange={setWhatsappReminders}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={whatsappReminders ? '#054687' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextGroup}>
              <Text style={styles.toggleTitle}>Mode Hors-Ligne & Secours</Text>
              <Text style={styles.toggleDesc}>
                Sauvegarde continue des transactions en local
              </Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={offlineMode ? '#054687' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextGroup}>
              <Text style={styles.toggleTitle}>Sons de caisse & bips</Text>
              <Text style={styles.toggleDesc}>Son de confirmation après encaissement</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
              thumbColor={soundEffects ? '#054687' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Outils & Données */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Outils Commerçant</Text>

          <Pressable style={styles.menuRow} onPress={handleExportData}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconCircle, { backgroundColor: '#ECFDF5' }]}>
                <Feather name="download" size={16} color="#059669" />
              </View>
              <Text style={styles.menuText}>Exporter la comptabilité (Excel/CSV)</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuRow}
            onPress={() => Linking.openURL('mailto:support@hanotplus.dz')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="headphones" size={16} color="#054687" />
              </View>
              <Text style={styles.menuText}>Assistance technique & Contact</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Bouton de Déconnexion */}
        <Pressable
          style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </Pressable>

        <View style={styles.versionFooter}>
          <Text style={styles.versionText}>HANOT+ v1.0.0 • Solution Numérique pour Commerçants</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  merchantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#054687',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  merchantEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  toggleDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    height: 52,
    borderRadius: 16,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionFooter: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
