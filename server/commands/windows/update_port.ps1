# update_port.ps1

# 배치 파일에서 전달받은 인자를 처리하기 위한 파라미터 블록
param (
    [string]$AppPort
)

Write-Host "external 포트를 $AppPort 로 변경합니다..."

$yamlFile = '.\docker-compose.yml'
$lines = Get-Content $yamlFile

$inApplicationSection = $false
$inPortsSection = $false

# 파일을 한 줄씩 읽어서 새로운 내용으로 교체
$newLines = foreach ($line in $lines) {
    if ($line -match '^\s*application:') {
        $inApplicationSection = $true
    }
    if ($inApplicationSection -and $line -match '^\s*ports:') {
        $inPortsSection = $true
    }

    # application 섹션의 ports 에서 포트 부분을 찾아 교체
    if ($inPortsSection -and $line -match '^\s*-\s*"(\d+):(\d+)"') {
        $internalPort = $Matches[2]
        # 변수와 문자를 조합하여 새로운 라인 생성
        $newLine = $line -replace '\d+:', "${AppPort}:"
        $newLine # 수정된 라인을 출력하여 $newLines에 추가
        $inPortsSection = $false # 작업 완료 후 플래그 초기화
    } else {
        $line
    }
}

# 수정된 내용으로 파일 덮어쓰기
$newLines | Set-Content $yamlFile -Encoding UTF8

Write-Host "✅ docker-compose.yml 파일의 포트가 성공적으로 변경되었습니다."