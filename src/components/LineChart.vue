<script>
import { Line } from 'vue-chartjs'

export default Line.extend({
  name: 'lineChart',
  props: ['datasets', 'labels'],

  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    })
  }
})
</script>
