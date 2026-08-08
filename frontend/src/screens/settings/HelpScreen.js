import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

const HelpSection = ({ id, icon, title, description, color, expandedId, setExpandedId }) => {
  const isExpanded = expandedId === id;

  const toggleExpand = () => {
    if (isExpanded) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={toggleExpand} style={[styles.sectionCard, isExpanded && styles.sectionCardExpanded]}>
      <View style={styles.sectionHeader}>
        <LinearGradient colors={[color, color + '80']} style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color="#FFF" />
        </LinearGradient>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.dark.muted} />
      </View>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionDesc}>{description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function HelpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState(null);

  const sections = [
    {
      id: 'chatting',
      icon: 'chatbubbles',
      title: '1. Chatting & Media',
      color: '#3B82F6',
      description: 'Relay offers a lightning-fast messaging experience. You can send text messages, voice notes, high-quality photos, and files instantly.\n\n• Mistakes happen! You have exactly 15 minutes to edit any text message after sending it.\n• Tap the "+" icon next to the chat bar to explore rich media options, including View Once images, Documents, and Polls.\n• Long-press any message to react with emojis or reply directly to it.'
    },
    {
      id: 'disappearing',
      icon: 'timer',
      title: '2. Disappearing Messages',
      color: '#EC4899',
      description: 'Privacy is our top priority. You have full control over how long your messages exist.\n\n• View Once Media: Send a photo or video using the "+" menu and select "View Once". It will instantly self-destruct the moment the recipient closes it.\n• Auto-Deleting Chats: Open any chat\'s settings to enable Disappearing Messages. You can set a timer (like 24 hours or 7 days) and all messages sent in that chat will automatically vanish once the time is up.'
    },
    {
      id: 'groups',
      icon: 'people',
      title: '3. Communities & Groups',
      color: '#10B981',
      description: 'Build your own community by creating a Group Chat. You can add your friends, assign admins, and share moments together.\n\n• Group Tags: Every group gets a unique Group Tag. Others can search for this tag in the Communities tab to join instantly.\n• Auto-Accept: Want a public community? Turn on "Auto-Accept Requests" in group settings, and anyone with the tag can join without waiting for admin approval.'
    },
    {
      id: 'moments',
      icon: 'aperture',
      title: '4. Moments (Stories)',
      color: '#F43F5E',
      description: 'Moments allow you to share your day with your friends. Post a photo, video, or a text update to your Moments.\n\n• Your Moments will automatically disappear after 24 hours.\n• Only your friends can view your Moments, and you can always check the viewer list to see exactly who watched them.'
    },
    {
      id: 'bots',
      icon: 'planet',
      title: '5. Meet the Bots: Mica & Mars',
      color: '#8B5CF6',
      description: 'Relay comes with two built-in AI companions that can be added to any group chat!\n\n• Mica: Your friendly, helpful, and polite AI assistant.\n• Mars: Your sarcastic, witty, and slightly rebellious AI companion.\n\nBot Commands:\n• !swap : Group admins can type this to instantly switch between Mica and Mars.\n• !help : Type this when Mica is active to get a full guide on what she can do.\n• Ask them anything! Just type their name or reply to their messages to start a conversation.'
    },
    {
      id: 'games',
      icon: 'game-controller',
      title: '6. Play Games',
      color: '#F59E0B',
      description: 'Bored? Relay brings multiplayer games directly into your group chats!\n\nJust type "!scramble" in any group chat where a bot is active. The bot will manage the game and explain all the rules. Race against your friends and climb the Global Leaderboard!'
    },
    {
      id: 'privacy',
      icon: 'shield-checkmark',
      title: '7. Privacy & Security',
      color: '#EAB308',
      description: 'You are in complete control of your data. Navigate to Settings > Privacy to fine-tune your account.\n\n• You can hide your Last Seen, Profile Picture, and Read Receipts.\n• You can silently remove friends without them being notified.\n• Need a break? You can safely deactivate your account and return whenever you are ready.'
    },
    {
      id: 'notifications',
      icon: 'notifications',
      title: '8. Smart Notifications',
      color: '#06B6D4',
      description: 'Our native background engine ensures you never miss a beat.\n\n• Even if Relay is completely closed, you will still receive notifications securely and instantly.\n• You can quick-reply to messages or mark them as read directly from your phone\'s notification panel or lock screen.'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.card} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & User Guide</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Welcome to Relay!</Text>
        <Text style={styles.subtitleText}>
          Relay is a beautiful, feature-rich messaging app designed for speed, privacy, and fun. Click on any section below to learn more.
        </Text>

        {sections.map(sec => (
          <HelpSection 
            key={sec.id}
            {...sec}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        ))}

        <View style={styles.footer}>
          <Ionicons name="heart" size={32} color="#EF4444" style={{ marginBottom: 8 }} />
          <Text style={styles.footerText}>Made with love</Text>
          <Text style={styles.versionText}>Relay Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitleText: {
    color: Colors.dark.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sectionCardExpanded: {
    borderColor: Colors.primary + '80',
    backgroundColor: Colors.dark.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  sectionDesc: {
    color: '#D4D4D8',
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    color: Colors.dark.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  versionText: {
    color: Colors.dark.muted,
    fontSize: 12,
    marginTop: 4,
  }
});
