import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegister, selectIsAuth } from '../../../redux/slices/auth'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import axios from '../../../axios'

const Register = () => {
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const dispatch = useDispatch()

	const isAuth = useSelector(selectIsAuth)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			fullName: 'Вася пупкин',
			login: 'login_test',
			password: '12345',
		},
		mode: 'onChange',
	})
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
	const clickToUploadAvatar = () => {
		inputFileRef.current.click()
	}

	const onSubmit = async values => {
		try {
			setError('')
			setIsLoading(true)
			const { payload } = await dispatch(
				fetchRegister({ ...values, avatarUrl })
			)
			console.log(payload)
			if ('token' in payload) {
				window.localStorage.setItem('token', payload.token)
			}
			if (payload.message) {
				return setError(payload.message)
			}
			if (Array.isArray(payload)) {
				return setError(payload)
			}
		} catch (error) {
			console.warn(error)
		} finally {
			setIsLoading(false)
		}
	}
	const isInvalidInput = path => {
		let result = false
		if (Array.isArray(error)) {
			error.forEach(error => {
				if (error.path === path) result = true
			})
			return result
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='mx-auto'>
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
					{avatarUrl ? 'Обновить фото' : 'Загрузить фото'}
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
					{...register('fullName', { required: true })}
					type='text'
					className={`form-control ${
						errors.fullName || (isInvalidInput('fullName') && 'is-invalid')
					}`}
					id='fullName'
					placeholder='Иван Иванов'
				/>
			</div>
			<div className='mb-3'>
				<label htmlFor='login' className='form-label'>
					Логин
				</label>
				<input
					{...register('login', { required: true })}
					type='text'
					className={`form-control ${
						errors.login || (isInvalidInput('login') && 'is-invalid')
					}`}
					id='login'
					placeholder='ivanivanov'
				/>
			</div>
			<div className='mb-5'>
				<label htmlFor='password' className='col-sm-2 col-form-label'>
					Пароль
				</label>
				<input
					{...register('password', { required: true })}
					type='password'
					className={`form-control ${
						errors.password || (isInvalidInput('password') && 'is-invalid')
					}`}
					id='password'
				/>
			</div>
			{error && (
				<div className='text-danger fw-bold d-flex flex-column'>
					{Array.isArray(error) ? (
						error.map(({ msg }) => <span>{msg}</span>)
					) : (
						<span>{error}</span>
					)}
				</div>
			)}
			<button disabled={isLoading} className='btn btn-success d-block ms-auto'>
				Зарегистрироваться
			</button>
		</form>
	)
}

export default Register
