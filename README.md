# Furniture Editor - AI-Powered Room Furnishing

A modern web application that uses Google's Gemini AI to add furniture to empty room photos. Upload up to 30 photos, describe the furniture you want, and download the AI-enhanced images.

## 🌟 Features

- **Drag & Drop Upload**: Easy photo upload with support for JPEG, PNG, and WebP formats
- **Batch Processing**: Handle up to 30 images at once
- **AI-Powered**: Uses Google Gemini AI for intelligent furniture placement
- **Progress Tracking**: Real-time progress updates during processing
- **Bulk Download**: Download individual images or all as a ZIP file
- **Clean Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Live Demo

Visit the live application: **https://furniture-editor-42.lindy.site**

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ or Bun
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furniture-editor
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## 📖 How to Use

1. **Upload Photos**: Drag and drop or click to browse and select up to 30 photos of empty rooms
2. **Describe Furniture**: Enter a detailed description of what furniture you'd like to add (e.g., "Add a modern sofa, coffee table, and floor lamp to create a cozy living room setup")
3. **Process Images**: Click "Add Furniture to Photos" to start the AI processing
4. **Download Results**: Once processing is complete, download individual images or all as a ZIP file

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI
- **File Handling**: JSZip for bulk downloads
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📁 Project Structure

```
furniture-editor/
├── app/
│   ├── api/
│   │   ├── process-image/
│   │   │   └── route.ts          # Gemini AI integration
│   │   └── placeholder-image/
│   │       └── route.ts          # Demo placeholder images
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application
├── components/
│   └── ui/                      # shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔧 Customization

### Modifying the AI Prompt
Edit the prompt in `app/api/process-image/route.ts` to customize how the AI interprets and adds furniture to rooms.

### Styling Changes
The app uses Tailwind CSS. Modify classes in `app/page.tsx` or add custom styles to `app/globals.css`.

### Adding New Features
- File format support: Update the `accept` attribute in the file input
- Processing limits: Modify the `30` limit in the upload handler
- UI components: Add new shadcn/ui components as needed

## 🚨 Important Notes

- **API Key Security**: Never commit your actual API key to version control
- **Rate Limits**: Be aware of Gemini API rate limits for production use
- **Image Processing**: Current implementation uses a placeholder for demo purposes. For production, you'll need to implement actual image generation
- **File Size**: Large images may take longer to process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check that your Gemini API key is correctly set
2. Ensure all dependencies are installed
3. Verify that the development server is running on port 3000
4. Check the browser console for any error messages

---

Built with ❤️ using Next.js, shadcn/ui, and Google Gemini AI
