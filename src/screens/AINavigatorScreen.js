import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, cardStyle, labelStyle } from '../utils/theme';

const ROUTES = {
  calc: { reply: 'Routing to OmniCalc module. Calculation grid ready.', tab: 'Calc' },
  calculator: { reply: 'OmniCalc online — handles +, -, *, /, %, √, x².', tab: 'Calc' },
  math: { reply: 'OmniCalc module engaged.', tab: 'Calc' },
  compass: { reply: 'Tactical Compass engaged. GPS + direction array loading.', tab: 'Compass' },
  gps: { reply: 'Routing to GPS Telemetry in Compass module.', tab: 'Compass' },
  location: { reply: 'Live coordinates in Compass module. Switching.', tab: 'Compass' },
  alarm: { reply: 'Scheduler opened. Set IST mission time and save plan.', tab: 'Sched' },
  schedule: { reply: 'Mission Planner online. Input task + time (IST).', tab: 'Sched' },
  calendar: { reply: 'IST Calendar loaded. Plan your missions.', tab: 'Sched' },
  sos: { reply: '⚠ Emergency SOS Guide is in Tactical Compass. Routing now.', tab: 'Compass' },
  emergency: { reply: '⚠ EMERGENCY — Routing to SOS coordination panel NOW.', tab: 'Compass' },
  help: { reply: 'NEXUS OS: [1] AI Navigator [2] Scheduler [3] OmniCalc [4] Compass+SOS', tab: null },
};

const CHIPS = [
  { label: '🧮 OmniCalc', kw: 'calc' },
  { label: '🧭 Compass', kw: 'compass' },
  { label: '⏰ Alarm', kw: 'alarm' },
  { label: '📍 GPS', kw: 'gps' },
  { label: '🆘 Emergency', kw: 'sos' },
  { label: '🔍 Help', kw: 'help' },
];

export default function AINavigatorScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: '0', text: 'Hello Commander. Type a keyword to navigate: calc, compass, alarm, gps, sos, help', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const processInput = (raw) => {
    const lower = raw.toLowerCase();
    let matched = null;
    for (const [kw, val] of Object.entries(ROUTES)) {
      if (lower.includes(kw)) { matched = val; break; }
    }
    setMessages(prev => [...prev, { id: Date.now().toString(), text: raw, sender: 'user' }]);
    setTimeout(() => {
      const reply = matched ? matched.reply : "Try: 'calc', 'compass', 'alarm', 'gps', 'sos', or 'help'";
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: reply, sender: 'bot' }]);
      if (matched?.tab) setTimeout(() => navigation.navigate(matched.tab), 700);
    }, 350);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    processInput(input.trim());
    setInput('');
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={cardStyle}>
        <Text style={labelStyle}>◈ AI NAVIGATOR — TOOL FINDER</Text>
        <ScrollView style={styles.chatArea} ref={scrollRef} nestedScrollEnabled>
          {messages.map(m => (
            <View key={m.id} style={[styles.msgWrap, m.sender === 'user' ? styles.right : styles.left]}>
              <Text style={styles.sender}>{m.sender === 'bot' ? 'NEXUS AI' : 'YOU'}</Text>
              <View style={[styles.bubble, m.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, m.sender === 'user' && { color: COLORS.neon }]}>{m.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} value={input} onChangeText={setInput}
            placeholder="Type command..." placeholderTextColor={COLORS.text3} onSubmitEditing={handleSend} returnKeyType="send" />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={cardStyle}>
        <Text style={labelStyle}>◈ QUICK ACCESS CHIPS</Text>
        <View style={styles.chipGrid}>
          {CHIPS.map(c => (
            <TouchableOpacity key={c.kw} style={styles.chip} onPress={() => processInput(c.kw)}>
              <Text style={styles.chipText}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 12, paddingBottom: 20 },
  chatArea: { height: 220, marginBottom: 10 },
  msgWrap: { marginBottom: 8 },
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  sender: { color: COLORS.text3, fontSize: 8, fontFamily: 'monospace', marginBottom: 2 },
  bubble: { maxWidth: '85%', padding: 8, borderRadius: 8, borderWidth: 1 },
  bubbleBot: { backgroundColor: COLORS.surface2, borderColor: COLORS.neonBorder },
  bubbleUser: { backgroundColor: COLORS.neonDim, borderColor: COLORS.neonBorder },
  bubbleText: { color: COLORS.text, fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.neonBorder, color: COLORS.text, fontFamily: 'monospace', fontSize: 13, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
  sendBtn: { backgroundColor: COLORS.neonDim, borderWidth: 1, borderColor: COLORS.neonBorder, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'center' },
  sendText: { color: COLORS.neon, fontFamily: 'monospace', fontSize: 10, letterSpacing: 1 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.neonBorder, borderRadius: 14, paddingVertical: 5, paddingHorizontal: 10 },
  chipText: { color: COLORS.neon, fontFamily: 'monospace', fontSize: 10 },
});