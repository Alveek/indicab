<script>
  import { db } from "../firebase.js";
  import { test, orderCollection, supplyCollection } from "../order-template";

  export let currentMonth;
  export let currentYear;

  let data = [];
  let lengthFactMonth;
  let impsPlanMonth;
  let impsFactMonth;
  let impsFactMonthA;
  let impsFactMonthB;
  let impsFactMonthV;
  let impsFactMonthG;

  let impsPlanMonthA;
  let impsPlanMonthB;
  let impsPlanMonthV;
  let impsPlanMonthG;

  let impsStartMonthA;
  let impsStartMonthB;
  let impsStartMonthV;
  let impsStartMonthG;

  let impsBWMonthA;
  let impsBWMonthB;
  let impsBWMonthV;
  let impsBWMonthG;

  let whiteUsed;

  export function getStats() {
    db.collection(orderCollection)
      .orderBy("timestamp", "desc")
      .where("month", "==", parseInt(currentMonth))
      .where("year", "==", parseInt(currentYear))
      .onSnapshot(snapshot => {
        lengthFactMonth = 0;
        impsPlanMonth = 0;
        impsFactMonth = 0;
        impsFactMonthA = 0;
        impsFactMonthB = 0;
        impsFactMonthV = 0;
        impsFactMonthG = 0;

        impsPlanMonthA = 0;
        impsPlanMonthB = 0;
        impsPlanMonthV = 0;
        impsPlanMonthG = 0;

        impsStartMonthA = 0;
        impsStartMonthB = 0;
        impsStartMonthV = 0;
        impsStartMonthG = 0;

        impsBWMonthA = 0;
        impsBWMonthB = 0;
        impsBWMonthV = 0;
        impsBWMonthG = 0;

        whiteUsed = 0;

        snapshot.docs.forEach(item => {
          lengthFactMonth += item.data().orderLength;
          impsPlanMonth += parseInt(item.data().impPlan);
          impsFactMonth += item.data().impFact;
          impsFactMonthA += item.data().smena === "А" ? item.data().impFact : 0;
          impsFactMonthB += item.data().smena === "Б" ? item.data().impFact : 0;
          impsFactMonthV += item.data().smena === "В" ? item.data().impFact : 0;
          impsFactMonthG += item.data().smena === "Г" ? item.data().impFact : 0;

          impsPlanMonthA +=
            item.data().smena === "А" ? Number(item.data().impPlan) : 0;
          impsPlanMonthB +=
            item.data().smena === "Б" ? Number(item.data().impPlan) : 0;
          impsPlanMonthV +=
            item.data().smena === "В" ? Number(item.data().impPlan) : 0;
          impsPlanMonthG +=
            item.data().smena === "Г" ? Number(item.data().impPlan) : 0;

          impsStartMonthA +=
            item.data().smena === "А" ? Number(item.data().impStart) : 0;
          impsStartMonthB +=
            item.data().smena === "Б" ? Number(item.data().impStart) : 0;
          impsStartMonthV +=
            item.data().smena === "В" ? Number(item.data().impStart) : 0;
          impsStartMonthG +=
            item.data().smena === "Г" ? Number(item.data().impStart) : 0;

          impsBWMonthA +=
            item.data().smena === "А" ? Number(item.data().bwImpTotal) : 0;
          impsBWMonthB +=
            item.data().smena === "Б" ? Number(item.data().bwImpTotal) : 0;
          impsBWMonthV +=
            item.data().smena === "В" ? Number(item.data().bwImpTotal) : 0;
          impsBWMonthG +=
            item.data().smena === "Г" ? Number(item.data().bwImpTotal) : 0;
        });
      });
  }
</script>

<style>
  .container {
    background: #fff;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 0 20px;
    width: 280px;
    height: 500px;
  }

  table {
    margin-top: 20px;
  }

  table,
  th,
  td {
    border: 1px solid #ccc;
    border-collapse: collapse;
    font-size: 0.9rem;
    text-align: center;
  }

  th,
  td {
    padding: 7px;
  }

  td:first-child,
  th {
    color: #555;
  }

  .common-stats {
    width: 246px;
  }

  .common-stats td {
    text-align: left;
  }

  .common-stats td:first-child {
    width: 135px;
  }

  .common-stats td:nth-child(2) {
    text-align: right;
  }

  @media (max-width: 400px) {
    .container {
      width: 282px;
      height: max-content;
      padding-bottom: 30px;
      margin: 0 auto;
      grid-row: 1;
    }
  }
</style>

<div class="container">
  <h2>Статистика</h2>
  <table class="common-stats">
    <tr>
      <td>Всего кликов:</td>
      <td>
        <strong>{impsFactMonth}</strong>
      </td>
    </tr>
    <tr>
      <td>Общий метраж:</td>
      <td>
        <strong>{lengthFactMonth}</strong>
      </td>
    </tr>
  </table>

  <table>
    <tr style="background: rgba(0, 79, 255, 0.05);">
      <th />
      <th>Тираж</th>
      <th>Запуск</th>
      <th>Ч\б</th>
      <th>Всего</th>
    </tr>
    <tr>
      <td>
        <b>А</b>
      </td>
      <td>{impsPlanMonthA || 0}</td>
      <td>{impsStartMonthA || 0}</td>
      <td>{impsBWMonthA || 0}</td>
      <td>{impsFactMonthA || 0}</td>
    </tr>
    <tr>
      <td>
        <b>Б</b>
      </td>
      <td>{impsPlanMonthB || 0}</td>
      <td>{impsStartMonthB || 0}</td>
      <td>{impsBWMonthB || 0}</td>
      <td>{impsFactMonthB || 0}</td>
    </tr>
    <tr>
      <td>
        <b>В</b>
      </td>
      <td>{impsPlanMonthV || 0}</td>
      <td>{impsStartMonthV || 0}</td>
      <td>{impsBWMonthV || 0}</td>
      <td>{impsFactMonthV || 0}</td>
    </tr>
    <tr>
      <td>
        <b>Г</b>
      </td>
      <td>{impsPlanMonthG || 0}</td>
      <td>{impsStartMonthG || 0}</td>
      <td>{impsBWMonthG || 0}</td>
      <td>{impsFactMonthG || 0}</td>
    </tr>

  </table>
</div>
