import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../../../axios'
import { useNavigate } from 'react-router-dom'
import Loader from '../../logic/Loader'

const Post = () => {
	const [postData, setPostData] = useState({})
	const [loaded, setLoaded] = useState(false)
	const { id } = useParams()

	const userData = useSelector(state => state.auth.data)

	const isUsersPost = postData._id && userData?._id === postData?.author._id

	const createdDate = new Date(postData.createdAt).toLocaleString()

	useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then(({ data }) => {
				setPostData(data)
				setLoaded(true)
			})
			.catch(err => {
				console.log(err)
				alert('Ошибка при получении статьи')
			})
	}, [])

	const navigate = useNavigate()

	const clickToDelete = async () => {
		await axios.delete(`/posts/${id}`)
		navigate('/')
	}

	const clickToUpdate = () => {
		navigate(`/posts/update/${id}`)
	}

	if (loaded) {
		return (
			<div className='post mb-5'>
				<div className='row mb-3 mb-sm-1'>
					<div className='col'>
						<h3>{postData.title}</h3>
					</div>
					{isUsersPost && (
						<div className='col-auto'>
							<button
								className='btn btn-outline-danger me-2'
								onClick={clickToDelete}
							>
								Удалить
							</button>
							<button
								className='btn btn-outline-success'
								onClick={clickToUpdate}
							>
								Редактировать
							</button>
						</div>
					)}
				</div>
				<div className='row mb-3'>
					<div className='col-auto'>
						<span className='fst-italic '>{createdDate}</span>
					</div>
					<div className='col-auto d-flex align-items-center gap-1'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='18'
							height='18'
							fill='currentColor'
							className='bi bi-eye'
							viewBox='0 0 16 16'
						>
							<path d='M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z' />
							<path d='M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z' />
						</svg>
						<span>{postData.viewsCount}</span>
					</div>
				</div>
				{postData.imageUrl && (
					<div className='post__image-wrapper image-wrapper mb-3'>
						<img
							className='img-fluid'
							src={`http://localhost:4444${postData.imageUrl}`}
							alt='Post'
						/>
					</div>
				)}
				<p className='mb-4'>{postData.text}</p>
				<div className='author d-flex gap-3'>
					<div className='author__image-wrapper image-wrapper'>
						<img
							src={
								postData.author.avatarUrl
									? `http://localhost:4444${postData.author.avatarUrl}`
									: 'http://localhost:4444/uploads/no-avatar.webp'
							}
							alt='Avatar author'
						/>
					</div>
					<div>
						<h6 className='mb-1'>{postData.author.fullName}</h6>
						<span>
							<i>@{postData.author.login}</i>
						</span>
					</div>
				</div>
			</div>
		)
	} else {
		return <Loader />
	}
}

export default Post
