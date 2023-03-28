import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getStudentInfo(user, pass) {
  const cookies = await getSession(user, pass)
  let page
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx").then(async (data) => page = await data.text())
  const pageParser = new JSDOM(page)
  const doc = pageParser.window.document
  const pushBack = {
    "studentName": doc.getElementById("plnMain_lblRegStudentName").textContent,
    "studentId": doc.getElementById("plnMain_lblRegStudentID").textContent,
    "studentBirthday": doc.getElementById("plnMain_lblBirthDate").textContent,
    "studentCounselor": doc.getElementById("plnMain_lblCounselor").textContent,
    "studentCounselorEmail": doc.getElementsByTagName("a")[0].href.match(/mailto:(.*)/)[1],
    "studentGrade": doc.getElementById("plnMain_lblGrade").textContent,
    "studentSchool": doc.getElementById("plnMain_lblBuildingName").textContent,
  }
  return pushBack
}
