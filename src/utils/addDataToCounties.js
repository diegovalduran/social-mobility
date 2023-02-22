import haversine from "haversine-distance";
import { sum, descending } from "d3";

function calculateCountyScores({ scaleDist, scalePop, sample, centroid }) {
	const withDist = sample.map((s) => ({
		...s,
		dist: Math.floor(haversine(centroid, [s.longitude, s.latitude]) / 1000)
	}));

	const withScore = withDist.map((d) => ({
		...d,
		scoreD: scaleDist(d.dist),
		scoreP: scalePop(d.population),
		score: scaleDist(d.dist) + scalePop(d.population)
	}));

	const total = sum(withScore, (d) => d.score);

	const withShare = withScore.map((d) => ({
		...d,
		share: d.score / total
	}));

	withShare.sort((a, b) => descending(a.share, b.share));

	return withShare;
}

export default function addDataToCounties({
	counties,
	sample,
	scaleDist,
	scalePop
}) {
	const countiesWithData = {
		...counties,
		features: counties.features.map((d) => ({
			...d,
			properties: {
				...d.properties,
				data: calculateCountyScores({
					scaleDist,
					scalePop,
					sample,
					centroid: d.properties.centroid
				})
			}
		}))
	};

	return countiesWithData;
}
