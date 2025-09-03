<div align="center">
  <h1>
    <b>Nexocial</b>
  </h1>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk"/>
  </p>
</div>

---

## 🚀 About The Project

**Nexocial** is a full-stack social media application built from the ground up using the Next.js App Router. It serves as a comprehensive case study for modern web development, demonstrating how to integrate a variety of powerful tools to create a seamless and performant user experience.

The project features a robust backend powered by Prisma and a serverless Postgres database from Neon, coupled with a reactive frontend built with Server and Client Components.

---

## ✨ Key Features

-   🔐 **Authentication**: Secure and easy to use authentication powered by **Clerk**.
-   🖼️ **Image Uploads**: Seamless image uploads for posts handled by **UploadThing**.
-   ❤️ **Likes & Comments**: Optimistic UI updates for instant user feedback on interactions.
-   📜 **Infinite Scrolling Feed**: A performant, infinitely scrolling feed on the homepage and profile pages.
-   👥 **User Profiles**: Dynamic, server-rendered user profile pages with nested layouts for posts and liked content.
-   🤝 **Follow System**: Ability for users to follow and unfollow each other.
-   🔔 **Real-time Notifications**: Instant notifications for likes, comments, and new followers using **Pusher**.
-   🎨 **Theming**: A beautiful, responsive UI with **Light/Dark mode** toggle, built with **Tailwind CSS** and **ShadCN/UI**.
-   ✅ **Accessibility & SEO**: Built with semantic HTML, proper metadata, and a focus on high Lighthouse scores.

---

## 🛠️ Built With

| Core & Framework         | Database & ORM             | Authentication & Services | Styling & UI                   |
| ------------------------ | -------------------------- | ------------------------- | ------------------------------ |
| **Next.js** (App Router) | **Neon** (Serverless PG)   | **Clerk** (Auth)          | **Tailwind CSS** |
| **React** (Server/Client)| **Prisma** (ORM)           | **UploadThing** (Storage) | **ShadCN/UI** (Components)     |
| **TypeScript** |                            | **Pusher** (Real-time)    | **Lucide React** (Icons)       |

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need accounts for the following third-party services:
* **[Neon](https://neon.tech/)** for the PostgreSQL database.
* **[Clerk](https://clerk.com/)** for authentication.
* **[Pusher](https://pusher.com/)** for real-time notifications.
* **[UploadThing](https://uploadthing.com/)** for file uploads.

### Installation

1.  **Install Dependencies**
    ```sh
    npm install
    ```

2.  **Set Up Environment Variables**
   
    Your `.env.local` should look like this:
    ```env
    BASE_URL="http://localhost:3000"

    DATABASE_URL="postgresql://..."

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    PUSHER_APP_ID="..."
    PUSHER_KEY="..."
    NEXT_PUBLIC_PUSHER_KEY="..."
    PUSHER_SECRET="..."
    PUSHER_CLUSTER="..."

    UPLOADTHING_TOKEN=...
    ```

3.  **Set Up the Database**
    Run the Prisma migration to create your database schema.
    ```sh
    npx prisma generate
    npx prisma db push
    ```

4.  **Run the Development Server**
    You are now ready to start the application.
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.
