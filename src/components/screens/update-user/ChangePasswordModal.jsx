import { useEffect, useRef, useState } from 'react'
import axios from '../../../axios'

const ChangePasswordModal = ({ userData }) => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const onSubmit = async () => {
		try {
			setError('')
			setIsLoading(true)
			const response = await axios.patch('/auth/password', {
				oldPassword,
				newPassword,
				...userData,
			})

			if (response.data.token)
				window.localStorage.setItem('token', response.data.token)
			alert('Пароль успешно изменен')
			closeModal()
		} catch (error) {
			if (error.response.data.message)
				return setError(error.response.data.message)
			if (error.response.data[0].msg)
				return setError(error.response.data[0].msg)
		} finally {
			setIsLoading(false)
		}
	}

	const closeBtn = useRef(null)
	const closeModal = () => {
		closeBtn.current.click()
		setOldPassword('')
		setNewPassword('')
	}

	return (
		<div
			className='modal fade'
			id='changePassword'
			tabIndex='-1'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<button
							type='button'
							className='btn-close'
							data-bs-dismiss='modal'
							aria-label='Close'
							onClick={closeModal}
							ref={closeBtn}
						></button>
					</div>
					<div className='modal-body'>
						<div className='mb-3'>
							<label htmlFor='oldPass' className='form-label'>
								Старый пароль
							</label>
							<input
								value={oldPassword}
								onChange={e => setOldPassword(e.target.value)}
								type='password'
								className='form-control'
								id='oldPass'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='oldPass' className='form-label'>
								Новый пароль
							</label>
							<input
								value={newPassword}
								onChange={e => setNewPassword(e.target.value)}
								type='password'
								className='form-control'
								id='oldPass'
							/>
						</div>
						{error && <span className='text-danger fw-bold'>{error}</span>}
					</div>
					<div className='modal-footer'>
						<button
							type='submit'
							onClick={onSubmit}
							disabled={isLoading}
							className='btn btn-primary'
						>
							Сменить пароль
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChangePasswordModal
