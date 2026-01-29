# Performance Optimization Guide

## Quick Fixes Applied ✅

### 1. **Next.js Configuration Optimizations**
- ✅ Enabled image optimization with WebP/AVIF support
- ✅ Enabled CSS optimization
- ✅ Removed source maps in production
- ✅ Enabled SWC minification
- ✅ Removed X-Powered-By header

### 2. **Navigation Component Optimizations**
- ✅ Added `requestAnimationFrame` for scroll events (60fps)
- ✅ Added `useCallback` for event handlers
- ✅ Added `useMemo` for navItems array
- ✅ Added `passive: true` to scroll listener for better performance

### 3. **Package Configuration**
- ✅ Created `.npmrc` for faster npm installs

---

## Additional Optimization Steps

### Step 1: Clear Cache & Reinstall
```powershell
# Remove node_modules and lock files
Remove-Item -Recurse -Force node_modules
Remove-Item -Path package-lock.json -Force

# Reinstall dependencies
npm install

# Clean Next.js cache
Remove-Item -Recurse -Force .next
```

### Step 2: Optimize Images
- Replace external URLs with optimized local images
- Use Next.js `<Image>` component instead of `<img>`
- Compress images to <100KB each

Example:
```tsx
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
```

### Step 3: Lazy Load Components
For sections below the fold, use dynamic imports:
```tsx
import dynamic from 'next/dynamic';

const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### Step 4: Disable Animations in Dev (Optional)
Add to `.env.local`:
```
NEXT_PUBLIC_DISABLE_ANIMATIONS=true
```

Then in components:
```tsx
const isAnimationDisabled = process.env.NEXT_PUBLIC_DISABLE_ANIMATIONS === 'true';

<motion.div
  initial={!isAnimationDisabled ? { y: -100 } : undefined}
  animate={!isAnimationDisabled ? { y: 0 } : undefined}
>
```

### Step 5: Monitor Bundle Size
```powershell
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
$env:ANALYZE = 'true'; npm run build
```

### Step 6: Enable Database Connection Pooling
In `.env.local`, use connection pooling:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# Add pooling for better performance
```

---

## Performance Checklist

- [ ] Clear cache: `npm run clean` (if added)
- [ ] Reinstall dependencies: `npm install`
- [ ] Test local dev: `npm run dev`
- [ ] Check page load time (should be <3s)
- [ ] Navigation should be instant
- [ ] No console errors
- [ ] Images load smoothly
- [ ] Animations are smooth (60fps)

---

## Monitoring Performance

### Check in Browser DevTools:
1. **Lighthouse**: DevTools > Lighthouse > Analyze page load
2. **Performance Tab**: DevTools > Performance > Record
3. **Network Tab**: DevTools > Network > Check bundle sizes
4. **Coverage Tab**: DevTools > Coverage > Check unused CSS/JS

---

## Recommended Deployment Optimizations

For production deployment:
1. Use Vercel (auto-optimizes Next.js)
2. Enable Gzip compression on server
3. Use CDN for static assets
4. Enable caching headers
5. Monitor with Sentry/LogRocket

---

## Need More Help?

Run these commands to debug:
```powershell
# Check build time
npm run build

# Analyze what's slow
npm run dev -- --debug

# Clear all cache
npm run clean:all
# (Add this script to package.json if needed)
```

Add to package.json scripts if needed:
```json
"clean:all": "Remove-Item -Recurse -Force node_modules .next && npm install",
"analyze": "ANALYZE=true npm run build"
```
