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
    <div class='count-block'>
      <h3>Done {{tallyData.count}} times.</h3>
      <button
        v-on:click='countPlusPlus'>
        +1
      </button>
    </div>
  </div>
  `,
  methods:{
    countPlusPlus: function(){
      this.tallyData.count += 1
      this.$emit('change')
    }
  }
})

Vue.component("tally-form", {
  template: `
    <form>
      <span>Tally Description</span>
      <input type='text' v-model='description'></input>
      <button
        v-on:click='finishCreate'>
        Go!
      </button>
    </form>

  `,
  data: function(){
    return { count: 0, description: ''}
  },
  methods:{
    finishCreate: function(event){
      event.preventDefault()
      console.log(this.$data)
      console.log(JSON.stringify(this.$data))
      // console.log(this)
      this.$emit('submitCreate', this.$data)
    }
  }


})