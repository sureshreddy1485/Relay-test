import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';

export default function SecurityScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [securityData, setSecurityData] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuthStore();

  const fetchSecurityStatus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/security-status');
      setSecurityData(data.security);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch security status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStatus();
  }, []);

  const handleRegenerate = async () => {
    if (!securityData?.recoveryCodes?.canRegenerate) return;
    
    Alert.alert(
      'Regenerate Recovery Codes',
      'This will invalidate your current recovery codes and generate a new set of 9 codes. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Regenerate', 
          style: 'destructive',
          onPress: async () => {
            try {
              setRegenerating(true);
              const { data } = await api.post('/auth/regenerate-recovery-codes');
              Alert.alert('Success', 'Recovery codes regenerated. Make sure to save them safely.', [
                { text: 'OK', onPress: () => fetchSecurityStatus() }
              ]);
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to regenerate codes');
            } finally {
              setRegenerating(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const { recoveryCodes, passwordChanges } = securityData || {};
  const progressCodes = recoveryCodes ? recoveryCodes.remaining / recoveryCodes.total : 1;
  const progressPass = passwordChanges ? passwordChanges.remaining / passwordChanges.limit : 1;
  
  // Calculate days since generated
  let daysSinceGen = 0;
  if (recoveryCodes?.generatedAt) {
    daysSinceGen = Math.floor((Date.now() - new Date(recoveryCodes.generatedAt).getTime()) / (1000 * 60 * 60 * 24));
  }
  const daysLeftToRegen = Math.max(0, 30 - daysSinceGen);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Security</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchSecurityStatus}>
          <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Recovery Codes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
            </View>
            <Text style={styles.cardTitle}>Recovery Codes</Text>
          </View>
          
          <View style={styles.statsRow}>
            <Text style={styles.bigStat}>{recoveryCodes?.remaining}</Text>
            <Text style={styles.smallStat}> of {recoveryCodes?.total} remaining</Text>
          </View>
          <Text style={styles.subStat}>{recoveryCodes?.used} codes used · {recoveryCodes?.remaining} remaining</Text>
          
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressCodes * 100}%`, backgroundColor: '#10B981' }]} />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={16} color={Colors.dark.muted} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              {recoveryCodes?.canRegenerate 
                ? 'New recovery codes are available to generate' 
                : `New recovery codes available in ${daysLeftToRegen} days`}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.actionBtn, !recoveryCodes?.canRegenerate && styles.actionBtnDisabled]}
            disabled={!recoveryCodes?.canRegenerate || regenerating}
            onPress={handleRegenerate}
          >
            {regenerating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="key-outline" size={18} color={recoveryCodes?.canRegenerate ? "#FFF" : Colors.dark.muted} style={{ marginRight: 8 }} />
                <Text style={[styles.actionBtnText, !recoveryCodes?.canRegenerate && { color: Colors.dark.muted }]}>Generate new recovery codes</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.cardFooterText}>
            Regeneration is available when all 9 codes are used or the set is 30+ days old.
          </Text>
        </View>

        {/* Security Changes Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: '#06B6D420' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#06B6D4" />
            </View>
            <Text style={styles.cardTitle}>Security Changes</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={[styles.bigStat, { color: '#06B6D4' }]}>{passwordChanges?.remaining}</Text>
            <Text style={styles.smallStat}> of {passwordChanges?.limit} remaining</Text>
          </View>
          
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPass * 100}%`, backgroundColor: '#06B6D4' }]} />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.dark.muted} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              {passwordChanges?.recentCount === 0 
                ? 'No security changes made in the last 30 days.'
                : `${passwordChanges?.recentCount} security changes made in the last 30 days.`}
            </Text>
          </View>

          <Text style={styles.listHeader}>The following count toward your limit:</Text>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Password changes</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bullet} />
            <Text style={styles.listText}>Password resets using recovery codes</Text>
          </View>
        </View>

        {/* Change Password Nav */}
        <TouchableOpacity 
          style={styles.bottomRow}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.iconWrap, { backgroundColor: '#8B5CF620', marginRight: 16 }]}>
            <Ionicons name="lock-closed-outline" size={20} color="#8B5CF6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bottomRowTitle}>Change Password</Text>
            <Text style={styles.bottomRowSub}>{passwordChanges?.remaining} changes remaining</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.dark.muted} />
        </TouchableOpacity>

      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="key-outline" size={28} color="#06B6D4" />
            </View>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalSubtitle}>Do you remember your old password?</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: '#10B981', borderWidth: 1 }]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('ChangePassword');
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.modalOptionTitle, { color: '#FFF' }]}>Yes, I Remember</Text>
                <Text style={styles.modalOptionSub}>Change password using current password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, { borderColor: '#3B82F6', borderWidth: 1 }]}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('ResetWithRecoveryKey');
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={22} color="#3B82F6" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.modalOptionTitle, { color: '#FFF' }]}>No, I Forgot</Text>
                <Text style={styles.modalOptionSub}>Reset password using Recovery Key code</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginRight: -4, 
  },
  refreshBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  bigStat: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  smallStat: {
    fontSize: 16,
    color: Colors.dark.muted,
    fontWeight: '600',
    marginLeft: 4,
  },
  subStat: {
    color: Colors.dark.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    color: Colors.dark.muted,
    fontSize: 13,
    flex: 1,
  },
  actionBtn: {
    backgroundColor: Colors.primary + '30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionBtnDisabled: {
    backgroundColor: Colors.dark.border,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardFooterText: {
    color: Colors.dark.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  listHeader: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.muted,
    marginRight: 8,
    marginLeft: 4,
  },
  listText: {
    color: Colors.dark.muted,
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 24,
  },
  bottomRowTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bottomRowSub: {
    color: Colors.dark.muted,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#06B6D420',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: Colors.dark.muted,
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalOptionSub: {
    fontSize: 12,
    color: Colors.dark.muted,
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.dark.muted,
    fontSize: 16,
    fontWeight: '600',
  }
});
