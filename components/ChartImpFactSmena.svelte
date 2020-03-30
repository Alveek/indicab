<script>
  import Chart from "chart.js";
  import { afterUpdate } from "svelte";
  export let data;

  function createChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    if (window.bar != undefined) {
      window.bar.destroy();
    }
    window.bar = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: ["А", "Б", "В", "Г"],
        datasets: [
          {
            label: "Клики",
            data: data,
            backgroundColor: [
              "rgba(154, 99, 255, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(130, 255, 99, 0.2)"
            ],
            borderColor: [
              "rgba(154, 99, 255, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(130, 255, 99, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        animation: false,
        title: {
          display: true,
          text: "Клики (факт) по сменам"
        },
        legend: { display: false },
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  afterUpdate(() => {
    setTimeout(createChart, 700);
  });
</script>

<canvas id="myChart" width="400" height="400"></canvas>

<style>
  canvas {
    margin-top: 30px;
  }
</style>