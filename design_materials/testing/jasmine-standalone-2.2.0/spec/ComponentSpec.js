describe("Meta", function() {
  it("should run tests",function(){
    expect(true).toEqual(true)
  })
});

function tallyBlockGen(tallyData){
  var blockProxy = Vue.extend(Vue.options.components["tally-block"])
  return new blockProxy({propsData:{tallyData:tallyData}})
}

describe('TallyBlock', function(){
  it('should have a description property', function(){
    // Vue.options.components is where the templates are stored
    var testBlock = tallyBlockGen({description:'testing', cont:0})
    // debugger
    expect(testBlock.tallyData.description).toEqual('testing')
    expect(testBlock.$mount().$el.textContent.includes('testing')).toEqual(true)
  })
})
