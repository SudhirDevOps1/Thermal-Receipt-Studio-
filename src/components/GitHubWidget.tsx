import { useState, useEffect } from 'react';
import { IconGitHub, IconExternalLink, IconStar, IconCheck } from './Icons';

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
  fork: boolean;
}

const GITHUB_USERNAME = 'SudhirDevOps1';

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
};

export default function GitHubWidget() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then((data: GitHubUser) => {
        setUser(data);
        return fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
      })
      .then(r => r.json())
      .then((data: GitHubRepo[]) => {
        setRepos(data.filter(r => !r.fork).slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38]">
        <div className="w-5 h-5 rounded-full bg-[#2c2c38] animate-pulse"></div>
        <span className="text-[10px] text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38] hover:border-[#58a6ff] transition-all"
      >
        <IconGitHub className="w-4 h-4 text-gray-400" />
        <span className="text-[10px] text-gray-400">@{GITHUB_USERNAME}</span>
      </a>
    );
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a28] border border-[#2c2c38] hover:border-[#58a6ff] transition-all cursor-pointer"
      >
        <img src={user.avatar_url} alt={user.name} className="w-5 h-5 rounded-full ring-1 ring-white/20" />
        <span className="text-[10px] sm:text-xs text-gray-300 font-medium hidden sm:inline">{user.name || user.login}</span>
        <IconGitHub className="w-3.5 h-3.5 text-gray-500" />
      </button>

      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[400px] glass-panel z-50 fade-in" style={{ padding: '1.25rem' }}>
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-4">
            <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-xl ring-2 ring-[#58a6ff]/30 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate">{user.name || user.login}</h3>
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <IconCheck className="w-2.5 h-2.5 text-white" />
                </span>
              </div>
              <p className="text-xs text-[#58a6ff] font-mono">@{user.login}</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{user.bio || 'Full-Stack Developer'}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                {user.location && <span className="flex items-center gap-1"><span className="text-gray-600">📍</span>{user.location}</span>}
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#0f0f18] rounded-lg p-2.5 text-center border border-[#2c2c38] hover:border-[#58a6ff]/50 transition-colors">
              <div className="text-lg font-bold text-white">{user.public_repos}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Repos</div>
            </div>
            <div className="bg-[#0f0f18] rounded-lg p-2.5 text-center border border-[#2c2c38] hover:border-[#58a6ff]/50 transition-colors">
              <div className="text-lg font-bold text-white">{user.followers}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Followers</div>
            </div>
            <div className="bg-[#0f0f18] rounded-lg p-2.5 text-center border border-[#2c2c38] hover:border-[#58a6ff]/50 transition-colors">
              <div className="text-lg font-bold text-white">{user.following}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Following</div>
            </div>
          </div>

          {/* Repos */}
          <div className="space-y-2 mb-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Latest Repositories</div>
            {repos.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#0f0f18] rounded-lg p-2.5 border border-[#2c2c38] hover:border-[#58a6ff] transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#58a6ff] group-hover:text-white transition-colors truncate">{repo.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span className="w-2 h-2 rounded-full" style={{ background: langColors[repo.language] || '#888' }}></span>
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
                {repo.description && <p className="text-[10px] text-gray-500 truncate mt-0.5">{repo.description}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <IconStar className="w-3 h-3 text-yellow-500" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-500">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3v18M17 3v18M3 7h18M3 17h18" /></svg>
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-[10px] text-gray-500">@{GITHUB_USERNAME} on GitHub</span>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn text-[10px] flex items-center gap-1"
            >
              View Profile <IconExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
