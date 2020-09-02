import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { registerFlureeUser } from "../../utils/flureeFunctions";
import { useHistory } from 'react-router';

const SignUp = () => {
    let history = useHistory();
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: ''
    });
    const changeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const resp = await registerFlureeUser({ user: form.email, password: form.password, "create-user?": true, roles: [["_role/id", form.role]], expire: 999999999})
        if (resp) {
            alert('SignUp Success')
            history.push('/login');
        }
    }
    return (
        <>
            <Form className="LoginForm col-md-6" onSubmit={submitHandler}>
                <Form.Row>
                    <Form.Label column lg={2}>
                        Email
					</Form.Label>
                    <Col>
                        <Form.Control name="email" onChange={changeHandler} type="text" placeholder="Email" />
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={2}>
                        Password
					</Form.Label>
                    <Col>
                        <Form.Control name="password" onChange={changeHandler} type="password" placeholder="Password" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Form.Label column lg={2}>
                        User Role
					</Form.Label>
                    <Col>
                        <Form.Group onChange={changeHandler} >
                            <Form.Control as="select" name="role">
                                <option value="seller">seller</option>
                                <option value="customer">customer</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Button variant="primary" type="submit">
                    Submit
				</Button>
                <div>
                <a href='/login'> Login</a>
            </div>
            </Form>
        </>
    );
}

export default SignUp;