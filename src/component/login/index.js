import React, {useState} from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { loginFlureeUser } from "../../utils/flureeFunctions";
import { useHistory } from 'react-router';

const Login = () => {
    let history = useHistory();
    const [form, setForm] = useState({
        email: "",
        password: "",
      });
    const changeHandler = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
      const submitHandler = async (e) => {
        e.preventDefault();
        const resp = await loginFlureeUser({ user: form.email, password: form.password, expire: 999999999})
        if (resp) {
            alert('Login Success')
            localStorage.setItem('token', resp);
            history.push('/dashboard');
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
				<Button variant="primary" type="submit">
					Submit
				</Button>
			<div>
                <a href='/signup'> Signup</a>
            </div>
			</Form>
		</>
	);
};

export default Login;
