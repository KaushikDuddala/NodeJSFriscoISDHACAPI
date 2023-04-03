import { fetch, CookieJar } from "node-fetch-cookies";
import { getSession } from "./../session.js"
import jsdom from "jsdom"
const { JSDOM } = jsdom;

export async function getClasses(username, password){
    let returnDataArray = [];
    let page
    const cookies = await getSession(username, password)
    await fetch(cookies, "https://hac.friscoisd.org/HomeAccess/Content/Student/Assignments.aspx").then(async (data) => page = await data.text())
    const pageParser = new JSDOM(page)
    const classesDiv = Object.values(pageParser.window.document.getElementsByClassName("AssignmentClass"))
    classesDiv.forEach(async (classDiv) => {
        let className;
        let lastUpdated;
        let grade;
        let assignments = [];
        const headerDivs = Object.values(classDiv.getElementsByClassName("sg-header sg-header-square"))
        headerDivs.forEach(async (headerDiv) => {
            className = headerDiv.getElementsByClassName("sg-header-heading")[0].textContent.trim()
            lastUpdated = headerDiv.getElementsByClassName("sg-header-sub-heading")[0].textContent.trim().replace("(Last Updated: ", "").replace(")","")
            grade = headerDiv.getElementsByClassName("sg-header-heading sg-right")[0].textContent.trim().replace("Student Grades ", "").replace("%", "")
            if(grade == ""){
                grade = "0.00"
            }
            if(lastUpdated == ""){
                lastUpdated = "n/a"
            }
        })
        let assignmentsArray = []
        const assignmentsDiv = Object.values(classDiv.getElementsByClassName("sg-content-grid"))
        assignmentsDiv.forEach(async (assignmentDiv) => {
            const assignments = Object.values(assignmentDiv.getElementsByClassName("sg-asp-table-data-row"))
            assignments.forEach(async (assignment) => {
                try{
                let grade = assignment.getElementsByTagName("td")[4].textContent.replace("\n", "").trim()
                if (grade == ""){
                    grade = "0.00"
                }
                const assignmentData =  {
                    "assignmentName": assignment.getElementsByTagName("a")[0].textContent.replace("\n", "").trim(),
                    "assignmentType": assignment.getElementsByTagName("td")[3].textContent,
                    "assignmentGrade": grade,
                    "assignmentDueDate": assignment.getElementsByTagName("td")[0].textContent,
                    "assignmentAssignedDate": assignment.getElementsByTagName("td")[1].textContent.trim(),
                    "assignmentMaxScore": assignment.getElementsByTagName("td")[5].textContent.trim()
                }
                assignmentsArray.push(assignmentData)
            }catch(error){}})
        })
        let courseData = {
            "className": className,
            "grade": grade,
            "lastUpdated": lastUpdated,
            "assignments":assignmentsArray
        }
        returnDataArray.push(courseData)
    })
    return returnDataArray
}
