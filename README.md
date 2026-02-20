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

🔒 **Admin Dashboard**
- **Secure Login**: Token-based authentication
- **Content Editor**: Update text and settings without coding
- **Security**: Change admin password securely
- **View Password**: Toggle visibility for password fields

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

**Using Included Server Script:**
1. Open this folder in terminal
2. Run:
```bash
node server.js
```
3. Click: [http://localhost:3001](http://localhost:3001)

**Using Python:**
```bash
python -m http.server 8080
```

**Using Node.js (npx):**
```bash
npx http-server -p 8080
```

Then visit: `http://localhost:8080`

## Customization

### 📝 Using the Admin Dashboard (Recommended)
Most text content on the site can be updated directly from the secure admin panel:
1. Navigate to `/admin.html`
2. Log in with your secure password
3. Go to the "Content Editor" tab
4. Update fields and click "Save All Changes"

### Manual Updates (Advanced)
For structural changes or permanent image updates, edit the files directly:

#### Update the Photo
The admin panel photo upload is currently local-only. To permanently update the site photo:
1. Replace `Headshot.jpg` in the root folder with your new image (keep the name or update `index.html`).
2. Update the `src` attribute in `index.html` if the filename changed.

#### Update Contact Form
The form submits to `formsubmit.co`. To change the recipient email:
1. Open `index.html`
2. Update the `action` attribute in the `<form>` tag.

## File Structure

├── index.html          # Main HTML structure
├── index.css           # Complete design system and styles
├── script.js           # Interactive functionality
├── admin.html          # Admin Dashboard
├── admin.js            # Admin panel logic (secure)
├── server.js           # Node.js backend server
├── content.json        # Dynamic content storage (auto-generated)
└── README.md           # This file

## Technologies Used

- **HTML5/CSS3**: Modern standards
- **Vanilla JavaScript**: Lightweight frontend
- **Node.js**: Secure backend for content management
- **GitHub Actions**: Automated deployment pipeline
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

## Deployment

🚀 **Automated Verification**: This repository is configured with GitHub Actions.
Any push to the `main` branch automatically deploys to the DigitalOcean droplet via SSH.

- **URL**: [https://mylenderdave.com](https://mylenderdave.com)
- **Server**: DigitalOcean Droplet (Ubuntu/Node.js/Nginx)
- **SSL**: Self-signed (CF Full Mode)

## License

© 2026 David Rinderknecht - Mortgage 1 Inc. All rights reserved.
