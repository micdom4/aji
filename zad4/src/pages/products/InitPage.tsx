import React, {useState} from 'react';
import {Alert, Button, Card, Container, Form, ProgressBar} from 'react-bootstrap';
import * as Yup from 'yup';
import {AxiosError} from 'axios';
import {apiInstance} from "../../api/api.config.ts";

const InitDataSchema = Yup.array().of(
    Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string().required(),
        unitPrice: Yup.number().typeError('"unitPrice" must be a number').positive().required(),
        unitWeight: Yup.number().typeError('"unitWeight" must be a number').positive().required(),
        categoryName: Yup.string().required(),
    })
).required('File must contain table of products');

export default function InitPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccess(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("You have to select a file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target?.result;
            if (typeof content !== 'string') return;

            try {
                const parsedData = JSON.parse(content);

                await InitDataSchema.validate(parsedData);

                const response = await apiInstance.post('/init', parsedData);

                setSuccess(`Success! Products' database has been initialized by adding ${response.data.count} products.`);
                setFile(null);

            } catch (err) {
                console.error(err);

                if (err instanceof Yup.ValidationError) {
                    setError(`File validation error: ${err.message}`);
                } else if (err instanceof SyntaxError) {
                    setError("Wrong format of JSON file.");
                } else if (err instanceof AxiosError && err.response) {
                    const status = err.response.status;
                    const apiMessage = err.response.data?.error || "Server error";

                    if (status === 409) {
                        setError("Error. Cannot overwrite not empty database.");
                    } else if (status === 401) {
                        setError("Error. Not authorized");
                    } else if (status === 400 && apiMessage.includes('Category not found')) {
                        setError(`Data error: ${apiMessage}`);
                    } else {
                        setError(`Server error: ${apiMessage}`);
                    }
                } else {
                    setError("Unknown error.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="shadow-sm" style={{maxWidth: '600px', width: '100%'}}>
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Products database initialization</h5>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        Upload a <code>.json</code> file containing list of products.
                        <br/>
                    </Card.Text>

                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Choose JSON file</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {isLoading && <ProgressBar animated now={100} label="Processing..." className="mb-3"/>}

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-grid gap-2">
                        <Button
                            variant="primary"
                            onClick={handleUpload}
                            disabled={!file || isLoading}
                        >
                            {isLoading ? 'Sending data...' : 'Initialize Database'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}