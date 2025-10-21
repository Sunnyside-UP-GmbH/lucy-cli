# TypeScript Debugging Guide for Daily Verse

## Overview
This guide explains how to properly debug your React Native/Expo TypeScript application using VS Code.

## Prerequisites
1. **VS Code Extensions** (install these):
   - Expo Tools (`expo.vscode-expo-tools`)
   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier

2. **Development Setup**:
   - Ensure you have `expo-dev-client` installed (✅ already in package.json)
   - Source maps are enabled (✅ configured in tsconfig.json and metro.config.js)

## Debugging Configurations

### 1. Debug Expo (Development Build) - **RECOMMENDED**
**Use this for**: Debugging React Native app on device/simulator
**Steps**:
1. Start Expo development server: `pnpm dev`
2. Open your app on device/simulator
3. In VS Code: Run & Debug → "Debug Expo (Development Build)"
4. Set breakpoints in your TypeScript files
5. Interact with your app to hit breakpoints

### 2. Debug Expo Web
**Use this for**: Debugging web version of your app
**Steps**:
1. In VS Code: Run & Debug → "Debug Expo Web"
2. This will start the web server and open browser
3. Set breakpoints in your TypeScript files
4. Interact with web app to hit breakpoints

### 3. Attach to Hermes (React Native Direct)
**Use this for**: Advanced debugging with Hermes engine
**Steps**:
1. Start your app with Hermes debugging enabled
2. In VS Code: Run & Debug → "Attach to Hermes (React Native Direct)"
3. Set breakpoints and debug

### 4. Debug TypeScript Scripts
**Use this for**: Debugging standalone TypeScript files (like scripts/)
**Steps**:
1. Open the TypeScript file you want to debug
2. In VS Code: Run & Debug → "Debug TypeScript Scripts"
3. This will run the current file with tsx

## Setting Breakpoints

### ✅ DO:
- Set breakpoints in `.ts` and `.tsx` files
- Use conditional breakpoints for specific scenarios
- Set breakpoints in component methods, hooks, and utility functions
- Use logpoints for non-intrusive debugging

### ❌ DON'T:
- Set breakpoints in `node_modules` files
- Set breakpoints in generated/compiled files
- Set breakpoints in files without source maps

## Common Issues & Solutions

### Issue: Breakpoints not hitting
**Solutions**:
1. Ensure source maps are enabled (✅ already configured)
2. Make sure you're using the correct debug configuration
3. Verify the development server is running
4. Check that you're debugging the right platform (web vs mobile)
5. Restart the debug session

### Issue: "Cannot connect to runtime process"
**Solutions**:
1. Ensure Expo development server is running (`pnpm dev`)
2. Make sure your app is open and connected to the development server
3. Check that ports 8081 and 8082 are not blocked
4. Try restarting both the Expo server and debug session

### Issue: Source maps not working
**Solutions**:
1. Clear Metro cache: `pnpm dev --clear`
2. Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
3. Check that `sourceMap: true` is in tsconfig.json (✅ already set)

## Best Practices

1. **Use Development Builds**: Always debug with development builds, not production
2. **Clear Cache**: When in doubt, clear Metro cache with `--clear` flag
3. **Restart Services**: Restart both Expo server and VS Code debug session if issues persist
4. **Check Console**: Monitor both VS Code Debug Console and Expo development tools
5. **Use Logpoints**: For quick debugging without stopping execution

## File Structure for Debugging
```
.vscode/
├── launch.json          # Debug configurations
├── settings.json        # VS Code workspace settings
└── extensions.json      # Recommended extensions

metro.config.js          # Metro bundler config (source maps enabled)
tsconfig.json           # TypeScript config (source maps enabled)
```

## Quick Start
1. Install recommended VS Code extensions
2. Run `pnpm dev` to start Expo development server
3. Open your app on device/simulator
4. In VS Code: F5 or Run & Debug → "Debug Expo (Development Build)"
5. Set breakpoints in your TypeScript code
6. Interact with your app to trigger breakpoints

## Troubleshooting Commands
```bash
# Clear Metro cache
pnpm dev --clear

# Reset Expo
expo r -c

# Check Expo doctor
pnpm doctor

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```
