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
  var blockWGoal
  var blockNGoal
  var blockWAntiGoal

  beforeEach(function(){
    blockWGoal = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          hasGoal: true,
          atLeast: true,
          interval: 3,
          target: 2
        }
      })
    blockNGoal = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal: {
          hasGoal: false,
          atLeast: false,
          interval: 1,
          target: 1
        }
      })
    blockWAntiGoal = tallyBlockGen({
        description: "make new tally counter",
        tallies: [],
        goal:{
          hasGoal: true,
          atLeast: false,
          interval: 3,
          target: 2
        }
      })
  })
  it('should have a description property', function(){
    var testBlock = blockNGoal;
    expect(testBlock.tallyData.description).toEqual('make new tally counter')
    expect(testBlock.$mount().$el.textContent.includes('counter')).toEqual(true)
  })

  it('should increment count', function(){
    var testBlock = blockNGoal;
    expect(testBlock.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.count).toEqual(1)
  })

  it('should decrement count', function(){
    var testBlock = blockNGoal;
    // debugger
    expect(testBlock.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.count).toEqual(1)
    testBlock.countMinusMinus()
    expect(testBlock.count).toEqual(0)
  })
  describe('Tally goals', function(){
    it('should have a goal property', function(){
      var testBlock = blockWGoal
      expect(testBlock.tallyData.goal.target).toEqual(2)
      expect(testBlock.$mount().$el.textContent.includes('Goal')).toEqual(true)
      expect(testBlock.$mount().$el.textContent.includes('3')).toEqual(true)
      expect(testBlock.$mount().$el.textContent.includes('2')).toEqual(true)
    })
    it('should calculate if the goal is met', function(){
      var testBlock = blockWGoal
      expect(testBlock.goalMet).toEqual(false)
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      expect(testBlock.goalMet).toEqual(true)
    })
    it('anti-goals calculate completion properly',function(){
      expect(blockWAntiGoal.goalMet).toEqual(true)
      blockWAntiGoal.countPlusPlus()
      blockWAntiGoal.countPlusPlus()
      blockWAntiGoal.countPlusPlus()
      blockWAntiGoal.countPlusPlus()
      expect(blockWAntiGoal.goalMet).toEqual(false)
    })
    it('Should be able to disregard past work for present goals', function(){
      var testBlock = blockWGoal
      testBlock.tallyData.tallies.push(
        {quantity:4, timestamp:Date.now()-4*86400000}
        )
      expect(testBlock.goalMet).toEqual(false)
    })
    it('Should be able to check recent work for progress', function(){
      var testBlock = blockWGoal
      testBlock.tallyData.tallies.push(
        {quantity:4, timestamp:Date.now()-4*86400000}
        )
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      expect(testBlock.goalMet).toEqual(true)
    })
    it('should be styled differently if goal is met', function(){
      var testBlock = blockWGoal
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      testBlock.countPlusPlus()
      expect(testBlock.$mount().$el.className.includes('goal-met')).toEqual(true)
    })
    it('should be styled differently if goal is not met', function(){
      var testBlock = blockWGoal
      expect(testBlock.$mount().$el.className.includes('goal-unmet')).toEqual(true)
    })
    it('should be styled differently if no goal', function(){
      var testBlock = blockNGoal
      expect(testBlock.$mount().$el.className.includes('no-goal-set')).toEqual(true)
      // debugger
    })
  })

  describe('Tally goal status tracking', function(){
    it('should inform me of a goal deficit', function(){
      var statusText = blockWGoal.$mount().$el.querySelector('.status-block').textContent
      expect(statusText.includes('3')).toEqual(true)
      blockWGoal.countPlusPlus()
      var statusText = blockWGoal.$mount().$el.querySelector('.status-block').textContent
      expect(statusText.includes('2')).toEqual(true)
    })
    it('should inform me of a time surplus', function(){
      blockWGoal.tallies = [
        {
          quantity:2,
          timestamp: Date.now()-2.5*24*3600*1000
        }
      ]
      var statusText = blockWGoal.$mount().$el.querySelector('.status-block').textContent
      expect(statusText.includes('2 days')).toEqual(true)
      blockWGoal.tallies = [
        {
          quantity:2,
          timestamp: Date.now()-1.5*24*3600*1000
        }
      ]
      var statusText = blockWGoal.$mount().$el.querySelector('.status-block').textContent
      expect(statusText.includes('1 day')).toEqual(true)
      blockWGoal.tallies = [
        {
          quantity:2,
          timestamp: Date.now()-12.5*3600*1000
        }
      ]
      var statusText = blockWGoal.$mount().$el.querySelector('.status-block').textContent
      expect(statusText.includes('12 hours')).toEqual(true)
    })
  })
});

