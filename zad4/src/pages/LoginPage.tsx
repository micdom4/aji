import {loginDataSchema, type LoginDataType} from "../model/LoginDataType.ts";
import {Formik, type FormikHelpers} from "formik";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {loginApi} from "../api/LoginApi.ts";
import useToast from "../components/toasts/useToast.tsx";
import {use} from "react";
import LoggedUserContext from "../contexts/LoggedUserContext";
import {LoggedUser} from "../contexts/LoggedUserContext/types.ts";

export default function LoginPage() {
    const {addToast} = useToast();

    const {setUser} = use(LoggedUserContext);

    const navigate = useNavigate();

    const handleLogin = async (
        values: LoginDataType,
        {setSubmitting, setStatus}: FormikHelpers<LoginDataType>
    ) => {
        try {
            setStatus(null);

            console.log('Wysyłanie danych do API:', values);

            await loginApi.login(values)
                .then((response) => {
                    console.log(response);
                    setUser(new LoggedUser(values.username, response.data.accessToken, response.data.role));

                    addToast(
                        'Login successful!',
                        `You are now logged as user: "${values.username}".`,
                        'success');
                    navigate('/home');
                })
                .catch(() => {
                    setStatus('Invalid username and/or password.');
                    addToast(
                        'Error!',
                        `Invalid credentials!`,
                        'danger'
                    );
                })

        } catch (error) {
            console.error('Błąd logowania', error);
            setStatus('Nieprawidłowy login lub hasło.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{username: '', password: ''}}
            validationSchema={loginDataSchema}
            onSubmit={handleLogin}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
                    <h3 className="mb-3">Login</h3>

                    <Form.Group className="mb-3" controlId="formLogin">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="e.g. Gigachad"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.username && !!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="e.g. ********"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && !!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}