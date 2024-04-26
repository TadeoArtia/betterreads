import Lottie, {type Options} from 'react-lottie';
import animationData from '../../../public/loader.json';

export function loader(props: { height?: number, width?: number }) {

	const width = props.width ?? 400;
	const height = props.height ?? 400;

	const defaultOptions: Options = {
		loop: true,
		autoplay: true,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice"
		},
		animationData: animationData
	};

	return (
		<div>
			<Lottie options={defaultOptions} height={height} width={width}/>
		</div>
	);
};
