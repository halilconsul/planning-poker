import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose as composeHOC, withHandlers } from 'recompose'

import '../styles.css'

import { loginUser } from '../../../Data/Auth/actions.js'
import {
  Input,
  FormGroup,
  Label,
  Button
} from '../../../Shared/Components/Controls'
import {
  handleLoginChange,
  handlePasswordChange,
  withLogin,
  withPassword
} from './helpers.js'

const handlers = withHandlers({
  handleLoginChange,
  handlePasswordChange,
  performLogin: ({ doLogin, login, password, history }) => e => {
    e.preventDefault()
    doLogin({
      login,
      password
    })
  }
})

const mapDispatchToProps = {
  doLogin: loginUser
}

const enhancer = composeHOC(
  connect(null, mapDispatchToProps),
  withRouter,
  withLogin,
  withPassword,
  handlers
)

export const LoginComponent = ({
  performLogin,
  login,
  handleLoginChange,
  password,
  handlePasswordChange
}) =>
  <div className="form">
    <h2 className="formTitle">Login Component</h2>
    <form noValidate={true} onSubmit={performLogin}>
      <FormGroup>
        <Label htmlFor="login">Login</Label>
        <Input
          id="login"
          type="text"
          placeholder="login"
          value={login}
          onChange={handleLoginChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </FormGroup>
      <FormGroup>
        <Button>Do Login</Button>
      </FormGroup>
    </form>
  </div>

export default enhancer(LoginComponent)