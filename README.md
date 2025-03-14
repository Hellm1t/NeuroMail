# NeuroMail

NeuroMail is an intelligent email management application that integrates with Gmail to provide a modern, user-friendly interface for managing your emails.

## Features

- **Google Authentication**: Secure login with Google OAuth 2.0
- **Gmail Integration**: Access and manage your Gmail inbox
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Email Management**: View, search, and organize your emails

## Technology Stack

- **Frontend**: React, Next.js
- **Authentication**: NextAuth.js with Google OAuth 2.0
- **Styling**: Tailwind CSS
- **API Integration**: Gmail API, Google People API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Cloud Platform account with Gmail API enabled

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/neuromail.git
   cd neuromail
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Gmail API and Google People API
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials (Web application)
6. Add authorized JavaScript origins: `http://localhost:3000`
7. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Copy the Client ID and Client Secret to your `.env.local` file

## Project Structure

```
/neuromail
│── /components        # UI components
│── /hooks             # Custom React hooks
│── /pages             # Next.js pages and API routes
│    ├── /api          # API endpoints
│    ├── index.tsx     # Home page
│    ├── auth.tsx      # Authentication page
│── /public            # Static assets
│── /styles            # Global styles
│── /utils             # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gmail API](https://developers.google.com/gmail/api) 