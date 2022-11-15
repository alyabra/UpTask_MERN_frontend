import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from 'react-router-dom'
import useAuth from "../hooks/useAuth";


const ProyectosContext = createContext()


const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()
    const { auth } = useAuth()

    useEffect(() => {
        const obtenerProyecto = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyecto()
    },[auth])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000)
    }

    const submitProyecto = async proyecto => {

        if(proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }


    }

    const editarProyecto = async (proyecto) => {
        console.log("editando", proyecto.id)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            console.log(`/proyectos/:${proyecto.id}`)
            // TODO: corregir el envio de los parametros, si no le pongo proyectos al final se manda un objeto vacio
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            // sincronizar el state
            //  console.log("data", data)
             
             const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)


            setProyectos(proyectosActualizados)

            // mandar alerta
            setAlerta({
                msg: 'Proyecto actualizado',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            },3000)
        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            // console.log(proyecto)
            // TODO: corregir el envio de los parametros, si no le pongo proyectos al final se manda un objeto vacio
             const { data } = await clienteAxios.post('/proyectos', proyecto, config, proyecto)
             setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto creado',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            },3000)
        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setTimeout(() => {
                setAlerta({})
            }, 2000);
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            // sincronizar el state
            const proyectoActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectoActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            },2000)
        } catch (error) {
            console.log(error)
        }
       
    }
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {

        if(tarea?.id) {
            await editarTarea(tarea) 
        } else {
            await crearTarea(tarea)
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            // console.log(data)

            // TODO: Atualizar Dom
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState)

            setProyecto(proyectoActualizado)
        } catch (error) {
            console.log(error)
        }
        setAlerta({})
        setModalFormularioTarea(false)
    }


    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            // console.log(data.fechaEntraga)
            // agrega la tarea al state

            const proyectoActualizado ={...proyecto}
            proyectoActualizado.tareas =[...proyectoActualizado.tareas, data]
            setProyecto(proyectoActualizado)
            setAlerta({})
            setModalFormularioTarea(false)

        } catch (error) {
            console.log(error)
        }
    }
        
    

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(!modalFormularioTarea)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })

            // TODO: Atualizar Dom
             const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id )

            setProyecto(proyectoActualizado)
            setModalEliminarTarea(false)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
        } finally {
            setCargando(false)
        }
    }

    const agreagarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            console.log(data)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setTimeout(() => {
            setAlerta({})
        }, 2000);
    }

    const handleModalElminiarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
        } catch (error) {
            console.log(error.response)
        }
        setModalEliminarColaborador(false)
        setTimeout(() => {
            setAlerta({})
        }, 2000);
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
           const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
           
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
            setProyecto(proyectoActualizado)
           setTarea({})
           setAlerta({})
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    const cerrarSesionProyectos = () => {
        setProyecto({})
        setProyectos([])
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto, 
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea   ,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agreagarColaborador,
                handleModalElminiarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                cerrarSesionProyectos
            }}
        >{children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext