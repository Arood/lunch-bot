var lunches = document.getElementsByClassName('wpb_text_column')[(new Date()).getDay()-1].textContent.replace(/[\s\n]{2,}/g, "\n").replace(/(^\n|\n$)/g, "");

window.scrapedField = {
  title: "Tre Rum",
  value: lunches,
  short: true
};
