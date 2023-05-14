import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../../axios'
import { fetchAuthUpdate } from '../../../redux/slices/auth'
import ChangePasswordModal from './ChangePasswordModal'

const UpdateUser = () => {
	const { id } = useParams()
	const dispatch = useDispatch()

	const userData = useSelector(state => state.auth.data)

	const [isLoading, setIsLoading] = useState(false)

	const [login, setLogin] = useState('')
	const [fullName, setFullName] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('')

	const inputFileRef = useRef(null)
	const handleFileChange = async event => {
		try {
			setIsLoading(true)
			const formData = new FormData()
			formData.append('image', event.target.files[0])
			const { data } = await axios.post('/upload', formData)
			setAvatarUrl(data.url)
		} catch (error) {
			console.log(error)
			alert('Ошибка при загрузки файла')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		setLogin(userData?.login)
		setFullName(userData?.fullName)
		setAvatarUrl(userData?.avatarUrl)
	}, [])

	const clickToUploadAvatar = () => {
		inputFileRef.current.click()
	}

	const navigate = useNavigate()

	const [error, setError] = useState('')
	const onSubmitToUpdate = async () => {
		try {
			setError('')
			setIsLoading(true)
			const { payload } = await dispatch(
				fetchAuthUpdate({ login, fullName, avatarUrl, _id: userData._id })
			)
			setIsLoading(false)
			if (!payload) {
				setError('Не удалось обновить информацию')
			}
			if ('token' in payload) {
				window.localStorage.setItem('token', payload.token)
			}
		} catch (error) {
			console.warn(error)
			alert('Не удалось обновить информацию')
		}
	}

	if (userData?._id !== id) return navigate('/')

	return (
		<>
			<form action='submit' className='mx-auto'>
				<div className='mb-3'>
					<div className='register__image-wrapper image-wrapper mx-auto'>
						<img
							src={`${process.env.REACT_APP_API_URL}${
								avatarUrl ? avatarUrl : '/uploads/no-avatar.webp'
							}`}
							alt='Avatar'
							width={900}
							height={500}
						/>
					</div>
					<button
						onClick={clickToUploadAvatar}
						className='btn d-block text-black mx-auto'
						type='button'
					>
						{userData.avatarUrl ? 'Обновить фото' : 'Загрузить фото'}
					</button>
					<input
						type='file'
						hidden
						ref={inputFileRef}
						onChange={handleFileChange}
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='fullName' className='form-label'>
						Полное имя
					</label>
					<input
						value={fullName}
						onChange={e => setFullName(e.target.value)}
						type='text'
						className={`form-control`}
						id='fullName'
						placeholder='Иван Иванов'
					/>
				</div>
				<div className='mb-3'>
					<label htmlFor='login' className='form-label'>
						Логин
					</label>
					<input
						value={login}
						onChange={e => setLogin(e.target.value)}
						type='text'
						className={`form-control`}
						id='login'
						placeholder='ivanivanov'
					/>
				</div>

				{error && <span className='text-danger fw-bold'>{error}</span>}
				<div className='row'>
					<div className='col-auto ms-auto'>
						<button
							disabled={isLoading}
							className='btn btn-outline-danger d-block'
							type='button'
							data-bs-toggle='modal'
							data-bs-target='#changePassword'
						>
							Смена пароля
						</button>
					</div>

					<div className='col-auto'>
						<button
							disabled={isLoading}
							type='submit'
							className='btn btn-success d-block '
							onClick={onSubmitToUpdate}
						>
							Сохранить
						</button>
					</div>
				</div>
			</form>
			<ChangePasswordModal userData={userData} />
		</>
	)
}

export default UpdateUser
