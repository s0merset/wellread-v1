import React, { useState } from 'react';
import Header from '../components/Header';

type Tab = 'Profile' | 'Activity' | 'Reviews' | 'Lists' | 'Stats';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const tabs: Tab[] = ['Profile', 'Activity', 'Reviews', 'Lists', 'Stats'];

  return (
    <div className="bg-[#0f172a] min-h-screen font-display text-white antialiased pb-20">
      <Header activePage="Profile" />
      
      <main className="max-w-[1400px] w-full mx-auto px-6 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR */}
          <aside className="w-full lg:w-[320px] shrink-0">
            <div className="flex flex-col items-center lg:items-start">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-blue-500 to-purple-500 ring-4 ring-[#0f172a]">
                   <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center overflow-hidden">
                      <img src="https://www.borbay.com//wp-content/uploads/2012/11/Morgan-Freeman-Source-8-by-8-500x500.jpg" alt="Alex" className="w-full h-full object-cover" />
                   </div>
                </div>
                <button className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full border-4 border-[#0f172a] hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              <h1 className="text-3xl font-extrabold mb-1">Francis Rey</h1>
              <p className="text-slate-400 font-medium mb-4">@fr_betonio</p>
              
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded uppercase tracking-tighter">Pro Member</span>
                <span className="text-[10px] font-black bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase tracking-tighter">Librarian</span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8 text-center lg:text-left">
                Devouring sci-fi, fantasy, and the occasional classic. Trying to read 52 books this year. Coffee addict & night owl reader.
              </p>

              <button className="w-full py-2.5 rounded-xl bg-[#1e293b] border border-slate-700 hover:bg-slate-800 text-sm font-bold transition-all mb-10">
                Edit Profile
              </button>

              {/* Sidebar Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden mb-10">
                <div className="bg-[#0f172a] p-4 text-center">
                  <div className="text-xl font-bold">142</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">Books</div>
                </div>
                <div className="bg-[#0f172a] p-4 text-center">
                  <div className="text-xl font-bold">42</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">This Year</div>
                </div>
                <div className="bg-[#0f172a] p-4 text-center">
                  <div className="text-xl font-bold">85</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">Reviews</div>
                </div>
                <div className="bg-[#0f172a] p-4 text-center">
                  <div className="text-xl font-bold">12</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black">Lists</div>
                </div>
              </div>

              {/* Currently Reading */}
              <div className="w-full">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Currently Reading
                 </h4>
                 <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex gap-4 mb-4">
                      <img src="https://covers.openlibrary.org/b/id/12647417-L.jpg" className="w-12 h-18 object-cover rounded shadow-lg" alt="Dune" />
                      <div className="flex-1">
                        <div className="font-bold text-sm">Dune</div>
                        <div className="text-xs text-slate-400">Frank Herbert</div>
                        <div className="mt-2 text-[10px] font-bold text-slate-500">Page 284 <span className="float-right text-blue-400">65%</span></div>
                        <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-blue-500 w-[65%]"></div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full text-center text-xs font-bold text-blue-400 hover:text-blue-300">Update Progress</button>
                 </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="border-b border-slate-800 flex gap-8 mb-10">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                </button>
              ))}
            </div>

            {/* Favorite Books */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">Favorite Books</h3>
                  <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold">All Time</span>
                </div>
                <button className="text-slate-600"><span className="material-symbols-outlined text-[20px]">edit</span></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
                {[
                  "https://covers.openlibrary.org/b/id/11504996-L.jpg",
                  "https://covers.openlibrary.org/b/id/12885107-L.jpg",
                  "https://covers.openlibrary.org/b/id/12711818-L.jpg",
                  "https://covers.openlibrary.org/b/id/10541997-L.jpg"
                ].map((url, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5 hover:scale-[1.05] transition-transform duration-300">
                    <img src={url} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="aspect-[2/3] rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 hover:border-slate-500 cursor-pointer"><span className="material-symbols-outlined text-4xl">add</span></div>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Reviews */}
              <div className="xl:col-span-2 space-y-6">
                <h3 className="text-xl font-bold mb-4 flex justify-between items-center">Recent Reviews <button className="text-blue-400 text-xs">View All</button></h3>
                <ReviewCard title="Atomic Habits" cover="https://covers.openlibrary.org/b/id/12560381-L.jpg" likes={24} text="A truly transformative read. Clear breaks down the psychology of habit formation." />
                <ReviewCard title="Happy Place" cover="https://covers.openlibrary.org/b/id/12853245-L.jpg" likes={18} text="Emily Henry does it again! The banter was top-notch and the emotional depth caught me off guard." />
              </div>

              {/* Diary */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex justify-between items-center">October Diary <button className="text-slate-500 text-xs">View Full</button></h3>
                <div className="relative pl-8 space-y-10 border-l border-slate-800 ml-2">
                  <DiaryEntry title="Cloud Cuckoo Land" date="Oct 22" color="bg-blue-500" cover="https://covers.openlibrary.org/b/id/11153723-L.jpg" />
                  <DiaryEntry title="Yellowface" date="Oct 14" color="bg-green-500" cover="https://covers.openlibrary.org/b/id/13600501-L.jpg" />
                  <DiaryEntry title="1984" date="Oct 02" color="bg-slate-500" cover="https://covers.openlibrary.org/b/id/12647417-L.jpg" />
                </div>
              </div>
            </div>

            {/* Fanned Lists Section */}
            <section className="mt-16">
               <h3 className="text-xl font-bold italic mb-8 flex justify-between items-center">Francis' Lists <button className="text-blue-400 text-xs">View All (12)</button></h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FannedListCard title="Cyberpunk Essentials" count={12} covers={[
                    "https://covers.openlibrary.org/b/id/12640243-L.jpg",
                    "https://covers.openlibrary.org/b/id/10541997-L.jpg",
                    "https://covers.openlibrary.org/b/id/8231992-L.jpg"
                  ]} />
                  <FannedListCard title="2026 Reading Goals" count={50} covers={[
                    "https://covers.openlibrary.org/b/id/11504996-L.jpg",
                    "https://covers.openlibrary.org/b/id/12885107-L.jpg",
                    "https://covers.openlibrary.org/b/id/12560381-L.jpg"
                  ]} />
                  <FannedListCard title="Books that made me cry" count={8} covers={[
                    "https://covers.openlibrary.org/b/id/12711818-L.jpg",
                    "https://covers.openlibrary.org/b/id/12818862-L.jpg",
                    "https://covers.openlibrary.org/b/id/10395333-L.jpg"
                  ]} />
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const ReviewCard = ({ title, likes, cover, text }: any) => (
  <div className="bg-[#1e293b]/30 p-6 rounded-2xl border border-slate-800 flex gap-6 hover:border-slate-700 transition-colors">
    <img src={cover} className="w-16 h-24 object-cover rounded shadow-lg" alt={title} />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold">{title}</h4>
        <div className="flex text-yellow-400 text-xs">
          {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[14px] fill-current">star</span>)}
        </div>
      </div>
      <p className="text-xs text-slate-400 my-2 line-clamp-2">{text}</p>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">thumb_up</span> {likes} likes</span>
      </div>
    </div>
  </div>
);

const DiaryEntry = ({ title, date, color, cover }: any) => (
  <div className="relative flex gap-4 items-center">
    <div className={`absolute -left-[37px] w-2.5 h-2.5 rounded-full ${color} ring-4 ring-[#0f172a]`} />
    <img src={cover} className="w-10 h-14 object-cover rounded shadow-md" alt={title} />
    <div>
      <h5 className="text-xs font-bold">{title}</h5>
      <p className="text-[10px] text-slate-500">Watched on {date}</p>
    </div>
  </div>
);

const FannedListCard = ({ title, count, covers }: any) => (
  <div className="group bg-[#1e293b]/30 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer">
    <h4 className="font-bold mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
    <p className="text-[10px] text-slate-500 mb-6">{count} books • Updated recently</p>
    
    <div className="relative flex items-center justify-center h-32 bg-black/20 rounded-xl overflow-hidden">
      {/* Book C3 (Right) */}
      <div className="absolute w-14 h-20 z-10 transition-all duration-300 translate-x-6 rotate-[12deg] opacity-60 group-hover:translate-x-16 group-hover:rotate-[25deg] group-hover:opacity-100">
        <img src={covers[2]} className="w-full h-full object-cover rounded shadow-md border border-white/10" alt="c3" />
      </div>
      {/* Book C2 (Center) */}
      <div className="absolute w-16 h-22 z-20 transition-all duration-300 translate-x-0 rotate-0 group-hover:scale-110 shadow-xl">
        <img src={covers[1]} className="w-full h-full object-cover rounded shadow-xl border border-white/10" alt="c2" />
      </div>
      {/* Book C1 (Left) */}
      <div className="absolute w-14 h-20 z-30 transition-all duration-300 -translate-x-6 rotate-[-12deg] group-hover:-translate-x-16 group-hover:rotate-[-25deg]">
        <img src={covers[0]} className="w-full h-full object-cover rounded shadow-md border border-white/10" alt="c1" />
      </div>
    </div>
  </div>
);

export default Profile;
