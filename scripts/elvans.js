var today = (new Date()).getDay();
var value;

switch (today) {
    case 1:
        value = 'Magic Bacon Meal\nHamburgare 90g med ost & bacon.\nFuture Fries & dryck.';
        break;
    case 2:
        value = 'Chicky Meal\nKycklingburgare i grovt bröd, mangoraya.\nFuture Fries & dryck.';
        break;
    case 3:
        value = 'Sibylla Meal\n2st krovar med mos, Future Fries eller sallad, hackad gurka & dryck.';
        break;
    case 4:
        value = 'Chicken Nuggets Meal 6 bitar\nChicken Nuggets, dippsås, Future Fries & dryck.';
        break;
    case 5:
        value = 'Magic Meal\nHamburgare 90g med ost.\nFuture Fries & dryck.';
        break;
}

window.scrapedField = {
  title: "11:ans grill (Sibylla)",
  value: value,
  short: true
};