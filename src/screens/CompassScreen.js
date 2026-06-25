import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { COLORS, cardStyle } from '../utils/theme';

function getDir(d) {
  const n = ((d%360)+360)%360;
  if(n<22.5||n>=337.5)return'NORTH';if(n<67.5)return'NE';if(n<112.5)return'EAST';
  if(n<157.5)return'SE';if(n<202.5)return'SOUTH';if(n<247.5)return'SW';
  if(n<292.5)return'WEST';return'NW';
}

const SOS = ['AMBULANCE: Dial 108','POLICE: Dial 100 / 112','FIRE: Dial 101','Share GPS coords to rescuers','Stay calm — signal every 30 sec','Mark: 26.1445°N 91.7362°E'];

export default function CompassScreen() {
  const [heading, setHeading] = useState(0);
  const [dir, setDir] = useState(1);
  const [gps, setGps] = useState({ lat:'26.1445°N', lon:'91.7362°E', alt:'54.2m', acc:'±3.1m', spd:'0.0 km/h', sig:'97%' });

  useEffect(() => {
    let h = 0, d = 1;
    const ci = setInterval(() => {
      h += d*(0.3+Math.random()*0.4);
      if(h>20)d=-1; if(h<-5)d=1;
      setHeading(Math.round(((h%360)+360)%360));
    }, 150);
    const gi = setInterval(() => {
      const j=()=>((Math.random()-0.5)*0.0004).toFixed(4);
      setGps({ lat:`${(26.1445+parseFloat(j())).toFixed(4)}°N`, lon:`${(91.7362+parseFloat(j())).toFixed(4)}°E`, alt:`${(54+Math.random()*0.6).toFixed(1)}m`, acc:`±${(2.8+Math.random()*0.8).toFixed(1)}m`, spd:`${(Math.random()*0.3).toFixed(1)} km/h`, sig:`${Math.floor(94+Math.random()*5)}%` });
    }, 2000);
    return () => { clearInterval(ci); clearInterval(gi); };
  }, []);

  const deg3 = String(heading).padStart(3,'0');
  const rad = (heading*Math.PI)/180;
  const cx=90,cy=90,r=65;
  const tx=cx+r*Math.sin(rad), ty=cy-r*Math.cos(rad);
  const bx=cx-(r*0.55)*Math.sin(rad), by=cy+(r*0.55)*Math.cos(rad);
  const px=7*Math.cos(rad), py=7*Math.sin(rad);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={cardStyle}>
        <Text style={styles.label}>◈ TACTICAL COMPASS ARRAY</Text>
        <View style={styles.compassWrap}>
          <Svg width={180} height={180} viewBox="0 0 180 180">
            <Circle cx={90} cy={90} r={82} fill="#0A0F1D" stroke="#00E5FF" strokeWidth={1.5} opacity={0.6}/>
            <Circle cx={90} cy={90} r={70} fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth={0.5} strokeDasharray="4,4"/>
            <Line x1={90} y1={10} x2={90} y2={170} stroke="rgba(0,229,255,0.15)" strokeWidth={0.5}/>
            <Line x1={10} y1={90} x2={170} y2={90} stroke="rgba(0,229,255,0.15)" strokeWidth={0.5}/>
            <SvgText x={90} y={19} textAnchor="middle" fill="#FF3B5C" fontSize={13} fontWeight="bold">N</SvgText>
            <SvgText x={90} y={175} textAnchor="middle" fill="#00E5FF" fontSize={13}>S</SvgText>
            <SvgText x={170} y={95} textAnchor="middle" fill="#00E5FF" fontSize={13}>E</SvgText>
            <SvgText x={13} y={95} textAnchor="middle" fill="#00E5FF" fontSize={13}>W</SvgText>
            <Polygon points={`${tx},${ty} ${cx+px},${cy+py} ${bx},${by} ${cx-px},${cy-py}`} fill="#FF3B5C" opacity={0.9}/>
            <Circle cx={90} cy={90} r={7} fill="#00E5FF" opacity={0.9}/>
            <Circle cx={90} cy={90} r={4} fill="#0A0F1D"/>
            <SvgText x={90} y={93} textAnchor="middle" fill="#00E5FF" fontSize={6}>{deg3}°</SvgText>
          </Svg>
          <Text style={styles.headingText}>HEADING: {getDir(heading)} — {deg3}°</Text>
        </View>
      </View>
      <View style={cardStyle}>
        <Text style={styles.label}>◈ LIVE GPS TELEMETRY — GUWAHATI</Text>
        <View style={styles.gpsGrid}>
          {[['LATITUDE',gps.lat],['LONGITUDE',gps.lon],['ALTITUDE',gps.alt],['ACCURACY',gps.acc],['SPEED',gps.spd],['SIGNAL',gps.sig]].map(([l,v])=>(
            <View key={l} style={styles.gpsStat}>
              <Text style={styles.gpsLabel}>{l}</Text>
              <Text style={styles.gpsValue}>{v}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.gpsFooter}>⚠ SIMULATED GPS — GUWAHATI, ASSAM, INDIA</Text>
      </View>
      <View style={styles.sosCard}>
        <Text style={styles.sosTitle}>🆘 EMERGENCY SOS GUIDE</Text>
        {SOS.map((s,i)=>(
          <View key={i} style={styles.sosRow}>
            <Text style={styles.sosBullet}>▶</Text>
            <Text style={styles.sosText}>{s}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.callBtn} onPress={()=>Linking.openURL('tel:112')}>
          <Text style={styles.callText}>📞 TAP TO CALL 112 — EMERGENCY</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg},
  content:{padding:12,paddingBottom:24},
  label:{color:COLORS.neon,fontFamily:'monospace',fontSize:9,letterSpacing:2,marginBottom:10},
  compassWrap:{alignItems:'center'},
  headingText:{color:COLORS.text2,fontFamily:'monospace',fontSize:11,letterSpacing:1,marginTop:8},
  gpsGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  gpsStat:{width:'47%',backgroundColor:COLORS.bg,borderWidth:1,borderColor:COLORS.neonBorder,borderRadius:6,padding:10},
  gpsLabel:{color:COLORS.text3,fontFamily:'monospace',fontSize:8,letterSpacing:1.5,marginBottom:4},
  gpsValue:{color:COLORS.neon,fontFamily:'monospace',fontSize:12,fontWeight:'bold'},
  gpsFooter:{color:COLORS.text3,fontFamily:'monospace',fontSize:8,textAlign:'center',marginTop:10},
  sosCard:{backgroundColor:'rgba(255,59,92,0.08)',borderWidth:1,borderColor:COLORS.red,borderRadius:10,padding:14,marginBottom:12},
  sosTitle:{color:COLORS.red,fontFamily:'monospace',fontSize:14,letterSpacing:2,fontWeight:'bold',marginBottom:10},
  sosRow:{flexDirection:'row',gap:8,marginBottom:6},
  sosBullet:{color:COLORS.red,fontFamily:'monospace',fontSize:10},
  sosText:{color:'rgba(255,255,255,0.8)',fontFamily:'monospace',fontSize:10,lineHeight:16,flex:1},
  callBtn:{backgroundColor:COLORS.red,borderRadius:8,paddingVertical:12,alignItems:'center',marginTop:10},
  callText:{color:'#fff',fontFamily:'monospace',fontSize:12,fontWeight:'bold'},
});