
function load (){
	// return [{description: "test", count: 0}, {description: "test2", count: 0}, {description: "test3", count: 3}];
  return JSON.parse(
    localStorage.getItem('state')
  )
};

function save(array){
  localStorage.setItem('state',
    JSON.stringify(array)
  )
}

new Vue({el: "#tally-list"})

