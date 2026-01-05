import React, { useState } from 'react';
import Header from '../components/Header';

type Tab = 'Profile' | 'Activity' | 'Reviews' | 'Lists' | 'Stats';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const tabs: Tab[] = ['Profile', 'Activity', 'Reviews', 'Lists', 'Stats'];

  return (
    <div className="dark bg-background-dark min-h-screen font-display text-white antialiased">
      <Header activePage="Profile" />
      <main className="max-w-[1280px] w-full mx-auto px-6 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative w-32 h-32 mb-4 rounded-full p-1 bg-gradient-to-br from-primary to-purple-500 shadow-xl shadow-primary/20">
                <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden border-4 border-background-dark">
                  <span className="material-symbols-outlined text-6xl text-slate-600">person</span>
                </div>
              </div>
              <h1 className="text-2xl font-extrabold mb-1">Alex Reader</h1>
              <p className="text-slate-400 font-medium mb-6">@alexreads</p>
              <button className="w-full py-2 rounded-lg border border-slate-600 hover:border-white text-sm font-bold transition-colors">
                Edit Profile
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="border-b border-slate-800 flex overflow-x-auto no-scrollbar mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 border-b-2 text-sm font-bold transition-colors whitespace-nowrap ${
                    activeTab === tab 
                    ? 'border-primary text-white' 
                    : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <section className="space-y-10">
              <div>
                <h3 className="text-lg font-bold mb-5">Favorite Books</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[2/3] rounded-lg bg-slate-800 overflow-hidden shadow-lg group">
                      <img 
                        src="https://via.placeholder.com/150x225" 
                        alt="Book cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
