
function load (){
	// return [{description: "test", count: 0}, {description: "test2", count: 0}, {description: "test3", count: 3}];
  var loadedData = JSON.parse(
    localStorage.getItem('tallyState')
  ) || [{description: "make new tally counter", tallies: [], goal: false}]
  if (typeof(loadedData[0].tallies)==='undefined'){
    console.log('found old data')
    loadedData = versionUpdate1to2(loadedData)
  }
  return loadedData
};

function save(array){
  localStorage.setItem('tallyState',
    JSON.stringify(array)
  )
}

function versionUpdate1to2(oldData){
  var newData = []
  for(var index = 0; index < oldData.length; index++){
    newData.push({
      description: oldData[index].description,
      goal: false,
      tallies: [{quantity: oldData[index].count, timestamp: Date.now()}]
    })
  }
  return newData
}

// new Vue({el: "#tally-list"})

