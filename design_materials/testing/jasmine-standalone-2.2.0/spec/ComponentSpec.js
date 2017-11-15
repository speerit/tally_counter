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

});

