Vue.component( "tally-list" , {
	template: `
	<div class='tally-list' >
    <div class='tally-header'>
      <h2>All Tallies</h2>
      <button
        v-on:click='newTally = true'>
        Create New Tally
      </button>
    </div>

    <tally-form
      v-if='newTally'
      v-on:submitCreate='parseForm'>
    </tally-form>

    <ul>
      <tally-block v-for='(tallyData, index) in tallies'
        v-bind:key=index
        v-bind:tallyData=tallyData
        v-on:change='saveTallies'
        >
      </tally-block>
    </ul>
  </div>
  `,
  data: function (){return {tallies: load(), newTally: false}},
  methods:{
    saveTallies: function(){
      console.log("ran")
      save(this.tallies)
    },
    parseForm: function(formData){
      console.log('parser ran')
      console.log(formData)
      this.tallies.push(formData)
      this.newTally = false
      this.saveTallies()
    }
  }
})

Vue.component( "tally-block" , {
  props:["tallyData"],
  template: `
  <div class='tally-block'>
    <h3>{{tallyData.description}}</h3>
    <div class='goal-block' v-if="tallyData.goal">
      Goal: finish at least {{tallyData.goal.target}} times per {{tallyData.goal.interval}} days
    </div>
    <div class='count-block'>
      <h3>Done {{count}} times.</h3>
      <button
        v-on:click='countPlusPlus'>
        +1
      </button>
      <button
        v-on:click='countMinusMinus'>
        -1
      </button>
    </div>
  </div>
  `,

  computed:{
    count: function(){
      var totalCount = 0
      console.log("count calculated")
      for (var index = 0; index < this.tallyData.tallies.length; index++) {
        totalCount += this.tallyData.tallies[index].quantity
        console.log(this.tallyData.tallies[index].quantity)
      };
      return totalCount
    },
    goalMet: function(){
      var now = Date.now();
      var earlierBound = now-this.tallyData.goal.interval*24*60*60*1000
      var totalCount = 0
      for (var index = 0; index < this.tallyData.tallies.length; index++) {
        if(this.tallyData.tallies[index].timestamp<earlierBound){
          break
        }
        totalCount += this.tallyData.tallies[index].quantity
      };
      return totalCount >= this.tallyData.goal.target
    }
  },

  methods:{
    countPlusPlus: function(){
      this.tallyData.tallies.push({quantity: 1, timestamp: Date.now()})
      this.$emit('change')
    },
    countMinusMinus: function(){
      this.tallyData.tallies.push({quantity: -1, timestamp: Date.now()})
      this.$emit('change')
    }

  }
})

Vue.component("tally-form", {
  template: `
    <form>
      <span>Tally Description</span>
      <input type='text' v-model='description'></input>
      <br>
      <span>Track periodic goal?</span>
      <input type='checkbox' v-model='hasGoal'></input>
      <div class='goal_subform' v-if='hasGoal'>
        <span>Over how many days do you want to meet this goal?</span>
        <br>
        <input
          type='number'
          min='1'
          v-model='goal.interval'>
        </input>
        <br>
        <span>How many times do you want to do this thing?</span>
        <br>
        <input
          type='number'
          min='1' value='1'
          v-model='goal.target'>
        </input>
      </div>
      <button
        v-on:click='finishCreate'>
        Go!
      </button>
    </form>

  `,
  data: function(){
    return { count: 0, description: '', hasGoal:false, goal:{}}
  },
  methods:{
    finishCreate: function(event){
      event.preventDefault()
      var outputData = JSON.parse(JSON.stringify(this.$data))
      if(!outputData.hasGoal){outputData.goal=false}
      delete outputData.hasGoal
      console.log(outputData)
      console.log(JSON.stringify(outputData))
      // console.log(this)
      this.$emit('submitCreate', outputData)
    }
  }


})
