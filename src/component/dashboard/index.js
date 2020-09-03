import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { flureeQuery, flureeTransact, flureeQueryWithoutHeader } from "../../utils/flureeFunctions";
import Products from "../products";
import Category from "../category";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
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
    }
}, []);
  return (
    <>
    <Category/>
    <Products />
    {userData.role === "customer" ? (
                <div>this is customer</div>
            ) : (
                    <div>this is selller</div>
                )}
    </>
  );
}

export default Dashboard;