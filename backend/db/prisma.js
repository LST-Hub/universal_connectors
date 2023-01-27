const { PrismaClient } = require('@prisma/client');
// const bodyParser = require('body-parser');
// const { response } = require('express');
// const response =  require ('./response');

const prisma = new PrismaClient();

// *** to create a new user in the database ***
const createUser = async (req, res) => {
    
    const user = await prisma.users.create({
        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }
    })
    res.json(user);
}


// *** to fetch all the users from the database ***
const getUsers = async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
    // console.log(users);
}

module.exports = {
    prisma,
    createUser,
    getUsers
};


// const createUser = async function main({ req, res }) {
//     const users = await prisma.users.findMany();
//     console.log(users);
//     // send response to the client
//     // Response.json(users);
//     res.json(users);
//     // response({
//     //     res,
//     //     success: true,
//     //     status: 200,
//     //     message: 'Users fetched successfully',
//     //     data: users

//     // })
// }