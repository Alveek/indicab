<script>
  import { db } from "../firebase.js";
  import { onMount } from "svelte";
  import {
    test,
    orderCollection,
    supplyCollection,
    date,
    newOrder,
    getCurrentDay,
    getCurrentMonth,
    getCurrentYear
  } from "../order-template";
  import { suppliesTemplate } from "../supplies-template";
  import Stats from "./Stats.svelte";
  import SupplyList from "./SupplyList.svelte";

  let orderDetails = [];
  let order = [];
  let filterImps = [0];
  let inksTotalForImps;
  let inksTotal;
  let bwTotal;
  let impPerInk;
  let bwPerInk;
  let bwImpTotal;
  let impPlan;
  let impStart;
  let impBW;
  let selectedSupply;
  let replacements = [];
  let currentMonth = getCurrentMonth().toString();
  let currentYear = getCurrentYear().toString();
  let currentId = test ? "2sT9c9WGw4f4tY4jxfN8" : "ASPlV9ExnvZZzDZPTgx6";
  let lastSmena;
  let lastOperator;

  let stats;
  let supplyUsage;
  onMount(() => {
    stats.getStats();
    supplyUsage.getSupplyUsage();
  });

  db.collection(orderCollection)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.docs.length) {
        currentId = snapshot.docs[0].id;
      } else {
        return;
      }
    });

  function createNewOrder() {
    getTotalFilterImps();

    newOrder.day = getCurrentDay();
    newOrder.month = getCurrentMonth();
    newOrder.year = getCurrentYear();

    newOrder.smena = lastSmena;
    newOrder.operator = lastOperator;

    db.collection(orderCollection).add(newOrder);

    db.collection(orderCollection)
      .orderBy("timestamp", "desc")
      .get()
      .then(snapshot => {
        currentId = snapshot.docs[0].id;
      });
  }

  function getTotalFilterImps() {
    if (!order.impFact) {
      return;
    }

    filterImps = [order.impFact, ...filterImps];
    db.collection(supplyCollection)
      .doc("supply-items")
      .update({
        filterImps: filterImps
      });
  }

  // Когда выбираешь другой месяц выполняется эта фунция, чтобы не вставлять $: выше.
  function getOrderData() {
    db.collection(orderCollection)
      .orderBy("timestamp", "desc")
      .where("month", "==", parseInt(currentMonth))
      .where("year", "==", parseInt(currentYear))
      .onSnapshot(snapshot => {
        orderDetails = snapshot.docs;
        // currentId = snapshot.docs[0].id;

        lastSmena = snapshot.docs[0].data().smena;
        lastOperator = snapshot.docs[0].data().operator;
      });
  }

  getOrderData();

  // Присвоение переменной order документа из БД
  $: db.collection(orderCollection)
    .doc(currentId)
    .onSnapshot(function(doc) {
      order = doc.data();
      replacements = Array.from(doc.data().rep);
    });

  // Обновление БД
  function calculateImps() {
    impPlan =
      Number((order.orderLength / (order.rapport / 1000)).toFixed()) *
      inksTotal;

    impStart = Number(order.impFact) - Number(impPlan) - Number(bwImpTotal);

    db.collection(orderCollection)
      .doc(currentId)
      .update({
        impPlan,
        bwImpTotal,
        impStart,
        // формула расчета кликов на каждую краску:
        // если кол-во краски больше 0, то клики на одну краску умножить на кол-во + если эта краска использовась для ч\б - прибавить клики ч\б на одну краску.
        ink_white_imp: (order.ink_white_qty
          ? Number(impPerInk) * order.ink_white_qty +
            (order.ink_white_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_cyan_imp: (order.ink_cyan_qty
          ? Number(impPerInk) * order.ink_cyan_qty +
            (order.ink_cyan_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_magenta_imp: (order.ink_magenta_qty
          ? Number(impPerInk) * order.ink_magenta_qty +
            (order.ink_magenta_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_yellow_imp: (order.ink_yellow_qty
          ? Number(impPerInk) * order.ink_yellow_qty +
            (order.ink_yellow_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_black_imp: (order.ink_black_qty
          ? Number(impPerInk) * order.ink_black_qty +
            (order.ink_black_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_orange_imp: (order.ink_orange_qty
          ? Number(impPerInk) * order.ink_orange_qty +
            (order.ink_orange_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_green_imp: (order.ink_green_qty
          ? Number(impPerInk) * order.ink_green_qty +
            (order.ink_green_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed(),
        ink_violet_imp: (order.ink_violet_qty
          ? Number(impPerInk) * order.ink_violet_qty +
            (order.ink_violet_bw === "yes" ? bwPerInk : 0)
          : 0
        ).toFixed()
      });
    document.querySelector(".calculateImpsBtn").style = "";
  }

  function updateOrder(e) {
    if (e.target.classList.contains("order-input")) {
      db.collection(orderCollection)
        .doc(currentId)
        .update({
          [e.target.name]:
            e.target.type === "number"
              ? parseInt(e.target.value)
              : e.target.value
        });
    }
  }

  // сумма кол-ва красок для расчета кликов: если используется 2 черных, то будет считаться как 1, потому что иначе клики рассчитываются неверно.
  $: inksTotalForImps = Number(
    (order.ink_black_qty ? 1 : 0) +
      (order.ink_white_qty ? 1 : 0) +
      (order.ink_cyan_qty ? 1 : 0) +
      (order.ink_magenta_qty ? 1 : 0) +
      (order.ink_green_qty ? 1 : 0) +
      (order.ink_violet_qty ? 1 : 0) +
      (order.ink_orange_qty ? 1 : 0) +
      (order.ink_yellow_qty ? 1 : 0)
  );

  $: inksTotal = Number(
    order.ink_black_qty +
      order.ink_white_qty +
      order.ink_cyan_qty +
      order.ink_magenta_qty +
      order.ink_green_qty +
      order.ink_violet_qty +
      order.ink_orange_qty +
      order.ink_yellow_qty
  );

  $: bwTotal = Number(
    (order.ink_black_bw === "yes" ? 1 : 0) +
      (order.ink_white_bw === "yes" ? 1 : 0) +
      (order.ink_cyan_bw === "yes" ? 1 : 0) +
      (order.ink_magenta_bw === "yes" ? 1 : 0) +
      (order.ink_green_bw === "yes" ? 1 : 0) +
      (order.ink_violet_bw === "yes" ? 1 : 0) +
      (order.ink_orange_bw === "yes" ? 1 : 0) +
      (order.ink_yellow_bw === "yes" ? 1 : 0)
  );

  $: impsSum = (
    Number(order.ink_white_imp) +
    Number(order.ink_black_imp) +
    Number(order.ink_cyan_imp) +
    Number(order.ink_yellow_imp) +
    Number(order.ink_magenta_imp) +
    Number(order.ink_orange_imp) +
    Number(order.ink_violet_imp) +
    Number(order.ink_green_imp)
  ).toFixed();

  $: impPerInk = Number(
    (order.impFact - bwImpTotal) / Number(inksTotal)
  ).toFixed();

  $: bwPerInk = Number(
    ((order.bwLength / (order.rapport / 1000)) * bwTotal).toFixed() / bwTotal
  );

  $: bwImpTotal = Number(
    ((order.bwLength / (order.rapport / 1000)) * bwTotal).toFixed()
  );

  // при нажатии на кнопку "Заменить" происходит обновление массива в базе данных. Происходит замена массива на нашу копию. В качестве аргумента выступает (bind) значение selectedSupply.
  function replaceSupply(item) {
    if (!item) {
      return;
    }
    replacements = [item, ...replacements];

    db.collection(orderCollection)
      .doc(currentId)
      .update({
        rep: replacements
      });

    if (item === "filterIO") {
      document.querySelector("input[name=" + item + "]").value -= 3;
      filterImps = [0];

      db.collection(supplyCollection)
        .doc("supply-items")
        .update({
          filterImps: filterImps
        });
    } else {
      document.querySelector("input[name=" + item + "]").value -= 1;
    }
    updateSupplyListAfterReplace(item);
    document.querySelector("#operations").selectedIndex = 0;
  }

  // эта функция выполняется после того, как нажата кнопка "Заменить", внутри функции replaceSupply.
  function updateSupplyListAfterReplace(item) {
    db.collection(supplyCollection)
      .doc("supply-items")
      .update({
        [item]: Number(document.querySelector("input[name=" + item + "]").value)
      });
  }

  function deleteReplacement(e) {
    let itemIndex = Number(e.target.parentElement.getAttribute("data-index"));
    let item = e.target.parentElement.getAttribute("data-name");
    replacements.splice(itemIndex, 1);

    db.collection(orderCollection)
      .doc(currentId)
      .update({
        rep: replacements
      });

    if (item === "filterIO") {
      document.querySelector("input[name=" + item + "]").valueAsNumber += 3;
    } else {
      document.querySelector("input[name=" + item + "]").valueAsNumber += 1;
    }
    updateSupplyListAfterReplace(item);
  }

  function setCmyk() {
    db.collection(orderCollection)
      .doc(currentId)
      .update({
        ink_white_qty: 1,
        ink_cyan_qty: 1,
        ink_magenta_qty: 1,
        ink_black_qty: 1,
        ink_yellow_qty: 1,
        ink_black_bw: "yes",
        ink_white_bw: "yes"
      });

    alertToCalculate();
  }

  function alertToCalculate(e) {
    if (!document.querySelector(".calculateImpsBtn")) {
      return;
    }
    let element = document.querySelector(".calculateImpsBtn");

    element.classList.add("animated", "shake");
    element.style = "box-shadow: 0px 0px 8px #f53b57;";
    element.addEventListener("animationend", function() {
      element.classList.remove("animated", "shake");
    });
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-gap: 20px;
    margin: 0 20px;
  }

  .order-info-col {
    background: #fff;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 0 20px;
    width: 760px;
    height: 823px;
    overflow: scroll;
  }

  .order {
    padding: 10px;
    /* width: max-content; */
    display: grid;
    grid-template-columns: 360px 1fr;
    align-content: start;
  }

  .col-inks {
    /* padding-left: 20px; */
    margin-top: -5px;
  }

  .order-history {
    background: #fff;
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    padding: 0 20px;
    height: 823px;
    width: 340px;
    overflow: scroll;
  }

  .order-history select {
    width: max-content;
  }

  .order-info-header {
    display: grid;
    grid-template-columns: max-content max-content;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .input-field {
    margin-bottom: 10px;
  }

  label {
    display: inline-block;
    width: 140px;
  }

  select {
    width: 140px;
    background: #fff;
    height: 26px;
    padding-left: 6px;
    /* font-size: 0.9rem; */
    cursor: pointer;
  }

  input {
    width: 130px;
    padding-left: 6px;
  }

  td input[type="number"] {
    width: 50px;
    text-align: center;
  }

  td,
  th {
    /* padding-right: 18px; */
    padding: 3px 18px 3px 6px;
  }

  td:not(:nth-child(1)),
  th:not(:nth-child(1)) {
    text-align: center;
  }

  td select {
    width: max-content;
    /* margin-right: 10px; */
  }

  th {
    border-bottom: 1px solid #ddd;
    padding-bottom: 6px;
    font-size: 0.96rem;
  }

  .operations {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    padding: 10px;
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 50px;
  }

  .operations select {
    width: 210px;
  }

  .operations h3 {
    margin-top: 0;
  }

  .order-history-item {
    padding: 5px 0 5px 5px;
    margin: 10px 0;
    border: 1px solid #ccc;
    width: 98%;
    cursor: pointer;
  }

  .order-history-item span {
    margin-right: 16px;
  }

  .del-rep-btn {
    margin: 0;
    display: none;
    cursor: pointer;
    /* padding-right: 20px; */
    float: right;
    color: #ee5253;
  }
  .replaced-item {
    padding: 6px;
    /* height: 26px; */
    border-bottom: 1px solid rgb(211, 203, 255);
  }

  .replaced-item:hover .del-rep-btn {
    display: inline-block;
  }

  .operations-list {
    /* font-size: 18px; */
    padding-left: 2px;
    list-style-position: inside;
    width: 278px;
    transform: translateY(-135px);
    font-size: 0.9rem;
  }

  .fa-comment-dots {
    color: #f53b57;
  }

  .active {
    border: 2px solid #4b189e;
    box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.1);
    font-weight: bold;
  }

  textarea {
    padding: 5px;
    width: 100%;
  }

  .cmyk-btn {
    width: 100%;
  }

  .calculateImpsBtn {
    margin-top: 16px;
    width: 100%;
  }

  .calculateImpsBtnInactive {
    margin-top: 16px;
    width: 100%;
  }

  .order-left-col button {
    width: 284px;
  }

  .higherSelect {
    height: 32px;
  }

  .show-btn {
    float: right;
  }

  .imps-sum {
    width: 70px;
    text-align: center;
  }

  .no-border {
    border: none;
    color: #000;
  }

  .date-span {
    font-weight: bold;
  }

  @media (max-width: 400px) {
    .container {
      grid-template-columns: 1fr;
      margin: 2px;
    }
    .order-info-col,
    .order-history {
      display: none;
    }
  }
</style>

<!------------------------ HTML GOES HERE------------------>
<div class="container">
  <SupplyList {currentMonth} {currentYear} bind:this={supplyUsage} />

  <Stats {currentMonth} {currentYear} bind:this={stats} />

  <div class="order-info-col">
    <div class="order-info-header">
      <h2>Информация о заказе</h2>
      <button class="new-order-btn outline" on:click={createNewOrder}>
        Новый заказ
      </button>
    </div>

    <!-- Добавлен ОбрСоб, если пользователь кликнул на элемент с классом "order-input" - при изменении данных берется имя этого элемента и обновленяется БД, ссылаясь на это имя. -->
    <div on:change={updateOrder} class="order">
      <div class="order-left-col">
        <div class="order-info-group">

          <div class="input-field">
            <label class="label" for="">Дата:</label>
            <span class="date-span">
              {order.day < 10 ? '0' + order.day : order.day}.{order.month < 10 ? '0' + order.month : order.month}.{order.year}
            </span>
          </div>

          <div class="input-field">
            <label class="label" for="">Смена:</label>
            <select
              class="order-input"
              name="smena"
              id="order-smena"
              value={order.smena}>
              <option style="border-bottom: 1px solid #ccc" value="">
                Выберите смену
              </option>
              <option value="А">А</option>
              <option value="Б">Б</option>
              <option value="В">В</option>
              <option value="Г">Г</option>
            </select>
          </div>

          <div class="input-field">
            <label class="label" for="">Оператор:</label>
            <select
              class="order-input"
              name="operator"
              id="order-operator"
              value={order.operator}>
              <option value="">Выберите оператора</option>
              <option value="Серегин">Operator 1</option>
              <option value="Хрипунов">Operator 2</option>
              <option value="Саберов">Operator 3</option>
              <option value="Кудрявцев">Operator 4</option>
            </select>
          </div>
        </div>

        <div class="input-field">
          <label class="label" for="">Номер заказа:</label>
          <input
            class="order-input"
            type="number"
            name="orderNumber"
            min="0"
            value={order.orderNumber}
            autocomplete="off" />
        </div>

        <div class="input-field">
          <label class="label" for="">Метраж:</label>
          <input
            class="order-input"
            type="number"
            name="orderLength"
            min="0"
            value={order.orderLength}
            autocomplete="off" />
        </div>

        <div class="input-field">
          <label class="label" for="">Хвосты ч/б:</label>
          <input
            class="order-input"
            type="number"
            name="bwLength"
            min="0"
            autocomplete="off"
            value={order.bwLength} />
        </div>

        <div class="input-field">
          <label class="label" for="">Раппорт:</label>
          <input
            class="order-input"
            type="number"
            name="rapport"
            min="0"
            autocomplete="off"
            value={order.rapport} />
        </div>

        <div class="input-field">
          <label for="">
            <strong>Клики:</strong>
          </label>
        </div>

        <div class="input-field">
          <label class="label" for="">- факт:</label>
          <input
            class="order-input"
            type="number"
            name="impFact"
            min="0"
            autocomplete="off"
            value={order.impFact} />
        </div>

        <div class="input-field">
          <label class="label" for="">- запуск:</label>
          <input
            class="order-input no-border"
            type="number"
            name="impStart"
            min="0"
            autocomplete="off"
            value={order.impStart ? order.impStart : 0}
            disabled />
        </div>

        <div class="input-field">
          <label class="label" for="">- тираж:</label>
          <input
            class="order-input no-border"
            type="number"
            name="impPlan"
            min="0"
            autocomplete="off"
            value={order.impPlan ? order.impPlan : 0}
            disabled />
        </div>

        <div class="input-field">
          <label class="label" for="">- ч/б:</label>
          <input
            class="order-input no-border"
            type="number"
            name="impBW"
            min="0"
            autocomplete="off"
            value={bwImpTotal ? bwImpTotal : 0}
            disabled />
        </div>

        <div>
          {#if !order.impFact}
            <button class="calculateImpsBtnInactive btn" disabled>
              Рассчитать клики
            </button>
          {:else}
            <button class="calculateImpsBtn btn info" on:click={calculateImps}>
              Рассчитать клики
            </button>
          {/if}
        </div>
      </div>

      <div on:change={() => alertToCalculate()} class="col-inks">
        <table>
          <tr class="table-header">
            <th>Краска</th>
            <th>Кол-во</th>
            <th>Клики:</th>
            <th>Ч/б</th>
          </tr>

          <tr>
            <td style="padding-left: 19px;">White</td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_white_qty"
                min="0"
                value={order.ink_white_qty} />
            </td>
            <td>{order.ink_white_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_white_bw"
                value={order.ink_white_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid cyan; padding-left: 15px;">
              Cyan
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_cyan_qty"
                min="0"
                value={order.ink_cyan_qty} />
            </td>
            <td>{order.ink_cyan_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_cyan_bw"
                value={order.ink_cyan_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid magenta; padding-left: 15px;">
              Magenta
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_magenta_qty"
                min="0"
                value={order.ink_magenta_qty} />
            </td>
            <td>{order.ink_magenta_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_magenta_bw"
                value={order.ink_magenta_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid yellow; padding-left: 15px;">
              Yellow
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_yellow_qty"
                min="0"
                value={order.ink_yellow_qty} />
            </td>
            <td>{order.ink_yellow_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_yellow_bw"
                value={order.ink_yellow_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid black; padding-left: 15px;">
              Black
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_black_qty"
                min="0"
                value={order.ink_black_qty} />
            </td>
            <td>{order.ink_black_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_black_bw"
                value={order.ink_black_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid orange; padding-left: 15px;">
              Orange
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_orange_qty"
                min="0"
                value={order.ink_orange_qty} />
            </td>
            <td>{order.ink_orange_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_orange_bw"
                value={order.ink_orange_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid blueviolet; padding-left: 15px;">
              Violet
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_violet_qty"
                min="0"
                value={order.ink_violet_qty} />
            </td>
            <td>{order.ink_violet_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_violet_bw"
                value={order.ink_violet_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>

          <tr>
            <td style="border-left: 4px solid lightgreen; padding-left: 15px;">
              Green
            </td>
            <td>
              <input
                class="order-input"
                type="number"
                name="ink_green_qty"
                min="0"
                value={order.ink_green_qty} />
            </td>
            <td>{order.ink_green_imp}</td>
            <td>
              <select
                class="order-input"
                name="ink_green_bw"
                value={order.ink_green_bw}>
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </td>
          </tr>
          <tr>
            <br />
          </tr>
          <tr>
            <td style="padding-left: 19px;">Итого:</td>
            <td>
              <input
                class="order-input"
                type="number"
                name="inks_total"
                bind:value={inksTotal}
                disabled />
            </td>
            <td>
              <input
                class="order-input imps-sum"
                type="text"
                name="imps_sum"
                bind:value={impsSum}
                disabled />
            </td>
            <td>
              <button on:click={setCmyk} class="cmyk-btn btn success">
                CMYK
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!------------------ ОПЕРАЦИИ ПО ЗАКАЗУ, ЗАМЕНЫ -->
    <div on:change={updateOrder} class="operations">
      <div>
        <h3>Операции</h3>
        <div class="operations-input-field">
          <select
            class="higherSelect"
            id="operations"
            bind:value={selectedSupply}>
            <option value="">Выберите расходник</option>
            <optgroup label="Краски">
              <option value="white">White</option>
              <option value="cyan">Cyan</option>
              <option value="magenta">Magenta</option>
              <option value="yellow">Yellow</option>
              <option value="black">Black</option>
              <option value="orange">Orange</option>
              <option value="violet">Violet</option>
              <option value="green">Green</option>
              <option value="primer">Primer</option>
            </optgroup>
            <optgroup label="Прочее">
              <option value="pip">PIP</option>
              <option value="blanket">Blanket</option>
              <option value="filterIO">Filter IO</option>
              <option value="selicaFilter">Selica Filter</option>
              <option value="imagingOil">Imaging Oil</option>
              <option value="imagingAgent">Imaging Agent</option>
              <option value="bidBase">BID Base</option>
              <option value="bidRoller">BID Roller</option>
              <option value="chargeRoller">Charge Roller</option>
              <option value="wiper">Wiper</option>
              <option value="spongeShort">Sponge Roller Short</option>
              <option value="spongeLong">Sponge Roller Long</option>
              <option value="bcsRoller">BCS Roller</option>
              <option value="underlayer">Underlayer</option>
            </optgroup>
          </select>
          <button
            class="btn info"
            on:click={replaceSupply(selectedSupply)}
            style="transform: translateY(2px);">
            Заменить
          </button>
        </div>

      </div>

      <div class="comments">
        <h3>Комментарии</h3>
        <textarea
          class="order-input"
          name="comments"
          value={order.comments}
          cols="38"
          rows="8" />
      </div>
    </div>

    <div>
      <ol class="operations-list" reversed>
        {#each replacements as item, index}
          <li data-index={index} data-name={item} class="replaced-item">
            {suppliesTemplate[item]}
            <span class="del-rep-btn" on:click={deleteReplacement}>
              удалить
            </span>
          </li>
        {/each}
      </ol>
    </div>
  </div>

  <!---------------------- ИСТОРИЯ ЗАКАЗОВ -->
  <div class="order-history">
    <h2>История заказов</h2>
    <!-- <div style="color: green; padding-bottom: 20px !important;">Current ID: {currentId}</div> -->

    <select class="higherSelect" name="month" bind:value={currentMonth}>
      <option value="1">Январь</option>
      <option value="2">Февраль</option>
      <option value="3">Март</option>
      <option value="4">Апрель</option>
      <option value="5">Май</option>
      <option value="6">Июнь</option>
      <option value="7">Июль</option>
      <option value="8">Август</option>
      <option value="9">Сентябрь</option>
      <option value="10">Октябрь</option>
      <option value="11">Ноябрь</option>
      <option value="12">Декабрь</option>
    </select>

    <select
      class="higherSelect"
      name="year"
      bind:value={currentYear}
      style="width: min-content; margin-bottom: 20px;">
      <option value="2020">2020</option>
      <option value="2021">2021</option>
    </select>

    <button
      class="show-btn btn info"
      on:click={() => {
        getOrderData();
        stats.getStats();
        supplyUsage.getSupplyUsage();
      }}>
      Показать
    </button>

    {#each orderDetails as order}
      <div
        class:active={currentId === order.id}
        data-id={order.id}
        class="order-history-item"
        on:click={e => {
          currentId = order.id;
        }}>
        <span>
          {order.data().day < 10 ? '0' + order.data().day : order.data().day}.{order.data().month < 10 ? '0' + order.data().month : order.data().month}.{order.data().year}
        </span>
        <span>№: {order.data().orderNumber}</span>
        <span>смена: {order.data().smena}</span>
        {#if order.data().comments}
          <span>
            <i class="fas fa-comment-dots" />
          </span>
        {/if}
      </div>
    {/each}
  </div>
</div>
