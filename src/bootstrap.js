import startPage from './web-framework/lib/app/startPage'
import Page from './appbase/src/app/basePage'

async function startApp () {
  startPage(Page)
}

startApp()
