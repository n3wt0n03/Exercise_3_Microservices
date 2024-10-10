const {body, validationResult} = require('express-validator');

const validateLogin = [
    body('username').isLength({min: 1}).withMessage('Username must be at least 1 character long'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
]

const validateRegister = [
    body('username').isLength({min: 5}).withMessage('Username must be at least 5 characters long'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('firstName').matches(/^[a-zA-Z\s]+$/).isLength({min: 1}).withMessage('First Name must contain only letters and spaces'),
    body('lastName').matches(/^[a-zA-Z\s]+$/).isLength({min: 1}).withMessage('Last Name must contain only letters and spaces'),
    body('gender').isIn(['male', 'female', 'Male', 'Female']).withMessage('Invalid gender'),
    body('age').isInt({min: 18, max: 120}).withMessage('Age must be at least 18')
]

const validateUpdateProfile = [
    body('firstName').matches(/^[a-zA-Z\s]+$/).withMessage('First Name must contain only letters and spaces'),
    body('lastName').matches(/^[a-zA-Z\s]+$/).withMessage('Last Name must contain only letters and spaces'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long')
]

const validateProductInput = [
    body('category').matches(/^[a-zA-Z\s]+$/).withMessage('Category must be valid'),
    body('name').isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
    body('color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('unit').isLength({min: 1}).withMessage('Unit must be at least 1 character long'),
    body('price').isNumeric() .custom((value, { req }) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Price must be a positive number');
        }
        return true;
      }).withMessage('Price must be a number')
]

const validateUpdateProduct = [
    body('category').matches(/^[a-zA-Z\s]+$/).withMessage('Category must be valid'),
    body('name').isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
    body('color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('unit').isLength({min: 1}).withMessage('Unit must be at least 1 character long'),
    body('price').isNumeric() .custom((value, { req }) => {
        if (parseFloat(value) <= 0) {
          throw new Error('Price must be a positive number');
        }
        return true;
      }).withMessage('Price must be a number')
]


const validateOrderInput = [
    body('productId').isInt().withMessage('Product ID must be an integer'),
  //  body('quantity').isInt({min: 1}).withMessage('Quantity must be at least 1')
]


const checkValidationResults = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({error: errors.array()});
    }
    next();
};


module.exports = {validateLogin, 
    validateRegister, 
    validateUpdateProfile,
    validateProductInput,
    validateUpdateProduct,
    validateOrderInput,
    checkValidationResults}