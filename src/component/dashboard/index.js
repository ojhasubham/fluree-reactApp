import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import jwt from 'jsonwebtoken';
import { flureeQuery, flureeTransact, flureeQueryWithoutHeader } from "../../utils/flureeFunctions";
import { useHistory } from 'react-router';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    deliverables: true,
    price: 0,
  });


  const fetchProducts = () => {
    const productsQuery = {
      select: ['*'],
      from: 'product',
      opts: {
        compact: true,
      },
    };
    flureeQuery(productsQuery)
      .then((res) => {
        console.log('product', res);
        const flatProducts = res.data.map((product) => {
          return {
            productName: product.productName,
            deliverables: product.deliverables,
            price: product.price,
          };
        });
        console.log('flatProducts', flatProducts);
        setProducts(flatProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!userData.role) {
      const token = localStorage.getItem('token');
      if (token) {
        const { sub } = jwt.decode(token);
        console.log('token subject', sub);
        const userQuery = {
          selectOne: [
            { "_user/_auth": ["_id", "username"] },
            { roles: ["id"] },
          ],
          from: ["_auth/id", sub],
          opts: {
            compact: true,
          },
        };

        flureeQueryWithoutHeader(userQuery)
        .then((user) => {
          console.log('user', user);
            setUserData({
              role: user.data.roles[0].id,
              username: user.data._user[0].username,
              _id: user.data._user[0]._id,
            });
          })
          .catch((err) => {
            return err;
          });
      }
      fetchProducts();
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const newProduct = [
      {
        _id: 'product$new',
        productName: form.productName,
        deliverables: form.deliverables,
        price: parseFloat(form.price),
      },
    ];
    flureeTransact(newProduct)
      .then((res) => {
        console.log(res);
        alert('Product Added Success');
        setForm({
          productName: '',
          deliverables: true,
          price: 0,
        });
      })
      .catch((err) => {
        alert(err.response.data.message || '');
        console.error(err.response.data.message || '')
      });
  };
  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Form className="LoginForm col-md-6" onSubmit={submitHandler}>
        <Form.Row>
          <Col>
            <Form.Control name="productName" onChange={changeHandler} type="text" placeholder="productName" />
          </Col>
        </Form.Row>
        <br />
        <Form.Row>
          <Col>
            <Form.Control name="password" onChange={changeHandler} type="text" placeholder="deliverables" />
          </Col>
        </Form.Row>
        <br />
        <Form.Row>
          <Col>
            <Form.Control name="price" onChange={changeHandler} type="text" placeholder="price" />
          </Col>
        </Form.Row>
        <Button variant="primary" type="submit">
          Submit
				</Button>
      </Form>
      <table>
        <th>productName</th>
        <th>deliverables</th>
        <th>price</th>
        <tbody>
          {products.length === 0
            ? null
            : products.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.deliverables}</td>
                  <td>{product.price}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {userData.role === "customer" ? (
        <div>this is customer</div>
      ) : (
          <div>this is selller</div>
        )}
    </>
  );
}

export default Dashboard;