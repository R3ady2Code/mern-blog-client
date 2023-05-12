import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout, selectIsAuth } from '../../../redux/slices/auth'
import Loader from './Loader'
import { useOutside } from '../../../hooks/useOutside'

const Header = ({ isLoading }) => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const userData = useSelector(state => state.auth.data)

	const onClickLogout = () => {
		dispatch(logout())
		window.localStorage.removeItem('token')
	}

	const burgerNav = useRef(null)
	const closeMobileNav = () => {
		burgerNav.current.click()
	}

	const mobileNav = useRef(null)
	useOutside(mobileNav, () => {
		if (Array.from(mobileNav.current.classList).includes('show'))
			closeMobileNav()
	})

	if (isLoading) return <Loader />

	return (
		<nav className='navbar bg-light-subtle py-3 mb-5 position-sticky top-0 w-100 z-2'>
			<div className='container-fluid'>
				<Link to='/' className='navbar-brand'>
					<h3>MERN Blog</h3>
				</Link>
				<div
					className='ms-auto d-block d-md-none'
					data-bs-toggle='collapse'
					data-bs-target='#collapseOne'
					aria-expanded='true'
					aria-controls='collapseOne'
					ref={burgerNav}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='30'
						height='30'
						fill='currentColor'
						className='bi bi-list'
						viewBox='0 0 16 16'
					>
						<path
							fillRule='evenodd'
							d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
						/>
					</svg>
				</div>
				<div
					id='collapseOne'
					className='position-absolute w-100 p-3 h-full collapse mobile-nav bg-light-subtle'
					ref={mobileNav}
				>
					{isAuth ? (
						<ul className='list-group'>
							<Link
								className='list-group-item'
								to='/add-post'
								onClick={closeMobileNav}
							>
								Новый пост
							</Link>
							<Link
								className='list-group-item'
								to={`/profile/update/${userData._id}`}
								onClick={closeMobileNav}
							>
								Профиль
							</Link>
							<li
								className='list-group-item'
								onClick={() => {
									closeMobileNav()
									onClickLogout()
								}}
							>
								Выйти
							</li>
						</ul>
					) : (
						<ul className='list-group'>
							<Link
								className='list-group-item'
								to='/login'
								onClick={closeMobileNav}
							>
								Войти
							</Link>
							<Link
								className='list-group-item'
								to='/register'
								onClick={closeMobileNav}
							>
								Зарегистрироваться
							</Link>
						</ul>
					)}
				</div>

				{isAuth ? (
					<div className='ms-auto d-none d-md-flex align-items-center'>
						<Link
							to='/add-post'
							className='btn btn-success d-none d-sm-block me-3'
						>
							Новый пост
						</Link>
						<div className='dropdown'>
							<div
								className='author d-flex gap-2 cursor-pointer'
								data-bs-toggle='dropdown'
								aria-expanded='false'
							>
								<div className='author__image-wrapper author__image-wrapper_header image-wrapper'>
									<img
										src={
											userData.avatarUrl
												? `http://localhost:4444${userData.avatarUrl}`
												: 'http://localhost:4444/uploads/no-avatar.webp'
										}
										alt='Avatar author'
									/>
								</div>
								<div>
									<h6 className='mb-0'>{userData.fullName}</h6>
									<span>
										<i>@{userData.login}</i>
									</span>
								</div>
							</div>
							<ul className='dropdown-menu dropdown-menu-end dropdown-menu-lg-end mt-2'>
								<li>
									<Link to='/add-post' className='dropdown-item'>
										Новый пост
									</Link>
								</li>
								<li>
									<Link
										to={`/profile/update/${userData._id}`}
										className='dropdown-item'
									>
										Профиль
									</Link>
								</li>
								<li>
									<button
										className=' text-danger dropdown-item'
										onClick={onClickLogout}
									>
										Выйти
									</button>
								</li>
							</ul>
						</div>
					</div>
				) : (
					<div className='ms-auto d-none d-md-block'>
						<Link to='/login' className='btn btn-outline-primary ms-auto me-2'>
							Войти
						</Link>
						<Link to='/register' className='btn btn-primary'>
							Зарегистрироваться
						</Link>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Header
