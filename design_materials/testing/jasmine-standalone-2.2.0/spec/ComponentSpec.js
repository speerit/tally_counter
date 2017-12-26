describe("Meta Component", function() {
  it("should run tests",function(){
    expect(true).toEqual(true)
  })
});

function tallyBlockGen(tallyData){
    // Vue.options.components is where the templates are stored
  var blockProxy = Vue.extend(Vue.options.components["tally-block"])
  return new blockProxy({propsData:{tallyData:tallyData}})
}

describe('TallyBlock', function(){
  it('should have a description property', function(){
    var testBlock = tallyBlockGen({description: "make new tally counter", tallies: [], goal: false})
    expect(testBlock.tallyData.description).toEqual('make new tally counter')
    expect(testBlock.$mount().$el.textContent.includes('counter')).toEqual(true)
  })

  it('should increment count', function(){
    var testBlock = tallyBlockGen({description: "make new tally counter", tallies: [], goal: false})
    expect(testBlock.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.count).toEqual(1)
  })

  it('should decrement count', function(){
    var testBlock = tallyBlockGen({description: "make new tally counter", tallies: [], goal: false})
    // debugger
    expect(testBlock.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.count).toEqual(1)
    testBlock.countMinusMinus()
    expect(testBlock.count).toEqual(0)
  })
  describe('Tally goals', function(){
    it('should have a goal property', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          interval: 3,
          target: 2
        }
      })
      expect(testBlock.tallyData.goal.target).toEqual(2)
      expect(testBlock.$mount().$el.textContent.includes('Goal')).toEqual(true)
      expect(testBlock.$mount().$el.textContent.includes('3')).toEqual(true)
      expect(testBlock.$mount().$el.textContent.includes('2')).toEqual(true)
    })
    it('should calculate if the goal is met', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          interval: 3,
          target: 2
        }
      })
      expect(testBlock.goalMet).toEqual(false)
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      expect(testBlock.goalMet).toEqual(true)
    })
    it('Should be able to disregard past work for present goals', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [{quantity:4, timestamp:Date.now()-4*86400000}],
        goal:{
          interval: 3,
          target: 2
        }
      })
      expect(testBlock.goalMet).toEqual(false)
    })
    it('should be styled differently if goal is met', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          interval: 3,
          target: 1
        }
      })
      testBlock.countPlusPlus()
      expect(testBlock.$mount().$el.className.includes('goal-met')).toEqual(true)
    })
    it('should be styled differently if goal is not met', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          interval: 3,
          target: 1
        }
      })
      expect(testBlock.$mount().$el.className.includes('goal-unmet')).toEqual(true)
    })
    it('should be styled differently if no goal', function(){
      var testBlock = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:false
      })
      expect(testBlock.$mount().$el.className.includes('no-goal-set')).toEqual(true)
      // debugger
    })
  })
});

