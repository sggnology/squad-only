import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSiteName, siteAsync, updateSiteAsync } from '../../store/siteSlice';

function SiteManagement() {
  const dispatch = useAppDispatch();
  const currentSiteName = useAppSelector(selectSiteName);
  
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSiteName(currentSiteName);
  }, [currentSiteName]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(siteAsync());
    } catch (err) {
      setError('사이트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!siteName.trim()) {
      setError('사이트 이름을 입력해주세요.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Redux를 통한 API 호출
      await dispatch(updateSiteAsync({ name: siteName.trim() }));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || '사이트 정보 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSiteName(currentSiteName);
    setError(null);
    setSuccess(false);
  };

  const isChanged = siteName !== currentSiteName;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon color="primary" />
          사이트 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          사이트의 기본 정보를 관리할 수 있습니다.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          사이트 정보가 성공적으로 저장되었습니다.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="사이트 이름"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              fullWidth
              variant="outlined"
              disabled={loading || saving}
              helperText="사이트 헤더에 표시될 이름입니다."
              error={!!error && !siteName.trim()}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                현재 사이트 이름: <strong>{currentSiteName}</strong>
              </Typography>
              {loading && <CircularProgress size={16} />}
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading || saving}
          >
            새로고침
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!isChanged || loading || saving}
            >
              취소
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={!isChanged || loading || saving || !siteName.trim()}
            >
              {saving ? '저장 중...' : '저장'}
            </Button>
          </Box>
        </CardActions>
      </Card>

      {/* 추가 설정 섹션 (향후 확장 가능) */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            추가 설정
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary">
            추가 사이트 설정 기능은 향후 업데이트에서 제공될 예정입니다.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SiteManagement;
