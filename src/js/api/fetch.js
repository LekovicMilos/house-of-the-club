import buildUrl from 'build-url'

const DEFAULT_HEADERS = {
    Accept: 'application/json',
}

const clubhouseHeaders = {
    'Content-Type': 'application/json'
  }

let token = '';

function apiURL(path, token, query = '') {
    return {base: 'https://cors-anywhere.herokuapp.com/https://api.clubhouse.io/', path: 'api/v2' + path, queryParams: {token, query}}
}

function apiBuildUrl(urlData) {
    let url = buildUrl(urlData.base, urlData)
  
    if (url.substr(url.length - 1) === '?') {
      url = url.substring(0, url.length - 1)
    }
    return url
  }

export function listUsers(token) {
    const projectsUrl = apiURL('/members', token)
    return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function getEpicWorkflow(token) {
  const projectsUrl = apiURL('/epic-workflow', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function getEpics(token) {
  const projectsUrl = apiURL('/epics', token)
  return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function getProfile(token) {
    const projectsUrl = apiURL('/profile', token)
    return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function listEpics(token) {
    const projectsUrl = apiURL('/epics', token)
    return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

export function searchStories(query, token) {
    const projectsUrl = apiURL('/search/stories', token, query)
    return apiFetch(projectsUrl, {headers: clubhouseHeaders})
}

function apiFetchRaw(urlData, opts) {
    opts.headers = Object.assign({}, DEFAULT_HEADERS, opts.headers)
  
    const url = (typeof urlData === 'object') ? apiBuildUrl(urlData) : urlData
  
    return fetch(url, opts)
  }

export function apiFetch(urlData, opts = {}) {
    return apiFetchRaw(urlData, opts)
      .then(resp => {
        if (!resp.ok) {
          const errorResponse = Object.assign({}, {
            status: resp.status
          });
          return errorResponse
        }
        return resp.json()
      })
}