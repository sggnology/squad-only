-- =====================================================
-- PostgreSQL 타임존 마이그레이션 스크립트
-- TIMESTAMP → TIMESTAMPTZ 변환 
-- =====================================================

-- 현재 타임존 확인
SHOW timezone;

-- 세션 타임존을 UTC로 설정
SET timezone = 'UTC';

-- 백업 테이블 생성 (선택사항)
-- CREATE TABLE user_info_backup AS SELECT * FROM user_info;
-- CREATE TABLE role_info_backup AS SELECT * FROM role_info;
-- CREATE TABLE config_info_backup AS SELECT * FROM config_info;

-- =====================================================
-- 1. user_info 테이블 마이그레이션
-- =====================================================

-- created_at 컬럼을 TIMESTAMPTZ로 변경
-- 기존 데이터를 UTC로 간주하고 변환
ALTER TABLE user_info 
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

-- updated_at 컬럼을 TIMESTAMPTZ로 변경
ALTER TABLE user_info 
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- last_login_at 컬럼을 TIMESTAMPTZ로 변경 (NULL 값 허용)
ALTER TABLE user_info 
ALTER COLUMN last_login_at TYPE TIMESTAMPTZ USING 
    CASE 
        WHEN last_login_at IS NULL THEN NULL 
        ELSE last_login_at AT TIME ZONE 'UTC' 
    END;

-- =====================================================
-- 2. role_info 테이블 마이그레이션
-- =====================================================

ALTER TABLE role_info 
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';

ALTER TABLE role_info 
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';

-- =====================================================
-- 3. config_info 테이블 마이그레이션 (존재하는 경우)
-- =====================================================

-- config_info 테이블이 존재하는지 확인 후 실행
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'config_info') THEN
        ALTER TABLE config_info 
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC';
        
        ALTER TABLE config_info 
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC';
        
        RAISE NOTICE 'config_info 테이블 마이그레이션 완료';
    ELSE
        RAISE NOTICE 'config_info 테이블이 존재하지 않음';
    END IF;
END $$;

-- =====================================================
-- 4. 기타 테이블들 마이그레이션
-- =====================================================

-- content 관련 테이블들
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- 모든 테이블에서 created_at, updated_at 컬럼을 찾아 변환
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('user_info', 'role_info', 'config_info')
    LOOP
        -- created_at 컬럼이 있는지 확인 후 변환
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = table_record.table_name 
            AND column_name = 'created_at'
            AND data_type = 'timestamp without time zone'
        ) THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE ''UTC''', 
                          table_record.table_name);
            RAISE NOTICE '% 테이블의 created_at 컬럼 변환 완료', table_record.table_name;
        END IF;
        
        -- updated_at 컬럼이 있는지 확인 후 변환
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = table_record.table_name 
            AND column_name = 'updated_at'
            AND data_type = 'timestamp without time zone'
        ) THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE ''UTC''', 
                          table_record.table_name);
            RAISE NOTICE '% 테이블의 updated_at 컬럼 변환 완료', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- =====================================================
-- 5. 변환 결과 확인
-- =====================================================

-- 모든 테이블의 timestamp 관련 컬럼 확인
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name IN ('created_at', 'updated_at', 'last_login_at')
ORDER BY table_name, column_name;

-- 샘플 데이터 확인
SELECT 'user_info' as table_name, created_at, updated_at, last_login_at 
FROM user_info 
LIMIT 3;

-- 현재 시간 확인
SELECT 
    NOW() as current_time_with_tz,
    CURRENT_TIMESTAMP as current_timestamp,
    timezone('UTC', NOW()) as utc_time;

-- =====================================================
-- 마이그레이션 완료 메시지
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=======================================================';
    RAISE NOTICE '✅ TIMESTAMPTZ 마이그레이션이 완료되었습니다!';
    RAISE NOTICE '=======================================================';
    RAISE NOTICE '📋 변경 사항:';
    RAISE NOTICE '   - 모든 TIMESTAMP 컬럼이 TIMESTAMPTZ로 변환됨';
    RAISE NOTICE '   - 기존 데이터는 UTC 시간으로 간주하여 변환됨';
    RAISE NOTICE '   - 새로운 데이터는 자동으로 TIMESTAMPTZ로 저장됨';
    RAISE NOTICE '=======================================================';
END $$;
