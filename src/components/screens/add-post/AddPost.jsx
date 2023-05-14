import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../../redux/slices/auth'
import { Navigate, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import axios from '../../../axios'

const AddPost = () => {
	const isAuth = useSelector(selectIsAuth)

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [imageUrl, setImageUrl] = useState('')

	const [isLoading, setIsLoading] = useState(false)

	const [error, setError] = useState('')
	const [showErrors, setShowErrors] = useState(false)

	const inputFileRef = useRef(null)
	const handleFileChange = async event => {
		try {
			setIsLoading(true)
			const formData = new FormData()
			formData.append('image', event.target.files[0])
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.url)
		} catch (error) {
			console.log(error)
			alert('Ошибка при загрузки файла')
		} finally {
			setIsLoading(false)
		}
	}
	const removeFile = () => {
		setImageUrl('')
		inputFileRef.current.value = ''
	}

	const navigate = useNavigate()

	const onSubmit = async () => {
		try {
			setIsLoading(true)
			const fields = { title, text, imageUrl }

			const { data } = await axios.post('/posts', fields)

			console.log(data)

			const id = data._id

			navigate(`/posts/${id}`)
		} catch ({ response }) {
			const { data } = response
			console.log(data)
			setError(data)
			setShowErrors(true)
		} finally {
			setIsLoading(false)
		}
	}

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<form className='mb-3'>
			<div className='mb-3'>
				<input
					value={title}
					onChange={e => setTitle(e.target.value)}
					className={`form-control form-control-lg ${
						showErrors && !title && 'is-invalid'
					}`}
					placeholder='Заголовок'
				/>
			</div>
			<div className='mb-3'>
				<textarea
					value={text}
					onChange={e => setText(e.target.value)}
					className={`form-control resize-none ${
						showErrors && !text && 'is-invalid'
					}`}
					placeholder='Текст'
					rows='6'
				></textarea>
			</div>

			<div className='mb-2 d-flex flex-column'>
				{error &&
					error.map(({ msg }) => (
						<span className='text-danger fw-bold text-end'>{msg}</span>
					))}
			</div>

			<div className='row gap-2'>
				<div className='col-lg-4 image-wrapper'>
					{imageUrl && (
						<img
							src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
							alt='Post'
							className='mb-3 ms-auto'
						/>
					)}
				</div>

				<div className='col col-lg-auto ms-lg-auto'>
					<input
						ref={inputFileRef}
						onChange={handleFileChange}
						className='form-control ms-auto'
						type='file'
					/>
				</div>

				{imageUrl && (
					<div className='col-auto'>
						<button onClick={removeFile} className='btn btn-outline-danger'>
							Удалить файл
						</button>
					</div>
				)}
				<div className='col-12 col-xl-auto'>
					<button
						disabled={isLoading}
						onClick={onSubmit}
						className='btn btn-outline-success w-100'
						type='submit'
					>
						Создать пост
					</button>
				</div>
			</div>
		</form>
	)
}

export default AddPost
