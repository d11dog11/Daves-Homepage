# David Rinderknecht - Mortgage Lender Homepage

A modern, premium homepage for David Rinderknecht, Mortgage Lender at Mortgage 1 Inc.

## Features

✨ **Premium Design**
- Modern dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and micro-interactions
- Fully responsive layout

🏡 **Sections**
- **Hero Section**: Eye-catching introduction with stats
- **About Section**: Professional background and values
- **Services Section**: Mortgage solutions offered
- **Contact Form**: Easy-to-use contact request form

📱 **Contact Form Fields**
- First Name
- Last Name
- Cell Phone Number (auto-formatted)
- Email Address

## How to View

### Option 1: Direct File Open
Simply double-click `index.html` to open it in your default browser.

### Option 2: Local Server (Recommended)
For the best experience, serve the files through a local web server:

**Using Python:**
```bash
python -m http.server 8080
```

**Using Node.js:**
```bash
npx http-server -p 8080
```

Then visit: `http://localhost:8080`

## Customization

### Update the Photo
Replace the placeholder by updating the HTML in `index.html`:
1. Find the `.placeholder-image` div (around line 67)
2. Replace it with:
```html
<img src="your-photo.jpg" alt="David Rinderknecht - Mortgage Lender">
```

### Update About Section
Edit the content in the `#about` section in `index.html` (around line 90-130)

### Update Contact Form
The form currently logs submissions to the browser console. To connect it to a backend:
1. Open `script.js`
2. Find the form submission handler (around line 60)
3. Uncomment and update the fetch API call with your endpoint

## File Structure

```
├── index.html          # Main HTML structure
├── index.css           # Complete design system and styles
├── script.js           # Interactive functionality
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic markup with SEO best practices
- **CSS3**: Modern design system with CSS variables
- **Vanilla JavaScript**: No dependencies, pure JS
- **Google Fonts**: Inter & Playfair Display

## Design Features

- **Color Palette**: Premium blue and purple gradients
- **Typography**: Professional font pairing
- **Animations**: Smooth scroll, fade-ins, hover effects
- **Form Validation**: Built-in HTML5 validation
- **Phone Formatting**: Auto-formats phone numbers as you type
- **Success Messages**: User-friendly form feedback

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Next Steps

1. ✅ Replace placeholder photo with professional headshot
2. ✅ Update "About Me" section with personal details
3. ✅ Add NMLS number to footer
4. ✅ Connect contact form to email/CRM backend
5. ✅ Add Google Analytics (optional)
6. ✅ Deploy to web hosting

## License

© 2026 David Rinderknecht - Mortgage 1 Inc. All rights reserved.
