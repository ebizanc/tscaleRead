const PROD_API_URL = 'https://your-api-host.example.com/wgymd'; // 배포 후 실제 호스트로 교체
export const API_URL = __DEV__ ? 'http://localhost:4000/wgymd' : PROD_API_URL;
/**
 * - Dev(USB 연결): adb reverse tcp:4000 tcp:4000 → localhost 사용 가능
 * - 에뮬레이터: http://10.0.2.2:4000/wgymd
 * - 실기기+같은 Wi‑Fi: http://<PC_IP>:4000/wgymd
 * - Prod(외부 사용): 위 PROD_API_URL을 실제 배포 도메인으로 교체
 */


