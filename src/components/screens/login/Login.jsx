import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAuth, selectIsAuth } from '../../../redux/slices/auth'
import { useState } from 'react'

const Login = () => {
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		mode: 'onChange',
	})

	const dispatch = useDispatch()

	const onSubmit = async values => {
		try {
			setError('')
			setIsLoading(true)
			const { payload } = await dispatch(fetchAuth(values))
			if ('token' in payload) {
				window.localStorage.setItem('token', payload.token)
			} else {
				return setError(payload.message)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	if (isAuth) {
		return <Navigate to='/' />
	}

	return (
		<form className='mx-auto w-50' onSubmit={handleSubmit(onSubmit)}>
			<div className='mb-3'>
				<label htmlFor='login' className='form-label'>
					Логин
				</label>
				<input
					type='text'
					className={`form-control ${errors.login && 'is-invalid'}`}
					id='login'
					{...register('login', { required: true })}
				/>
			</div>
			<div className={`${!error ? 'mb-5' : 'mb-3'}`}>
				<label htmlFor='password' className='col-sm-2 col-form-label'>
					Пароль
				</label>
				<input
					type='password'
					className={`form-control ${errors.password && 'is-invalid'}`}
					id='password'
					{...register('password', { required: true })}
				/>
			</div>
			{error && <span className='text-danger fw-bold'>{error}</span>}
			<button
				disabled={isLoading}
				className={`btn btn-primary w-25 d-block mx-auto ${error && 'mt-3'}`}
			>
				Войти
			</button>
		</form>
	)
}

export default Login
