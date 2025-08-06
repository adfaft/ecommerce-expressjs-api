# NOTES

## Features
- user : for admin login
- blog : page, post, contact us (form)
- member
	- shipping address
- product
	- product categories
- transactions
- shopping cart
- transaction status

## Tasklist

- [x] All Routes : api/user, api/auth, api/member, api/product, api/order, api/cart, api/post, api/form/contact
- [x] convert to typescript
- [x] Model & Seed
  - [x] user schema
  - [x] member schema
  - [x] post schema
  - [x] product schema
  - [x] order schema
  - [x] media schema
  - [x] tdd post
  - [ ] tdd authentication
      [ ] User Model password hash via zod validator
    - [ ] User Model testing via mocha / jade
  - [ ] tdd product
  - [ ] tdd order
  
- [ ] Authentication
- [ ] Model Query, Validation and Pagination
- [-] OpenAPI Spec via TSOA or Typescrypt Rest Swagger
  - tidak jadi, karena TSOA tidak indenpenden. Dia generate routes sendiri, sehingga routing tidak customisable. Mending ganti ke NESTJS


Question
- Jasmine, bagaimana caranya membuat sequential test, dimana hasil dari sebuah state bisa dikirimkan ke next test?
- validator.js, digunakan untuk escaping tapi tidak support tree-shaking untuk javascript
  - https://janejeon.dev/using-type-definition-files-in-a-typescript-package/