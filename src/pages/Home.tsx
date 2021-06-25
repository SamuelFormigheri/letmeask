import { useHistory } from 'react-router-dom';
import AssetsIllustrationImg from '../assets/illustration.svg';
import AssetsLogoImg from '../assets/logo.svg';
import AssetsGoogleImg from '../assets/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useRef } from 'react';
import { FirebaseDatabase } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    const codeInputRef = useRef<HTMLInputElement>(null);
    
    const handleCreateRoom = async () => {
        if(!user)
            await signInWithGoogle();

        history.push('/new-room');
    };

    const handleJoinRoom = async(e: FormEvent) => {
        e.preventDefault();

        if(!codeInputRef.current || codeInputRef.current.value.trim() === "" || !user)
            return;

        const roomExistsOnDatabaseRef = await FirebaseDatabase.ref(`rooms/${codeInputRef.current.value}`).get();

        if(!roomExistsOnDatabaseRef.exists()){
            alert(' Room does not exists');
            return;
        }

        if(!roomExistsOnDatabaseRef.val().closedAt){
            alert(' Room closed');
            return;
        }

        history.push(`/room/${codeInputRef.current.value}`);
    }

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
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={AssetsGoogleImg} alt="Google" />
                        Create your room with Google
                    </button>
                    <div className="separator">
                        or enter in a room
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            ref={codeInputRef}
                            type="text"
                            name="code"
                            placeholder="Type the code of the room"
                        />
                        <Button type="submit">
                            Enter in the room
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}