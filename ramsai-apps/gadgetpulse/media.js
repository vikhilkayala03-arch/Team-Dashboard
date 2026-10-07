/* Optional review attachments stay on this device in IndexedDB. */
(function () {
  'use strict';
  let connection;
  function database() {
    if(!window.indexedDB)return Promise.reject(new Error('Attachments are unavailable in this browser. You can still post a text review.'));
    if(!connection)connection=new Promise((resolve,reject)=>{const request=indexedDB.open('gadgetpulse-media',1);request.onupgradeneeded=()=>request.result.createObjectStore('files');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Browser storage could not open. Try a normal browser tab or post a text review.'));});
    return connection;
  }
  async function save(files) {
    const selected=Array.from(files);
    if(selected.length>3)throw new Error('Choose up to three photos or videos.');
    for(const file of selected)if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(file.type)||file.size>10*1024*1024)throw new Error('Use JPG, PNG, WebP, MP4 or WebM files, up to 10 MB each.');
    if(!selected.length)return [];
    const db=await database(),keys=selected.map(()=>`m-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');selected.forEach((file,i)=>tx.objectStore('files').put(file,keys[i]));tx.oncomplete=resolve;tx.onerror=()=>reject(new Error('Attachment storage is full or unavailable. Try fewer files.'));tx.onabort=tx.onerror;});
    return keys;
  }
  async function get(key) {const db=await database();return new Promise((resolve,reject)=>{const request=db.transaction('files').objectStore('files').get(key);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
  async function remove(keys) {if(!keys.length)return;const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');keys.forEach(k=>tx.objectStore('files').delete(k));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
  window.GadgetPulseMedia={save,get,remove};
})();
