// VSCode-like Reddit Client
// List of subreddits to show in the sidebar
const subreddits = ['javascript', 'webdev', 'reactjs', 'aww', 'news', 'funny', 'AskReddit'];

const subredditList = document.getElementById('subreddit-list');
const editor = document.getElementById('editor');
const tabs = document.getElementById('tabs');
const statusbar = document.getElementById('statusbar');

let openTabs = [];
let activeTab = null;

// Populate sidebar
subreddits.forEach(sub => {
  const li = document.createElement('li');
  li.textContent = `r/${sub}`;
  li.onclick = () => openSubreddit(sub);
  subredditList.appendChild(li);
});

function openSubreddit(sub) {
  // If already open, just activate
  let tab = openTabs.find(t => t.subreddit === sub);
  if (!tab) {
    tab = { subreddit: sub, posts: [] };
    openTabs.push(tab);
    fetchSubredditPosts(sub, tab);
  }
  setActiveTab(tab);
  updateTabs();
}

function fetchSubredditPosts(sub, tab) {
  editor.innerHTML = `<div class="welcome">Loading r/${sub}...</div>`;
  fetch(`https://www.reddit.com/r/${sub}.json`)
    .then(res => res.json())
    .then(data => {
      tab.posts = data.data.children.map(c => c.data);
      if (activeTab === tab) showPosts(tab);
    })
    .catch(() => {
      editor.innerHTML = `<div class="welcome">Failed to load r/${sub}</div>`;
    });
}

function setActiveTab(tab) {
  activeTab = tab;
  showPosts(tab);
  updateTabs();
}

function showPosts(tab) {
  editor.innerHTML = `<h2>r/${tab.subreddit}</h2>`;
  if (!tab.posts.length) {
    editor.innerHTML += `<div class="welcome">No posts found.</div>`;
    return;
  }
  tab.posts.forEach(post => {
    const div = document.createElement('div');
    div.style.marginBottom = '18px';
    div.innerHTML = `<strong>${post.title}</strong><br>
      <span style="color:#888;">by u/${post.author}</span><br>
      <a href="https://reddit.com${post.permalink}" target="_blank" style="color:#4FC3F7;">View on Reddit</a>`;
    editor.appendChild(div);
  });
}

function updateTabs() {
  tabs.innerHTML = '';
  openTabs.forEach(tab => {
    const tabDiv = document.createElement('div');
    tabDiv.className = 'tab' + (tab === activeTab ? ' active' : '');
    tabDiv.textContent = `r/${tab.subreddit}`;
    tabDiv.onclick = () => setActiveTab(tab);
    tabs.appendChild(tabDiv);
  });
}

// Optionally, update status bar (e.g., login status)
statusbar.textContent = 'Not logged in'; 