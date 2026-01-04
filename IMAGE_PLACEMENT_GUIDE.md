# 📸 Image Placement Guide

## Where to Place Your Images

All images should be placed in the **`public`** folder. In Next.js, files in the `public` folder are served from the root URL (`/`).

## 📁 Required Folder Structure

Create these folders inside your `public` directory:

```
public/
├── logo.png                    ✅ (Already exists)
├── images/
│   ├── services/
│   │   ├── residential-solar.jpg
│   │   ├── commercial-solar.jpg
│   │   ├── industrial-solar.jpg
│   │   └── grid-systems.jpg
│   ├── benefits/
│   │   ├── reduce-bills.jpg
│   │   ├── low-maintenance.jpg
│   │   ├── eco-friendly.jpg
│   │   └── energy-independence.jpg
│   ├── why-choose-us/
│   │   ├── certified.jpg
│   │   ├── efficient-panels.jpg
│   │   ├── end-to-end.jpg
│   │   └── support.jpg
│   └── testimonials/
│       ├── harshdeep-patel.jpg
│       ├── suvarna-bhanushali.jpg
│       └── veeranna-ayyar.jpg
└── videos/
    └── dashboard.mp4           ✅ (Already exists)
```

## 🎯 Quick Setup Steps

### Step 1: Create the Folders

**On Windows (PowerShell):**
```powershell
cd public
mkdir images
cd images
mkdir services
mkdir benefits
mkdir "why-choose-us"
mkdir testimonials
```

**On Mac/Linux:**
```bash
cd public
mkdir -p images/services images/benefits images/why-choose-us images/testimonials
```

**Or manually:**
1. Open your project in File Explorer
2. Go to `public` folder
3. Create a new folder called `images`
4. Inside `images`, create these folders:
   - `services`
   - `benefits`
   - `why-choose-us`
   - `testimonials`

### Step 2: Add Your Images

Place your images in the corresponding folders with these **exact filenames**:

#### Services Section (4 images)
**Location:** `public/images/services/`
- `residential-solar.jpg` - Residential solar installation
- `commercial-solar.jpg` - Commercial building with solar
- `industrial-solar.jpg` - Industrial solar installation
- `grid-systems.jpg` - Grid-connected solar systems

#### Benefits Section (4 images)
**Location:** `public/images/benefits/`
- `reduce-bills.jpg` - Cost savings theme
- `low-maintenance.jpg` - Low maintenance solar panels
- `eco-friendly.jpg` - Environmental benefits
- `energy-independence.jpg` - Energy independence concept

#### Why Choose Us Section (4 images)
**Location:** `public/images/why-choose-us/`
- `certified.jpg` - Certified professionals
- `efficient-panels.jpg` - High-quality solar panels
- `end-to-end.jpg` - Complete service process
- `support.jpg` - Customer support

#### Testimonials Section (3 images)
**Location:** `public/images/testimonials/`
- `harshdeep-patel.jpg` - Portrait photo (square recommended)
- `suvarna-bhanushali.jpg` - Portrait photo (square recommended)
- `veeranna-ayyar.jpg` - Portrait photo (square recommended)

## 📏 Recommended Image Sizes

| Section | Image Size | Format |
|---------|-----------|--------|
| Services | 800x600px | JPG/PNG |
| Benefits | 600x400px | JPG/PNG |
| Why Choose Us | 600x400px | JPG/PNG |
| Testimonials | 200x200px (square) | JPG/PNG |

## ✅ How to Verify

1. **Check the folder structure:**
   ```
   public/images/services/        ← Should contain 4 images
   public/images/benefits/        ← Should contain 4 images
   public/images/why-choose-us/   ← Should contain 4 images
   public/images/testimonials/    ← Should contain 3 images
   ```

2. **Test in browser:**
   - Start your dev server: `npm run dev`
   - Visit: `http://localhost:3000/images/services/residential-solar.jpg`
   - If you see the image, it's working! ✅
   - If you see "404 Not Found", check the file path and name

## 🔍 Important Notes

1. **File Names Must Match Exactly:**
   - Use lowercase letters
   - Use hyphens (`-`) not underscores (`_`)
   - Match the exact spelling shown above

2. **File Extensions:**
   - Use `.jpg` or `.jpeg` for photos
   - Use `.png` for images with transparency
   - The code expects `.jpg` but `.jpeg` will also work

3. **Image Optimization:**
   - Compress images before adding (use TinyPNG, ImageOptim, or similar)
   - Keep file sizes under 500KB for faster loading
   - Use appropriate dimensions (don't upload 4000x3000px images)

4. **What Happens If Images Are Missing:**
   - The website will still work
   - Gray placeholder boxes will show instead
   - No errors will occur

## 🎨 Example File Structure

Your final `public` folder should look like this:

```
public/
├── logo.png
├── images/
│   ├── services/
│   │   ├── residential-solar.jpg    ← Your image here
│   │   ├── commercial-solar.jpg      ← Your image here
│   │   ├── industrial-solar.jpg      ← Your image here
│   │   └── grid-systems.jpg          ← Your image here
│   ├── benefits/
│   │   ├── reduce-bills.jpg          ← Your image here
│   │   ├── low-maintenance.jpg       ← Your image here
│   │   ├── eco-friendly.jpg          ← Your image here
│   │   └── energy-independence.jpg   ← Your image here
│   ├── why-choose-us/
│   │   ├── certified.jpg             ← Your image here
│   │   ├── efficient-panels.jpg      ← Your image here
│   │   ├── end-to-end.jpg            ← Your image here
│   │   └── support.jpg               ← Your image here
│   └── testimonials/
│       ├── harshdeep-patel.jpg       ← Your image here
│       ├── suvarna-bhanushali.jpg    ← Your image here
│       └── veeranna-ayyar.jpg        ← Your image here
└── videos/
    └── dashboard.mp4
```

## 🚀 Quick Test

After adding images, restart your dev server and check:
- Homepage loads without errors
- Images appear in the Services section
- Images appear in the Benefits section
- Images appear in the Why Choose Us section
- Testimonial photos appear (or initials if missing)

## 💡 Pro Tips

1. **Use descriptive filenames** - Makes it easier to manage
2. **Optimize before uploading** - Smaller files = faster website
3. **Keep backups** - Store original high-quality images elsewhere
4. **Test on mobile** - Make sure images look good on phones too

---

**Need help?** Check `IMAGE_PLACEHOLDERS.md` for more details about each image.


