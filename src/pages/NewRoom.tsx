
// import { useContext } from 'react';
import {Link, useHistory} from 'react-router-dom'
import {FormEvent, useState} from 'react'
// import { AuthContext } from '../contexts/AuthContext';

import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg';


import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.scss'
import { database } from '../services/firebase';
// import userEvent from '@testing-library/user-event';

export function NewRoom() {
    const { user } = useAuth()

    // pegar dados do formulario do input
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    // previnir o carregamento do formulario e cria a sala
    async function handleCreateRoom(event: FormEvent) {
       event.preventDefault();

       if (newRoom.trim() === '') {
           return;
       }

       const roomRef = database.ref('rooms');

       const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
       })

       history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                   <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                        <p>
                            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                        </p>
                </div>
            </main>
        </div>
    )
}