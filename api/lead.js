// /api/lead — 신청을 받는 서버 함수
import crypto from 'crypto';
const hash = v => crypto.createHash('sha256')
  .update(v.trim().toLowerCase()).digest('hex');   // 개인정보 해시

export default async function handler(req, res){
  const { email, phone, eventId } = req.body;

  // (여기서 DB 저장 로직 실행)

  await fetch(
    \`https://graph.facebook.com/v21.0/\${process.env.PIXEL_ID}/events\`,
    { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        access_token: process.env.META_TOKEN,   // ← 환경변수의 토큰
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now()/1000),
          event_id: eventId,                     // ← 픽셀과 동일 = 중복제거
          action_source: 'website',
          user_data: {
            em: [hash(email)],                   // 해시된 이메일
            ph: [hash(phone)]                    // 해시된 전화번호 → EMQ ↑
          }
        }]
      })
    });

  res.status(200).json({ ok:true });
}
