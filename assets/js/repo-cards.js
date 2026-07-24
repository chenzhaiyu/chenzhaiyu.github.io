const cacheTtl = 60 * 60 * 1000

const languageColors = {
  C: '#555555',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  Go: '#00add8',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Jupyter: '#da5b0b',
  Python: '#3572a5',
  Rust: '#dea584',
  Shell: '#89e051',
  TypeScript: '#3178c6'
}

function formatNumber(value) {
  if (value < 1000) return String(value)
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

function readCache(key) {
  try {
    const cached = JSON.parse(localStorage.getItem(key))
    if (!cached?.data) return null

    return {
      data: cached.data,
      fresh: Date.now() - cached.savedAt < cacheTtl
    }
  } catch (_error) {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }))
  } catch (_error) {
    // Cards still work when storage is unavailable.
  }
}

async function fetchGitHub(path) {
  const cacheKey = `github-card:${path}`
  const cached = readCache(cacheKey)

  if (cached?.fresh) return cached.data

  try {
    const response = await fetch(`https://api.github.com/${path}`, {
      headers: { Accept: 'application/vnd.github+json' }
    })

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`)

    const data = await response.json()
    writeCache(cacheKey, data)
    return data
  } catch (error) {
    if (cached?.data) return cached.data
    throw error
  }
}

function renderLanguage(element, language) {
  if (!element || !language) return

  const color = languageColors[language] || '#858585'
  element.innerHTML = `<span class="repo-card-lang-dot" style="background-color: ${color}"></span>${language}`
}

async function hydrateRepository(card) {
  const repository = card.dataset.repo

  try {
    const data = await fetchGitHub(`repos/${repository}`)
    card.querySelector('.repo-card-description').textContent = data.description || 'No description provided.'
    card.querySelector('.repo-card-stars').innerHTML = `<i class="fa-regular fa-star"></i> ${formatNumber(data.stargazers_count)}`
    card.querySelector('.repo-card-forks').innerHTML = `<i class="fa-solid fa-code-branch"></i> ${formatNumber(data.forks_count)}`
    renderLanguage(card.querySelector('.repo-card-language'), data.language)
  } catch (_error) {
    // Keep the build-time metadata when GitHub rate-limits anonymous requests.
  }
}

async function hydrateUser(card) {
  const username = card.dataset.githubUser

  try {
    const data = await fetchGitHub(`users/${username}`)
    card.querySelector('.repo-card-description').textContent = data.bio || `@${username} on GitHub`
    card.querySelector('.repo-card-repos').innerHTML = `<i class="fa-solid fa-book"></i> ${formatNumber(data.public_repos)} repos`
    card.querySelector('.repo-card-followers').innerHTML = `<i class="fa-solid fa-users"></i> ${formatNumber(data.followers)} followers`
  } catch (_error) {
    // Keep the build-time metadata when GitHub rate-limits anonymous requests.
  }
}

document.querySelectorAll('[data-repo]').forEach(hydrateRepository)
document.querySelectorAll('[data-github-user]').forEach(hydrateUser)
