# PDF Tracker

A web application for tracking your PDF reading progress. Built with Next.js, MongoDB, and Cloudinary for file storage.

## Features
- Upload PDFs and store metadata
- Track reading progress per user
- Fullscreen PDF viewer with auto-hiding navigation bar
- User authentication
- Cloudinary integration for PDF storage
- Responsive UI

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manik2375/pdf-tracker.git
   cd pdf-tracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your MongoDB and Cloudinary credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) or your dev tunnel URL.

## Usage
- Sign up or log in
- Upload a PDF
- View and track your reading progress
- Delete or update PDF metadata

## Development Notes
- Uses Next.js App Router and Server Actions
- MongoDB for storing user and PDF metadata
- Cloudinary for file uploads
- PDF rendering via `@react-pdf-viewer/core`
