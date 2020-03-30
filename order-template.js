import firebase from "firebase/app";
import "firebase/firestore";

export let test = false;
export let orderCollection = test ? "orders" : "orders-prod";
export let supplyCollection = test ? "supply" : "supply-prod";

export let date = new Date();

export function getCurrentDay() {
  let date = new Date();
  let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  if (date.getHours() >= 8) {
    return date.getDate();
  } else {
    return yesterday.getDate();
  }
}

export function getCurrentMonth() {
  let date = new Date();
  let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  if (date.getHours() >= 8) {
    return date.getMonth() + 1;
  } else {
    return yesterday.getMonth() + 1;
  }
}
export function getCurrentYear() {
  let date = new Date();
  let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  if (date.getHours() >= 8) {
    return date.getFullYear();
  } else {
    return yesterday.getFullYear();
  }
}

export const newOrder = {
  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  day: getCurrentDay(),
  month: getCurrentMonth(),
  year: getCurrentYear(),
  orderNumber: 0,
  orderLength: 0,
  bwLength: 0,
  rapport: 0,
  smena: "",
  operator: "",
  impPlan: 0,
  impFact: 0,
  impStart: 0,
  bwImpTotal: 0,
  ink_white_qty: 0,
  ink_white_imp: 0,
  ink_white_bw: "no",
  ink_cyan_qty: 0,
  ink_cyan_imp: 0,
  ink_cyan_bw: "no",
  ink_magenta_qty: 0,
  ink_magenta_imp: 0,
  ink_magenta_bw: "no",
  ink_yellow_qty: 0,
  ink_yellow_imp: 0,
  ink_yellow_bw: "no",
  ink_black_qty: 0,
  ink_black_imp: 0,
  ink_black_bw: "no",
  ink_orange_qty: 0,
  ink_orange_imp: 0,
  ink_orange_bw: "no",
  ink_violet_qty: 0,
  ink_violet_imp: 0,
  ink_violet_bw: "no",
  ink_green_qty: 0,
  ink_green_imp: 0,
  ink_green_bw: "no",
  comments: "",
  rep: []
};