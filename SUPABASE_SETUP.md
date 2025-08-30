# Supabase 설정 가이드

이 애플리케이션은 이제 **Supabase**를 사용하여 모든 데이터를 저장합니다. Convex는 완전히 제거되었습니다.

## 🚀 빠른 시작 (로컬 개발)

현재 설정으로도 완벽하게 작동합니다! 데이터는 **localStorage**에 저장됩니다.

## 🌐 실제 클라우드 데이터베이스 사용하기

### 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com)에서 계정 생성
2. "New Project" 클릭
3. 프로젝트 이름과 비밀번호 설정
4. **데이터베이스 설정**:
   - **Connections**: "Data API + Connection String" 선택 ✅
   - **API Configuration**: "Use public schema for Data API (Default)" 선택 ✅

### 2. 데이터베이스 테이블 생성

1. Supabase 대시보드에서 "SQL Editor" 이동
2. `supabase/schema.sql` 파일의 모든 내용을 복사
3. SQL Editor에 붙여넣기하고 "Run" 실행

### 3. 환경 변수 설정

`.env.local` 파일에서 다음 값들을 실제 Supabase 값으로 변경:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**값 찾는 방법:**
- Supabase 대시보드 → Settings → API
- `URL`: Project URL 복사
- `ANON_KEY`: anon public 키 복사

### 4. 완료!

이제 애플리케이션을 재시작하면 실제 클라우드 데이터베이스를 사용합니다.

## 📊 데이터베이스 구조

### 테이블들:
- **users**: 사용자 정보 및 크레딧
- **discussion_rooms**: 대화방 정보
- **conversations**: 채팅 기록
- **feedbacks**: AI 피드백 및 노트

### 자동 기능:
- ✅ **Row Level Security**: 사용자별 데이터 격리
- ✅ **자동 타임스탬프**: created_at, updated_at
- ✅ **인덱스 최적화**: 빠른 쿼리
- ✅ **실시간 동기화**: 변경사항 즉시 반영

## 🔄 마이그레이션

### Convex에서 Supabase로 완전 교체:

| Convex 기능 | Supabase 대체 |
|------------|--------------|
| `CreateUser` | `db.createUser()` |
| `UpdateUserToken` | `db.updateUserCredits()` |
| `CreateNewRoom` | `db.createDiscussionRoom()` |
| `UpdateConversation` | `db.updateRoomConversation()` |
| `UpdateSummery` | `db.updateRoomSummary()` |
| `GetDiscussionRoom` | `db.getDiscussionRoom()` |
| `GetAllDiscussionRoom` | `db.getUserDiscussionRooms()` |

### 실시간 기능:
- 모든 데이터 변경사항이 즉시 동기화됩니다
- localStorage 폴백으로 항상 안정적으로 작동합니다

## 💡 개발자 노트

- **자동 폴백**: Supabase 연결 실패시 localStorage 사용
- **에러 처리**: 모든 API 호출에 try-catch 적용
- **호환성**: 기존 Convex 코드와 완벽 호환
- **무료**: Supabase 무료 티어로 충분히 사용 가능

## 🛠️ 문제해결

### Q: "table doesn't exist" 에러
A: `supabase/schema.sql`을 SQL Editor에서 실행했는지 확인

### Q: 데이터가 저장되지 않음
A: 환경 변수가 올바른지 확인, 콘솔에서 "using localStorage" 메시지 확인

### Q: 권한 에러
A: Row Level Security 정책이 올바르게 설정되었는지 확인

---

**모든 Convex 기능이 완벽하게 Supabase로 이전되었습니다! 🎉**