# Vestibot: AI-Powered Vestige Product Assistant

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## About This Project

Vestibot is an intelligent web application designed to assist users by providing expert information on Vestige health products. It features an AI-powered chatbot that acts as a virtual health expert, offering product recommendations based on user-described symptoms or health concerns. The application is built to be secure, user-friendly, and responsive.

### Key Features

- **AI Chatbot:** A sophisticated chatbot powered by the Groq Llama 3 model, trained to answer health-related questions using a curated list of Vestige products.
- **User Authentication:** Secure user sign-up and login functionality implemented with Firebase Authentication.
- **Protected Routes:** User profiles and other sensitive areas are protected, accessible only after logging in.
- **Product Catalog:** A dedicated page to browse all available Vestige products.
- **Responsive Design:** A clean and modern UI built with Tailwind CSS that works seamlessly across devices.

### Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Authentication:** [Firebase](https://firebase.google.com/)
- **AI/LLM:** [Groq API](https://groq.com/) (Llama 3)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
