import { FormEvent, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AssetsIllustrationImg from '../assets/illustration.svg';
import AssetsLogoImg from '../assets/logo.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { FirebaseDatabase } from '../services/firebase';
import '../styles/auth.scss';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    
    const nameInputRef = useRef<HTMLInputElement>(null);
    const handleCreateRoom = async(e: FormEvent) => {
        e.preventDefault();

        if(!nameInputRef.current || nameInputRef.current.value.trim() === "" || !user)
            return;

        const roomDatabaseRef = FirebaseDatabase.ref('rooms');

        const firebaseRoom = await roomDatabaseRef.push({
            title: nameInputRef.current.value,
            authorId: user.id
        });

        history.push(`/room/${firebaseRoom.key}`);
    };

    return (
        <div id="page-auth">
            <aside>
                <img src={AssetsIllustrationImg} alt="Ilustração" />
                <strong>Create Q&amp;A rooms live</strong>
                <p>Answer questions from your audience in real time</p>
            </aside>
            <main>

                <div className="main-content">
                    <img src={AssetsLogoImg} alt="LetMeAsk" />
                    <h2>Create new room</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            ref={nameInputRef} 
                            type="text"
                            name="name"
                            placeholder="Name of the room"
                        />
                        <Button type="submit">
                            Create
                        </Button>
                    </form>
                    <p>
                        Wanna join an existent room?
                        <Link to="/">Click here</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}