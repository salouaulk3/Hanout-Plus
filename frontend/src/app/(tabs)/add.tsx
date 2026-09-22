import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import {
  ClientItem,
  fetchClients,
  createTransaction,
  formatCurrency,
} from '@/services/dashboard';

export default function AddTransactionScreen() {
  const router = useRouter();

  const [type, setType] = useState<'credit' | 'paiement'>('paiement');
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [customClientName, setCustomClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchClients();
        setClients(list);
        if (list.length > 0) {
          setSelectedClientId(list[0].id);
        }
      } catch (err) {
        console.error('Erreur chargement clients:', err);
      } finally {
        setFetchingClients(false);
      }
    }
    load();
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const numAmount = parseFloat(amount.replace(/\s/g, '')) || 0;

  // Calcul du solde prévisionnel
  const currentCredit = selectedClient ? selectedClient.credit : 0;
  const projectedCredit =
    type === 'paiement' ? Math.max(0, currentCredit - numAmount) : currentCredit + numAmount;

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const quickDescriptions =
    type === 'paiement'
      ? ['Règlement partiel en espèces', 'Versement dette', 'Solde de tout compte']
      : ['Achat alimentation générale', 'Pain & Produits laitiers', 'Boissons & Snacks', 'Marchandises diverses'];

  const handleSubmit = async () => {
    const clientName = selectedClient ? selectedClient.name : customClientName.trim();

    if (!clientName) {
      if (Platform.OS === 'web') {
        window.alert('Veuillez sélectionner ou saisir un nom de client.');
      } else {
        Alert.alert('Attention', 'Veuillez sélectionner ou saisir un nom de client.');
      }
      return;
    }

    if (numAmount <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Veuillez saisir un montant supérieur à 0 DA.');
      } else {
        Alert.alert('Attention', 'Veuillez saisir un montant supérieur à 0 DA.');
      }
      return;
    }

    setLoading(true);
    try {
      const res = await createTransaction({
        client_id: selectedClient ? selectedClient.id : undefined,
        client_name: clientName,
        type,
        amount: numAmount,
        description: description.trim() || (type === 'paiement' ? 'Paiement en caisse' : 'Vente à crédit'),
      });

      if (res.success) {
        setSuccessMessage(
          `Mouvement de ${formatCurrency(numAmount)} enregistré pour ${clientName} !`
        );
        setTimeout(() => {
          setSuccessMessage(null);
          setAmount('');
          setDescription('');
          router.replace('/(tabs)/dashboard');
        }, 1200);
      }
    } catch (error) {
      console.error('Erreur création transaction:', error);
      if (Platform.OS === 'web') {
        window.alert('Une erreur est survenue lors de l’enregistrement.');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de l’enregistrement.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nouveau Mouvement</Text>
        <Text style={styles.headerSubtitle}>Enregistrez un paiement ou une dette client</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {successMessage && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#047857" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {/* Sélecteur de type : Paiement ou Crédit */}
        <View style={styles.typeSelectorContainer}>
          <Pressable
            style={[
              styles.typeTab,
              type === 'paiement' && styles.typeTabActivePayment,
            ]}
            onPress={() => setType('paiement')}
          >
            <Feather
              name="arrow-down-left"
              size={18}
              color={type === 'paiement' ? '#FFFFFF' : '#10B981'}
            />
            <Text
              style={[
                styles.typeTabText,
                type === 'paiement' && styles.typeTabTextActive,
              ]}
            >
              💵 Paiement Reçu
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeTab,
              type === 'credit' && styles.typeTabActiveCredit,
            ]}
            onPress={() => setType('credit')}
          >
            <Feather
              name="arrow-up-right"
              size={18}
              color={type === 'credit' ? '#FFFFFF' : '#F59E0B'}
            />
            <Text
              style={[
                styles.typeTabText,
                type === 'credit' && styles.typeTabTextActive,
              ]}
            >
              💳 Vente à Crédit
            </Text>
          </Pressable>
        </View>

        {/* Choix du Client */}
        <View style={styles.cardSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.fieldLabel}>Client concerné</Text>
          </View>

          {fetchingClients ? (
            <ActivityIndicator size="small" color="#054687" style={{ paddingVertical: 12 }} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clientChipsList}>
              {clients.map((c) => {
                const isSelected = selectedClientId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.clientChip, isSelected && styles.clientChipSelected]}
                    onPress={() => {
                      setSelectedClientId(c.id);
                      setCustomClientName('');
                    }}
                  >
                    <Text style={[styles.clientChipName, isSelected && styles.clientChipNameSelected]}>
                      {c.name}
                    </Text>
                    {c.credit > 0 ? (
                      <Text style={[styles.clientChipCredit, isSelected && styles.clientChipCreditSelected]}>
                        Dette: {formatCurrency(c.credit)}
                      </Text>
                    ) : (
                      <Text style={[styles.clientChipClean, isSelected && styles.clientChipCleanSelected]}>
                        À jour
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* Saisie libre si client occasionnel */}
          <View style={styles.inputWrapper}>
            <Feather name="user" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Ou saisir le nom d'un autre client..."
              placeholderTextColor="#94A3B8"
              value={customClientName}
              onChangeText={(text) => {
                setCustomClientName(text);
                if (text) setSelectedClientId(null);
              }}
            />
          </View>
        </View>

        {/* Montant */}
        <View style={styles.cardSection}>
          <Text style={styles.fieldLabel}>Montant de l'opération (DA)</Text>
          <View style={styles.amountInputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#CBD5E1"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.currencyBadge}>DA</Text>
          </View>

          {/* Raccourcis rapides de montant */}
          <View style={styles.quickAmountsRow}>
            {quickAmounts.map((val) => (
              <Pressable
                key={val}
                style={styles.quickAmountBtn}
                onPress={() => setAmount(val.toString())}
              >
                <Text style={styles.quickAmountText}>+{val}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Motif / Description */}
        <View style={styles.cardSection}>
          <Text style={styles.fieldLabel}>Motif / Description</Text>
          <View style={styles.inputWrapper}>
            <Feather name="file-text" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Achat épicerie, solde dette..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.quickTagsRow}>
            {quickDescriptions.map((desc) => (
              <Pressable
                key={desc}
                style={styles.quickTag}
                onPress={() => setDescription(desc)}
              >
                <Text style={styles.quickTagText}>{desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Calculateur de Solde Futur */}
        {selectedClient && numAmount > 0 && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="calculator-outline" size={18} color="#054687" />
              <Text style={styles.previewTitle}>Impact sur le solde de {selectedClient.name}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewCol}>
                <Text style={styles.previewSub}>Dette Actuelle</Text>
                <Text style={styles.previewValOld}>{formatCurrency(currentCredit)}</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#94A3B8" />
              <View style={styles.previewCol}>
                <Text style={styles.previewSub}>Nouveau Solde</Text>
                <Text style={[styles.previewValNew, projectedCredit === 0 && { color: '#047857' }]}>
                  {formatCurrency(projectedCredit)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Bouton de confirmation */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            type === 'paiement' ? styles.submitBtnPayment : styles.submitBtnCredit,
            (pressed || loading) && { opacity: 0.8 },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather
                name={type === 'paiement' ? 'check-circle' : 'plus-circle'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.submitButtonText}>
                {type === 'paiement' ? 'Encaisser le Paiement' : 'Enregistrer le Crédit'}
              </Text>
            </>
          )}
        </Pressable>

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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 14,
  },
  successText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 4,
    gap: 6,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  typeTabActivePayment: {
    backgroundColor: '#059669',
  },
  typeTabActiveCredit: {
    backgroundColor: '#D97706',
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  typeTabTextActive: {
    color: '#FFFFFF',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  linkNewClient: {
    fontSize: 13,
    fontWeight: '700',
    color: '#054687',
  },
  clientChipsList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  clientChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  clientChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#054687',
  },
  clientChipName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  clientChipNameSelected: {
    color: '#054687',
  },
  clientChipCredit: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    marginTop: 2,
  },
  clientChipCreditSelected: {
    color: '#B45309',
  },
  clientChipClean: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginTop: 2,
  },
  clientChipCleanSelected: {
    color: '#047857',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    outlineStyle: 'none' as any,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    height: 64,
  },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    outlineStyle: 'none' as any,
  },
  currencyBadge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#64748B',
    paddingHorizontal: 8,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#054687',
  },
  quickTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  quickTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickTagText: {
    fontSize: 12,
    color: '#475569',
  },
  previewCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#054687',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewCol: {
    alignItems: 'center',
  },
  previewSub: {
    fontSize: 11,
    color: '#64748B',
  },
  previewValOld: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  previewValNew: {
    fontSize: 18,
    fontWeight: '900',
    color: '#054687',
    marginTop: 2,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 56,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 8,
  },
  submitBtnPayment: {
    backgroundColor: '#059669',
  },
  submitBtnCredit: {
    backgroundColor: '#D97706',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
