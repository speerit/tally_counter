Vue.component( "tally-list" , {
	template: `
	<div class='tally-list'>
    <h2>First Component</h2>
    <tally-block v-for='(tallyData, index) in tallies'
      v-bind:key=index
      v-bind:tallyData=tallyData>
    </tally-block>
  </div>
  `,
  data: function (){return {tallies: load()}},
})

Vue.component( "tally-block" , {
  template: `
  <div class='tally-block'>
    <h3>{{tallyData.description}}</h3>
    <div class='count-block'>
      <h3>Done {{tallyData.count}} times.</h3>
      <button v-on:click='countPlusPlus'>
        +1
      </button>
    </div>
  </div>
  `,
  props:["tallyData"],
  methods:{
    countPlusPlus: function(){
      this.tallyData.count += 1
    }
  }
})