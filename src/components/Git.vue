<template>
  <div>
    <div>
      <h1>This week</h1>
      This week there has been
      <span class="additions">
        {{ codeFrequency[codeFrequency.length-1][1] }} additions
      </span>
      &amp;
      <span class="deletions">
        {{ codeFrequency[codeFrequency.length-1][2] }} deletions
      </span>
      in
      <span class="commits">
        {{ participation.all[participation.all.length-1] }} commits
      </span>
    </div>

    <div>
      <h1>Authors:</h1>
      <div v-for="contributor in contributors">
        {{ contributor.author.login }}
        {{ contributor.author.avatar_url }}
        <span class="additions">{{ contributor.weeks[contributor.weeks.length-1].a }} additions</span>
        <span class="deletions">{{ contributor.weeks[contributor.weeks.length-1].d }} deletions</span>
        <span class="commits">{{ contributor.weeks[contributor.weeks.length-1].c }} commits</span>
      </div>
    </div>

    <div>
      <h1>Hours</h1>
      {{ punchCard }}
    </div>

    <div>
      <h1>Last Year</h1>
      <LineChart
        :datasets=yearDatasets
        :labels=yearLabels
      />
    </div>
  </div>
</template>

<script>
import GitService from '../services/GitService.js'
import LineChart from './LineChart'

const owner = process.env.PROJECT_OWNER
const repo = process.env.PROJECT_REPO

const gitService = GitService(owner, repo)

export default {
  name: 'git',
  
  components: {
    LineChart
  },

  data () {
    return {
      contributors: [],
      commitActivity: [],
      codeFrequency: [],
      participation: {},
      punchCard: [],

      yearOptions: {
        title: {
          display: true,
          text: 'Commits per week'
        }
      }
    }
  },

  computed: {
    yearDatasets: function () { 
      const label = 'Weekly commits'
      const data = this.commitActivity.map(week => week.total)
      const backgroundColor= '#f87979'

      const dataset = { label, data, backgroundColor }
      return [ dataset ]
    },

    yearLabels: function () { return this.commitActivity.map(week => this.unixDateToString(week.week))},
  },

  methods: {
    unixDateToString: (unixDate) => { 
      let date = new Date(unixDate * 1000)
      return date.toLocaleDateString()
    }
  }, 

  created () {
    gitService.getContributors()
      .then(response => this.contributors = response)
      .catch(error => console.log(error))

    gitService.getCommitActivity()
      .then(response => this.commitActivity = response)
      .catch(error => console.log(error))

    gitService.getCodeFrequency()
      .then(response => this.codeFrequency = response)
      .catch(error => console.log(error))

    gitService.getParticipation()
      .then(response => this.participation = response)
      .catch(error => console.log(error))

    gitService.getPunchCard()
      .then(response => this.punchCard = response)
      .catch(error => console.log(error))
  }
}
</script>

<style>
.additions{
  color: green;
}

.deletions{
  color: red;
}

.commits{
  color: orange;
}

.percentaje{
  color: blue;
}
</style>
