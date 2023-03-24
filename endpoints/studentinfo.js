import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getStudentInfo(user, pass) {
  const cookies = await getSession(user, pass)
  let page
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx").then(async (data) => page = await data.text())
  const pageParser = new JSDOM(page)
  const pushBack = {
    "studentName": pageParser.window.document.getElementById("plnMain_lblRegStudentName").textContent,
    "studentId": pageParser.window.document.getElementById("plnMain_lblRegStudentID").textContent,
    "studentBirthday": pageParser.window.document.getElementById("plnMain_lblBirthDate").textContent,
    "studentCounselor": pageParser.window.document.getElementById("plnMain_lblCounselor").textContent,
    "studentCounselorEmail": pageParser.window.document.getElementsByTagName("a")[0].href.match(/mailto:(.*)/)[1],
    "studentGrade": pageParser.window.document.getElementById("plnMain_lblGrade").textContent,
    "studentSchool": pageParser.window.document.getElementById("plnMain_lblBuildingName").textContent
  }
  return pushBack
}