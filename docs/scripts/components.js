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
  <div class='tally-block' :class='goalCSS'>
    <h3>{{tallyData.description}}</h3>
    <div class='goal-block' v-if="tallyData.goal.hasGoal">
      Goal:
        finish at
        {{tallyData.goal.atLeast ? 'least' : 'most'}}
        {{tallyData.goal.target}}
        {{tallyData.goal.target==1 ? "time" : "times"}}
        per {{tallyData.goal.interval}} days
    </div>
    <div class='status-block'>
      {{statusString}}
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
      if(!this.tallyData.goal.hasGoal){
        return undefined
      }
      var earlierBound = now-this.tallyData.goal.interval*24*60*60*1000
      var totalCount = 0
      for (var index = this.tallyData.tallies.length-1; 0 <= index; index--) {
        if(this.tallyData.tallies[index].timestamp<earlierBound){
          break
        }
        totalCount += this.tallyData.tallies[index].quantity
      };
      if(this.tallyData.goal.atLeast){
        return totalCount >= this.tallyData.goal.target
      }
      if(!this.tallyData.goal.atLeast){
        return totalCount <= this.tallyData.goal.target
      }
    },
    goalCSS: function(){
      if(!this.tallyData.goal.hasGoal){return 'no-goal-set'}
      if(this.goalMet){return 'goal-met'}
      return 'goal-unmet'
    },
    intervalMS:function(){
      return (this.tallyData.goal.interval*24*3600*1000)
    },
    statusObj: function(){
      var out = {timeFinished:0, lastTime:0, targetDiff:0};
      var runningTotal = 0
      var now = Date.now()
      for (var index = this.tallyData.tallies.length-1; 0 <= index; index--) {
        var time = this.tallyData.tallies[index].timestamp
        if((now-time) > this.intervalMS){
          out.targetDiff = this.tallyData.goal.target-runningTotal
          break
        }
        runningTotal += this.tallyData.tallies[index].quantity;
        if(runningTotal>0 && time > out.lastTime){
          out.lastTime = time
        }
        if(runningTotal === this.tallyData.goal.target){
          out.timeFinished = time
          break
        }
      };
      console.log(out)
      return out
    },
    lastDoneString: function(){
      var runningTotal = 0
      var lastTime = this.statusObj.lastTime
      var now = Date.now()
      // for (var index = this.tallyData.tallies.length-1; 0 <= index; index--) {
      //   runningTotal += this.tallyData.tallies[index].quantity;
      //   lastTime = this.tallyData.tallies[index].timestamp;
      //   if(runningTotal > 0){break}
      // };
      var deltaT = now-lastTime
      var deltaHours = Math.floor(deltaT / (60*60*1000))
      console.log(deltaHours)
      var lastDate = new Date(lastTime)
      if(deltaHours>=24){
        return `${1900+lastDate.getYear()}-${1+lastDate.getMonth()}-${lastDate.getDay()}`
      }
      if(deltaHours < 1){
        return 'less than an hour ago'
      }
      if(deltaHours < 2){
        return 'an hour ago'
      }
      return `${deltaHours} hours ago`
    },
    statusString: function(){
      if(!this.tallyData.goal.hasGoal){
        return `Last done: ${this.lastDoneString}`
      }
    },
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
      <input type='checkbox' v-model='goal.hasGoal'></input>
      <div class='goal_subform' v-if='goal.hasGoal'>
        I want to do this thing
        <select v-model='goal.atLeast'>
          <option v-bind:value="true">at least</option>
          <option v-bind:value="false">at most</option>
        </select>
        <input
          type='number'
          min='1' value='1'
          v-model='goal.target'>
        </input>
        {{goal.target==1 ? 'time' : 'times'}}
        every
        <input
          type='number'
          min='1'
          v-model='goal.interval'>
        </input>
        days
      </div>
      <button
        v-on:click='finishCreate'>
        Go!
      </button>
    </form>

  `,
  data: function(){
    return {
      tallies: [],
      description: '',
      goal:{hasGoal:false, target:1, interval:1, atLeast:true}}
  },
  methods:{
    finishCreate: function(event){
      event.preventDefault()
      var outputData = JSON.parse(JSON.stringify(this.$data))
      // if(!outputData.hasGoal){outputData.goal=false}
      // delete outputData.hasGoal
      console.log(outputData)
      console.log(JSON.stringify(outputData))
      // console.log(this)
      this.$emit('submitCreate', outputData)
    }
  }
})
