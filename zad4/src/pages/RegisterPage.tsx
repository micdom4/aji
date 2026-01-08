import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const RegisterPage = function () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submitForm = () => {
        setLoading(true);
    }


    return <>
        <h2>Formularz rejestracyjny użytkownika</h2>
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
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                {loading ? 'Rejestracja w toku...' : 'Zarejestruj się'}
            </Button>
        </Form>
        <h4>Masz już konto? <Link to={'/login'}>Zaloguj się</Link></h4>
    </>
}

export default RegisterPage;