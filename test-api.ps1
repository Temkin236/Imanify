#!/usr/bin/env pwsh
# Test Imanify Backend API

$BaseUrl = "http://localhost:5000"
$TestEmail = "testuser_$(Get-Random)@test.com"
$TestPassword = "Test123456"

Write-Host "🧪 Testing Imanify Backend API..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ API is running" -ForegroundColor Green
    Write-Host "Response: $($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2)" -ForegroundColor Green
} catch {
    Write-Host "❌ API health check failed" -ForegroundColor Red
}

# Test 2: Register User
Write-Host "`n2️⃣  Testing Register..." -ForegroundColor Yellow
try {
    $body = @{email = $TestEmail; password = $TestPassword} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ User registered: $TestEmail" -ForegroundColor Green
    $token = $data.data.token
    Write-Host "Token: $token" -ForegroundColor Green
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Login
Write-Host "`n3️⃣  Testing Login..." -ForegroundColor Yellow
try {
    $body = @{email = $TestEmail; password = $TestPassword} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login successful" -ForegroundColor Green
    $token = $data.data.token
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Get Profile
Write-Host "`n4️⃣  Testing Get Profile..." -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer $token"}
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/user/profile" -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Profile retrieved" -ForegroundColor Green
    Write-Host "Email: $($data.data.email)" -ForegroundColor Green
    Write-Host "Streak: $($data.data.streak)" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Post Activity
Write-Host "`n5️⃣  Testing Post Activity..." -ForegroundColor Yellow
try {
    $headers = @{"Authorization" = "Bearer $token"}
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/user/activity" -Method POST -Headers $headers -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Activity posted" -ForegroundColor Green
    Write-Host "Streak updated: $($data.data.streak)" -ForegroundColor Green
} catch {
    Write-Host "❌ Activity posting failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Quran
Write-Host "`n6️⃣  Testing Get Quran Verse..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/quran/1/1" -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Quran verse retrieved" -ForegroundColor Green
    Write-Host "Surah 1, Ayah 1:" -ForegroundColor Green
    Write-Host "Arabic: $($data.data.arabic)" -ForegroundColor Green
    Write-Host "English: $($data.data.english)" -ForegroundColor Green
} catch {
    Write-Host "❌ Quran retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get Azkar
Write-Host "`n7️⃣  Testing Get Azkar..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/azkar" -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Azkar retrieved" -ForegroundColor Green
    Write-Host "Total Azkar: $($data.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Azkar retrieval failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Chat (RAG)
Write-Host "`n8️⃣  Testing Chat (RAG)..." -ForegroundColor Yellow
try {
    $body = @{message = "What does Islam teach about patience?"} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Chat response received" -ForegroundColor Green
    Write-Host "Answer: $($data.data.answer.Substring(0, [Math]::Min(100, $data.data.answer.Length)))..." -ForegroundColor Green
    Write-Host "Quran verses: $($data.data.context.quran.Count)" -ForegroundColor Green
    Write-Host "Azkar found: $($data.data.context.azkar.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Chat failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "✅ All tests completed!" -ForegroundColor Cyan
