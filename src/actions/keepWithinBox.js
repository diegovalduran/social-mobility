function getXY(node) {
	return node
		.getAttribute("transform")
		.split(",")
		.map((d) => +d.replace(/[^0-9.]/g, ""));
}

export default function keepWithinBox(node, params = {}) {
	function check({ width }) {
		const { top, left, right, bottom } = node.getBoundingClientRect();
		let transform;
		const [x, y] = getXY(node);

		if (right > width) transform = `translate(${x + (width - right)}, ${y})`;
		else if (left < 0) transform = `translate(${x + Math.abs(left)}, ${y})`;
	}

	check(params);

	return {
		update(params) {
			check(params);
		},

		destroy() {}
	};
}
