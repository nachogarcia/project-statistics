import GitService from '../../src/services/GitService.js'

describe('GitService', () => {
  let service

  beforeEach(() => {
    service = GitService(process.env.PROJECT_OWNER, process.env.PROJECT_REPO)
  })

  it('gets contributors list with additions, deletions, and commit counts', () => {
    return service.getContributors().then((response) => {
      expect(response).not.to.be.undefined
    })
  })

  it('gets the last year of commit activity data', () => {
    return service.getCommitActivity().then((response) => {
      expect(response).not.to.be.undefined
    })
  })

  it('gets the number of additions and deletions per week', () => {
    return service.getCodeFrequency().then((response) => {
      expect(response).not.to.be.undefined
    })
  })

  it('gets the weekly commit count for the repository owner and everyone else', () => {
    return service.getParticipation().then((response) => {
      expect(response).not.to.be.undefined
    })
  })

  it('gets the number of commits per hour in each day', () => {
    return service.getPunchCard().then((response) => {
      expect(response).not.to.be.undefined
    })
  })

  it('returns a rejected promise if there is a problem', () => {
    service = GitService('nonExistentOwner!', 'nonExistentRepository!')

    return service.getContributors().catch((error) => {
      expect(error).not.to.be.undefined
    })
  })
})
