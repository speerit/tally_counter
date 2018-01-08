describe("Meta Utilities", function() {
  it("should run tests", function(){
    expect(true).toEqual(true)
  })
});

describe("versionUpdate1to2", function(){
  it("should convert count data into tallies data", function(){
    var oldData = [
      { description: 'test1', count: 3},
      { description: 'test2', count: 5}
    ]

    var newData = versionUpdate1to2(oldData)
    expect(newData[0].tallies.length).toEqual(1)
    expect(newData[1].tallies[0].quantity).toEqual(5)
    expect(newData[1].tallies[0].timestamp).toBeGreaterThan(Date.now()-2000)
  })
});

describe("versionUpdate2to3", function(){
  it("should convert goal data into new data format", function(){
    var oldData = [
      { description: 'test1', tallies: [], goal:{interval:1, target:2}},
      { description: 'test2', tallies: [], goal:false},
    ]

    var newData = versionUpdate2to3(oldData)
    expect(newData[0].goal.hasGoal).toEqual(true)
    expect(newData[0].goal.atLeast).toEqual(true)
    expect(newData[1].goal.hasGoal).toEqual(false)
  })

  it('should trigger on v2 data but not v3 data', function(){
    var oldData = [
      { description: 'test1', tallies: [], goal:{interval:1, target:2}},
      { description: 'test2', tallies: [], goal:false},
    ]
    var newData = versionUpdate2to3(oldData)
    function checkForV2Data(data){
      return (data[0].goal===false || typeof(data[0].goal.atLeast)==='undefined')
    }
    expect(checkForV2Data(oldData)).toEqual(true)
    expect(checkForV2Data(newData)).toEqual(false)
  })
});
