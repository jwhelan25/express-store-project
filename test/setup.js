const supertest = require('supertest')
const { expect } = require('chai')

global.supertest = supertest
global.expect = expect

// 'npm t -- --watch' in git will set up tests to run again when file changes were made