describe("Meta", function() {
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
    var testBlock = tallyBlockGen({description:'testing', cont:0})
    expect(testBlock.tallyData.description).toEqual('testing')
    expect(testBlock.$mount().$el.textContent.includes('testing')).toEqual(true)
  })

  it('should increment count', function(){
    var testBlock = tallyBlockGen({description:'testing', count:0})
    expect(testBlock.tallyData.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.tallyData.count).toEqual(1)
  })

  it('should decrement count', function(){
    var testBlock = tallyBlockGen({description:'testing', count:0})
    expect(testBlock.tallyData.count).toEqual(0)
    testBlock.countPlusPlus()
    expect(testBlock.tallyData.count).toEqual(1)
    testBlock.countMinusMinus()
    expect(testBlock.tallyData.count).toEqual(0)
  })

})

