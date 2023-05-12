import ContentLoader from 'react-content-loader'
import { Link } from 'react-router-dom'

const Loader = props => {
	return (
		<nav className='navbar bg-light-subtle py-3 mb-5 position-sticky top-0 w-100 z-2'>
			<div className='container-fluid'>
				<Link to='/' className='navbar-brand'>
					<h3>MERN Blog</h3>
				</Link>
				<ContentLoader
					speed={2}
					width={400}
					height={38}
					viewBox='0 0 400 38'
					backgroundColor='#f3f3f3'
					foregroundColor='#ecebeb'
					{...props}
				>
					<rect x='191' y='0' rx='0' ry='0' width='188' height='38' />
					<rect x='0' y='0' rx='0' ry='0' width='178' height='38' />
				</ContentLoader>
			</div>
		</nav>
	)
}

export default Loader
