import haversine from "haversine-distance";
import { sum, descending } from "d3";

function setScales({ counties, sample }) {
	// const allDists = counties.features.map((d) => {
	// 	const withDist = sample.map((s) => ({
	// 		...s,
	// 		dist: Math.floor(
	// 			haversine(d.properties.centroid, [s.longitude, s.latitude]) / 1000
	// 		)
	// 	}));
	// 	return extent(withDist, (d) => d.dist);
	// });
	// const extentDist = [
	// 	Math.min(...allDists.map((d) => d[0])),
	// 	Math.max(...allDists.map((d) => d[1]))
	// ];
	// TODO min should only be in bounds
	// TODO should min be the same for all or based on cities? (clamp?)
	// scaleDist.domain(extentDist).range([1, 0]);
	// TODO
	// 1000 = 0.1
	// 10000 = 0.2
	// 100000 = 0.4
	// 1000000 = 0.8
	// scalePop.domain([1000, 1000000]).range([0.1, 0.8]);
}

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
	// console.log(scalePop(10000000));
	// console.log(scalePop(1000000));
	// console.log(scalePop(100000));
	// console.log(scalePop(10000));
	// console.log(scalePop(1000));

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
