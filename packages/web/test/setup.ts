import path from 'path'
import React from 'react'
import '@testing-library/jest-dom'

// Support not manually `import`ing React in component tests and components
global.React = React

// Load test environment variables
require('dotenv').config({
  path: path.join(__dirname, '..', '.env.test'),
})

// Make fetch available in tests
import 'isomorphic-fetch'
