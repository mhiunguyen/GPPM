@echo off
setlocal ENABLEDELAYEDEXPANSION

echo === DermaSafeAI: Push to GitHub (mhiunguyen/GPPM) ===

REM Ensure Git is installed
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git is not installed or not in PATH.
  echo Download: https://git-scm.com/download/win
  exit /b 1
)

REM Go to repository root (this script's directory)
cd /d %~dp0

REM Initialize git repo if needed
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo Initializing new git repository...
  git init || goto :fail
)

echo Using branch: feature/symptom-validation
git checkout -B feature/symptom-validation || goto :fail

echo Staging changes...
git add -A || goto :fail

REM Ensure local author identity (use env overrides if provided)
if "%GIT_USER_NAME%"=="" set GIT_USER_NAME=mhiunguyen
if "%GIT_USER_EMAIL%"=="" set GIT_USER_EMAIL=mhiunguyen@users.noreply.github.com

echo Configuring local git identity: name="%GIT_USER_NAME%", email="%GIT_USER_EMAIL%"
git config user.name "%GIT_USER_NAME%" || goto :fail
git config user.email "%GIT_USER_EMAIL%" || goto :fail

echo Committing changes...
if exist COMMIT_MESSAGE.txt (
  git commit -F COMMIT_MESSAGE.txt || goto :maybe_empty
) else (
  git commit -m "feat(symptoms): add Symptom Validation API + frontend integration" || goto :maybe_empty
)

:maybe_empty
REM If commit fails because there is nothing to commit, continue

REM Configure remote
set REMOTE_URL=https://github.com/mhiunguyen/GPPM.git
echo Configuring remote 'origin' to %REMOTE_URL%
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin %REMOTE_URL% || goto :fail
) else (
  git remote set-url origin %REMOTE_URL% || goto :fail
)

REM Optional auth via env vars (avoid interactive prompt)
if not "%GITHUB_TOKEN%"=="" (
  if "%GITHUB_USERNAME%"=="" set GITHUB_USERNAME=mhiunguyen
  set REMOTE_AUTH=https://%GITHUB_USERNAME%:%GITHUB_TOKEN%@github.com/mhiunguyen/GPPM.git
  echo Using token auth for push (user=%GITHUB_USERNAME%)
  git remote set-url origin %REMOTE_AUTH% || goto :fail
)

echo Pushing branch to GitHub...
git push -u origin feature/symptom-validation || goto :auth_help

echo.
echo ✅ Success! Open PR here:
echo    https://github.com/mhiunguyen/GPPM/compare/feature/symptom-validation?expand=1
echo.
exit /b 0

:auth_help
echo.
echo [ERROR] Push failed. Likely an auth issue. Options:
echo   1) Run: git credential-manager configure  (if you use Git Credential Manager)
echo   2) Set env vars then re-run this script (temporary in current cmd):
echo      set GITHUB_USERNAME=your_github_username
echo      set GITHUB_TOKEN=your_pat_here
echo   Get a Personal Access Token (PAT): https://github.com/settings/tokens
echo.
echo Or push manually:
echo   git push -u origin feature/symptom-validation
echo.
exit /b 1

:fail
echo.
echo [ERROR] An unexpected error occurred. Aborting.
echo.
exit /b 1
