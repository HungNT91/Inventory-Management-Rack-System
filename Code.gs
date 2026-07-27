/**
 * Code.gs
 * Backend router for Inventory Management Web App (Supabase Migration)
 */

/**
 * Serves the web app HTML.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Inventory Management Rack System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) 
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

/**
 * Helper to include other HTML files if needed.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
