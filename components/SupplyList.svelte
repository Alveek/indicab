<script>
  import { db } from "../firebase.js";
  import { test, orderCollection, supplyCollection } from "../order-template";
  import { onMount } from "svelte";

  export let currentMonth;
  export let currentYear;

  let supplyList = {};
  let totalFilterImps = 0;

  let whiteUsed;
  let cyanUsed;
  let magentaUsed;
  let yellowUsed;
  let blackUsed;
  let orangeUsed;
  let violetUsed;
  let greenUsed;
  let primerUsed;
  let pipUsed;
  let blanketUsed;
  let filterIOUsed;
  let selicaFilterUsed;
  let imagingOilUsed;
  let imagingAgentUsed;
  let bidBaseUsed;
  let bidRollerUsed;
  let chargeRollerUsed;
  let wiperUsed;
  let spongeShortUsed;
  let spongeLongUsed;
  let bcsRollerUsed;
  let underlayerUsed;

  onMount(() => {
    db.collection(supplyCollection)
      .doc("supply-items")
      .onSnapshot(snapshot => {
        supplyList = snapshot.data();

        totalFilterImps = supplyList.filterImps.reduce((a, b) => a + b);
      });
  });

  function updateSupplyList(e) {
    db.collection(supplyCollection)
      .doc("supply-items")
      .update({
        [e.target.name]: parseInt(e.target.value)
      });
  }

  export function getSupplyUsage() {
    db.collection(orderCollection)
      .orderBy("timestamp", "desc")
      .where("month", "==", parseInt(currentMonth))
      .where("year", "==", parseInt(currentYear))
      .onSnapshot(snapshot => {
        whiteUsed = 0;
        cyanUsed = 0;
        magentaUsed = 0;
        yellowUsed = 0;
        blackUsed = 0;
        orangeUsed = 0;
        violetUsed = 0;
        greenUsed = 0;
        primerUsed = 0;
        pipUsed = 0;
        blanketUsed = 0;
        filterIOUsed = 0;
        selicaFilterUsed = 0;
        imagingOilUsed = 0;
        imagingAgentUsed = 0;
        bidBaseUsed = 0;
        bidRollerUsed = 0;
        chargeRollerUsed = 0;
        wiperUsed = 0;
        spongeShortUsed = 0;
        spongeLongUsed = 0;
        bcsRollerUsed = 0;
        underlayerUsed = 0;

        snapshot.docs.forEach(item => {
          whiteUsed +=
            item.data().rep.filter(item => item === "white").length || 0;
          cyanUsed += item.data().rep.filter(item => item === "cyan").length || 0;
          magentaUsed +=
            item.data().rep.filter(item => item === "magenta").length || 0;
          yellowUsed +=
            item.data().rep.filter(item => item === "yellow").length || 0;
          blackUsed +=
            item.data().rep.filter(item => item === "black").length || 0;
          orangeUsed +=
            item.data().rep.filter(item => item === "orange").length || 0;
          violetUsed +=
            item.data().rep.filter(item => item === "violet").length || 0;
          greenUsed +=
            item.data().rep.filter(item => item === "green").length || 0;
          primerUsed +=
            item.data().rep.filter(item => item === "primer").length || 0;
          pipUsed += item.data().rep.filter(item => item === "pip").length || 0;
          blanketUsed +=
            item.data().rep.filter(item => item === "blanket").length || 0;
          filterIOUsed +=
            item.data().rep.filter(item => item === "filterIO").length * 3 || 0;
          selicaFilterUsed +=
            item.data().rep.filter(item => item === "selicaFilter").length || 0;
          imagingOilUsed +=
            item.data().rep.filter(item => item === "imagingOil").length || 0;
          imagingAgentUsed +=
            item.data().rep.filter(item => item === "imagingAgent").length || 0;
          bidBaseUsed +=
            item.data().rep.filter(item => item === "bidBase").length || 0;
          bidRollerUsed +=
            item.data().rep.filter(item => item === "bidRoller").length || 0;
          chargeRollerUsed +=
            item.data().rep.filter(item => item === "chargeRoller").length || 0;
          wiperUsed +=
            item.data().rep.filter(item => item === "wiper").length || 0;
          spongeShortUsed +=
            item.data().rep.filter(item => item === "spongeShort").length || 0;
          spongeLongUsed +=
            item.data().rep.filter(item => item === "spongeLong").length || 0;
          bcsRollerUsed +=
            item.data().rep.filter(item => item === "bcsRoller").length || 0;
          underlayerUsed +=
            item.data().rep.filter(item => item === "underlayer").length || 0;
        });
      });
  }
</script>



