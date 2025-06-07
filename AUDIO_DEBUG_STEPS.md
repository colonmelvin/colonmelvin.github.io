# 🔧 Audio Debug Steps

## Step-by-Step Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Browser Console
- Press F12 or right-click → Inspect
- Go to Console tab
- Keep it open while testing

### 3. Test Audio System Initialization
When the page loads, you should see:
```
✅ Audio context initialized successfully
```

If you see an error here, the Web Audio API isn't working.

### 4. Test Basic Audio (Most Important)
1. Open vibe controls (🎛️ button)
2. Click the **🧪 Test Audio** button (should be visible in development)
3. You should see console logs like:
   ```
   🧪 Test button clicked
   Current state: {soundLevel: 0, currentAmbientSound: null}
   🧪 Testing audio system...
   ✅ Audio context state: running
   ✅ Audio context resumed
   ✅ Test tone played successfully
   ```
4. **You should hear a brief beep sound** (440Hz tone for 0.5 seconds)

**If you don't hear the beep, the Web Audio API isn't working in your browser.**

### 5. Test Sound Level Slider
1. Move the "Ambient Sound" slider to 50%
2. You should see console logs:
   ```
   🔊 setSoundLevel called with value: 50
   🔊 updateAmbientSound called: {soundLevel: 50, currentAmbientSound: null}
   🎵 Playing rain at 50% volume
   🎵 AudioManager: Creating rain sound at volume 0.5
   🌧️ Creating rain sound
   🌧️ Creating rain sound with volume: 0.5
   ✅ Rain sound started successfully
   ```
3. **You should hear continuous rain-like white noise**

### 6. Test Sound Type Buttons
1. With sound level > 0, click the **🌧️ Rain** button
2. You should see it highlight and hear rain sounds
3. Click **⌨️ Keyboard** button
4. You should hear periodic clicking sounds
5. Try **☕ Cafe** and **🌲 Forest** buttons

### 7. Test Presets
1. Click **😌 Chill** preset
2. Console should show:
   ```
   🎨 applyPreset called with: chill
   🎨 Preset values: {ambiance: 60, colorHue: 180, ...}
   🔊 updateAmbientSound called: {soundLevel: 40, currentAmbientSound: "rain"}
   ```
3. **You should hear rain sounds at 40% volume**

## Common Issues & Solutions

### Issue: No console logs at all
**Solution**: Make sure you're running in development mode (`npm run dev`)

### Issue: "Audio context not available"
**Solutions**:
- Try a different browser (Chrome/Firefox/Safari)
- Check if browser has audio permissions
- Try clicking somewhere on the page first (user interaction required)

### Issue: Console logs but no sound
**Solutions**:
- Check browser volume
- Check system volume
- Try headphones
- Check if browser is muted
- Try the test audio button first

### Issue: Test tone works but ambient sounds don't
**Solutions**:
- Check for JavaScript errors in console
- Try refreshing the page
- Check if the specific sound generation is failing

### Issue: Slider moves but no logs
**Solution**: There might be an issue with the Zustand store connection

## What Should Work

✅ **Test Audio Button**: Should play a beep and show logs
✅ **Sound Level Slider**: Should trigger logs and start ambient sounds
✅ **Sound Type Buttons**: Should switch between different ambient sounds
✅ **Presets**: Should change sound type and volume automatically
✅ **Volume Control**: Should affect the loudness of ambient sounds

## Next Steps

Based on what you find:

1. **If test audio doesn't work**: Web Audio API issue
2. **If test audio works but sliders don't**: UI/store connection issue  
3. **If logs show but no sound**: Audio generation issue
4. **If no logs at all**: Development mode or store issue

Let me know what you see in the console and what you hear!
