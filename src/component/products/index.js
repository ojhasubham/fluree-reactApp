import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import jwt from 'jsonwebtoken';
import { flureeQuery, flureeTransact, flureeQueryWithoutHeader } from "../../utils/flureeFunctions";


const Products = () => {
    const [userData, setUserData] = useState({});
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [form, setForm] = useState({
        productName: '',
        deliverables: true,
        price: 0,
        category: '',
    });


    const fetchProducts = () => {
        const productsQuery = {
            select: ['*', {category: ['*']}],
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
                        category: product.category
                    };
                });
                console.log('flatProducts', flatProducts);
                setProducts(flatProducts);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchCategory = () => {
        const categoryQuery = {
            select: ['*'],
            from: 'category'
        };
        flureeQuery(categoryQuery)
            .then((res) => {
                console.log('category', res);
                const flatcategory = res.data.map((product) => {
                    return {
                        categoryName: product['category/categoryName'],
                        _id: product._id
                    };
                });
                console.log('flatcategory', flatcategory);
                setCategory(flatcategory);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        const newProduct = [
            {
                _id: 'product$new',
                productName: form.productName,
                deliverables: form.deliverables,
                price: parseFloat(form.price),
                category: [parseInt(form.category)],
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
                setProducts([...products, newProduct])
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
                <Form.Row>
                    <Col>
                        <Form.Group onChange={changeHandler}  >
                            <Form.Control as="select" name="category">
                                <option value="">Select Category</option>
                                {category && category.map(cat=> {
                                    return (
                                    <option value={cat._id}>{cat.categoryName}</option>
                                    )
                                })}
                            </Form.Control>
                        </Form.Group>
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
                <th>category</th>
                <tbody>
                    {products.length === 0
                        ? null
                        : products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.productName}</td>
                                    <td>{product.deliverables}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category && product.category.map(cat => {
                                        return (
                                            <div>
                                                {cat.categoryName}
                                            </div>
                                        )
                                    })}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    );

}


export default Products;