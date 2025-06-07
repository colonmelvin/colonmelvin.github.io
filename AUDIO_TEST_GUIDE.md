# 🔊 Audio Testing Guide

## Quick Test Steps

1. **Start the dev server**: `npm run dev`
2. **Open browser console** (F12 → Console tab) to see debug logs
3. **Open vibe controls**: Click the 🎛️ button
4. **Test the presets first** (easiest way):
   - Click "😌 Chill" preset → Should hear rain sounds + see console logs
   - Click "🎯 Focus" preset → Should hear keyboard typing + see console logs
   - Click "⚡ Energy" preset → Should hear cafe ambience + see console logs
   - Click "🌙 Midnight" preset → Should hear forest sounds + see console logs

## Manual Testing

1. **Set sound level**: Move "Ambient Sound" slider to 50%
2. **Select sound type**: Click one of the sound buttons (⌨️🌧️☕🌲)
3. **Use test button**: Click "🧪 Test Audio" to trigger sound manually
4. **Check console**: Look for debug messages like:
   ```
   🔊 updateAmbientSound called: {soundLevel: 50, currentAmbientSound: "rain"}
   🎵 Playing rain at 50% volume
   🎵 AudioManager: Creating rain sound at volume 0.5
   🌧️ Creating rain sound
   ```

## Expected Sounds

- **⌨️ Keyboard**: Periodic clicking sounds (like typing)
- **🌧️ Rain**: Continuous white noise (like rainfall)
- **☕ Cafe**: Background noise + occasional chatter sounds
- **🌲 Forest**: Soft ambient + occasional bird chirps

## Troubleshooting

**No sound at all?**
- Check browser volume
- Look for console errors
- Try clicking a preset button first (user interaction required)
- Check if browser supports Web Audio API

**Console shows errors?**
- Look for "Audio context not available" messages
- Check for any red error messages
- Try refreshing the page

**Sounds but wrong type?**
- Check which sound type is selected (should highlight)
- Try clicking the sound type buttons directly
- Use the test button to force a sound update

## Debug Console Messages

You should see messages like:
```
🔊 updateAmbientSound called: {...}
🎵 AudioManager: Creating [type] sound at volume [X]
🌧️ Creating rain sound (or ⌨️, ☕, 🌲)
```

If you see "❌ Audio context not available", the Web Audio API isn't working.

## What Should Work Now

✅ **Presets change sound type**: Each preset should play its designated sound
✅ **Manual sound selection**: Clicking sound type buttons should work
✅ **Volume control**: Slider should affect volume in real-time
✅ **Sound switching**: Changing types should stop old sound and start new one
✅ **Debug logging**: Console should show what's happening

Let me know what you hear and what the console shows!
