import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getStudentInfo(user, pass) {
  const cookies = await getSession(user, pass)
  let page
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Registration.aspx").then(async (data) => page = await data.text())
  const pageParser = new JSDOM(page)
  const studentName = await pageParser.window.document.getElementById("plnMain_lblRegStudentName").textContent
  const studentId = await pageParser.window.document.getElementById("plnMain_lblRegStudentID").textContent
  const studentBirthday = await pageParser.window.document.getElementById("plnMain_lblBirthDate").textContent
  const studentCounselor = await pageParser.window.document.getElementById("plnMain_lblCounselor").textContent
  const studentCounselorEmail = await pageParser.window.document.getElementsByTagName("a")[0].href.match(/mailto:(.*)/)[1]
  const studentGrade = await pageParser.window.document.getElementById("plnMain_lblGrade").textContent
  const studentSchool = await pageParser.window.document.getElementById("plnMain_lblBuildingName").textContent
  const pushBack = {
    "studentName": studentName,
    "studentId": studentId,
    "studentBirthday": studentBirthday,
    "studentCounselor": studentCounselor,
    "studentCounselorEmail": studentCounselorEmail,
    "studentGrade": studentGrade,
    "studentSchool": studentSchool
  }
  console.log(pushBack)
  return pushBack
}
