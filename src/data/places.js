import raw from "$data/raw.csv";
import stateLookup from "$data/states.csv";
import cleanPlaceData from "$data/cleanPlaceData.js";

const places = cleanPlaceData({ raw, stateLookup });

export default places;
