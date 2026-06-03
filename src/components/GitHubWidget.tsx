import { useState, useEffect } from 'react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  blog: string;
  location: string;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  homepage: string | null;
}

const GITHUB_USERNAME = 'SudhirDevOps1';

export default function GitHubWidget() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then(r => r.json())
      .then((data: GitHubUser) => {
        setUser(data);
        return fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=5`);
      })
      .then(r => r.json())
      .then((data: GitHubRepo[]) => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38]">
        <div className="w-5 h-5 rounded-full bg-[#2c2c38] animate-pulse"></div>
        <span className="text-[10px] text-gray-500">Loading GitHub...</span>
      </div>
    );
  }

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38] hover:border-[#58a6ff] transition-all cursor-pointer"
      >
        <img src={user.avatar_url} alt={user.name} className="w-5 h-5 rounded-full" />
        <span className="text-[10px] sm:text-xs text-gray-300 font-medium hidden sm:inline">{user.name || user.login}</span>
        <span className="text-[10px] text-gray-500">🐙</span>
      </button>

      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] glass-panel z-50 fade-in" style={{ padding: '1rem' }}>
          <div className="flex items-start gap-3 mb-3">
            <img src={user.avatar_url} alt={user.name} className="w-14 h-14 rounded-xl ring-2 ring-[#58a6ff]/30 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{user.name || user.login}</h3>
              <p className="text-[11px] text-[#58a6ff] truncate">@{user.login}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{user.bio || 'GitHub Developer'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-[#0f0f18] rounded-lg p-2 text-center border border-[#2c2c38]">
              <div className="text-sm font-bold text-white">{user.public_repos}</div>
              <div className="text-[9px] text-gray-500 uppercase">Repos</div>
            </div>
            <div className="bg-[#0f0f18] rounded-lg p-2 text-center border border-[#2c2c38]">
              <div className="text-sm font-bold text-white">{user.followers}</div>
              <div className="text-[9px] text-gray-500 uppercase">Followers</div>
            </div>
            <div className="bg-[#0f0f18] rounded-lg p-2 text-center border border-[#2c2c38]">
              <div className="text-sm font-bold text-white">{user.following}</div>
              <div className="text-[9px] text-gray-500 uppercase">Following</div>
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#0f0f18] rounded-lg p-2 border border-[#2c2c38] hover:border-[#58a6ff] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#58a6ff] truncate">{repo.name}</span>
                  <span className="text-[9px] text-gray-500 flex-shrink-0">{repo.language || '—'}</span>
                </div>
                {repo.description && <p className="text-[9px] text-gray-400 truncate mt-0.5">{repo.description}</p>}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] text-gray-500">⭐ {repo.stargazers_count}</span>
                  <span className="text-[9px] text-gray-500">🍴 {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] text-gray-500">Joined {joinDate}</span>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn text-[10px]"
            >
              View Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
