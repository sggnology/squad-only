insert into
    role_info (idx, created_at, updated_at, role)
values  (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ROLE_ADMIN'),
        (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ROLE_USER')
on conflict (idx) do nothing;
