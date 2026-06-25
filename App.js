import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Switch, Alert, Linking, Dimensions
} from 'react-native';

const W = Dimensions.get('window').width;
const C = {
  bg:'#0A0F1D', surface:'#111827', surface2:'#1a2235',
  neon:'#00E5FF', neonDim:'rgba(0,229,255,0.12)', neonBorder:'rgba(0,229,255,0.35)',
  red:'#FF3B5C', redDim:'rgba(255,59,92,0.12)', text:'#FFFFFF',
  text2:'rgba(255,255,255,0.6)', text3:'rgba(255,255,255,0.3)',
  green:'#39FF6E', yellow:'#FFD700', neon2:'#00b4cc',
};
const card = { backgroundColor:C.surface, borderWidth:1, borderColor:C.neonBorder, borderRadius:10, padding:14, marginBottom:12 };
const lbl = { color:C.neon, fontSize:9, letterSpacing:2, fontFamily:'monospace', marginBottom:6 };
function pad(n){ return String(n).padStart(2,'0'); }
function getIST(){ const n=new Date(); return new Date(n.getTime()+(5.5*3600000)-(n.getTimezoneOffset()*60000)); }

// ═══════════════════════════════════════════
// TAB 1 — AI NAVIGATOR
// ═══════════════════════════════════════════
const ROUTES = {
  calc:{reply:'Routing to OmniCalc — full calculation grid ready.',tab:2},
  calculator:{reply:'OmniCalc online. Handles +−×÷ % √ x².',tab:2},
  math:{reply:'OmniCalc module engaged.',tab:2},
  compass:{reply:'Tactical Compass engaged. GPS array loading.',tab:3},
  gps:{reply:'Routing to GPS Telemetry in Compass module.',tab:3},
  location:{reply:'Live coordinates in Compass. Switching now.',tab:3},
  navigate:{reply:'Navigation array online. Compass engaged.',tab:3},
  alarm:{reply:'Scheduler opened. Set IST mission time and save.',tab:1},
  schedule:{reply:'Mission Planner online. Input task + time (IST).',tab:1},
  calendar:{reply:'IST Calendar loaded. Plan your missions.',tab:1},
  sos:{reply:'⚠ SOS Guide is in Tactical Compass. Routing now.',tab:3},
  emergency:{reply:'⚠ EMERGENCY — Routing to SOS panel NOW.',tab:3},
  help:{reply:'NEXUS OS: [1] AI Nav [2] Scheduler [3] OmniCalc [4] Compass+SOS — type any keyword!',tab:null},
};
const CHIPS=[{label:'🧮 OmniCalc',kw:'calc'},{label:'🧭 Compass',kw:'compass'},{label:'⏰ Alarm',kw:'alarm'},{label:'📍 GPS',kw:'gps'},{label:'🆘 Emergency',kw:'sos'},{label:'🔍 Help',kw:'help'}];

