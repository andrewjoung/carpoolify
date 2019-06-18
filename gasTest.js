// let string = `<fuelPrices> < cng > 2.19</cng > <diesel>3.11</diesel> <e85>1.99</e85> <electric>0.13</electric> <lpg>2.91</lpg> <midgrade>3.13</midgrade> <premium>3.38</premium> <regular>2.73</regular> </fuelPrices > `


// console.log(string);


let getGas = (gas) => {
  console.log(gas)
  return gas
}


//ajax call to get gas -----------------------------------------------------------

$.ajax({
  url: "https://www.fueleconomy.gov/ws/rest/fuelprices",
  method: "GET"
}).then(function (response) {
  // console.log(response)
  let resString = new XMLSerializer().serializeToString(response);
  //  console.log(resString);
  var result = parser.validate(resString);
  // if (result !== true) console.log(result.err); 
  var jsonObj = parser.parse(resString);
  let gas = (jsonObj.fuelPrices.midgrade)

// ajax call to get car id via make model and year ------------------------------

  $.ajax({
    url: "https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=1997&make=Dodge&model=Intrepid",
    method: "GET"
  }).then(function (response) {
    // console.log(response)
    let resString = new XMLSerializer().serializeToString(response);

    var result = parser.validate(resString);
    // if (result !== true) console.log(result.err); 
    var jsonObj = parser.parse(resString);

    // console.log(jsonObj.menuItems.menuItem[0].value)
    let t = (jsonObj.menuItems.menuItem[0].value)

   // ajax call to get car MPG via car ID, which is declared as T -------------------

    $.ajax({
      url: "https://www.fueleconomy.gov/ws/rest/ympg/shared/ympgVehicle/" + t,
      method: "GET"
    }).then(function (response) {
      let resString = new XMLSerializer().serializeToString(response);

      var result = parser.validate(resString);
      // if (result !== true) console.log(result.err); 
      var jsonObj = parser.parse(resString);
      let MPG = (jsonObj.yourMpgVehicle.avgMpg)

      let pricePerMile = gas / MPG
      console.log(pricePerMile)

    })
  })
})





