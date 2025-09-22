⚖️ LegitMind AI
AI-powered legal assistant to simplify, explain, and analyze complex legal and financial documents.
LegitMind bridges the gap between legal jargon and everyday understanding by leveraging Google Cloud Vertex AI, Next.js, MongoDB, and Firebase Auth. It empowers individuals, startups, and SMEs to make confident legal decisions without relying on costly legal consultancy.
✨ Features
📜 Plain-Language Simplification – Breaks down complex clauses into easy-to-understand terms.
⚠️ Risk & Obligation Detection – Highlights hidden obligations, penalties, or compliance issues.
🔍 Clause Comparison – Compare multiple contracts side by side.
🤖 Interactive Q&A – Ask document-specific questions and get instant AI answers.
📊 Visual Insights – See obligations, timelines, and risks in a clear dashboard.
🔐 Secure & Scalable – Firebase Authentication and GCP services ensure privacy and performance.
🏗️ Tech Stack
Frontend: Next.js + Tailwind CSS
Backend: Next.js API Routes
Database: MongoDB Atlas
Authentication: Firebase Auth
AI & Cloud: Google Cloud Vertex AI, Cloud Storage, Pub/Sub, BigQuery
📐 Architecture
Copy code
Mermaid
flowchart TD
    User -->|Upload Document| Next.js-Frontend
    Next.js-Frontend -->|API Call| Next.js-Backend
    Next.js-Backend -->|Store| MongoDB
    Next.js-Backend -->|Auth| Firebase
    Next.js-Backend -->|Send Request| VertexAI
    VertexAI -->|Simplified Text + Insights| Next.js-Backend
    Next.js-Backend --> Next.js-Frontend
    Next.js-Frontend -->|Show Results| User
🚀 Getting Started
1. Clone the repo
Copy code
Bash
git clone https://github.com/yourusername/legitmind.git
cd legitmind
2. Install dependencies
Copy code
Bash
npm install
3. Setup Environment Variables
Create a .env.local file and add:
Copy code
Env
MONGODB_URI=your_mongodb_uri
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
GCLOUD_PROJECT=your_gcp_project_id
VERTEX_MODEL=your_vertex_ai_model
4. Run the app
Copy code
Bash
npm run dev
Your app will be live at http://localhost:3000 🎉
🌍 Use Cases
Students simplifying legal study material.
Startups reviewing vendor contracts.
SMEs identifying financial obligations in agreements.
NGOs making legal awareness accessible.
⚠️ Current Limitations
Requires internet connectivity (cloud AI dependency).
Higher AI costs at scale.
Some legal nuances may require manual lawyer validation.
🔮 Future Roadmap
📑 Legal Document Application in India – with Eligibility Tracker for government documents (Passport, PAN, GST, Licenses).
🌐 Multi-language support for regional accessibility.
📱 Mobile App version.
🤝 Contributing
We welcome contributions!
Fork the repo
Create a new branch (feature/my-feature)
Commit changes
Open a Pull Request
📜 License
This project is licensed under the MIT License.
🙌 Acknowledgements
Google Cloud Vertex AI
Firebase Authentication
MongoDB Atlas
Next.js & TailwindCSS
🔥 LegitMind AI — Making Law Accessible, One Document at a Time.