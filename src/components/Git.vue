<template>
  <div class="container">
    <h1>This week</h1>
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
        class="col-4 bg-faded"
        :key="contributor.author.login"
        :img="contributor.author.avatar_url.concat('&size=250')"
        :title="contributor.author.login"
      >
        <div class="row">
          <div class="col-6">
            <b-list-group>
              <b-list-group-item active>This week</b-list-group-item>
              <b-list-group-item>
                <span class="text-success">{{ contributor.weeks[contributor.weeks.length-1].a }} additions</span>
              </b-list-group-item>
              <b-list-group-item>
                <span class="text-danger">{{ contributor.weeks[contributor.weeks.length-1].d }} deletions</span>
              </b-list-group-item>
              <b-list-group-item>
                <span class="text-warning">{{ contributor.weeks[contributor.weeks.length-1].c }} commits</span>
              </b-list-group-item>
            </b-list-group>
          </div>
          <div class="col-6">
            <b-list-group>
              <b-list-group-item active>Total</b-list-group-item>
              <b-list-group-item>
                <span class="text-success">{{ contributor.weeks.reduce( (a, b) => ({a: a.a + b.a }) ).a }} additions</span>
              </b-list-group-item>
              <b-list-group-item>
                <span class="text-danger">{{ contributor.weeks.reduce( (a, b) => ({d: a.d + b.d }) ).d }} deletions</span>
              </b-list-group-item>
              <b-list-group-item>
                <span class="text-warning">{{ contributor.total }} commits</span>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </b-card>
    </b-card-group>

    <h1>Commits per hour</h1>
    <div class="row bg-faded">
      <div class="col">
        {{ punchCard }}
      </div>
    </div>

    <h1>Commits per week this year</h1>
    <div class="row bg-faded">
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

    gitService.getCommitActivity()
      .then(response => this.commitActivity = response)

    gitService.getCodeFrequency()
      .then(response => this.codeFrequency = response)

    gitService.getParticipation()
      .then(response => this.participation = response)

    gitService.getPunchCard()
      .then(response => this.punchCard = response)
  }
}
</script>
