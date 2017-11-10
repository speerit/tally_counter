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