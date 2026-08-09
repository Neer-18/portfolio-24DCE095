import { useState, useEffect } from 'react';

export default function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Controlled inputs & active fetch targets
    const [searchTerm, setSearchTerm] = useState('');
    const [usernameInput, setUsernameInput] = useState('Neer-18');
    const [activeUsername, setActiveUsername] = useState('Neer-18');
    const [simulateError, setSimulateError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Fetch repositories with rate limit consideration & error simulation
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Break API URL intentionally if simulation checkbox is ticked
        const apiUrl = simulateError
            ? `https://api.github.com/users/${activeUsername}/repos-non-existent-simulate-error`
            : `https://api.github.com/users/${activeUsername}/repos`;

        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`GitHub API request failed with status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    // Sort repositories by star count descending, then by name
                    const sortedData = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
                    setRepos(sortedData);
                } else {
                    throw new Error("Received unexpected non-array data response.");
                }
            })
            .catch((err) => {
                setError(err.message || "Something went wrong while loading repos.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [activeUsername, simulateError, retryCount]);

    // Local client-side filtering based on name matching
    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle retry click
    const handleRetry = () => {
        setRetryCount((prev) => prev + 1);
    };

    return (
        <section id="projects" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', margin: '1.5rem 0 1rem 0', lineHeight: '1.25' }}>GitHub Project Explorer</h1>
            <p style={{ textAlign: 'center', color: 'var(--text)', margin: '0 0 2.5rem 0', lineHeight: '1.6' }}>
                Discover public codebases, repositories, and contributions dynamically powered by the GitHub REST API.
            </p>

            {/* Dashboard Control Bar */}
            <div className="controls-container">
                <div className="control-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="🔍 Filter by project name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading || error !== null}
                    />
                </div>

                <div className="control-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="GitHub Username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setActiveUsername(usernameInput);
                            }
                        }}
                    />
                    <button
                        className="btn-primary"
                        onClick={() => setActiveUsername(usernameInput)}
                        disabled={loading}
                    >
                        Load User
                    </button>
                </div>

                <div className="control-group">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={simulateError}
                            onChange={(e) => setSimulateError(e.target.checked)}
                        />
                        Simulate API Error
                    </label>
                </div>
            </div>

            {/* Conditional States Rendering */}
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p style={{ fontWeight: '500', color: 'var(--text-h)' }}>
                        Fetching repositories for "{activeUsername}"...
                    </p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <h3 className="error-title">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ verticalAlign: 'middle' }}>
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        API Connection Error
                    </h3>
                    <p className="error-message">{error}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
                        Ensure your internet connection is active, the username is correct, or uncheck "Simulate API Error" before retrying.
                    </p>
                    <button className="btn-retry" onClick={handleRetry}>
                        🔄 Try Again
                    </button>
                </div>
            ) : (
                <div>
                    <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Public Repositories ({filteredRepos.length})</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text)' }}>
                            Active User: <strong style={{ color: 'var(--accent)' }}>{activeUsername}</strong>
                        </span>
                    </h2>

                    {filteredRepos.length === 0 ? (
                        <div className="repo-grid">
                            <div className="no-results">
                                <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>No projects match your search.</p>
                                <p style={{ fontSize: '0.9rem', margin: 0 }}>Try clearing the search query or search a different user's repositories.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="repo-grid">
                            {filteredRepos.map((repo) => (
                                <div key={repo.id} className="repo-card">
                                    <div>
                                        <div className="repo-header">
                                            <h3 className="repo-title" title={repo.name}>
                                                {repo.name}
                                            </h3>
                                            <span className="star-badge" title="GitHub Stars">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
                                                </svg>
                                                {repo.stargazers_count}
                                            </span>
                                        </div>
                                        <p className="repo-desc">
                                            {repo.description || "No project description provided."}
                                        </p>
                                    </div>
                                    <div className="repo-footer">
                                        <span className="lang-tag">
                                            {repo.language || "Markdown"}
                                        </span>
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="repo-link"
                                        >
                                            View Source
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}