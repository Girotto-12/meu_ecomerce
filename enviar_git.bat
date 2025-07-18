@echo off
echo ================================
echo Subindo projeto para o GitHub...
echo ================================
cd /d "%~dp0"

git init

REM Remove a origem anterior se existir
git remote remove origin 2>nul

REM Adiciona o repositório correto
git remote add origin https://github.com/Girotto-12/meu_ecomerce.git

git add .
git commit -m "🚀 Primeira versão do site de linguiças"
git branch -M main
git push -u origin main

echo.
echo ✅ Projeto enviado com sucesso!
pause
