const prisma = require("../lib/prisma");
const response = require("../lib/response");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const user = await prisma.users.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      },
    });

    if (user) {
      const token = jwt.sign(
        { email: req.body.email, password: req.body.password },
        process.env.ACCESS_TOKEN_SECRET
      );
      response({
        res,
        success: true,
        status_code: 200,
        data: [
          {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            verrified: true,
            token: token,
          },
        ],
        message: "User created successfully",
        token: token, 
        // TODO: check refresh token is neccessary or not
      })
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [
          {
            success: false,
            verrified: false,
            token: null,
          },
        ],
        message: "User not created",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [
        {
          success: false,
          verrified: false,
          token: null,
        },
      ],
      message: "Error while creating user" + error,
    });
    console.log("error==>", error);
  }
};

const getUser = async (req, res) => {
  const reqBody = req.params;
  try {
    const decodedToken = jwt.verify(
      reqBody.token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await prisma.users.findUnique({
      where: {
        loginUser: {
          email: decodedToken.email,
          password: decodedToken.password,
        },
      },
    });

    if (user) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [
          {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            country: user.country,
            city: user.city,
          },
        ],
        message: "user fetched successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "user not found",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "user not found",
    });
  }
};

const updateUser = async (req, res) => {
  const user = req.body;

  try {
    const updatedUser = await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        city: user.city,
      },
    });
    if (updatedUser) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [
          {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            country: updatedUser.country,
            city: updatedUser.city,
          },
        ],
        message: "user updated successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [],
        message: "user not updated",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [],
      message: "user not updated",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const logedinUser = await prisma.users.findUnique({
      where: {
        loginUser: {
          email: req.query.email,
          password: req.query.password,
        },
      },
    });
    if (logedinUser) {
      const token = jwt.sign(
        { email: req.query.email, password: req.query.password },
        process.env.ACCESS_TOKEN_SECRET
      );
      response({
        res,
        success: true,
        status_code: 200,
        data: [
          {
            userId: logedinUser.id,
            firstName: logedinUser.firstName,
            lastName: logedinUser.lastName,
            email: logedinUser.email,
            verrified: true,
            token: token,
          },
        ],
        message: "User logged in successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [
          {
            success: false,
            verrified: false,
            token: null,
          },
        ],
        message: "User not found",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [
        {
          success: false,
          verrified: false,
          token: null,
        },
      ],
      message: "User not found",
    });
  }
};

const verifyToken = async (req, res) => {
  const values = req.body;
  try {
    const decoded = jwt.verify(values.token, process.env.ACCESS_TOKEN_SECRET);

    const logedinUser = await prisma.users.findUnique({
      where: {
        loginUser: {
          email: decoded.email,
          password: decoded.password,
        },
      },
    });

    if (logedinUser) {
      response({
        res,
        success: true,
        status_code: 200,
        data: [
          {
            verified: true,
          },
        ],
        message: "User logged in successfully",
      });
    } else {
      response({
        res,
        success: false,
        status_code: 400,
        data: [
          {
            verified: false,
          },
        ],
        message: "User not found",
      });
    }
  } catch (error) {
    response({
      res,
      success: false,
      status_code: 400,
      data: [
        {
          verified: false,
        },
      ],
      message: "error",
      verified: false,
    });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  userLogin,
  verifyToken,
};
