/* Sekoly — firebase.js : loads Firebase SDK and boots the app */
import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, getDocs, collection, query, where, orderBy, limit, onSnapshot, writeBatch, deleteField } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from '../firebase-config.js';

const ok=!!(firebaseConfig&&firebaseConfig.apiKey&&!/^(VOTRE|YOUR|AZO)/i.test(firebaseConfig.apiKey));
const F={ok,config:firebaseConfig,initializeApp,deleteApp,getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged,updatePassword,reauthenticateWithCredential,EmailAuthProvider,deleteUser,
 doc,getDoc,setDoc,updateDoc,addDoc,deleteDoc,getDocs,collection,query,where,orderBy,limit,onSnapshot,writeBatch,deleteField};
if(ok){
 F.app=initializeApp(firebaseConfig);
 F.auth=getAuth(F.app);
 try{F.db=initializeFirestore(F.app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})})}
 catch(e){F.db=initializeFirestore(F.app,{})}
}
window.__bootSekoly(F);
