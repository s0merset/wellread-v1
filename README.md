    
# 📚 WellRead — Your Social Library & Reading Tracker

WellRead is a modern, social-first platform for book lovers to track their reading journey, curate custom collections, and visualize their reading habits. Built with a focus on speed and user experience, it allows readers to manage their "To-Read" lists, track real-time progress on active books, and set yearly reading goals.

## 🚀 Live Demo
**URL**: [https://wellread-v1.netlify.app/](https://wellread-v1.netlify.app)

---

## ✨ Key Features

### 📖 Library Management
- **Custom Lists:** Create, update, and delete curated book collections (e.g., "#SciFi", "#Favorites").
- **Dynamic Filtering & Sorting:** Sort your library by "Last Updated," "Alphabetical," or "Book Count."
- **Privacy Controls:** Toggle lists between Public and Private visibility.

### ⏱️ Real-time Reading Tracker
- **Central Dashboard:** A single hub to view your active book, yearly progress, and quick stats.
- **Progress Visualization:** Update your current page and see real-time completion percentages with interactive progress bars.
- **Replace/Swap Logic:** Seamlessly switch between active books while maintaining your library history.

### 📊 Insights & Challenges
- **Automated Stats:** Real-time calculation of total pages read, average ratings, and review counts.
- **2026 Reading Challenge:** Set a yearly book goal and monitor your pace with a "Pace Indicator" (Books ahead/behind schedule).
- **Global Data Sync:** Powered by a centralized `LibraryContext` for instant updates across the Dashboard, Library, and Stats tabs.

### 🔒 Security
- **Secure Authentication:** Full sign-up and login flow powered by Supabase Auth.
- **Protected Routing:** Ensures your personal library and stats are only accessible to you.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 (Vite), TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL)
- **State Management:** React Context API
- **Icons:** Google Material Symbols
- **Notifications:** Sonner (Toast notifications)

---

## ⚙️ Database Setup (Supabase)

To ensure the sorting and syncing features work correctly, run the following SQL script in your **Supabase SQL Editor** to add the necessary `updated_at` columns and triggers:

```sql
-- 1. Add updated_at column to the lists table
ALTER TABLE public.lists 
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Enable the extension for automatic timestamps
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- 3. Create the trigger for the lists table
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime (updated_at);

  

🛠️ Local Development
Prerequisites

    Node.js & npm installed

    A Supabase project (URL and Anon Key)

Installation
code Sh

    
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
cd wellread

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

  

Environment Variables

Create a .env file in the root directory and add your Supabase credentials:
code Env

    
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

  

🌐 Deployment

The project is optimized for deployment on Netlify.

    Connect your GitHub repository to Netlify.

    Build Command: npm run build

    Publish Directory: dist

    Important: Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the Environment Variables in the Netlify Site Settings.

🗺️ Roadmap

    Social Feed: Share reading updates and reviews with friends.

    External API Integration: Search for books using the Google Books API.

    Achievement System: Earn badges for reading streaks and genre diversity.

    Mobile App: Responsive PWA support for tracking on mobile devices.

Created with ❤️ by Francis Rey Betonio
