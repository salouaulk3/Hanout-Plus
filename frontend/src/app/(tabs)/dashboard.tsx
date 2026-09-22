import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/auth-context';
import {
  DashboardData,
  ActivityItem,
  ClientItem,
  fetchDashboardData,
  formatCurrency,
  formatTimeAgo,
} from '@/services/dashboard';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'paiement' | 'credit'>('all');

  const loadData = useCallback(async () => {
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // Filtrage des activités
  const filteredActivities = (dashboardData?.recentActivities || []).filter((item) => {
    if (activityFilter === 'all') return true;
    return item.type === activityFilter;
  });

  // Date du jour formatée
  const todayFormatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  // Nom d'affichage
  const displayName = user?.name || user?.email?.split('@')[0] || 'Commerçant';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#054687']}
            tintColor="#054687"
          />
        }
      >
        {/* ================= HEADER / MESSAGE D'ACCUEIL ================= */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>HANOT+</Text>
              </View>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusPillText}>Boutique Ouverte</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.refreshButton, pressed && styles.buttonPressed]}
              onPress={onRefresh}
              accessibilityLabel="Rafraîchir"
            >
              <Feather name="rotate-cw" size={18} color="#054687" />
            </Pressable>
          </View>

          <View style={styles.welcomeBanner}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>

            <View style={styles.welcomeTextGroup}>
              <Text style={styles.dateLabel}>{todayFormatted}</Text>
              <Text style={styles.greetingTitle}>
                Bonjour, <Text style={styles.highlightName}>{displayName}</Text> 👋
              </Text>
              <Text style={styles.greetingSubtitle}>
                Voici le récapitulatif de votre commerce aujourd'hui
              </Text>
            </View>
          </View>
        </View>

        {loading && !dashboardData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#054687" />
            <Text style={styles.loadingText}>Chargement des statistiques...</Text>
          </View>
        ) : (
          <>
            {/* ================= STATISTIQUES (KPIS) ================= */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Statistiques Clés</Text>
              <Text style={styles.sectionSubtitle}>Performance en temps réel</Text>
            </View>

            <View style={styles.statsGrid}>
              {/* Carte 1: Nombre de clients */}
              <View style={[styles.statCard, styles.clientCardBorder]}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="people" size={22} color="#054687" />
                  </View>
                  <View style={[styles.trendBadge, { backgroundColor: '#DBEAFE' }]}>
                    <Feather name="arrow-up-right" size={12} color="#1D4ED8" />
                    <Text style={[styles.trendText, { color: '#1D4ED8' }]}>Actifs</Text>
                  </View>
                </View>
                <Text style={styles.statNumber}>
                  {dashboardData?.stats.totalClients || 0}
                </Text>
                <Text style={styles.statLabel}>Nombre de Clients</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerNote}>Portefeuille clients fidèle</Text>
                </View>
              </View>

              {/* Carte 2: Total Paiement */}
              <View style={[styles.statCard, styles.paymentCardBorder]}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
                    <Ionicons name="cash" size={22} color="#10B981" />
                  </View>
                  <View style={[styles.trendBadge, { backgroundColor: '#D1FAE5' }]}>
                    <Feather name="check-circle" size={12} color="#047857" />
                    <Text style={[styles.trendText, { color: '#047857' }]}>Reçu</Text>
                  </View>
                </View>
                <Text style={[styles.statNumber, { color: '#047857' }]}>
                  {formatCurrency(dashboardData?.stats.totalPaid || 0)}
                </Text>
                <Text style={styles.statLabel}>Total Paiements</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerNote}>Encaissements cumulés</Text>
                </View>
              </View>

              {/* Carte 3: Total Crédit */}
              <View style={[styles.statCard, styles.creditCardBorder]}>
                <View style={styles.statCardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: '#FFFBEB' }]}>
                    <Ionicons name="card" size={22} color="#F59E0B" />
                  </View>
                  <View style={[styles.trendBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Feather name="clock" size={12} color="#B45309" />
                    <Text style={[styles.trendText, { color: '#B45309' }]}>Dettes</Text>
                  </View>
                </View>
                <Text style={[styles.statNumber, { color: '#B45309' }]}>
                  {formatCurrency(dashboardData?.stats.totalCredit || 0)}
                </Text>
                <Text style={styles.statLabel}>Total Crédit en Cours</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerNote}>Montant total à recouvrer</Text>
                </View>
              </View>
            </View>

            {/* ================= ACTIONS RAPIDES ================= */}
            <View style={styles.quickActionsContainer}>
              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                onPress={() => router.push('/(tabs)/add')}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: '#E0E7FF' }]}>
                  <Feather name="plus-circle" size={18} color="#4338CA" />
                </View>
                <Text style={styles.actionButtonText}>+ Paiement</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
                onPress={() => router.push('/(tabs)/add')}
              >
                <View style={[styles.actionIconWrapper, { backgroundColor: '#FEF3C7' }]}>
                  <Feather name="file-text" size={18} color="#B45309" />
                </View>
                <Text style={styles.actionButtonText}>+ Crédit</Text>
              </Pressable>
            </View>

            {/* ================= DERNIÈRES ACTIVITÉS ================= */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Dernières Activités</Text>
                <Text style={styles.sectionSubtitle}>Historique récent des mouvements</Text>
              </View>
            </View>

            {/* Filtres d'activités */}
            <View style={styles.filterPillsRow}>
              <Pressable
                style={[styles.filterPill, activityFilter === 'all' && styles.filterPillActive]}
                onPress={() => setActivityFilter('all')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activityFilter === 'all' && styles.filterPillTextActive,
                  ]}
                >
                  Tous
                </Text>
              </Pressable>

              <Pressable
                style={[styles.filterPill, activityFilter === 'paiement' && styles.filterPillActive]}
                onPress={() => setActivityFilter('paiement')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activityFilter === 'paiement' && styles.filterPillTextActive,
                  ]}
                >
                  Paiements
                </Text>
              </Pressable>

              <Pressable
                style={[styles.filterPill, activityFilter === 'credit' && styles.filterPillActive]}
                onPress={() => setActivityFilter('credit')}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    activityFilter === 'credit' && styles.filterPillTextActive,
                  ]}
                >
                  Crédits
                </Text>
              </Pressable>
            </View>

            {/* Liste des activités */}
            <View style={styles.activitiesList}>
              {filteredActivities.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>Aucune activité pour ce filtre</Text>
                </View>
              ) : (
                filteredActivities.map((activity) => {
                  const isPayment = activity.type === 'paiement';
                  const isCredit = activity.type === 'credit';

                  return (
                    <View key={activity.id} style={styles.activityItem}>
                      <View
                        style={[
                          styles.activityIconCircle,
                          isPayment && { backgroundColor: '#ECFDF5' },
                          isCredit && { backgroundColor: '#FFFBEB' },
                          !isPayment && !isCredit && { backgroundColor: '#EFF6FF' },
                        ]}
                      >
                        {isPayment ? (
                          <Feather name="arrow-down-left" size={18} color="#10B981" />
                        ) : isCredit ? (
                          <Feather name="arrow-up-right" size={18} color="#F59E0B" />
                        ) : (
                          <Feather name="user-plus" size={18} color="#054687" />
                        )}
                      </View>

                      <View style={styles.activityDetails}>
                        <Text style={styles.activityClientName} numberOfLines={1}>
                          {activity.client_name}
                        </Text>
                        <Text style={styles.activityDescription} numberOfLines={1}>
                          {activity.description || (isPayment ? 'Paiement reçu' : 'Crédit accordé')}
                        </Text>
                        <Text style={styles.activityTime}>{formatTimeAgo(activity.created_at)}</Text>
                      </View>

                      <View style={styles.activityAmountContainer}>
                        {activity.amount > 0 ? (
                          <Text
                            style={[
                              styles.activityAmount,
                              isPayment ? styles.amountPositive : styles.amountNegative,
                            ]}
                          >
                            {isPayment ? '+' : '-'} {formatCurrency(activity.amount)}
                          </Text>
                        ) : (
                          <Text style={styles.activityBadgeNew}>Nouveau</Text>
                        )}
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* ================= DERNIERS CLIENTS ================= */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Derniers Clients</Text>
                <Text style={styles.sectionSubtitle}>Clients récemment enregistrés</Text>
              </View>
            </View>

            <View style={styles.clientsList}>
              {(dashboardData?.recentClients || []).map((client) => {
                const clientInitial = client.name.charAt(0).toUpperCase();
                const hasCredit = client.credit > 0;

                return (
                  <View key={client.id} style={styles.clientCard}>
                    <View style={styles.clientAvatar}>
                      <Text style={styles.clientAvatarText}>{clientInitial}</Text>
                    </View>

                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName} numberOfLines={1}>
                        {client.name}
                      </Text>
                      <View style={styles.clientContactRow}>
                        <Feather name="phone" size={12} color="#6B7280" />
                        <Text style={styles.clientPhone}>{client.phone || 'Non renseigné'}</Text>
                      </View>
                    </View>

                    <View style={styles.clientBalanceContainer}>
                      {hasCredit ? (
                        <View style={styles.creditDueBadge}>
                          <Text style={styles.creditDueLabel}>Crédit :</Text>
                          <Text style={styles.creditDueAmount}>{formatCurrency(client.credit)}</Text>
                        </View>
                      ) : (
                        <View style={styles.settledBadge}>
                          <Feather name="check" size={12} color="#047857" />
                          <Text style={styles.settledText}>À jour</Text>
                        </View>
                      )}

                      {client.phone ? (
                        <Pressable
                          style={styles.callActionButton}
                          onPress={() => Linking.openURL(`tel:${client.phone}`)}
                          accessibilityLabel="Appeler le client"
                        >
                          <Feather name="phone-call" size={14} color="#054687" />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Espacement de sécurité pour la barre de navigation du bas */}
            <View style={{ height: 90 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Header styles
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    backgroundColor: '#054687',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  logoBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  statusPillText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600',
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#054687',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#054687',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  welcomeTextGroup: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
    marginBottom: 2,
    fontWeight: '500',
  },
  greetingTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
  },
  highlightName: {
    color: '#054687',
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  // Loading
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
  },

  // Section headers
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: '#054687',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    gap: 14,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  clientCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#054687',
  },
  paymentCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  creditCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerNote: {
    fontSize: 11,
    color: '#94A3B8',
  },

  // Quick actions
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 6,
  },
  actionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Filter Pills
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#054687',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Activities List
  activitiesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityClientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  activityAmountContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountPositive: {
    color: '#10B981',
  },
  amountNegative: {
    color: '#F59E0B',
  },
  activityBadgeNew: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  emptyState: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94A3B8',
  },

  // Clients List
  clientsList: {
    gap: 10,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  clientAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#054687',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  clientContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  clientPhone: {
    fontSize: 12,
    color: '#64748B',
  },
  clientBalanceContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  creditDueBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  creditDueLabel: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  creditDueAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  settledText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  callActionButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
