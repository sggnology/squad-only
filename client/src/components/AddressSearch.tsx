import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { LocationOn as LocationIcon, Search as SearchIcon } from '@mui/icons-material';

// 카카오 주소 API 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: (state: string) => void;
        onsearch?: (data: { count: number }) => void;
        width?: string | number;
        height?: string | number;
        maxSuggestItems?: number;
        alwaysShowEngAddr?: boolean;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

interface DaumPostcodeData {
  address: string;         // 기본 주소 (지번 또는 도로명)
  roadAddress: string;     // 도로명 주소
  jibunAddress: string;    // 지번 주소
  zonecode: string;        // 우편번호
  buildingName: string;    // 건물명
  addressType: 'R' | 'J';  // R: 도로명, J: 지번
  userSelectedType: 'R' | 'J'; // 사용자가 선택한 주소 타입
  sido: string;            // 시도
  sigungu: string;         // 시군구
  bname: string;           // 법정동/법정리
  roadname: string;        // 도로명
  buildingCode: string;    // 건물 관리번호
}

interface AddressSearchProps {
  value: string;
  onChange: (address: string, zonecode?: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
  label = '주소',
  placeholder = '주소를 검색해주세요',
  required = false,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [zonecode, setZonecode] = useState('');

  const handleAddressSearch = () => {
    if (disabled) return;

    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleAddressComplete = (data: DaumPostcodeData) => {
    // 사용자가 선택한 주소 타입에 따라 주소 설정
    const selectedAddr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

    setSelectedAddress(selectedAddr);
    setZonecode(data.zonecode);
    setIsModalOpen(false);

    // 상세주소 입력을 위해 잠시 대기
    setTimeout(() => {
      const fullAddress = selectedAddr;
      onChange(fullAddress, data.zonecode);
    }, 100);
  };

  const handleDetailAddressSubmit = () => {
    const fullAddress = detailAddress
      ? `${selectedAddress}, ${detailAddress}`
      : selectedAddress;
    onChange(fullAddress, zonecode);
    setDetailAddress('');
  };

  return (
    <Box>
      <TextField
        label={label}
        value={value}
        placeholder={placeholder}
        fullWidth
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        onClick={handleAddressSearch}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SearchIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />} // 모바일에서 아이콘 크기 조정
                  onClick={handleAddressSearch}
                  disabled={disabled}
                  sx={{
                    ml: 1,
                    minWidth: { xs: '60px', sm: '80px' }, // 모바일에서 버튼 최소 너비
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, // 모바일에서 폰트 크기 조정
                    px: { xs: 1, sm: 2 } // 모바일에서 패딩 조정
                  }}
                >
                  검색
                </Button>
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon
                  color={error ? 'error' : 'primary'}
                  sx={{ fontSize: { xs: 20, sm: 24 } }} // 모바일에서 아이콘 크기 조정
                />
              </InputAdornment>
            ),
          }
        }}
        sx={{
          cursor: disabled ? 'default' : 'pointer',
          '& .MuiInputBase-input': {
            cursor: disabled ? 'default' : 'pointer',
            fontSize: { xs: '0.9rem', sm: '1rem' } // 모바일에서 입력 텍스트 크기 조정
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '0.9rem', sm: '1rem' } // 모바일에서 라벨 크기 조정
          }
        }}
      />{
        
        /* 주소 검색 모달 */}      
        <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: { xs: '80vh', sm: '800px' }, // 높이 증가
            maxHeight: { xs: '80vh', sm: '800px' },
            margin: { xs: 1, sm: 2 },
            padding: { xs: 1, sm: 0 },
            borderRadius: { xs: 2, sm: 2 },
            width: { xs: '95vw', sm: '700px' }, // 모바일에서 너비 증가
            maxWidth: { xs: '95vw', sm: 'md' }
          }
        }}
      >
        <DialogTitle sx={{
          pb: { xs: 1, sm: 2 }, // 모바일에서 패딩 줄이기
          borderBottom: '1px solid #e0e0e0' // 구분선 추가
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon color="primary" />
            주소 검색
          </Box>
        </DialogTitle>        
        <DialogContent sx={{
          p: { xs: 0.5, sm: 1 }, // 패딩 최소화
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: { xs: 'calc(80vh - 150px)', sm: '600px' } // 충분한 높이 확보
        }}>
          <Box
            id="postcode-container"
            sx={{
              width: '100%',
              height: '100%',
              minHeight: { xs: 'calc(80vh - 150px)', sm: '600px' },
              flex: 1,              // 카카오 주소 검색 UI 최적화
              '& iframe': {
                width: '100% !important',
                height: '100% !important',
                border: 'none'
              },
              // 카카오 주소 검색 내부 요소들의 크기 조정
              '& .postcode_container': {
                width: '100% !important',
                height: '100% !important'
              },
              // 자동완성 리스트가 잘리지 않도록 CSS 추가
              '& .suggest_item': {
                whiteSpace: 'nowrap !important',
                overflow: 'visible !important',
                textOverflow: 'unset !important'
              },
              '& .suggest_list': {
                maxWidth: 'none !important',
                width: '100% !important'
              },
              // 검색 결과 항목들이 잘리지 않도록
              '& .list_item': {
                whiteSpace: 'normal !important',
                wordBreak: 'keep-all !important',
                overflow: 'visible !important'
              }
            }}
            ref={(element: HTMLDivElement | null) => {
              if (element && window.daum && isModalOpen) {
                // 기존 내용 초기화
                element.innerHTML = '';                // 카카오 주소 검색 임베드
                new window.daum.Postcode({
                  oncomplete: handleAddressComplete,
                  onclose: (state: string) => {
                    if (state === 'FORCE_CLOSE' || state === 'COMPLETE_CLOSE') {
                      setIsModalOpen(false);
                    }
                  },
                  // 추가 옵션으로 더 넓은 UI 사용
                  width: '100%',
                  height: '100%',
                  maxSuggestItems: 10, // 자동완성 최대 개수 설정
                  alwaysShowEngAddr: false // 항상 영문 주소 표시 여부
                }).embed(element);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{
          borderTop: '1px solid #e0e0e0', // 구분선 추가
          p: { xs: 1.5, sm: 3 }, // 모바일에서 패딩 줄이기
          justifyContent: 'center'
        }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outlined"
            sx={{
              minWidth: { xs: '120px', sm: '80px' }, // 모바일에서 버튼 크기 확대
              fontSize: { xs: '1rem', sm: '0.875rem' },
              // 모바일에서 medium 크기, 데스크톱에서 large 크기
              height: { xs: '40px', sm: '36px' },
              px: { xs: 3, sm: 2 }
            }}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 상세주소 입력 안내 */}
      {selectedAddress && !value.includes(',') && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            선택된 주소: {selectedAddress}
          </Alert>
          <TextField
            label="상세주소 (선택사항)"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="동, 호수 등 상세주소를 입력하세요"
            fullWidth
            size="small"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleDetailAddressSubmit();
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={handleDetailAddressSubmit}
                      disabled={!detailAddress.trim()}
                    >
                      완료
                    </Button>
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AddressSearch;
