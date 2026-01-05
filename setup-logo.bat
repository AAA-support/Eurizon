@echo off
echo Setting up Eurizon Investment Portal Logo and Favicon...
echo.

REM Navigate to project directory
cd C:\Users\Administrator\eurizon-frontend

REM Create public directory if it doesn't exist
if not exist "public" mkdir public

REM Copy favicon from desktop
echo Copying favicon...
copy "%USERPROFILE%\Desktop\eurizoninvestmentcp.com(2)" "public\favicon.ico"
if %errorlevel% equ 0 (
    echo ✓ Favicon copied successfully
) else (
    echo ✗ Failed to copy favicon
)

REM Copy logo from desktop
echo Copying logo...
copy "%USERPROFILE%\Desktop\eurizoninvestmentcp.com(4)" "public\logo.png"
if %errorlevel% equ 0 (
    echo ✓ Logo copied successfully
) else (
    echo ✗ Failed to copy logo
)

REM Update index.html with favicon
echo Updating index.html...
powershell -Command "(Get-Content 'public\index.html') -replace '<title>.*</title>', '<title>Eurizon Investment Portal</title>' | Set-Content 'public\index.html'"
powershell -Command "(Get-Content 'public\index.html') -replace '</title>', '</title>^<link rel=\"icon\" href=\"/favicon.ico\" />' | Set-Content 'public\index.html'"

echo ✓ Updated index.html

echo.
echo All files have been set up! Now updating the React code...
echo.

REM Create updated App.js with logo references
echo Creating updated App.js...
powershell -Command "
$appContent = Get-Content 'src\App.js' -Raw
$appContent = $appContent -replace 'className=\"mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3\">[^<]*<span[^>]*>E</span>[^<]*</div>', 'className=\"mx-auto w-12 h-12 mb-3\"><img src=\"/logo.png\" alt=\"Eurizon\" className=\"w-full h-full object-contain rounded-full\" /></div>'
$appContent = $appContent -replace 'className=\"w-8 h-8\">[^<]*<img[^>]*>[^<]*</div>', 'className=\"w-8 h-8\"><img src=\"/logo.png\" alt=\"Eurizon\" className=\"w-full h-full object-contain\" /></div>'
$appContent = $appContent -replace '<div className=\"w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center\">[^<]*<span[^>]*>E</span>[^<]*</div>', '<div className=\"w-8 h-8\"><img src=\"/logo.png\" alt=\"Eurizon\" className=\"w-full h-full object-contain\" /></div>'
Set-Content 'src\App.js' $appContent
"

echo ✓ Updated App.js with logo references
echo.
echo Setup complete! Your logo and favicon are now integrated.
echo.
echo Next steps:
echo 1. Run: npm run build
echo 2. Deploy to Netlify
echo.
pause