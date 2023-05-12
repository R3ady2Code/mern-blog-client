import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../../redux/slices/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import axios from '../../../axios'

const UpdatePost = () => {
	const isAuth = useSelector(selectIsAuth)
	const { id } = useParams()
	const [dataIsLoaded, setDataIsLoaded] = useState(false)

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [imageUrl, setImageUrl] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [showErrors, setShowErrors] = useState(false)

	const inputFileRef = useRef(null)
	const handleFileChange = async event => {
		try {
			setShowErrors(true)
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

	async function fetchPostData() {
		const { data } = await axios.get(`posts/${id}`)
		setTitle(data.title)
		setText(data.text)
		setImageUrl(data.imageUrl)
		setDataIsLoaded(true)
	}
	useEffect(() => {
		fetchPostData()
	}, [])

	const navigate = useNavigate()

	const onSubmit = async e => {
		try {
			setIsLoading(true)
			await axios.patch(`/posts/${id}`, { title, text, imageUrl })
			navigate(`/posts/${id}`)
		} catch (error) {
			console.warn(error)
			alert('Не удалось обновить запись')
		} finally {
			setIsLoading(false)
		}
	}

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	if (!dataIsLoaded) return <h1>loading...</h1>

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

			<div className='d-flex align-items-start gap-2'>
				{imageUrl && (
					<img
						src={`http://localhost:4444${imageUrl}`}
						alt='Post'
						className='mb-3 ms-auto w-25'
					/>
				)}
				<input
					ref={inputFileRef}
					onChange={handleFileChange}
					className='form-control ms-auto w-25'
					type='file'
				/>
				{imageUrl && (
					<button onClick={removeFile} className='btn btn-outline-danger'>
						Удалить файл
					</button>
				)}
				<button
					disabled={isLoading}
					onClick={onSubmit}
					className='btn btn-outline-success'
					type='submit'
				>
					Обновить пост
				</button>
			</div>
		</form>
	)
}

export default UpdatePost
