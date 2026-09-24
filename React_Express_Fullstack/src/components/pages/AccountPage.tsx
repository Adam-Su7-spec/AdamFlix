import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bookmark, 
  PlayCircle, 
  History, 
  Settings, 
  Trash2, 
  Play, 
  Check, 
  ShieldCheck, 
  Film,
  Sliders
} from 'lucide-react';
import { useApp, AUTHORIZED_ADMIN_EMAIL } from '../../context/AppContext';
import { MovieCard } from '../common/MovieCard';
import { QualityType } from '../../types';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, 
    watchlist, 
    removeFromWatchlist, 
    continueWatching, 
    removeFromContinueWatching, 
    watchHistory, 
    clearWatchHistory, 
    userSettings, 
    updateUserSettings,
    navigateTo,
    openAuthModal,
    switchUserRole,
    movies,
    routeParams
  } = useApp();

  const initialTab = routeParams.tab || 'profile';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <UserIcon className="w-16 h-16 text-[#A7AFBF]/30 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 font-display">Sign In Required</h2>
        <p className="text-sm text-[#A7AFBF] mb-6">
          Access your personal Watchlist, Continue Watching queue, and streaming settings.
        </p>
        <button
          onClick={() => openAuthModal('signin')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#3B2896] text-white text-xs font-bold shadow-lg cursor-pointer"
        >
          Sign In to AdamFlix
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header & User Bio */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101521] border border-[#1E2638] mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#7C5CFF]"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {currentUser.name}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                currentUser.role === 'admin' 
                  ? 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/40' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Standard Member'}
              </span>
            </div>
            <p className="text-xs text-[#A7AFBF]">{currentUser.email}</p>
            <p className="text-[11px] text-[#A7AFBF]/60 mt-1">Member since {currentUser.joinedDate}</p>
          </div>
        </div>

        {/* Quick Role Switcher (Strictly only visible to ssouhaimat1999@gmail.com) */}
        {currentUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase() && (
          <div className="flex flex-col items-center sm:items-end gap-2">
            <button
              onClick={() => switchUserRole(currentUser.role === 'admin' ? 'user' : 'admin')}
              className="px-4 py-2 rounded-xl bg-[#151B28] hover:bg-[#1E2638] border border-[#1E2638] text-xs font-semibold text-[#00D4FF] transition-all cursor-pointer"
            >
              Switch to {currentUser.role === 'admin' ? 'Viewer Role' : 'Admin Role'}
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => navigateTo('/admin')}
                className="text-xs text-[#7C5CFF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Dashboard</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1E2638] mb-8 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'profile', label: 'Profile', icon: UserIcon },
          { id: 'watchlist', label: `My List (${watchlist.length})`, icon: Bookmark },
          { id: 'continue', label: `Continue Watching (${continueWatching.length})`, icon: PlayCircle },
          { id: 'history', label: `Watch History (${watchHistory.length})`, icon: History },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#151B28] text-white border-b-2 border-[#7C5CFF]'
                  : 'text-[#A7AFBF] hover:text-white hover:bg-[#101521]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#7C5CFF]' : 'text-[#A7AFBF]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Overview */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4">Account Information</h3>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Name</dt>
                <dd className="text-white font-medium">{currentUser.name}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Email</dt>
                <dd className="text-white font-medium">{currentUser.email}</dd>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#151B28]">
                <dt className="text-[#A7AFBF]">Subscription Plan</dt>
                <dd className="text-[#00D4FF] font-bold">AdamFlix 4K Ultra VIP</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A7AFBF]">Streaming Devices</dt>
                <dd className="text-white font-medium">4 Concurrent Streams</dd>
              </div>
            </dl>
          </div>

          <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
            <h3 className="text-base font-bold text-white mb-4">Streaming Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638]">
                <span className="text-xs text-[#A7AFBF]">Titles in My List</span>
                <span className="text-2xl font-bold font-mono text-white block mt-1">{watchlist.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638]">
                <span className="text-xs text-[#A7AFBF]">Active Resumptions</span>
                <span className="text-2xl font-bold font-mono text-[#00D4FF] block mt-1">{continueWatching.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638]">
                <span className="text-xs text-[#A7AFBF]">Total Completed</span>
                <span className="text-2xl font-bold font-mono text-[#7C5CFF] block mt-1">{watchHistory.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151B28] border border-[#1E2638]">
                <span className="text-xs text-[#A7AFBF]">Stream Quality</span>
                <span className="text-2xl font-bold font-mono text-white block mt-1">{userSettings.preferredQuality}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My List */}
      {activeTab === 'watchlist' && (
        <div>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlist.map(item => {
                const fullMovie = movies.find(m => m.id === item.contentId);
                return (
                  <div key={item.id} className="relative group">
                    {fullMovie ? (
                      <MovieCard movie={fullMovie} />
                    ) : (
                      <div className="rounded-xl bg-[#151B28] p-4 text-center">
                        <p className="text-xs text-white">{item.title}</p>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.contentId);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-all z-30 cursor-pointer shadow-lg"
                      title="Remove from My List"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#101521] rounded-2xl border border-[#1E2638] p-8">
              <Bookmark className="w-12 h-12 text-[#A7AFBF]/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Your list is currently empty</h3>
              <p className="text-xs text-[#A7AFBF] max-w-sm mx-auto mb-5">
                Save movies and series to your personal list to easily access and watch them later.
              </p>
              <button
                onClick={() => navigateTo('/movies')}
                className="px-5 py-2.5 rounded-xl bg-[#7C5CFF] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
              >
                Explore Movies
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Continue Watching */}
      {activeTab === 'continue' && (
        <div>
          {continueWatching.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {continueWatching.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-[#101521] border border-[#1E2638] hover:border-[#7C5CFF]/60 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black overflow-hidden group">
                    <img
                      src={item.backdrop || item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => {
                          const navParams: Record<string, string> = {
                            id: item.contentId,
                            title: item.title,
                          };
                          if (item.seasonNumber !== undefined) navParams.season = item.seasonNumber.toString();
                          if (item.episodeNumber !== undefined) navParams.episode = item.episodeNumber.toString();
                          navigateTo(`/watch/${item.contentId}`, navParams);
                        }}
                        className="w-12 h-12 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-5 h-5 fill-white translate-x-0.5" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-[#00D4FF] mt-0.5">
                        {item.percentage}% watched · {item.seasonNumber ? `S${item.seasonNumber}:E${item.episodeNumber}` : 'Feature Film'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromContinueWatching(item.contentId)}
                      className="text-[#A7AFBF] hover:text-rose-400 p-1.5 rounded-lg hover:bg-[#151B28] cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#101521] rounded-2xl border border-[#1E2638] p-8">
              <PlayCircle className="w-12 h-12 text-[#A7AFBF]/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No active streams in progress</h3>
              <p className="text-xs text-[#A7AFBF]">Titles you begin watching will automatically bookmark here.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Watch History */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-[#101521] border border-[#1E2638]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#151B28]">
            <h3 className="text-base font-bold text-white">Viewing History</h3>
            {watchHistory.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          {watchHistory.length > 0 ? (
            <div className="divide-y divide-[#151B28]">
              {watchHistory.map(entry => (
                <div key={entry.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={entry.poster} alt={entry.title} className="w-10 h-14 object-cover rounded bg-black shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-white">{entry.title}</div>
                      <div className="text-xs text-[#A7AFBF]">
                        {entry.seasonNumber ? `Season ${entry.seasonNumber} · Episode ${entry.episodeNumber}` : 'Full Movie'} · Watched {entry.watchedAt}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo(`/watch/${entry.contentId}`, { id: entry.contentId, title: entry.title })}
                    className="px-3 py-1.5 rounded-lg bg-[#151B28] hover:bg-[#7C5CFF] text-white text-xs font-semibold cursor-pointer"
                  >
                    Watch Again
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#A7AFBF]">
              No watch history recorded yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101521] border border-[#1E2638] max-w-2xl">
          <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#7C5CFF]" />
            <span>Playback & Streaming Preferences</span>
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-white mb-2">
                Default Stream Quality
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['4K', 'FHD', 'HD'] as QualityType[]).map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => updateUserSettings({ preferredQuality: q })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userSettings.preferredQuality === q
                        ? 'bg-[#7C5CFF] text-white shadow-lg'
                        : 'bg-[#151B28] text-[#A7AFBF] border border-[#1E2638] hover:text-white'
                    }`}
                  >
                    {q} Ultra HD
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#151B28]">
              <div>
                <div className="text-xs font-bold text-white">Auto-Play Next Episode</div>
                <div className="text-[11px] text-[#A7AFBF]">Automatically transition to following episode when current ends</div>
              </div>
              <input
                type="checkbox"
                checked={userSettings.autoPlayNext}
                onChange={(e) => updateUserSettings({ autoPlayNext: e.target.checked })}
                className="w-5 h-5 accent-[#7C5CFF] cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-[#151B28]">
              <label className="block text-xs font-bold text-white mb-1.5">
                Default Subtitle Track
              </label>
              <select
                value={userSettings.defaultSubtitles}
                onChange={(e) => updateUserSettings({ defaultSubtitles: e.target.value })}
                className="w-full bg-[#151B28] text-xs text-white p-2.5 rounded-xl border border-[#1E2638] focus:outline-none"
              >
                <option value="English">English</option>
                <option value="English [CC]">English [CC]</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Off">Off by Default</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
