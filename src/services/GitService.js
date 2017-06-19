const axios = require('axios')

export default function GitService (owner, repo) {
  const URL = `https://api.github.com/repos/${owner}/${repo}/stats/`

  function getContributors () {
    return axios.get(URL + 'contributors')
      .then(response => {
        return parseResponse(response)
      })
  }

  function getCommitActivity () {
    return axios.get(URL + 'commit_activity')
      .then(response => {
        return parseResponse(response)
      })
  }

  function getCodeFrequency () {
    return axios.get(URL + 'code_frequency')
      .then(response => {
        return parseResponse(response)
      })
  }

  function getParticipation () {
    return axios.get(URL + 'participation')
      .then(response => {
        return parseResponse(response)
      })
  }

  function getPunchCard () {
    return axios.get(URL + 'punch_card')
      .then(response => {
        return parseResponse(response)
      })
  }

  function parseResponse (response) {
    if (response.status === '202') return Promise.reject(new Error('Github is caching the response'))
    return response.data
  }

  return { getContributors, getCommitActivity, getCodeFrequency, getParticipation, getPunchCard }
}
