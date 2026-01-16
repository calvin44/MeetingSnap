# Meeting Snap 📸

**Meeting Snap** is a Next.js application designed to streamline the process of extracting, previewing, and distributing meeting minutes from Google Docs. It integrates closely with Google Workspace and provides a secure, whitelisted environment for team communication.

## 🚀 Features

- **Google Workspace Integration**: Seamlessly extract content from Google Docs using the Google Drive and Docs APIs.
- **Smart Extraction**: Automatically parses meeting notes from document tabs.
- **Preview & Edit**: precise HTML preview of meeting minutes before sending.
- **One-Click Dispatch**: Send beautifully formatted meeting minutes to the team via email.
- **Secure Access**:
  - **Google Login**: OAuth2 authentication via NextAuth.
  - **Whitelist System**: Restrict access to specific email domains or approved users only.
  - **Team Management**: Admin interface to manage whitelisted users.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Email**: Nodemailer
- **APIs**: Google Drive API, Google Docs API
- **Logging**: Pino

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud Platform project with Drive and Docs APIs enabled.
- A Supabase project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/meeting-snap.git
    cd meeting-snap
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and configure the following variables:

    ```env
    # NextAuth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret

    # Google Auth (OAuth Client)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Google Service Account (for API access)
    GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
    GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Email Service
    EMAIL_FROM_ADDRESS=noreply@yourdomain.com
    EMAIL_SERVER_HOST=smtp.example.com
    EMAIL_SERVER_PORT=587
    EMAIL_SERVER_USER=your_smtp_user
    EMAIL_SERVER_PASSWORD=your_smtp_password
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/lib`: Shared utilities, database clients, and service logic.
  - `/services`: Core business logic (Email, Google APIs).
- `/credential`: Storage for specific credential files (if applicable).

## 🛡 License

This project is private and intended for internal use.

