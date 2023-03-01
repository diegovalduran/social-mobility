import us from "$data/counties-10m.json";
import cleanUSData from "$data/cleanUSData.js";

const { counties, states } = cleanUSData(us);

export { counties, states };
