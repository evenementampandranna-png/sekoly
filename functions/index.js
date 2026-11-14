/**
 * Sekoly — Cloud Functions (offre Blaze requise)
 *  1. sendSms     : envoie chaque SMS ajouté dans schools/{code}/sms (absences, reçus, relances, convocations…)
 *  2. dailyBackup : sauvegarde automatique quotidienne de Firestore vers un bucket Cloud Storage (copie hors de l'école)
 *
 * Configuration (une fois) :
 *   firebase functions:secrets:set SMS_TOKEN        # jeton / clé API de la passerelle
 *   Fichier functions/.env :
 *     SMS_PROVIDER=orange          # "orange" (Orange Developer SMS API) ou "http" (passerelle générique)
 *     SMS_URL=https://...          # (http) URL POST de la passerelle  — reçoit {to,from,text}
 *     SMS_SENDER=tel:+261320000000 # (orange) numéro expéditeur autorisé / (http) nom d'expéditeur
 *     ORANGE_CLIENT_ID=...         # (orange) identifiants de l'application Orange Developer
 *     BACKUP_BUCKET=gs://<projet>-sekoly-backups
 */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const { v1 } = require('@google-cloud/firestore');
admin.initializeApp();
const SMS_TOKEN = defineSecret('SMS_TOKEN');
const REGION = 'europe-west1';

const intl = p => { let d = String(p || '').replace(/\D/g, ''); if (d.startsWith('0')) d = '261' + d.slice(1); return '+' + d; };

async function orangeToken() {
  const id = process.env.ORANGE_CLIENT_ID, secret = SMS_TOKEN.value();
  const r = await fetch('https://api.orange.com/oauth/v3/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('Orange OAuth ' + r.status);
  return (await r.json()).access_token;
}
async function send(to, text, senderName) {
  const provider = process.env.SMS_PROVIDER || 'http';
  if (provider === 'orange') {
    const from = process.env.SMS_SENDER;
    const tok = await orangeToken();
    const r = await fetch(`https://api.orange.com/smsmessaging/v1/outbound/${encodeURIComponent(from)}/requests`, {
      method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' },
      body: JSON.stringify({ outboundSMSMessageRequest: { address: 'tel:' + intl(to), senderAddress: from, senderName: senderName || undefined, outboundSMSTextMessage: { message: text } } })
    });
    if (!r.ok) throw new Error('Orange SMS ' + r.status + ' ' + (await r.text()).slice(0, 200));
    return;
  }
  const r = await fetch(process.env.SMS_URL, {
    method: 'POST', headers: { Authorization: 'Bearer ' + SMS_TOKEN.value(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: intl(to), from: senderName || process.env.SMS_SENDER || 'SEKOLY', text })
  });
  if (!r.ok) throw new Error('Gateway ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

exports.sendSms = onDocumentCreated({ document: 'schools/{code}/sms/{id}', region: REGION, secrets: [SMS_TOKEN] }, async (event) => {
  const snap = event.data; if (!snap) return;
  const m = snap.data(); if (m.status !== 'pending') return;
  const school = (await admin.firestore().doc(`schools/${event.params.code}`).get()).data()?.school || {};
  try {
    await send(m.to, m.text, school.smsSender);
    await snap.ref.update({ status: 'sent', sentAt: Date.now(), error: admin.firestore.FieldValue.delete() });
  } catch (e) {
    await snap.ref.update({ status: 'failed', error: String(e.message || e).slice(0, 300), triedAt: Date.now() });
  }
});

exports.dailyBackup = onSchedule({ schedule: 'every day 02:00', timeZone: 'Indian/Antananarivo', region: REGION }, async () => {
  const client = new v1.FirestoreAdminClient();
  const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
  const bucket = process.env.BACKUP_BUCKET || `gs://${projectId}-sekoly-backups`;
  const name = client.databasePath(projectId, '(default)');
  const [op] = await client.exportDocuments({ name, outputUriPrefix: `${bucket}/${new Date().toISOString().slice(0, 10)}`, collectionIds: [] });
  console.log('Backup started', op.name);
});
