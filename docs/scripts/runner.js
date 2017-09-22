
function load (){
	// return [{description: "test", count: 0}, {description: "test2", count: 0}, {description: "test3", count: 3}];
  return JSON.parse(
    localStorage.getItem('tallyState')
  )|| [{description:"make new tally counter", count: 0}]
};

function save(array){
  localStorage.setItem('tallyState',
    JSON.stringify(array)
  )
}

new Vue({el: "#tally-list"})

