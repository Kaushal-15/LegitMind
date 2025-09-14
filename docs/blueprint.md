# **App Name**: LegitMind MVP

## Core Features:

- User Authentication: Authenticate users via Google login or email/password using Firebase Auth; store user profiles in Firestore.
- Dashboard Layout: Implement a dashboard layout with a sidebar for navigation (Upload Documents, My Files, Summaries, Chat) and a top header with a user profile dropdown.
- Document Upload: Upload documents (PDF, DOCX, TXT) to Firebase Storage. Store document metadata (filename, size, date) in Firestore; display an upload progress bar. A 'tool' will use reasoning to help guide the user as they complete the task.
- My Files Page: List uploaded files with metadata on a 'My Files' page; include action buttons such as View, Summarize.
- AI-Powered Summarization: Enable document summarization using a generative AI tool that provides concise summaries.
- Document Viewer: Allow users to view uploaded documents directly within the app.

## Style Guidelines:

- Primary color: Deep Green (#013220) for an old-money, rich aesthetic.
- Background color: Ivory/Beige (#F5F5DC) for a classic, understated backdrop.
- Accent color: Gold (#D4AF37) for highlights and important UI elements.
- Headline Font: 'Literata', a serif, for an elegant, vintage, formal feel.
- Body Font: 'Inter', a sans-serif, for a clean, modern, readable feel.
- Minimal layout with a premium, professional aesthetic. Utilize ShadCN/UI components.
- Subtle transitions and animations to enhance user experience.