import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {
  const [password, setPassword] = useState('')
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [passwordModificado, setPasswordModificado] = useState(false)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
         await clienteAxios(`/usuarios/olvide-password/${id}`)
         setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
        console.log(error.response)
      }
    }
    comprobarToken()
  },[])

  const handleSubmit = async e => {
    e.preventDefault()
    if(password.length < 6) {
      setAlerta({
        msg: 'El password debe ser mayor a 6 caracteres,',
        error: true
      })
      return
    }
    try {
      const url = `/usuarios/olvide-password/${id}`
      const { data } = await clienteAxios.post(url, {password})
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  return (
    <>
    <h1 className="text-sky-600 font-black text-6xl capitalize">Restablece tu password y no pierdas acceso a tus {' '} <span className="text-slate-700">proyectos</span></h1>
    {alerta.msg && <Alerta alerta={alerta} />}
   {tokenValido && (

      <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg px-10 py-5">
      <div className="my-5">
        <label htmlFor="password"
          className="uppercase text-gray-600 block text-xl font-bold"
        >Nuevo Password</label>
        <input 
          id="password"
          type="password"
          placeholder="Escribe tu nuevo passsword"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <input type="submit" 
        value="Guardar nuevo password"
        className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-10"
      />
    </form>
   )}
             {passwordModificado && (
                  <Link
                  className=' block text-center my-5 text-slate-500 uppercase text-sm'
                  to="/registrar"
                >
                 Inicia sesión
                </Link>
          )}
  </>
  )
}

export default NuevoPassword