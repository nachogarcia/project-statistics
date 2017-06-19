<template>
  <div class="container">
    <div class="row">
      <b-card class="col-xl mb-2 bg-faded">
        This week there has been
        <span class="text-success">
          {{ codeFrequency[codeFrequency.length-1][1] }} additions
        </span>
        &amp;
        <span class="text-danger">
          {{ codeFrequency[codeFrequency.length-1][2] }} deletions
        </span>
        in
        <span class="text-warning">
          {{ participation.all[participation.all.length-1] }} commits
        </span>
      </b-card>
    </div>

    <b-card-group>
      <b-card 
        v-for="contributor in contributors"
        class="bg-faded"
        :key="contributor.author.login"
        :img="contributor.author.avatar_url"
        :title="contributor.author.login"
      >
        <span class="text-success">{{ contributor.weeks[contributor.weeks.length-1].a }} additions</span>
        <span class="text-danger">{{ contributor.weeks[contributor.weeks.length-1].d }} deletions</span>
        <span class="text-warning">{{ contributor.weeks[contributor.weeks.length-1].c }} commits</span>
      </b-card>
    </b-card-group>

    <h1>Commits per hour</h1>
    <div class="row">
      <div class="col">
        {{ punchCard }}
      </div>
    </div>

    <h1>Commits per week this year</h1>
    <div class="row">
      <div class="col">
        <LineChart
          :datasets=yearDatasets
          :labels=yearLabels
        />
      </div>
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
