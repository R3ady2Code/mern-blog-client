import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostItem from '../../logic/PostItem'
import { fetchPosts } from '../../../redux/slices/posts'
import Loader from '../../logic/Loader'

const Home = () => {
	const dispatch = useDispatch()
	const { posts } = useSelector(state => state.posts)

	const isPostsLoading = posts.status === 'loading'

	useEffect(() => {
		dispatch(fetchPosts())
	}, [])

	if (isPostsLoading)
		return (
			<div className='loader-container'>
				<Loader />
			</div>
		)

	return (
		<div className='row'>
			{posts.items.map(post => (
				<div className='col-sm-6 col-md-4 col-lg-3 mb-4' key={post._id}>
					<PostItem post={post} />
				</div>
			))}
		</div>
	)
}

export default Home
