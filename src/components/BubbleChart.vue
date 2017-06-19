<script>
import { Bubble } from 'vue-chartjs'

export default Bubble.extend({
  name: 'bubbleChart',
  props: ['datasets', 'labels'],

  mounted () {
    this.renderChart({
      labels: this.labels,
      datasets: this.datasets
    })
  }
})
</script>
