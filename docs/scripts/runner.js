//
function load (){
	// return [{description: "test", count: 0}, {description: "test2", count: 0}, {description: "test3", count: 3}];
  var loadedData = JSON.parse(
    localStorage.getItem('tallyState')
  ) || [{description: "make new tally counter", tallies: [], goal: false}]
  if (typeof(loadedData[0].tallies)==='undefined'){
    console.log('found version 1 data')
    loadedData = versionUpdate1to2(loadedData)
  }
  function checkForV2Data(data){
    return (data[0].goal===false || typeof(data[0].goal.atLeast)==='undefined')
  }
  if (checkForV2Data(loadedData)){
    console.log('found version 2 data')
    loadedData = versionUpdate2to3(loadedData)
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

function versionUpdate2to3(oldData){
  var newData = []
  for(var index = 0; index < oldData.length; index++){
    var newGoal ={}
    if(!oldData[index].goal){
      newGoal.interval = 0
      newGoal.target = 0
      newGoal.hasGoal=false
      newGoal.atLeast = true
    }else{
      newGoal.interval = oldData[index].goal.interval
      newGoal.target = oldData[index].goal.target
      newGoal.hasGoal= true
      newGoal.atLeast = true
    }
    newData.push({
      description: oldData[index].description,
      goal: newGoal,
      tallies: oldData[index].tallies
    })
  }
  return newData
}

new Vue({el: "#tally-list"})

