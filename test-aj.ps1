$cap = (Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/captcha" -UseBasicParsing).Content | ConvertFrom-Json
$a=[int]($cap.question.Split(' ')[2]); $b=[int]($cap.question.Split(' ')[4].TrimEnd('?')); $ans=($a+$b).ToString()
$body = @{ name='AJ Tester'; email='ajtester@example.com'; password='password123'; role='candidate'; phone='9876543210'; captchaId=$cap.id; captchaAnswer=$ans } | ConvertTo-Json
try { Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/register" -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing | Out-Null } catch {}
$loginCap = (Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/captcha" -UseBasicParsing).Content | ConvertFrom-Json
$a=[int]($loginCap.question.Split(' ')[2]); $b=[int]($loginCap.question.Split(' ')[4].TrimEnd('?')); $ans=($a+$b).ToString()
$login = @{ email='ajtester@example.com'; password='password123'; captchaId=$loginCap.id; captchaAnswer=$ans } | ConvertTo-Json
$lr = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/login" -Method POST -Body $login -ContentType 'application/json' -UseBasicParsing
$token = ($lr.Content | ConvertFrom-Json).token
$q = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/quiz/generate" -Method POST -Headers @{ Authorization = "Bearer $token" } -Body (@{ topic='React' } | ConvertTo-Json) -ContentType 'application/json' -UseBasicParsing
Write-Host "QUIZ RESPONSE:" ($q.Content.Substring(0,400))