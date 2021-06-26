// import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { Question } from '../components/Question'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode'
import chekImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg'
// import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const {user} = useAuth();

    const history = useHistory()

    //Pegar o ID da sala e passar como paramentro
    const params = useParams<RoomParams>();
    // const [newQuestion, setNewQuestion] = useState('')
    const roomId = params.id

    const { title, questions } = useRoom(roomId)

    console.log(questions)

    //encerrar sala
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/')
    }

    //Excluir a pergunta
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Você tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswerd(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighLightQuestion(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />

                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutline onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswerd(question.id)}
                                        >
                                            <img src={chekImg} alt="Marcar a pergunta como respondida" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleHighLightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>

                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}