import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const { setAuth } = useAuth()

  const navigate = useNavigate()


  const handleSubmit = async e => {
    e.preventDefault()

    if([email, password].includes('')) {
      setAlerta({
        msg: 'Todoos los campos son obligatorios',
        error: true
      })
      return
    }
    try {
      const { data } = await clienteAxios.post('usuarios/login', { email, password})
      localStorage.setItem('token', data.token)
      setAuth(data)
      setAlerta({
        msg: "",
        error: false
      })
      navigate('/')
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }
  
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesion y administra tus proyectos {' '} <span className="text-slate-700">proyectos</span></h1>
      {alerta.msg && <Alerta alerta={alerta} />}
      <form className="my-10 bg-white shadow rounded-lg px-10 py-5"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >Email</label>
          <input 
            id="email"
            type="email"
            placeholder="tuEmail@mail.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >Password</label>
          <input 
            id="password"
            type="password"
            placeholder="passsword"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input type="submit" 
          value="Iniciar Sesión"
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-10"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className=' block text-center my-5 text-slate-500 uppercase text-sm'
          to="/registrar"
        >
        No tienes una cuenta? Registrate
        </Link>
        <Link
          className=' block text-center my-5 text-slate-500 uppercase text-sm'
          to="/olvide-password"
        >
        Olvidé mi password
        </Link>
      </nav>    
    </>
  )
}

export default Login