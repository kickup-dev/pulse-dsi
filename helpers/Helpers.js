function titleCase(string) {
  if (!string) return string;
  var result = "";
  var split = string.split(" ");
  split.forEach(word => {
    result += (word.substring(0,1).toUpperCase() + word.substring(1,word.length)).replace("-", " ");
  })
  return result;
}
function missingAttributes(item, callback) {
  var result = false;
  var required = ["id","name","url","dimensions","category", "styleSource"];

  required.forEach(prop => {
    if (!item[prop] || item[prop] === undefined || item[prop] === "") {
      result = true;
    }
    if (item.clientFacing === null) {
      result = true
    }
  })
  if (callback) {
    callback(result);
  } else {
    return result
  }
}
function buildCategories(items) {
  var categories = [];
  
  // get unique values
  items.forEach(image => {
    var category = image.category;
    if (categories.indexOf(category) < 0) {
      categories.push(category)
    }
  })
  categories.sort()
  
  // add ghost parents
  categories.forEach(category => {
    // if has submenus
    if (category.indexOf('/') > 0) {
      var split = category.split("/");      
      var result = [];
      for (var i = 0; i < split.length; i++) {
        result.push(split[i])
        if (categories.indexOf(result.join("/")) < 0) {
          categories.push(result.join("/"))
        }
      }
    }
  })
  categories.sort()
  // console.log(categories)
  
  var tierOne = JSON.parse(`[{"name":"accordions","parent":"All"},{"name":"badge","parent":"All"},{"name":"button","parent":"All"},{"name":"container","parent":"All"},{"name":"data","parent":"All"},{"name":"dropdown","parent":"All"},{"name":"events","parent":"All"},{"name":"form","parent":"All"},{"name":"icon","parent":"All"},{"name":"list","parent":"All"},{"name":"message","parent":"All"},{"name":"metadata","parent":"All"},{"name":"motion","parent":"All"},{"name":"other","parent":"All"},{"name":"overlay","parent":"All"},{"name":"pagination","parent":"All"},{"name":"search","parent":"All"},{"name":"table","parent":"All"},{"name":"tabs","parent":"All"},{"name":"tags","parent":"All"},{"name":"text","parent":"All"},{"name":"button-group","parent":"button"},{"name":"card","parent":"container"},{"name":"menu","parent":"dropdown"},{"name":"item","parent":"events"},{"name":"checkbox","parent":"form"},{"name":"input","parent":"form"},{"name":"radio-button","parent":"form"},{"name":"rich-text","parent":"form"},{"name":"select","parent":"form"},{"name":"textarea","parent":"form"},{"name":"upload","parent":"form"},{"name":"empty-state","parent":"message"},{"name":"tooltip","parent":"overlay"},{"name":"cell","parent":"table"},{"name":"header","parent":"text"},{"name":"link","parent":"text"},{"name":"subheader","parent":"text"},{"name":"calendar","parent":"select"},{"name":"multi-select","parent":"select"}]`);
  tierOne.forEach((category, i) => {
    category.name = cleanText(category.name);
    category.parent = cleanText(category.parent);
  })
  // console.log(JSON.stringify(tierOne))

}
function cleanText(text) {
  var string = [];
  text.split("-").forEach(slice => {
    var capitalized = slice.substring(0,1).toUpperCase() + slice.substring(1, slice.length);
    string.push(capitalized)
  })
  return string.join(" ");
}

export {
  titleCase,
  missingAttributes
};
