INSERT INTO
user_info
    (idx, created_at, updated_at, is_deleted, name, nickname, user_id, user_pw)
VALUES
    (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'admin', 'squad_admin', 'admin', 'admin')
ON CONFLICT (idx) DO NOTHING; -- userid 컬럼에 UNIQUE 제약 조건이 있어야 작동
