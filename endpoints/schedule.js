import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getSchedule(username, password) {
  let returnDataArray = [];
  let page
  const cookies = await getSession(username, password)
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Classes.aspx").then(async (data) => page = await data.text())
  const pageParser = new JSDOM(page)
  let courses = Object.values(pageParser.window.document.getElementsByClassName("sg-asp-table-data-row"))
  courses.forEach(async (row) => {
    const returnData = {
      "className": row.getElementsByTagName("a")[0].textContent,
      "teacherEmail": row.getElementsByTagName('a')[1].href.match(/mailto:(.*)/)[1],
      "classRoom": row.getElementsByTagName("td")[4].textContent,
      "teacherName": row.getElementsByTagName("td")[3].textContent.trimEnd(),
      "classDays": row.getElementsByTagName("td")[5].textContent,
      "classQuarters": row.getElementsByTagName("td")[6].textContent,
      "building": row.getElementsByTagName("td")[7].textContent.trimEnd(),
      "periods": row.getElementsByTagName("td")[2].textContent.trimEnd(),
      "status": row.getElementsByTagName("td")[8].textContent.trimEnd()
    }
    returnDataArray.push(returnData)
  })
  return returnDataArray
}
