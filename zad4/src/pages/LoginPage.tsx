import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const LoginPage = function () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validLogin, setValidLogin] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    // Jeśli 'from' nie istnieje (użytkownik wszedł bezpośrednio na /login), idź na stronę główną
    const from = location.state?.from?.pathname || '/';

    const submitForm = (e: React.FormEvent) => {
        setLoading(true);
        handleLogin(e);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Logowanie do backendu 
            const response = await api.post('/login', { username, password });

            setValidLogin(true);

            // Zapis tokenów zwróconych przez backend 
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            // Musimy zapisać ID lub zdekodować token, żeby użyć go w refresh URL
            // Zakładam, że wyciągniesz to z tokena (używając np. biblioteki jwt-decode)
            // localStorage.setItem('userId', decodedToken.userId); 

            // MAGICZNY MOMENT: Przekierowanie powrotne
            navigate(from, { replace: true });

        } catch (error) {
            setLoading(false);
            setValidLogin(false);
        }
    };


    return <>
        <h2>Zaloguj się</h2>
        <Form onSubmit={submitForm}>
            <Form.Group className="mb-3">
                <Form.Label>Nazwa użytkownika:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Wprowadź nazwę użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hasło:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Text id="invalidLogin">{validLogin ? "" : "Niepoprawna nazwa użytkownika lub hasło"}</Form.Text>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Zalogowywanie w toku...' : 'Zaloguj się'}
            </Button>
        </Form>
        <h4>Nie posiadasz jeszcze konta? <Link to={'/register'}>Zarejestruj się</Link></h4>
    </>
}

export default LoginPage;