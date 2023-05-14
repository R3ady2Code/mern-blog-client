import React from 'react'
import { Link } from 'react-router-dom'

const PostItem = ({ post }) => {
	return (
		<div className='card'>
			<div className='card-img-top image-wrapper post-item__image-wrapper'>
				<img
					src={
						post.imageUrl
							? `${process.env.REACT_APP_API_URL}${post.imageUrl}`
							: `${process.env.REACT_APP_API_URL}/uploads/non-image.jpg`
					}
					className='card-img-top '
					alt='...'
				/>
			</div>

			<div className='card-body'>
				<h5 className='card-title ellipsis'>{post.title}</h5>
				<p className='card-text custom-card-text'>{post.text}</p>
				<Link to={`/posts/${post._id}`} className='btn btn-outline-primary'>
					Читать полностью
				</Link>
			</div>
			<div className='card-footer'>
				<p className='text-body-secondary text-end mb-0'>
					Автор: @<i>{post.author.login}</i>
				</p>
			</div>
		</div>
	)
}

export default PostItem
