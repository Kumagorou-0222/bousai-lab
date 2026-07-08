@echo off
echo === 防災Lab X自動投稿 タスクスケジューラ登録 ===
echo.

set PYTHON=C:\Users\Lenovo\AppData\Local\Python\pythoncore-3.14-64\python.exe
set SCRIPT=H:\マイドライブ\031_bousai-lab\disaster-bot\scheduled_post_runner.py
set WORKDIR=H:\マイドライブ\031_bousai-lab\disaster-bot

schtasks /create /tn "BousaiLab-Morning" /tr "\"%PYTHON%\" \"%SCRIPT%\" morning --auto-post" /sc daily /st 07:00 /sd 01/01/2026 /f
schtasks /create /tn "BousaiLab-Noon"    /tr "\"%PYTHON%\" \"%SCRIPT%\" noon --auto-post"    /sc daily /st 12:00 /sd 01/01/2026 /f
schtasks /create /tn "BousaiLab-Evening" /tr "\"%PYTHON%\" \"%SCRIPT%\" evening --auto-post" /sc daily /st 21:00 /sd 01/01/2026 /f

echo.
echo 登録完了！確認してください：
schtasks /query /tn "BousaiLab-Morning"
schtasks /query /tn "BousaiLab-Noon"
schtasks /query /tn "BousaiLab-Evening"
echo.
pause