<div class="container">
	<h2 class="heading-underline">Склад</h2>
	<div on:change={updateSupplyList} class="supplyList" >
  <div class="titles">
    <span>Наличие</span>
    <span>Расход</span>
  </div>
    <div class="supply-item">
      <label class="label" for="">White</label>
      <input type="number" autocomplete="off" name="white" value="{supplyList.white}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={whiteUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Cyan</label>
      <input type="number" autocomplete="off" name="cyan" value="{supplyList.cyan}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={cyanUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Magenta</label>
      <input type="number" autocomplete="off" name="magenta" value="{supplyList.magenta}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={magentaUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Yellow</label>
      <input type="number" autocomplete="off" name="yellow" value="{supplyList.yellow}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={yellowUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Black</label>
      <input type="number" autocomplete="off" name="black" value="{supplyList.black}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={blackUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Orange</label>
      <input type="number" autocomplete="off" name="orange" value="{supplyList.orange}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={orangeUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Violet</label>
      <input type="number" autocomplete="off" name="violet" value="{supplyList.violet}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={violetUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Green</label>
      <input type="number" autocomplete="off" name="green" value="{supplyList.green}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={greenUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Primer</label>
      <input type="number" autocomplete="off" name="primer" value="{supplyList.primer}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={primerUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">PIP</label>
      <input type="number" autocomplete="off" name="pip" value="{supplyList.pip}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={pipUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Blanket</label>
      <input type="number" autocomplete="off" name="blanket" value="{supplyList.blanket}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={blanketUsed || 0}>
    </div>
    <div class="supply-item filter-io">
      <label for="">Filter IO <span class="fio-imps-output">({totalFilterImps})</span></label>
      <input type="number" autocomplete="off" name="filterIO" value="{supplyList.filterIO}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={filterIOUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Selica Filter</label>
      <input type="number" autocomplete="off" name="selicaFilter" value="{supplyList.selicaFilter}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={selicaFilterUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Imaging Oil</label>
      <input type="number" autocomplete="off" name="imagingOil" value="{supplyList.imagingOil}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={imagingOilUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Imaging Agent</label>
      <input type="number" autocomplete="off" name="imagingAgent" value="{supplyList.imagingAgent}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={imagingAgentUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">BID Base</label>
      <input type="number" autocomplete="off" name="bidBase" value="{supplyList.bidBase}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={bidBaseUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">BID Roller</label>
      <input type="number" autocomplete="off" name="bidRoller" value="{supplyList.bidRoller}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={bidRollerUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Charge Roller</label>
      <input type="number" autocomplete="off" name="chargeRoller" value="{supplyList.chargeRoller}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={chargeRollerUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Wiper</label>
      <input type="number" autocomplete="off" name="wiper" value="{supplyList.wiper}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={wiperUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Sponge Short</label>
      <input type="number" autocomplete="off" name="spongeShort" value="{supplyList.spongeShort}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={spongeShortUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Sponge Long</label>
      <input type="number" autocomplete="off" name="spongeLong" value="{supplyList.spongeLong}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={spongeLongUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">BCS Roller</label>
      <input type="number" autocomplete="off" name="bcsRoller" value="{supplyList.bcsRoller}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={bcsRollerUsed || 0}>
    </div>
    <div class="supply-item">
      <label for="">Underlayer</label>
      <input type="number" autocomplete="off" name="underlayer" value="{supplyList.underlayer}">
      <input class="supply-usage-input" type="text" autocomplete="off" disabled value={underlayerUsed || 0}>
    </div>
  </div>
</div>

<style>
  .container {
    background: #fff;
    border: 1px solid rgb(255, 255, 255);
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    width: 270px;
    padding: 0 20px;
    padding-bottom: 30px;
  }
  .supply-item {
    margin-bottom: 10px;
    border-bottom: 1px solid rgb(211, 203, 255);
  }

  input {
    /* font-weight: bold; */
    border: 0;
  }

  .supply-item label {
    width: 130px;
    display: inline-block;
  }

  .supply-item input {
    width: 50px !important;
  }

  .fio-imps-output {
    font-size: 0.9rem;
  }

  .supply-usage-input {
    display: inline-block;
    margin-left: 26px;
  }

  .supply-usage-input:disabled {
    background: #fff;
  }

  .titles {
    font-size: 0.9rem;
    font-weight: bold;
    margin-bottom: 14px;
    color: #444;
  }

  .titles:first-child {
    margin-left: 98px;
  }

  .titles span {
    padding-left: 15px;
  }

  @media (max-width: 400px) {
    .container {
      width: 280px;
      /* margin: 0px auto 30px; */
    }
  }
</style>