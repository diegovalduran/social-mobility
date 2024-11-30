import haversine from "haversine-distance";
import { sum, descending } from "d3";

const MI_IN_KM = 0.621371;

function calculateCountyScores({
	scaleDist,
	scalePop,
	scaleWiki,
	places,
	centroid
}) {
	const withDist = places.map((s) => ({
		...s,
		dist: Math.floor(
			(haversine(centroid, [s.longitude, s.latitude]) / 1000) * MI_IN_KM
		)
	}));

	const withScore = withDist.map((d) => ({
		...d,
		scoreD: scaleDist(d.dist),
		scoreP: scalePop(d.population),
		scoreW: scaleWiki(d.wiki),
		score: scaleDist(d.dist) + scalePop(d.population) + scaleWiki(d.wiki)
	}));

	const total = sum(withScore, (d) => d.score);

	const withShare = withScore.map((d) => ({
		...d,
		share: d.score / total
	}));

	withShare.sort((a, b) => descending(a.share, b.share));

	const withOther = withShare.map((d, i) => ({
		...d,
		shareDelta: d.share - (withShare[1]?.share || d.share),
		growth: d.score / (withShare[1]?.score || d.score) - 1
	}));

	return withOther;
}

export default function addDataToCounties({
	counties,
	places,
	scaleDist,
	scalePop,
	scaleWiki
}) {
	if (!counties || !counties.features) {
		console.warn('No counties data available yet');
		return null;
	}

	if (!places || !Array.isArray(places)) {
		console.warn('No places data available yet');
		return counties;
	}

	try {
		const countiesWithData = {
			...counties,
			features: counties.features.map(d => {
				if (!d.properties?.centroid) {
					console.warn(`No centroid for county ${d.id}`);
					return d;
				}

				return {
					...d,
					properties: {
						...d.properties,
						data: calculateCountyScores({
							scaleDist,
							scalePop,
							scaleWiki,
							places,
							centroid: d.properties.centroid
						})
					}
				};
			})
		};

		return countiesWithData;
	} catch (error) {
		console.error('Error in addDataToCounties:', error);
		return counties;
	}
}
