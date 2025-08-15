window.SW_DATA = (function(){
  const core = ["Fixed Signage","LED Signage","Naming Rights","Jersey Patch","Helmet Logo","Concourse Signage","Videoboard Signage","Concession Areas"];
  const extras = { MLB:["Outfield Wall Signage"], NHL:["Dasher-Board Signage","In-Ice Signage"], MLS:["Pitch-Level Signage"] };
  const leagues = {
    NFL:[["Portland Lumberjacks","Timberline Field"],["Las Vegas Vipers","Mojave Bank Stadium"],["Miami Tritons","Oceanview Arena"],["Milwaukee Guardians","Lakefront Field"],["Austin Outlaws","Republic Stadium"],["San Antonio Stampede","Alamo Energy Stadium"],["St. Louis Stallions","Gateway Dome"],["Salt Lake Blizzard","Wasatch Stadium"]],
    NBA:[["Portland Pioneers","Rose City Arena"],["Las Vegas Outlaws","Desert Sun Arena"],["Miami Cyclones","Atlantic Bank Center"],["Milwaukee Lakehawks","Brew City Arena"],["Nashville Rhythm","Music City Arena"],["Kansas City Monarchs","Heartland Arena"],["San Diego Surge","Pacific Energy Arena"],["Pittsburgh Iron","Steel City Arena"]],
    MLB:[["Portland Beavers","Cascade Ballpark"],["Las Vegas High Rollers","Silver State Stadium"],["Miami Sailfish","Gulf Breeze Park"],["Milwaukee Hammers","Brew Park"],["Charlotte Copperheads","Queen City Field"],["Oklahoma City Wranglers","Prairie Bank Ballpark"],["Sacramento Gold","Capital Field"],["Louisville Legends","Derby Park"]],
    NHL:[["Portland Glaciers","Rose Ice Arena"],["Las Vegas Outlaws","Desert Chill Arena"],["Miami Barracudas","Ocean Ice Center"],["Milwaukee Blizzard","Brew Ice Arena"],["Quebec Voyageurs","St. Lawrence Ice Centre"],["Houston Polar Bears","Lone Star Arena"],["Kansas City Kodiaks","Heartland Icehouse"],["Anchorage Northern Lights","Aurora Ice Center"]],
    MLS:[["Portland Cascades","Timberline Park"],["Las Vegas Scorpions","Mojave Bank Field"],["Miami Waves","Atlantic Energy Stadium"],["Milwaukee Forge","Lakefront Pitch"],["Phoenix Heatwave","Sonoran Bank Stadium"],["Raleigh Oaks","Carolina Pitch Park"],["San Diego Breakers","Pacific Pitch Arena"],["Detroit Grit","Motor City Field"]]
  };
  const ranges = { NFL:{low:25000,high:10000000}, NBA:{low:15000,high:8000000}, MLB:{low:10000,high:6000000}, NHL:{low:8000,high:4000000}, MLS:{low:5000,high:2000000} };
  const brands = ["Glacier Water Co.","Solarix Energy","Frontier Bank","Skyline Tech","Maverick Brewing","Trailblazer Insurance","Rapid Ride E-Bikes","Aurora Health","Goldline Logistics","Oceanic Airlines","Beacon Coffee","Summit Outdoors","Blue Harbor Media","NovaCloud","Atlas Freight"];
  function assetsFor(league){ return core.concat(extras[league]||[]); }
  return { leagues, ranges, brands, assetsFor };
})();