function AITab({setTab}){
  const [msgs,setMsgs]=useState([{id:'0',text:'Hello Commander. Type a keyword: calc, compass, alarm, gps, sos, help',sender:'bot'}]);
  const [inp,setInp]=useState('');
  const ref=useRef(null);
  const process=(raw)=>{
    const lower=raw.toLowerCase();
    let matched=null;
    for(const [kw,val] of Object.entries(ROUTES)){ if(lower.includes(kw)){matched=val;break;} }
    setMsgs(p=>[...p,{id:Date.now()+'',text:raw,sender:'user'}]);
    setTimeout(()=>{
      const reply=matched?matched.reply:"Try: 'calc', 'compass', 'alarm', 'gps', 'sos', 'help'";
      setMsgs(p=>[...p,{id:(Date.now()+1)+'',text:reply,sender:'bot'}]);
      if(matched?.tab!=null) setTimeout(()=>setTab(matched.tab),600);
    },350);
  };
  const send=()=>{ if(!inp.trim())return; process(inp.trim()); setInp(''); };
  useEffect(()=>{ setTimeout(()=>ref.current?.scrollToEnd({animated:true}),100); },[msgs]);
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:12,paddingBottom:20}} keyboardShouldPersistTaps="handled">
      <View style={card}>
        <Text style={lbl}>◈ AI NAVIGATOR — TOOL FINDER</Text>
        <ScrollView style={{height:200,marginBottom:10}} ref={ref} nestedScrollEnabled>
          {msgs.map(m=>(
            <View key={m.id} style={{marginBottom:8,alignItems:m.sender==='user'?'flex-end':'flex-start'}}>
              <Text style={{color:C.text3,fontSize:8,fontFamily:'monospace',marginBottom:2}}>{m.sender==='bot'?'NEXUS AI':'YOU'}</Text>
              <View style={{maxWidth:'85%',padding:8,borderRadius:8,borderWidth:1,backgroundColor:m.sender==='user'?C.neonDim:C.surface2,borderColor:C.neonBorder}}>
                <Text style={{color:m.sender==='user'?C.neon:C.text,fontSize:12,fontFamily:'monospace',lineHeight:18}}>{m.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={{flexDirection:'row',gap:8}}>
          <TextInput style={{flex:1,backgroundColor:C.bg,borderWidth:1,borderColor:C.neonBorder,color:C.text,fontFamily:'monospace',fontSize:13,paddingHorizontal:10,paddingVertical:8,borderRadius:6}} value={inp} onChangeText={setInp} placeholder="Type command..." placeholderTextColor={C.text3} onSubmitEditing={send} returnKeyType="send"/>
          <TouchableOpacity style={{backgroundColor:C.neonDim,borderWidth:1,borderColor:C.neonBorder,borderRadius:6,paddingVertical:8,paddingHorizontal:12,justifyContent:'center'}} onPress={send}>
            <Text style={{color:C.neon,fontFamily:'monospace',fontSize:10,letterSpacing:1}}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ QUICK ACCESS CHIPS</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:6}}>
          {CHIPS.map(c=>(
            <TouchableOpacity key={c.kw} style={{backgroundColor:C.surface2,borderWidth:1,borderColor:C.neonBorder,borderRadius:14,paddingVertical:5,paddingHorizontal:10}} onPress={()=>process(c.kw)}>
              <Text style={{color:C.neon,fontFamily:'monospace',fontSize:10}}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ SYSTEM INFO</Text>
        <Text style={{color:C.text2,fontFamily:'monospace',fontSize:11,lineHeight:18}}>NEXUS OS v2.7 — All logic runs locally. Zero API costs. Zero third-party dependencies.{'\n\n'}Tap a chip or type a keyword to instantly navigate between all 4 modules.</Text>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════
// TAB 2 — SCHEDULER
// ═══════════════════════════════════════════
const MONTHS=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DNAMES=['SUN','MON','TUE','WED','THU','FRI','SAT'];

function SchedulerTab(){
  const ist=getIST();
  const [year,setYear]=useState(ist.getFullYear());
  const [month,setMonth]=useState(ist.getMonth());
  const [task,setTask]=useState('');
  const [time,setTime]=useState('');
  const [alarmOn,setAlarmOn]=useState(false);
  const [alarms,setAlarms]=useState([]);
  const [clock,setClock]=useState('');
  useEffect(()=>{ const t=setInterval(()=>{ const i=getIST(); setClock(`${pad(i.getHours())}:${pad(i.getMinutes())}:${pad(i.getSeconds())} IST`); },1000); return()=>clearInterval(t); },[]);
  const dim=new Date(year,month+1,0).getDate();
  const first=new Date(year,month,1).getDay();
  const todayIST=getIST();
  const todayStr=`${todayIST.getFullYear()}-${pad(todayIST.getMonth()+1)}-${pad(todayIST.getDate())}`;
  const alarmDays=alarms.map(a=>a.date);
  const chgMonth=d=>{ let m=month+d,y=year; if(m<0){m=11;y--;} if(m>11){m=0;y++;} setMonth(m);setYear(y); };
  const save=()=>{
    if(!task.trim()){Alert.alert('Error','Enter a task.');return;}
    if(!time){Alert.alert('Error','Enter a time (HH:MM).');return;}
    const ds=`${year}-${pad(month+1)}-${pad(todayIST.getDate())}`;
    setAlarms(p=>[...p,{id:Date.now(),task:task.trim(),time,date:ds,active:alarmOn}]);
    setTask('');setTime('');
  };
  const cells=[];
  for(let i=0;i<first;i++) cells.push({type:'empty',key:'e'+i});
  for(let d=1;d<=dim;d++){
    const ds=`${year}-${pad(month+1)}-${pad(d)}`;
    cells.push({type:'day',d,ds,isToday:ds===todayStr,hasEvent:alarmDays.includes(ds),key:'d'+d});
  }
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:12,paddingBottom:20}} keyboardShouldPersistTaps="handled">
      <View style={{backgroundColor:C.surface,borderWidth:1,borderColor:C.neonBorder,borderRadius:8,padding:10,marginBottom:12,alignItems:'center'}}>
        <Text style={{color:C.neon,fontFamily:'monospace',fontSize:20,fontWeight:'bold',letterSpacing:3}}>{clock}</Text>
        <Text style={{color:C.text3,fontFamily:'monospace',fontSize:9,letterSpacing:1.5,marginTop:2}}>INDIAN STANDARD TIME GMT+5:30</Text>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ IST CALENDAR</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <TouchableOpacity style={{backgroundColor:C.neonDim,borderWidth:1,borderColor:C.neonBorder,borderRadius:5,paddingVertical:4,paddingHorizontal:8}} onPress={()=>chgMonth(-1)}><Text style={{color:C.neon,fontFamily:'monospace',fontSize:9}}>◀ PREV</Text></TouchableOpacity>
          <Text style={{color:C.neon,fontFamily:'monospace',fontSize:11,letterSpacing:2}}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity style={{backgroundColor:C.neonDim,borderWidth:1,borderColor:C.neonBorder,borderRadius:5,paddingVertical:4,paddingHorizontal:8}} onPress={()=>chgMonth(1)}><Text style={{color:C.neon,fontFamily:'monospace',fontSize:9}}>NEXT ▶</Text></TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
          {DNAMES.map(d=><View key={d} style={{width:'14.28%',alignItems:'center',paddingVertical:4}}><Text style={{color:C.neon,fontFamily:'monospace',fontSize:8}}>{d}</Text></View>)}
          {cells.map(c=>(
            <View key={c.key} style={{width:'14.28%',alignItems:'center',paddingVertical:5,borderRadius:4,backgroundColor:c.isToday?C.neonDim:'transparent',borderWidth:c.isToday?1:0,borderColor:C.neonBorder}}>
              <Text style={{color:c.isToday?C.neon:c.hasEvent?C.yellow:C.text2,fontFamily:'monospace',fontSize:11,opacity:c.type==='empty'?0:1,fontWeight:c.isToday?'bold':'normal'}}>{c.d||'·'}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ MISSION PLANNER</Text>
        <Text style={{color:C.neon,fontFamily:'monospace',fontSize:9,letterSpacing:1.5,marginBottom:5}}>TASK DESCRIPTION</Text>
        <TextInput style={{backgroundColor:C.bg,borderWidth:1,borderColor:C.neonBorder,color:C.text,fontFamily:'monospace',fontSize:12,paddingHorizontal:10,paddingVertical:8,borderRadius:6,marginBottom:10,minHeight:70,textAlignVertical:'top'}} value={task} onChangeText={setTask} placeholder="Describe mission or plan..." placeholderTextColor={C.text3} multiline numberOfLines={3}/>
        <Text style={{color:C.neon,fontFamily:'monospace',fontSize:9,letterSpacing:1.5,marginBottom:5}}>TIME (HH:MM — IST)</Text>
        <TextInput style={{backgroundColor:C.bg,borderWidth:1,borderColor:C.neonBorder,color:C.text,fontFamily:'monospace',fontSize:13,paddingHorizontal:10,paddingVertical:8,borderRadius:6,marginBottom:10}} value={time} onChangeText={setTime} placeholder="e.g. 14:30" placeholderTextColor={C.text3} maxLength={5}/>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <Text style={{color:C.text2,fontFamily:'monospace',fontSize:10,flex:1}}>PUSH ALARM ACTIVE</Text>
          <Switch value={alarmOn} onValueChange={setAlarmOn} trackColor={{false:C.text3,true:C.neon2}} thumbColor={alarmOn?C.neon:'#888'}/>
        </View>
        <TouchableOpacity style={{backgroundColor:C.neonDim,borderWidth:1,borderColor:C.neonBorder,borderRadius:6,paddingVertical:10,alignItems:'center'}} onPress={save}>
          <Text style={{color:C.neon,fontFamily:'monospace',fontSize:11,letterSpacing:1}}>⊕ SAVE PLAN</Text>
        </TouchableOpacity>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ ACTIVE ALARM TRACKER [{alarms.length}]</Text>
        {alarms.length===0?<Text style={{color:C.text3,fontFamily:'monospace',fontSize:10,textAlign:'center',paddingVertical:14}}>No missions saved yet.</Text>:
          alarms.map(a=>(
            <View key={a.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.surface2,borderWidth:1,borderColor:C.neonBorder,borderRadius:8,padding:10,marginBottom:8,gap:8}}>
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:a.active?C.green:C.text3}}/>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontFamily:'monospace',fontSize:12,marginBottom:3}}>{a.task}</Text>
                <Text style={{color:C.neon,fontFamily:'monospace',fontSize:9}}>⏱ {a.time} IST • {a.date}</Text>
              </View>
              <TouchableOpacity style={{backgroundColor:C.redDim,borderWidth:1,borderColor:C.red,borderRadius:5,paddingVertical:5,paddingHorizontal:8}} onPress={()=>setAlarms(p=>p.filter(x=>x.id!==a.id))}>
                <Text style={{color:C.red,fontFamily:'monospace',fontSize:9}}>✕ DEL</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════
// TAB 3 — OMNICALC
// ═══════════════════════════════════════════
const ROWS=[
  [{label:'C',type:'clear'},{label:'⌫',type:'back'},{label:'%',type:'op',val:'%'},{label:'÷',type:'op',val:'/'}],
  [{label:'7',type:'num'},{label:'8',type:'num'},{label:'9',type:'num'},{label:'×',type:'op',val:'*'}],
  [{label:'4',type:'num'},{label:'5',type:'num'},{label:'6',type:'num'},{label:'−',type:'op',val:'-'}],
  [{label:'1',type:'num'},{label:'2',type:'num'},{label:'3',type:'num'},{label:'+',type:'op',val:'+'}],
  [{label:'0',type:'num',wide:true},{label:'.',type:'num'},{label:'=',type:'eq'}],
];
const ADV=[{label:'√',type:'func',val:'sqrt'},{label:'x²',type:'func',val:'sq'},{label:'1/x',type:'func',val:'inv'},{label:'π',type:'func',val:'pi'}];

function CalcTab(){
  const [expr,setExpr]=useState('');
  const [disp,setDisp]=useState('0');
  const [buf,setBuf]=useState('');
  const [evaled,setEvaled]=useState(false);
  const fmt=n=>{ const s=parseFloat(Number(n).toPrecision(10)); return isNaN(s)?'ERROR':String(s); };
  const handle=(btn)=>{
    if(btn.type==='clear'){setExpr('');setDisp('0');setBuf('');setEvaled(false);return;}
    if(btn.type==='back'){const e=expr.slice(0,-1);const b=buf.slice(0,-1)||'0';setExpr(e);setBuf(b==='0'?'':b);setDisp(b);return;}
    if(btn.type==='eq'){
      try{const r=Function('"use strict";return('+expr.replace(/π/g,'3.141592653589793')+')')();const f=fmt(r);setDisp(f);setExpr(f);setBuf(f);setEvaled(true);}
      catch{setDisp('ERR');setExpr('');}
      return;
    }
    if(btn.type==='func'){
      const n=parseFloat(buf||disp||'0');let r,label;
      if(btn.val==='sqrt'){r=Math.sqrt(n);label=`√(${n})`;}
      else if(btn.val==='sq'){r=n*n;label=`(${n})²`;}
      else if(btn.val==='inv'){r=1/n;label=`1/(${n})`;}
      else if(btn.val==='pi'){setExpr(expr+'π');setBuf('3.14159265');setDisp('π');return;}
      const f=fmt(r);setDisp(f);setBuf(f);setExpr(label);setEvaled(false);return;
    }
    if(btn.type==='op'){
      if(btn.val==='%'){const n=parseFloat(buf||'0')/100;const f=fmt(n);setDisp(f);setExpr(f+'%');setBuf(f);return;}
      setBuf('');setExpr(p=>p+btn.val);return;
    }
    if(btn.type==='num'){
      if(evaled){setExpr('');setBuf('');setEvaled(false);}
      const nb=buf+btn.label;setBuf(nb);setExpr(p=>evaled?btn.label:p+btn.label);setDisp(nb);
    }
  };
  const bw=Math.floor((W-24-18)/4);
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:12,paddingBottom:20}} scrollEnabled={false}>
      <View style={{backgroundColor:C.surface,borderWidth:1,borderColor:C.neonBorder,borderRadius:10,padding:14,marginBottom:12,alignItems:'flex-end'}}>
        <Text style={{color:C.text3,fontFamily:'monospace',fontSize:11,marginBottom:6}} numberOfLines={1}>{expr||' '}</Text>
        <Text style={{color:C.neon,fontFamily:'monospace',fontSize:36,fontWeight:'bold',letterSpacing:2}} numberOfLines={1} adjustsFontSizeToFit>{disp}</Text>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ STANDARD OPERATIONS</Text>
        {ROWS.map((row,ri)=>(
          <View key={ri} style={{flexDirection:'row',gap:6,marginBottom:6}}>
            {row.map(btn=>(
              <TouchableOpacity key={btn.label} style={{flex:btn.wide?2:1,backgroundColor:btn.type==='op'?C.neonDim:btn.type==='eq'?C.neonDim:C.surface2,borderWidth:1,borderColor:btn.type==='op'?C.neonBorder:btn.type==='eq'?C.neon:(btn.type==='clear'||btn.label==='⌫')?'rgba(255,59,92,0.3)':'rgba(255,255,255,0.1)',borderRadius:8,paddingVertical:15,alignItems:'center'}} onPress={()=>handle(btn)} activeOpacity={0.7}>
                <Text style={{color:btn.type==='op'?C.neon:btn.type==='eq'?C.neon:(btn.type==='clear'||btn.label==='⌫')?C.red:C.text,fontFamily:'monospace',fontSize:btn.type==='eq'?22:18}}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={card}>
        <Text style={lbl}>◈ ADVANCED MODIFIERS</Text>
        <View style={{flexDirection:'row',gap:6}}>
          {ADV.map(btn=>(
            <TouchableOpacity key={btn.val} style={{flex:1,backgroundColor:'rgba(255,215,0,0.08)',borderWidth:1,borderColor:'rgba(255,215,0,0.25)',borderRadius:8,paddingVertical:12,alignItems:'center'}} onPress={()=>handle(btn)} activeOpacity={0.7}>
              <Text style={{color:C.yellow,fontFamily:'monospace',fontSize:14}}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════
// TAB 4 — COMPASS
// ═══════════════════════════════════════════
const SOS_LIST=['AMBULANCE: Dial 108 (India)','POLICE: Dial 100 / 112','FIRE & RESCUE: Dial 101','Coast Guard: Dial 1554','Share GPS coordinates to rescuers','Stay calm — signal every 30 seconds','Conserve phone battery to maximum','Do not move if injured unnecessarily'];

function getDir(d){
  const n=((d%360)+360)%360;
  if(n<22.5||n>=337.5)return'NORTH';if(n<67.5)return'NE';if(n<112.5)return'EAST';
  if(n<157.5)return'SE';if(n<202.5)return'SOUTH';if(n<247.5)return'SW';
  if(n<292.5)return'WEST';return'NW';
}

function CompassTab(){
  const [heading,setHeading]=useState(0);
  const [gps,setGps]=useState({lat:'26.1445°N',lon:'91.7362°E',alt:'54.2m',acc:'±3.1m',spd:'0.0 km/h',sig:'97%'});
  const dirRef=useRef(1);
  const hRef=useRef(0);
  useEffect(()=>{
    const ci=setInterval(()=>{
      hRef.current+=dirRef.current*(0.3+Math.random()*0.4);
      if(hRef.current>20)dirRef.current=-1;
      if(hRef.current<-5)dirRef.current=1;
      setHeading(Math.round(((hRef.current%360)+360)%360));
    },150);
    const gi=setInterval(()=>{
      const j=()=>((Math.random()-0.5)*0.0004).toFixed(4);
      setGps({lat:`${(26.1445+parseFloat(j())).toFixed(4)}°N`,lon:`${(91.7362+parseFloat(j())).toFixed(4)}°E`,alt:`${(54+Math.random()*0.6).toFixed(1)}m`,acc:`±${(2.8+Math.random()*0.8).toFixed(1)}m`,spd:`${(Math.random()*0.3).toFixed(1)} km/h`,sig:`${Math.floor(94+Math.random()*5)}%`});
    },2000);
    return()=>{clearInterval(ci);clearInterval(gi);};
  },[]);

  const deg3=String(heading).padStart(3,'0');
  const S=180;
  const cx=S/2,cy=S/2,r=65;
  const rad=(heading*Math.PI)/180;
  const tx=cx+r*Math.sin(rad),ty=cy-r*Math.cos(rad);
  const bx=cx-(r*0.55)*Math.sin(rad),by=cy+(r*0.55)*Math.cos(rad);
  const px=7*Math.cos(rad),py=7*Math.sin(rad);

  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:12,paddingBottom:24}}>
      <View style={card}>
        <Text style={lbl}>◈ TACTICAL COMPASS ARRAY</Text>
        <View style={{alignItems:'center'}}>
          <View style={{width:S,height:S,position:'relative'}}>
            {/* Outer circle */}
            <View style={{position:'absolute',top:7,left:7,width:S-14,height:S-14,borderRadius:(S-14)/2,borderWidth:1.5,borderColor:'rgba(0,229,255,0.6)',backgroundColor:C.bg}}/>
            {/* Inner dashed ring — simulated */}
            <View style={{position:'absolute',top:20,left:20,width:S-40,height:S-40,borderRadius:(S-40)/2,borderWidth:1,borderColor:'rgba(0,229,255,0.2)',borderStyle:'dashed'}}/>
            {/* Cardinal labels */}
            <Text style={{position:'absolute',top:10,left:0,right:0,textAlign:'center',color:C.red,fontFamily:'monospace',fontSize:14,fontWeight:'bold'}}>N</Text>
            <Text style={{position:'absolute',bottom:8,left:0,right:0,textAlign:'center',color:C.neon,fontFamily:'monospace',fontSize:14}}>S</Text>
            <Text style={{position:'absolute',top:S/2-10,right:8,color:C.neon,fontFamily:'monospace',fontSize:14}}>E</Text>
            <Text style={{position:'absolute',top:S/2-10,left:8,color:C.neon,fontFamily:'monospace',fontSize:14}}>W</Text>
            <Text style={{position:'absolute',top:22,right:22,color:'rgba(0,229,255,0.4)',fontFamily:'monospace',fontSize:9}}>NE</Text>
            <Text style={{position:'absolute',bottom:22,right:22,color:'rgba(0,229,255,0.4)',fontFamily:'monospace',fontSize:9}}>SE</Text>
            <Text style={{position:'absolute',bottom:22,left:22,color:'rgba(0,229,255,0.4)',fontFamily:'monospace',fontSize:9}}>SW</Text>
            <Text style={{position:'absolute',top:22,left:22,color:'rgba(0,229,255,0.4)',fontFamily:'monospace',fontSize:9}}>NW</Text>
            {/* Crosshair lines */}
            <View style={{position:'absolute',top:S/2,left:0,right:0,height:1,backgroundColor:'rgba(0,229,255,0.15)'}}/>
            <View style={{position:'absolute',left:S/2,top:0,bottom:0,width:1,backgroundColor:'rgba(0,229,255,0.15)'}}/>
            {/* Needle — red tip pointing direction */}
            <View style={{position:'absolute',top:cy-r,left:cx-4,width:8,height:r,backgroundColor:C.red,borderRadius:4,opacity:0.9,transform:[{translateX:0},{rotate:`${heading}deg`},{translateX:0}],transformOrigin:`4px ${r}px`}}/>
            {/* Center dot */}
            <View style={{position:'absolute',top:cy-8,left:cx-8,width:16,height:16,borderRadius:8,backgroundColor:C.neon,opacity:0.9}}/>
            <View style={{position:'absolute',top:cy-4,left:cx-4,width:8,height:8,borderRadius:4,backgroundColor:C.bg}}/>
            {/* Degree text */}
            <Text style={{position:'absolute',top:cy-6,left:0,right:0,textAlign:'center',color:C.neon,fontFamily:'monospace',fontSize:9}}>{deg3}°</Text>
          </View>
          <Text style={{color:C.text2,fontFamily:'monospace',fontSize:11,letterSpacing:1,marginTop:8}}>HEADING: {getDir(heading)} — {deg3}°</Text>
        </View>
      </View>
      <View style={card}>
        <Text style={lbl}>◈ LIVE GPS TELEMETRY — GUWAHATI, ASSAM</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
          {[['LATITUDE',gps.lat],['LONGITUDE',gps.lon],['ALTITUDE',gps.alt],['ACCURACY',gps.acc],['SPEED',gps.spd],['SIGNAL',gps.sig]].map(([l,v])=>(
            <View key={l} style={{width:'47%',backgroundColor:C.bg,borderWidth:1,borderColor:C.neonBorder,borderRadius:6,padding:10}}>
              <Text style={{color:C.text3,fontFamily:'monospace',fontSize:8,letterSpacing:1.5,marginBottom:4}}>{l}</Text>
              <Text style={{color:C.neon,fontFamily:'monospace',fontSize:12,fontWeight:'bold'}}>{v}</Text>
            </View>
          ))}
        </View>
        <Text style={{color:C.text3,fontFamily:'monospace',fontSize:8,textAlign:'center',marginTop:10}}>⚠ SIMULATED GPS — GUWAHATI, ASSAM, INDIA</Text>
      </View>
      <View style={{backgroundColor:C.redDim,borderWidth:1,borderColor:C.red,borderRadius:10,padding:14,marginBottom:12}}>
        <Text style={{color:C.red,fontFamily:'monospace',fontSize:14,letterSpacing:2,fontWeight:'bold',marginBottom:4}}>🆘 EMERGENCY SOS GUIDE</Text>
        <Text style={{color:'rgba(255,59,92,0.6)',fontFamily:'monospace',fontSize:8,letterSpacing:1.5,marginBottom:12}}>CRITICAL RESPONSE PROTOCOL — INDIA</Text>
        {SOS_LIST.map((s,i)=>(
          <View key={i} style={{flexDirection:'row',gap:8,marginBottom:6}}>
            <Text style={{color:C.red,fontFamily:'monospace',fontSize:10}}>▶</Text>
            <Text style={{color:'rgba(255,255,255,0.8)',fontFamily:'monospace',fontSize:10,lineHeight:16,flex:1}}>{s}</Text>
          </View>
        ))}
        <TouchableOpacity style={{backgroundColor:C.red,borderRadius:8,paddingVertical:12,alignItems:'center',marginTop:10}} onPress={()=>Linking.openURL('tel:112')}>
          <Text style={{color:'#fff',fontFamily:'monospace',fontSize:12,fontWeight:'bold'}}>📞 TAP TO CALL 112 — EMERGENCY</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ═══════════════════════════════════════════
// MAIN APP — NO NAVIGATION LIBRARY NEEDED
// ═══════════════════════════════════════════
const TABS=[
  {id:0,icon:'◈',label:'AI NAV'},
  {id:1,icon:'◷',label:'SCHED'},
  {id:2,icon:'⊞',label:'CALC'},
  {id:3,icon:'⊕',label:'COMPASS'},
];

export default function App(){
  const [tab,setTab]=useState(0);
  const [clock,setClock]=useState('');
  useEffect(()=>{
    const t=setInterval(()=>{ const i=getIST(); setClock(`IST ${pad(i.getHours())}:${pad(i.getMinutes())}:${pad(i.getSeconds())}`); },1000);
    return()=>clearInterval(t);
  },[]);
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      {/* TOP BAR */}
      <View style={{backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.neonBorder,paddingTop:44,paddingBottom:10,paddingHorizontal:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={{color:C.neon,fontSize:13,letterSpacing:2,fontFamily:'monospace',fontWeight:'bold'}}>◈ NEXUS OS v2.7</Text>
        <View style={{backgroundColor:C.neonDim,borderWidth:1,borderColor:C.neonBorder,borderRadius:3,paddingVertical:2,paddingHorizontal:6}}>
          <Text style={{color:C.neon,fontSize:9,letterSpacing:1,fontFamily:'monospace'}}>{clock}</Text>
        </View>
      </View>
      {/* SCREEN */}
      <View style={{flex:1}}>
        {tab===0 && <AITab setTab={setTab}/>}
        {tab===1 && <SchedulerTab/>}
        {tab===2 && <CalcTab/>}
        {tab===3 && <CompassTab/>}
      </View>
      {/* BOTTOM NAV */}
      <View style={{backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.neonBorder,flexDirection:'row'}}>
        {TABS.map(t=>(
          <TouchableOpacity key={t.id} style={{flex:1,paddingVertical:8,alignItems:'center'}} onPress={()=>setTab(t.id)}>
            <Text style={{fontSize:20,color:tab===t.id?C.neon:'rgba(255,255,255,0.3)'}}>{t.icon}</Text>
            <Text style={{fontSize:8,color:tab===t.id?C.neon:'rgba(255,255,255,0.3)',fontFamily:'monospace',letterSpacing:0.5,marginTop:2}}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}