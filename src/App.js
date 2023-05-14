import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth'
import { useDispatch, useSelector } from 'react-redux'

import Header from './components/logic/Header/Header'
import Home from './components/screens/home/Home'
import Post from './components/screens/post/Post'
import AddPost from './components/screens/add-post/AddPost'
import Register from './components/screens/register/Register'
import Login from './components/screens/login/Login'
import UpdatePost from './components/screens/update-post/UpdatePost'
import UpdateUser from './components/screens/update-user/UpdateUser'

function App() {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)
	const [isLoading, setIsLoading] = useState(false)

	async function fetchMyData() {
		setIsLoading(true)
		await dispatch(fetchAuthMe())
		setIsLoading(false)
	}

	useEffect(() => {
		fetchMyData()
	}, [])

	return (
		<div className='App'>
			<Header isLoading={isLoading} />
			<div className='container-xl'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<Post />} />
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login />} />
					<Route path='/add-post' element={<AddPost />} />
					<Route path='/posts/update/:id' element={<UpdatePost />} />
					<Route path='/profile/update/:id' element={<UpdateUser />} />
				</Routes>
			</div>
		</div>
	)
}

export default App
