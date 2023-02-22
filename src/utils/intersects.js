export default function intersect(
	[minAx, minAy, maxAx, maxAy],
	[minBx, minBy, maxBx, maxBy]
) {
	const aLeftOfB = maxAx < minBx;
	const aRightOfB = minAx > maxBx;
	const aAboveB = minAy > maxBy;
	const aBelowB = maxAy < minBy;

	return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}
