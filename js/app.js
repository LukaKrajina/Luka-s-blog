const GITHUB_USERNAME = 'LukaKrajina'; 
const clockEl = document.getElementById('clock');
const themeToggleBtn = document.getElementById('theme-toggle');
const bgMusic = document.getElementById('bg-music');
const lastUpdateEl = document.getElementById('last-update');
const repoListEl = document.getElementById('repo-list');
const searchInput = document.getElementById('repo-search');
const docLinks = document.querySelectorAll('#doc-nav a');
const docContentArea = document.getElementById('doc-content');
const albumPlayer = document.getElementById('album-player');
const albumArt = document.getElementById('album-art');
const musicToast = document.getElementById('music-toast');
const avatarBtn = document.getElementById('avatar-btn');
const socialDropdown = document.getElementById('social-dropdown');
const hljsTheme = document.getElementById('hljs-theme');

let allRepos = []; 

function updateClock() {
  const now = new Date();
  clockEl.innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.replace('light-theme', 'dark-theme');
  if (themeToggleBtn) themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
  if (hljsTheme) hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"; 
} else {
  if (hljsTheme) hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
}

themeToggleBtn.addEventListener('click', () => {
  if (document.body.classList.contains('light-theme')) {
    document.body.classList.replace('light-theme', 'dark-theme');
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    updateGiscusTheme('dark');
    hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"; 
  } else {
    document.body.classList.replace('dark-theme', 'light-theme');
    localStorage.setItem('theme', 'light');
    themeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
    updateGiscusTheme('light');
    hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css"; 
  }
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    musicToast.classList.add('show');
  }, 500);

  setTimeout(() => {
    musicToast.classList.remove('show');
  }, 5500);

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn("Browser blocked autoplay. Waiting for user interaction.");
      albumArt.classList.add('paused');
    });
  }
});

albumPlayer.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    albumArt.classList.remove('paused');
  } else {
    bgMusic.pause();
    albumArt.classList.add('paused');
  }
});

if (avatarBtn) {
  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    socialDropdown.classList.toggle('show');
  });
}

window.addEventListener('click', () => {
  if (socialDropdown && socialDropdown.classList.contains('show')) {
    socialDropdown.classList.remove('show');
  }
});

async function fetchGitHubData() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) throw new Error('Failed to fetch repositories');
    
    allRepos = await response.json();
    
    if (allRepos.length > 0) {
      const lastUpdatedDate = new Date(allRepos[0].updated_at);
      lastUpdateEl.innerText = lastUpdatedDate.toLocaleString();
    } else {
      lastUpdateEl.innerText = 'No repositories found.';
    }

    renderRepos(allRepos);

  } catch (error) {
    console.error('GitHub Sync Error:', error);
    repoListEl.innerHTML = `<div class="repo-card glass-panel" style="color: red;">Error loading repositories.</div>`;
    lastUpdateEl.innerText = 'Sync failed.';
  }
}

function renderRepos(repos) {
  repoListEl.innerHTML = '';

  if (repos.length === 0) {
    repoListEl.innerHTML = `<div class="repo-card glass-panel">No repositories match your search.</div>`;
    return;
  }

  repos.forEach(repo => {
    if (!repo.fork) { 
      const repoCard = document.createElement('div');
      repoCard.className = 'repo-card glass-panel scroll-fade';
      
      repoCard.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" style="color: inherit; text-decoration: none;">${repo.name}</a></h3>
        <p style="font-size: 0.85rem; margin-bottom: 10px; opacity: 0.8;">
          ${repo.description ? repo.description : 'No description provided.'}
        </p>
        <div class="repo-stats">
          <span><i class='bx bx-star'></i> ${repo.stargazers_count}</span>
          <span><i class='bx bx-git-repo-forked'></i> ${repo.forks_count}</span>
          <span><i class='bx bxs-circle' style="font-size: 0.6rem;"></i> ${repo.language || 'N/A'}</span>
        </div>
      `;
      repoListEl.appendChild(repoCard);
      scrollObserver.observe(repoCard);
    }
  });
}

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRepos = allRepos.filter(repo => {
    const nameMatch = repo.name.toLowerCase().includes(searchTerm);
    const descMatch = repo.description && repo.description.toLowerCase().includes(searchTerm);
    return nameMatch || descMatch;
  });

  renderRepos(filteredRepos);
});

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-'
});

docLinks.forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    
    docLinks.forEach(l => l.style.fontWeight = '500');
    e.target.style.fontWeight = 'bold';
    
    const filename = e.target.getAttribute('data-file');
    docContentArea.innerHTML = '<p>Loading document...</p>';

    try {
      const response = await fetch(`docs/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Could not load ${filename}`);
      }
      
      const markdownText = await response.text();
      
      docContentArea.innerHTML = marked.parse(markdownText);
      
    } catch (error) {
      console.error('Error loading documentation:', error);
      docContentArea.innerHTML = `<p style="color: #ff6b6b;">Error: The file <b>${filename}</b> could not be found. Make sure it exists in your /docs/ folder.</p>`;
    }
  });
});

if (docLinks.length > 0) {
    docLinks[0].click();
}

function updateGiscusTheme(theme) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) return;
  
  const giscusTheme = theme === 'dark' ? 'transparent_dark' : 'light';
  
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusTheme } } },
    'https://giscus.app'
  );
}

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
});

fetchGitHubData();

async function updateVisitCount() {
  const visitCountEl = document.getElementById('visit-count');
  try {
    const response = await fetch('https://api.counterapi.dev/v1/LukaKrajina_devhub/visits/up');
    if (!response.ok) throw new Error('Counter API unreachable');
    
    const data = await response.json();
    visitCountEl.innerText = data.count;
  } catch (error) {
    console.warn('Visit counter failed to load:', error);
    visitCountEl.innerText = 'Unavailable';
  }
}

window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

function initTranslation() {
  const script = document.createElement('script');
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  
  script.onerror = () => {
    console.warn("Google Translate blocked or unavailable. Initializing Microsoft Translator fallback.");
    
    document.getElementById('google_translate_element').style.display = 'none';
    const msBtn = document.getElementById('ms-translate-btn');
    msBtn.style.display = 'flex';
    
    msBtn.addEventListener('click', () => {
       const currentUrl = encodeURIComponent(window.location.href);
       window.open(`https://www.bing.com/translator?to=en&altloc=en&ref=IE8Activity&a=${currentUrl}`, '_blank');
    });
  };
  
  document.body.appendChild(script);
}

updateVisitCount();
initTranslation();