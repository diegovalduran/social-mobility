import us from "$data/counties-10m.json";
import cleanUSData from "$data/cleanUSData.js";
import stateLookup from "$data/states.csv";

const { counties, states } = cleanUSData({ us, stateLookup });

export { counties, states };
