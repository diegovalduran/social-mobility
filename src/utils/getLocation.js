import locate from "$utils/locate.js";
import states from "$data/state-name-abbr.csv";

export default async function getLocation(test) {
	let location;
	try {
		const { country, region, loc } = await locate(test);
		if (country === "US") {
			const [lat, lon] = loc.split(",");
			const state = states.find((s) => s.state === region)?.postal;
			location = { lat, lon, state };
		}
	} catch (err) {
		console.log(err);
	} finally {
		return location;
	}
}
