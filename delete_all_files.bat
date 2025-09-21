@echo off
echo ========================================
echo    Șterge toate fișierele din GitHub
echo ========================================
echo.
echo ATENȚIE: Această operațiune va șterge TOATE fișierele din repository!
echo.
echo Pași:
echo 1. Clonează repository-ul local
echo 2. Șterge toate fișierele
echo 3. Commit și push modificările
echo.
echo Vrei să continui? (y/n)
set /p choice=
if /i "%choice%"=="y" (
    echo.
    echo Clonare repository...
    git clone https://github.com/Alexr00t/foodapp.git temp_repo
    cd temp_repo
    
    echo Ștergere fișiere...
    del /q *.*
    rmdir /s /q .git
    
    echo Commit modificări...
    git init
    git add .
    git commit -m "Delete all files"
    git branch -M main
    git remote add origin https://github.com/Alexr00t/foodapp.git
    git push -u origin main --force
    
    echo.
    echo ✅ Toate fișierele au fost șterse!
    echo.
    cd ..
    rmdir /s /q temp_repo
) else (
    echo Operațiune anulată.
)
echo.
pause
