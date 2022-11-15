import clienteAxios from '../config/clienteAxios'
import { useState } from 'react'
import  { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if(email === '' || email.length < 6) {
      setAlerta({
        msg: 'Email invalido',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
      setAlerta({ 
        msg: data.msg,
        error: false
      })
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Recupera tu acceso y no pierdas tus {' '} <span className="text-slate-700">proyectoss</span></h1>
    { alerta.msg && <Alerta alerta={alerta} />}
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
          onChange={ e => setEmail(e.target.value)}
        />
      </div>

      <input type="submit" 
        value="Enviar instrucciones"
        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-10"
      />
    </form>

    <nav className="lg:flex lg:justify-between">
      <Link
        className=' block text-center my-5 text-slate-500 uppercase text-sm'
        to="/registrar"
      >
      Ya tengo una cuenta. Inicia sesión
      </Link>
      <Link
        className=' block text-center my-5 text-slate-500 uppercase text-sm'
        to="/olvide-password"
      >
      No tienes na cuenta? Registrate
      </Link>
    </nav>    
  </>
  )
}

export default OlvidePassword