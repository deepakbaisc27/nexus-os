import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, cardStyle } from '../utils/theme';

const ROWS = [
  [{label:'C',type:'clear'},{label:'⌫',type:'back'},{label:'%',type:'op',val:'%'},{label:'÷',type:'op',val:'/'}],
  [{label:'7',type:'num'},{label:'8',type:'num'},{label:'9',type:'num'},{label:'×',type:'op',val:'*'}],
  [{label:'4',type:'num'},{label:'5',type:'num'},{label:'6',type:'num'},{label:'−',type:'op',val:'-'}],
  [{label:'1',type:'num'},{label:'2',type:'num'},{label:'3',type:'num'},{label:'+',type:'op',val:'+'}],
  [{label:'0',type:'num',wide:true},{label:'.',type:'num'},{label:'=',type:'eq'}],
];
const ADV = [
  {label:'√',type:'func',val:'sqrt'},
  {label:'x²',type:'func',val:'sq'},
  {label:'1/x',type:'func',val:'inv'},
  {label:'π',type:'func',val:'pi'},
];

export default function OmniCalcScreen() {
  const [expr, setExpr] = useState('');
  const [display, setDisplay] = useState('0');
  const [buf, setBuf] = useState('');
  const [evaled, setEvaled] = useState(false);

  const fmt = n => { const s = parseFloat(Number(n).toPrecision(10)); return isNaN(s) ? 'ERROR' : String(s); };

  const handleBtn = (btn) => {
    if (btn.type==='clear') { setExpr(''); setDisplay('0'); setBuf(''); setEvaled(false); return; }
    if (btn.type==='back') { const e=expr.slice(0,-1); const b=buf.slice(0,-1)||'0'; setExpr(e); setBuf(b==='0'?'':b); setDisplay(b); return; }
    if (btn.type==='eq') {
      try {
        const r = Function('"use strict";return('+expr.replace(/π/g,'3.141592653589793')+')')();
        const f = fmt(r); setDisplay(f); setExpr(f); setBuf(f); setEvaled(true);
      } catch { setDisplay('ERR'); setExpr(''); }
      return;
    }
    if (btn.type==='func') {
      const n = parseFloat(buf||display||'0');
      let r, label;
      if (btn.val==='sqrt'){r=Math.sqrt(n);label=`√(${n})`;}
      else if(btn.val==='sq'){r=n*n;label=`(${n})²`;}
      else if(btn.val==='inv'){r=1/n;label=`1/(${n})`;}
      else if(btn.val==='pi'){setExpr(expr+'π');setBuf('3.14159265');setDisplay('π');return;}
      const f=fmt(r); setDisplay(f); setBuf(f); setExpr(label); setEvaled(false); return;
    }
    if (btn.type==='op') {
      if(btn.val==='%'){const n=parseFloat(buf||'0')/100;const f=fmt(n);setDisplay(f);setExpr(f+'%');setBuf(f);return;}
      setBuf(''); setExpr(prev=>prev+btn.val); return;
    }
    if (btn.type==='num') {
      if(evaled){setExpr('');setBuf('');setEvaled(false);}
      const c=btn.label; const nb=buf+c;
      setBuf(nb); setExpr(prev=>evaled?c:prev+c); setDisplay(nb);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} scrollEnabled={false}>
      <View style={styles.display}>
        <Text style={styles.expr} numberOfLines={1}>{expr||' '}</Text>
        <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
      </View>
      <View style={cardStyle}>
        <Text style={styles.label}>◈ STANDARD OPERATIONS</Text>
        {ROWS.map((row,ri) => (
          <View key={ri} style={styles.row}>
            {row.map(btn => (
              <TouchableOpacity key={btn.label} style={[styles.btn, btn.wide&&styles.wide, btn.type==='op'&&styles.opBtn, btn.type==='eq'&&styles.eqBtn, (btn.type==='clear'||btn.label==='⌫')&&styles.clrBtn]} onPress={()=>handleBtn(btn)} activeOpacity={0.7}>
                <Text style={[styles.btnText, btn.type==='op'&&styles.opText, btn.type==='eq'&&styles.eqText, (btn.type==='clear'||btn.label==='⌫')&&styles.clrText]}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={cardStyle}>
        <Text style={styles.label}>◈ ADVANCED MODIFIERS</Text>
        <View style={styles.row}>
          {ADV.map(btn => (
            <TouchableOpacity key={btn.val} style={[styles.btn,styles.advBtn]} onPress={()=>handleBtn(btn)} activeOpacity={0.7}>
              <Text style={styles.advText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg},
  content:{padding:12,paddingBottom:16},
  display:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.neonBorder,borderRadius:10,padding:14,marginBottom:12,alignItems:'flex-end'},
  expr:{color:COLORS.text3,fontFamily:'monospace',fontSize:11,marginBottom:6},
  result:{color:COLORS.neon,fontFamily:'monospace',fontSize:36,fontWeight:'bold',letterSpacing:2},
  label:{color:COLORS.neon,fontFamily:'monospace',fontSize:9,letterSpacing:2,marginBottom:10},
  row:{flexDirection:'row',gap:6,marginBottom:6},
  btn:{flex:1,backgroundColor:COLORS.surface2,borderWidth:1,borderColor:'rgba(255,255,255,0.1)',borderRadius:8,paddingVertical:16,alignItems:'center'},
  wide:{flex:2},
  opBtn:{borderColor:COLORS.neonBorder,backgroundColor:COLORS.neonDim},
  eqBtn:{backgroundColor:COLORS.neonDim,borderColor:COLORS.neon},
  clrBtn:{borderColor:'rgba(255,59,92,0.3)'},
  advBtn:{backgroundColor:'rgba(255,215,0,0.08)',borderColor:'rgba(255,215,0,0.25)'},
  btnText:{color:COLORS.text,fontFamily:'monospace',fontSize:18},
  opText:{color:COLORS.neon},
  eqText:{color:COLORS.neon,fontSize:22},
  clrText:{color:COLORS.red},
  advText:{color:COLORS.yellow,fontFamily:'monospace',fontSize:14},
});