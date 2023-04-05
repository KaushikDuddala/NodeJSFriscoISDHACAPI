import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getStudentGpa(user, pass) {
  const cookies = await getSession(user, pass)
  let page
  let pushBack
  await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Transcript.aspx").then(async (data) => page = await data.text())
  const pageParser = new JSDOM(page)
  const doc = pageParser.window.document
  try{
    pushBack = {
      "weighted": doc.getElementById("plnMain_rpTranscriptGroup_lblGPACum1"),
      "unweighted": doc.getElementById("plnMain_rpTranscriptGroup_lblGPACum2")
    }}catch(error){
      pushBack={
        "weighted":"N/A",
        "unweighted":"N/A"
      }
    }
    if (pushBack.weighted == null){
      pushBack={
        "weighted":"N/A",
        "unweighted":"N/A"
      }
    }
    return pushBack
  }