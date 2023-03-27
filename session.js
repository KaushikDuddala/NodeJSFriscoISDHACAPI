import { fetch, CookieJar } from "node-fetch-cookies";

export async function getSession(user, pas) {
  const pass = encodeURIComponent(pas)
  const mainJar = await new CookieJar();
  let loginResponseScreen;
  await fetch(mainJar, "https://hac.friscoisd.org/HomeAccess/Account/LogOn").then(async (data) => loginResponseScreen = JSON.stringify(await data.text()))
  let requestVerificationToken = loginResponseScreen.match(/<input name=\\"__RequestVerificationToken\\" type=\\"hidden\\" value=\\"(.*?)\\"/m)[1]
  const requestHeaders = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Content-Type": "application/x-www-form-urlencoded",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1"
  }
  const requestPayload = `__RequestVerificationToken=${requestVerificationToken}&SCKTY00328510CustomEnabled=False&SCKTY00436568CustomEnabled=False&Database=10&VerificationOption=UsernamePassword&LogOnDetails.UserName=${user}&tempUN=&tempPW=${pass}&LogOnDetails.Password=${pass}`
  let login = await fetch(mainJar, "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2f", {
    "credentials": "include",
    "headers": requestHeaders,
    "referrer": "https://hac.friscoisd.org/HomeAccess/Account/LogOn?ReturnUrl=%2fHomeAccess%2fClasses%2fClasswork",
    "body": requestPayload,
    "method": "POST",
    "mode": "cors"
  })
  return mainJar
};
