import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { COLORS, cardStyle, labelStyle, neonBtnStyle, neonBtnTextStyle } from '../utils/theme';

const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
function pad(n) { return String(n).padStart(2,'0'); }
function getIST() {
  const now = new Date();
  return new Date(now.getTime() + (5.5*3600000) - (now.getTimezoneOffset()*60000));
}

export default function SchedulerScreen() {
  const ist = getIST();
  const [year, setYear] = useState(ist.getFullYear());
  const [month, setMonth] = useState(ist.getMonth());
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      const i = getIST();
      setClock(`${pad(i.getHours())}:${pad(i.getMinutes())}:${pad(i.getSeconds())} IST`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const todayIST = getIST();
  const todayStr = `${todayIST.getFullYear()}-${pad(todayIST.getMonth()+1)}-${pad(todayIST.getDate())}`;
  const alarmDays = alarms.map(a => a.date);

  const changeMonth = (dir) => {
    let m = month+dir, y = year;
    if (m<0){m=11;y--;} if(m>11){m=0;y++;}
    setMonth(m); setYear(y);
  };

  const savePlan = () => {
    if (!task.trim()) { Alert.alert('Error','Enter a task description.'); return; }
    if (!time) { Alert.alert('Error','Enter a time (HH:MM).'); return; }
    const dateStr = `${year}-${pad(month+1)}-${pad(todayIST.getDate())}`;
    setAlarms(prev => [...prev, { id: Date.now(), task: task.trim(), time, date: dateStr, active: alarmActive }]);
    setTask(''); setTime('');
  };

  const cells = [];
  for (let i=0;i<firstDay;i++) cells.push({ type:'empty', key:`e${i}` });
  for (let d=1;d<=daysInMonth;d++) {
    const ds = `${year}-${pad(month+1)}-${pad(d)}`;
    cells.push({ type:'day', d, ds, isToday: ds===todayStr, hasEvent: alarmDays.includes(ds), key:`d${d}` });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.clockBar}>
        <Text style={styles.clockText}>⏱ {clock}</Text>
        <Text style={styles.clockSub}>INDIAN STANDARD TIME GMT+5:30</Text>
      </View>
      <View style={cardStyle}>
        <Text style={labelStyle}>◈ IST CALENDAR</Text>
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.smBtn} onPress={() => changeMonth(-1)}><Text style={styles.smBtnText}>◀ PREV</Text></TouchableOpacity>
          <Text style={styles.monthLabel}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity style={styles.smBtn} onPress={() => changeMonth(1)}><Text style={styles.smBtnText}>NEXT ▶</Text></TouchableOpacity>
        </View>
        <View style={styles.calGrid}>
          {DAYS.map(d => <View key={d} style={styles.calHead}><Text style={styles.calHeadText}>{d}</Text></View>)}
          {cells.map(c => (
            <View key={c.key} style={[styles.calCell, c.isToday && styles.calToday]}>
              <Text style={[styles.calText, c.isToday && styles.calTodayText, c.hasEvent && styles.calEvent, c.type==='empty' && {opacity:0}]}>{c.d||'·'}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={cardStyle}>
        <Text style={labelStyle}>◈ MISSION PLANNER</Text>
        <Text style={styles.fieldLabel}>TASK DESCRIPTION</Text>
        <TextInput style={styles.textArea} value={task} onChangeText={setTask} placeholder="Describe mission..." placeholderTextColor={COLORS.text3} multiline numberOfLines={3} />
        <Text style={styles.fieldLabel}>TIME (HH:MM — IST)</Text>
        <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="e.g. 14:30" placeholderTextColor={COLORS.text3} keyboardType="numbers-and-punctuation" maxLength={5} />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>PUSH ALARM ACTIVE</Text>
          <Switch value={alarmActive} onValueChange={setAlarmActive} trackColor={{ false: COLORS.text3, true: COLORS.neon2 }} thumbColor={alarmActive ? COLORS.neon : '#888'} />
        </View>
        <TouchableOpacity style={[neonBtnStyle,{width:'100%'}]} onPress={savePlan}>
          <Text style={neonBtnTextStyle}>⊕ SAVE PLAN</Text>
        </TouchableOpacity>
      </View>
      <View style={cardStyle}>
        <Text style={labelStyle}>◈ ACTIVE ALARM TRACKER [{alarms.length}]</Text>
        {alarms.length===0 ? <Text style={styles.emptyText}>No missions saved yet.</Text> :
          alarms.map(a => (
            <View key={a.id} style={styles.alarmItem}>
              <View style={[styles.dot, !a.active && styles.dotOff]} />
              <View style={{flex:1}}>
                <Text style={styles.alarmTask}>{a.task}</Text>
                <Text style={styles.alarmTime}>⏱ {a.time} IST • {a.date}</Text>
              </View>
              <TouchableOpacity style={styles.delBtn} onPress={() => setAlarms(prev => prev.filter(x => x.id !== a.id))}>
                <Text style={styles.delText}>✕ DEL</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: COLORS.bg },
  content: { padding:12, paddingBottom:20 },
  clockBar: { backgroundColor: COLORS.surface, borderWidth:1, borderColor: COLORS.neonBorder, borderRadius:8, padding:10, marginBottom:12, alignItems:'center' },
  clockText: { color: COLORS.neon, fontFamily:'monospace', fontSize:20, fontWeight:'bold', letterSpacing:3 },
  clockSub: { color: COLORS.text3, fontFamily:'monospace', fontSize:9, letterSpacing:1.5, marginTop:2 },
  monthNav: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  monthLabel: { color: COLORS.neon, fontFamily:'monospace', fontSize:11, letterSpacing:2 },
  smBtn: { backgroundColor: COLORS.neonDim, borderWidth:1, borderColor: COLORS.neonBorder, borderRadius:5, paddingVertical:4, paddingHorizontal:8 },
  smBtnText: { color: COLORS.neon, fontFamily:'monospace', fontSize:9 },
  calGrid: { flexDirection:'row', flexWrap:'wrap' },
  calHead: { width:'14.28%', alignItems:'center', paddingVertical:4 },
  calHeadText: { color: COLORS.neon, fontFamily:'monospace', fontSize:8 },
  calCell: { width:'14.28%', alignItems:'center', paddingVertical:5, borderRadius:4 },
  calToday: { backgroundColor: COLORS.neonDim, borderWidth:1, borderColor: COLORS.neonBorder },
  calText: { color: COLORS.text2, fontFamily:'monospace', fontSize:11 },
  calTodayText: { color: COLORS.neon, fontWeight:'bold' },
  calEvent: { color: COLORS.yellow },
  fieldLabel: { color: COLORS.neon, fontFamily:'monospace', fontSize:9, letterSpacing:1.5, marginBottom:5 },
  textArea: { backgroundColor: COLORS.bg, borderWidth:1, borderColor: COLORS.neonBorder, color: COLORS.text, fontFamily:'monospace', fontSize:12, paddingHorizontal:10, paddingVertical:8, borderRadius:6, marginBottom:10, textAlignVertical:'top', minHeight:70 },
  input: { backgroundColor: COLORS.bg, borderWidth:1, borderColor: COLORS.neonBorder, color: COLORS.text, fontFamily:'monospace', fontSize:13, paddingHorizontal:10, paddingVertical:8, borderRadius:6, marginBottom:10 },
  toggleRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  toggleLabel: { color: COLORS.text2, fontFamily:'monospace', fontSize:10, flex:1 },
  emptyText: { color: COLORS.text3, fontFamily:'monospace', fontSize:10, textAlign:'center', paddingVertical:14 },
  alarmItem: { flexDirection:'row', alignItems:'center', backgroundColor: COLORS.surface2, borderWidth:1, borderColor: COLORS.neonBorder, borderRadius:8, padding:10, marginBottom:8, gap:8 },
  dot: { width:8, height:8, borderRadius:4, backgroundColor: COLORS.green },
  dotOff: { backgroundColor: COLORS.text3 },
  alarmTask: { color: COLORS.text, fontFamily:'monospace', fontSize:12, marginBottom:3 },
  alarmTime: { color: COLORS.neon, fontFamily:'monospace', fontSize:9 },
  delBtn: { backgroundColor:'rgba(255,59,92,0.12)', borderWidth:1, borderColor: COLORS.red, borderRadius:5, paddingVertical:5, paddingHorizontal:8 },
  delText: { color: COLORS.red, fontFamily:'monospace', fontSize:9 },
});